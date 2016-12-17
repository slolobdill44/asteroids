/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const GameView = __webpack_require__(1);
	const Asteroid = __webpack_require__(3);
	const Util = __webpack_require__(5);

	document.addEventListener("DOMContentLoaded", function() {
	  const canvas = document.getElementById('game-canvas');
	  const ctx = canvas.getContext("2d");
	  const view = new GameView(ctx);
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(2);

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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Asteroid = __webpack_require__(3);
	const Util = __webpack_require__(5);

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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Util = __webpack_require__(5);

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


/***/ },
/* 4 */
/***/ function(module, exports) {

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


/***/ },
/* 5 */
/***/ function(module, exports) {

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


/***/ }
/******/ ]);