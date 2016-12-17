const MovingObject = require('./moving_object');
const Util = require('./utils');

function Asteroid(options) {
  const COLOR = "#af1665";
  const RADIUS = 75;

  options.color = COLOR;
  options.radius = RADIUS;

  MovingObject.call(this, options);
}

Util.inherits.call(Asteroid, MovingObject);

//window.Asteroid = Asteroid;
module.exports = Asteroid;
