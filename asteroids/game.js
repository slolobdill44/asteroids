const Asteroid = require('./asteroid');
const Util = require('./utils');

function Game(DIM_X, DIM_Y, NUM_ASTEROIDS) {
  this.dim_x = DIM_X;
  this.dim_y = DIM_Y;
  this.num_asteroids = NUM_ASTEROIDS;
  this.asteroids = Game.prototype.addAsteroids();
}

Game.prototype.addAsteroids = function() {
  const asteroidsArray = [];

  for (var i = 0; i < this.num_asteroids; i++) {
    const pos = Util.randomPos(this.dim_x);
    const vel = Util.randomVec(75);
    const ops = { };
    ops.pos = pos;
    ops.vel = vel;
    const asteroid = new Asteroid(ops);
    asteroidsArray.push(asteroid);
  }

  return asteroidsArray;
};

Game.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, 500, 500); //wipe it down

  this.asteroids.forEach(function(a) {
    a.draw(ctx);
  });
};

Game.prototype.moveObjects = function() {
  this.asteroids.forEach(function(a) {
    a.move();
  });
};

module.exports = Game;
