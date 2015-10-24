var game = window.game;
var properties = require('../properties');

/**
 * Orb description
 * calls init
 *
 * @class Orb
 * @constructor
 */
function Orb (collisions) {
	/**
	 * A collisions container
	 *
	 * @property collisions
	 * @type {Collisions}
	 */
	this.collisions = collisions;

	this.player = null;

	var bmd = game.make.bitmapData(22,22);
	bmd.ctx.strokeStyle = '#999999';
	bmd.ctx.lineWidth = 2;
	bmd.ctx.beginPath();
	bmd.ctx.arc(11, 11, 10, 0, Math.PI*2, true);
	bmd.ctx.closePath();
	bmd.ctx.stroke();
	/**
	 * @property sprite
	 */
	this.sprite = game.make.sprite(550, 1200, bmd);
	this.sprite.anchor.setTo(0.5,0.5);

	this.init();
}

var p = Orb.prototype;

/**
 * Orb initialisation
 * motionState = 1; //for dynamic
 * motionState = 2; //for static
 * motionState = 4; //for kinematic
 *
 * @method init
 */
p.init = function() {

	game.physics.p2.enable(this.sprite, true);

	this.body = this.sprite.body;

	this.body.setCircle(10,0,0);

	this.body.motionState = 2;

	this.body.setCollisionGroup(this.collisions.orb);

	this.body.collideWorldBounds = properties.collideWorldBounds;

	this.body.collides([this.collisions.enemyBullets, this.collisions.players, this.collisions.terrain, this.collisions.bullets], this.crash, this);

	//this.body.collides(this.collisions.bullets, this.move, this)
};

p.setPlayer = function(player) {
	this.player = player;
};

/**
 * @method move
 * motionState = 1; //for dynamic
 * motionState = 2; //for static
 * motionState = 4; //for kinematic
 */
p.move = function() {
	this.body.motionState = 1;
	this.body.mass = 1;
};

/**
 * @method crash
 */
p.crash = function() {
	console.warn('Orb :: crash');

	if (this.player) {
		this.player.playerDeath();
	}
};


module.exports = Orb;