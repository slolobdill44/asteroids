#!/usr/bin/env python3
import json, os, re, subprocess, sys, time, urllib.request

LOG = "/tmp/hooklog.jsonl"
MODE = "/tmp/hooktest_mode.json"
TOKENISH = re.compile(r"^[A-Za-z0-9_\-+/=.:]{41,}$")


def redact(v):
    if isinstance(v, dict):
        return {k: redact(x) for k, x in v.items()}
    if isinstance(v, list):
        return [redact(x) for x in v]
    if isinstance(v, str) and len(v) > 40 and not v.startswith(("/", "~", "./", "../", "$")) \
            and TOKENISH.match(v) and re.search(r"[A-Za-z]", v) and re.search(r"\d", v):
        return f"<redacted len={len(v)} head={v[:4]}>"
    return v


def log(rec):
    with open(LOG, "a") as f:
        f.write(json.dumps(rec) + "\n")


def parent_cmd():
    try:
        return open(f"/proc/{os.getppid()}/cmdline", "rb").read().replace(b"\0", b" ").decode()[:200]
    except Exception as e:
        return f"<{e}>"


def find_rule(event, slot, raw_text):
    try:
        rules = json.load(open(MODE))
    except Exception:
        return None
    for r in rules:
        if r.get("event") == event and r.get("slot", "main") == slot and r.get("match", "") in raw_text:
            return r
    return None


def bench(url, n, budget):
    out, t_end = [], time.time() + budget
    for _ in range(n):
        if time.time() > t_end:
            break
        t = time.time()
        try:
            urllib.request.urlopen(urllib.request.Request(url, data=b"{}", method="POST",
                                   headers={"Content-Type": "application/json"}), timeout=2).read()
            ok = "ok"
        except urllib.error.HTTPError as e:
            ok = f"http{e.code}"
        except Exception as e:
            ok = type(e).__name__
        out.append([round((time.time() - t) * 1000, 1), ok])
    return out


def main():
    t0 = time.time()
    event = sys.argv[1] if len(sys.argv) > 1 else "unknown"
    slot = sys.argv[2] if len(sys.argv) > 2 else "main"
    raw = sys.stdin.buffer.read()
    text = raw.decode("utf-8", "replace")
    rule = find_rule(event, slot, text)
    if slot != "main" and rule is None:
        return 0
    try:
        payload = redact(json.loads(text))
    except Exception:
        payload = {"_unparsed": text[:2000]}
    rec = {"event": event, "slot": slot, "time": t0, "stdin_bytes": len(raw), "stdin": payload,
           "env_keys": sorted(os.environ.keys()), "pid": os.getpid(), "ppid": os.getppid(),
           "parent_cmd": parent_cmd(), "rule": rule and rule.get("id"),
           "plugin_root": os.environ.get("DEVIN_PLUGIN_ROOT"),
           "rl_env": {k: {"len": len(v), "head": v[:4]} for k, v in os.environ.items() if k.startswith("RL_")}}
    if rule is None:
        rec["end"] = time.time()
        log(rec)
        return 0
    if "sleep" in rule:
        hb = f"/tmp/hooktest_hb_{rule.get('id')}"
        for i in range(int(rule["sleep"] * 10)):
            time.sleep(0.1)
            if i % 10 == 0:
                open(hb, "w").write(f"{time.time() - t0:.1f}\n")
        open(hb, "w").write(f"done {time.time() - t0:.1f}\n")
    if "bench" in rule:
        rec["bench"] = bench(rule["bench"], rule.get("n", 20), rule.get("budget", 8.5))
    if rule.get("daemon"):
        p = subprocess.Popen(["sleep", str(rule["daemon"])], start_new_session=True,
                             stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        rec["daemon_pid"] = p.pid
    out = rule.get("stdout")
    if "rewrite" in rule:
        src = json.loads(text).get("tool_input", {})
        new = json.loads(json.dumps(src).replace(*rule["rewrite"]))
        out = json.dumps({"hookSpecificOutput": {"hookEventName": event, "permissionDecision": "allow",
                                                 "updatedInput": new}})
    rec["end"] = time.time()
    log(rec)
    if out is not None:
        sys.stdout.write(out if isinstance(out, str) else json.dumps(out))
        sys.stdout.flush()
    if rule.get("stderr"):
        sys.stderr.write(rule["stderr"])
    return int(rule.get("exit", 0))


try:
    code = main()
except Exception as e:
    try:
        log({"event": "hook_error", "time": time.time(), "error": repr(e)})
    except Exception:
        pass
    code = 0
sys.exit(code)
