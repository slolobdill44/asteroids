function sum() {
  let total = 0;
  let arrayArgs = Array.prototype.slice.call(arguments);

  arrayArgs.forEach(function(num) {
    total += num;
  });

  return total;
}

function restSum(...nums) {
  let newSum = 0;

  nums.forEach(function(num) {
    newSum += num;
  });

  return newSum;
}


Function.prototype.myBind = function(context) {
  const bindArgArray = Array.prototype.slice.call(arguments);

  const that = this;

  return function () {
    const callArgArray = Array.prototype.slice.call(arguments);

    const totalArgs = bindArgArray.concat(callArgArray);

    that.apply(context, totalArgs.slice(1));
  };
};

Function.prototype.myBindRest = function(context, ...bindArgs) {
  const that = this;

  return function(...callArgs) {
      that.apply(context, bindArgs.concat(callArgs));
  };
};

//Curried sum
function curriedSum(n) {
  const nums = [];
  function _curriedSum(number) {
    nums.push(number);
    if (nums.length === n) {
      return sum(...nums);
    } else {
      return _curriedSum;
    }
  }
  return _curriedSum;
}

Function.prototype.curry = function(numArgs) {
  // const func = this;
  const args = [];

  const _curriedFunc = (arg) => {
    args.push(arg);
    if (args.length === numArgs) {
      return this(...args);
    } else {
      return _curriedFunc;
    }
  };
  return _curriedFunc;
};
