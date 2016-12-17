const Util = {
  inherits (parent) {
    function Surrogate() {}
    Surrogate.prototype = parent.prototype;
    this.prototype = new Surrogate();
    this.prototype.constructor = parent;
  },

  // Return a randomly oriented vector with the given length.
  randomVec (length) {
    const deg = 2 * Math.PI * Math.random();
    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
  },
  // Scale the length of a vector by the given amount.
  scale (vec, m) {
    return [vec[0] * m, vec[1] * m];
  },

  randomPos (dim) {
    const pos = {};
    pos.x = Math.floor(Math.random() * dim);
    pos.y = Math.floor(Math.random() * dim);
    return pos;
  }

};


module.exports = Util;
