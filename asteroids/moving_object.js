function MovingObject(properties) {
  this.pos = properties["pos"];
  this.vel = properties["vel"];
  this.radius = properties["radius"];
  this.color = properties["color"];
}

MovingObject.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, false);
  ctx.fillStyle = 'green'; // FIX LATER
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#003300';
  ctx.stroke();
};

MovingObject.prototype.move = function() {
  this.pos.x += this.vel.x;
  this.pos.y += this.vel.y;
};

//window.MovingObject = MovingObject;

module.exports = MovingObject;
