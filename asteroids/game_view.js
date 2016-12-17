const Game = require('./game');

function GameView(ctx) {
  this.game = new Game();
  this.ctx = ctx;
}

GameView.prototype.start = function() {
  const that = this;
  window.setInterval(function() {
    that.game.moveObjects();
    that.game.draw(that.ctx);
    console.log('inverval passed');
  }, 20);
};

module.exports = GameView;
