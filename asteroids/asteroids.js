const GameView = require('./game_view.js');
const Asteroid = require('./asteroid.js');
const Util = require('./utils.js');

document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext("2d");
  const view = new GameView(ctx);
});
