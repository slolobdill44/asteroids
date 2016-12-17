Function.prototype.inherits = function (parent) {
  function Surrogate() {}
  Surrogate.prototype = parent.prototype;
  this.prototype = new Surrogate();
  this.prototype.constructor = parent;
};

// function MovingObject (name) {
//   this.name = name;
// }
//
// MovingObject.prototype.fly = function(name) {
//     console.log(`${this.name} is flying!!`);
// };
//
// const m = new MovingObject('testObj');
//
// m.fly();
// console.log(m.name);
//
// function Ship (name, shipType) {
//   MovingObject.call(this, name);
//   this.shipType = shipType;
// }
//
// Ship.inherits(MovingObject);
//
// const s = new Ship('Kirby', 'Death Star');
// s.fly();
// console.log(s.shipType);
//
//
//
// function Asteroid (name, rockType) {
//   MovingObject.call(this, name);
//   this.rockType = rockType;
// }
// Asteroid.inherits(MovingObject);
//
// const rock = new Asteroid('Pebble', 'Plutonium');
//
// rock.fly();
// console.log(rock.rockType);
