(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Background.js":[function(require,module,exports){
var properties = require('../properties');

/**
 *
 *
 * @type {Phaser.Graphics}
 */
var graphics;

/**
 * Background description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class Background
 * @constructor
 */
function Background() {
	this.sprite = game.make.tileSprite(0, 0, 928, 600, 'stars');
	this.init();
}

var p = Background.prototype;

/**
 * Background initialisation
 *
 * @method init
 */
p.init = function() {
	this.stars = this.sprite;

	if (properties.drawMountains) {
		this.mountains = game.add.sprite(0, 700);
		graphics = new Phaser.Graphics(game, 0,0);
		graphics.lineStyle(2, 0xffffff, 0.7);
		var groundWidth = 2000;
		var peakW = 200;
		var peakH = 100;
		var up = true;
		var i;
		for (i = 0; i < groundWidth; i++) {
			if (i % peakW === 0) {
				graphics.lineTo( peakW + i, up? -Math.random() * peakH : 0 );
				up = !up;
			}
		}
		this.mountains.addChild(graphics);
	}


};


module.exports = Background;
},{"../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Map.js":[function(require,module,exports){
var properties = require('../properties');
var game = window.game;

/**
 * A private var description
 *
 * @property myPrivateVar
 * @type {number}
 * @private
 */
var myPrivateVar = 0;

/**
 * Map description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class Map
 * @constructor
 */
function Map(collisions) {
	this.collisions = collisions;

	this.sprite = game.add.sprite(0,0, 'thrustmap');

	this.init();
}

var p = Map.prototype;

/**
 * Map initialisation
 *
 * @method init
 */
p.init = function() {
	this.sprite.position.setTo(this.sprite.width/2, 970);

	game.physics.p2.enable(this.sprite, properties.debugPhysics);

	this.body = this.sprite.body;

	this.body.static = true;

	this.body.clearShapes();
	this.body.loadPolygon('physicsData', 'thrustmap');

	this.body.setCollisionGroup(this.collisions.terrain);
};


module.exports = Map;

},{"../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Orb.js":[function(require,module,exports){
var game = window.game;
var properties = require('../properties');
/**
 * A private var description
 *
 * @property myPrivateVar
 * @type {number}
 * @private
 */
var myPrivateVar = 0;

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
	this.sprite = game.make.sprite(300, 670, bmd);
	this.sprite.anchor.setTo(0.5,0.5);

	this.init();
}

var p = Orb.prototype;

/**
 * Orb initialisation
 *
 * @method init
 */
p.init = function() {

	game.physics.p2.enable(this.sprite, properties.debugPhysics);

	//motionState = 1; //for dynamic
	//motionState = 2; //for static
	//motionState = 4; //for kinematic

	this.body = this.sprite.body;

	this.body.motionState = 2;

	this.body.setCollisionGroup(this.collisions.terrain);

	this.body.collideWorldBounds = properties.collideWorldBounds;

	//this.body.collides(this.collisions.bullets, this.move, this)
};

p.move = function() {
	this.body.motionState = 1;
	this.body.mass = 0.55;
	this.body.fixedRotation = true;
};


module.exports = Orb;

},{"../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Player.js":[function(require,module,exports){
var game = window.game;
var properties = require('../properties');


/**
 * Player description
 * calls init
 *
 * @param collisions {Collisions} Our collisions container of collisionGroups
 * @class Player
 * @constructor
 */
function Player(collisions) {
	/**
	 * The Collisions Object
	 *
	 * @property collisions
	 * @type {Collisions}
	 */
	this.collisions = collisions;

	/**
	 * Creates the player sprite which is returned for easy reference by the containing state
	 *
	 * @property sprite
	 * @type {Phaser.Sprite}
	 */
	this.sprite = game.make.sprite(game.world.centerX, 300);

	this.init();
}

var p = Player.prototype;

/**
 * Player initialisation
 *
 * @method init
 */
p.init = function() {

	game.physics.p2.enable(this.sprite, properties.debugPhysics);

	this.body = this.sprite.body;

	var graphics = new Phaser.Graphics(game, 0,0);
	//graphics.beginFill(0x000000);
	graphics.lineStyle(4,0xffffff);
	graphics.lineTo(20,40);
	graphics.lineTo(25,40);
	graphics.arc(0,40,25,game.math.degToRad(0), game.math.degToRad(180), false);
	graphics.lineTo(-20,40);
	graphics.lineTo(0,0);
	//graphics.endFill();
	this.sprite.addChild(graphics);

	this.sprite.scale.setTo(0.3,0.3);
	this.sprite.pivot.x = 0;
	this.sprite.pivot.y = 40;

	this.body.clearShapes();
	this.body.addRectangle(-10,-17, 0,-2);
	this.body.collideWorldBounds = properties.collideWorldBounds;
	this.body.mass = 1;
	this.body.setCollisionGroup(this.collisions.players);
};

p.crash = function() {
	return "moo moo land";
};


module.exports = Player;

},{"../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Collisions.js":[function(require,module,exports){
var game = window.game;
var properties = require('../properties');

/**
 * A private var description
 *
 * @property myPrivateVar
 * @type {number}
 * @private
 */
var myPrivateVar = 0;

/**
 * Collisions description
 * calls init
 *
 * @class Collisions
 * @constructor
 */
function Collisions (collisions) {
	/**
	 * A public var description
	 *
	 * @property myPublicVar
	 * @type {number}
	 */
	this.myPublicVar = 1;
	this.init();
}

var p = Collisions.prototype;

/**
 * Collisions initialisation
 *
 * @method init
 */
p.init = function() {
	this.players = game.physics.p2.createCollisionGroup();
	this.terrain = game.physics.p2.createCollisionGroup();
	this.bullets = game.physics.p2.createCollisionGroup();

	game.physics.p2.updateBoundsCollisionGroup();
};

/**
*
*/
p.set = function(sprite, collisionGroups) {
	sprite.body.collides(collisionGroups);
};


module.exports = Collisions;

},{"../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Groups.js":[function(require,module,exports){
/**
 * A private var description
 *
 * @property myPrivateVar
 * @type {number}
 * @private
 */
var myPrivateVar = 0;

/**
 * Groups description
 * calls init
 *
 * @class Groups
 * @constructor
 */
function Groups () {
	/**
	 * A public var description
	 *
	 * @property myPublicVar
	 * @type {number}
	 */
	this.myPublicVar = 1;
	this.init();
}

var p = Groups.prototype;

/**
 * Groups initialisation
 *
 * @method init
 */
p.init = function() {
	this.actors = game.add.group();
	this.terrain = game.add.group();
	this.bullets = game.add.group();
};


module.exports = Groups;
},{}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Physics.js":[function(require,module,exports){
var game = window.game;

/**
 * A private var description
 *
 * @property myPrivateVar
 * @type {number}
 * @private
 */
var myPrivateVar = 0;

/**
 * Physics description
 * calls init
 *
 * @class Physics
 * @constructor
 */
function Physics () {
	/**
	 * A public var description
	 *
	 * @property myPublicVar
	 * @type {number}
	 */
	this.myPublicVar = 1;
	this.init();
}

var p = Physics.prototype;

/**
 * Physics initialisation
 *
 * @method init
 */
p.init = function() {
	game.physics.startSystem(Phaser.Physics.P2JS);
	game.physics.p2.setImpactEvents(true);
	game.physics.p2.gravity.y = 100;
};


module.exports = Physics;
},{}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/game.js":[function(require,module,exports){
"use strict";

var game = new Phaser.Game(700,500, Phaser.AUTO);
window.game = game;

game.state.add('play', require('./states/play'));
game.state.add('load', require('./states/load'));
game.state.add('menu', require('./states/menu'));
game.state.add('boot', require('./states/boot'));

//game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
//game.scale.setScreenSize();

game.state.start('boot');
},{"./states/boot":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/boot.js","./states/load":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/load.js","./states/menu":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/menu.js","./states/play":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/play.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/libs/stats.js/stats.min.js":[function(require,module,exports){
(function (global){
; var __browserify_shim_require__=require;(function browserifyShim(module, exports, require, define, browserify_shim__define__module__export__) {
// stats.js - http://github.com/mrdoob/stats.js
var Stats=function(){var l=Date.now(),m=l,g=0,n=Infinity,o=0,h=0,p=Infinity,q=0,r=0,s=0,f=document.createElement("div");f.id="stats";f.addEventListener("mousedown",function(b){b.preventDefault();t(++s%2)},!1);f.style.cssText="width:80px;opacity:0.9;cursor:pointer";var a=document.createElement("div");a.id="fps";a.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#002";f.appendChild(a);var i=document.createElement("div");i.id="fpsText";i.style.cssText="color:#0ff;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";
i.innerHTML="FPS";a.appendChild(i);var c=document.createElement("div");c.id="fpsGraph";c.style.cssText="position:relative;width:74px;height:30px;background-color:#0ff";for(a.appendChild(c);74>c.children.length;){var j=document.createElement("span");j.style.cssText="width:1px;height:30px;float:left;background-color:#113";c.appendChild(j)}var d=document.createElement("div");d.id="ms";d.style.cssText="padding:0 0 3px 3px;text-align:left;background-color:#020;display:none";f.appendChild(d);var k=document.createElement("div");
k.id="msText";k.style.cssText="color:#0f0;font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px";k.innerHTML="MS";d.appendChild(k);var e=document.createElement("div");e.id="msGraph";e.style.cssText="position:relative;width:74px;height:30px;background-color:#0f0";for(d.appendChild(e);74>e.children.length;)j=document.createElement("span"),j.style.cssText="width:1px;height:30px;float:left;background-color:#131",e.appendChild(j);var t=function(b){s=b;switch(s){case 0:a.style.display=
"block";d.style.display="none";break;case 1:a.style.display="none",d.style.display="block"}};return{REVISION:12,domElement:f,setMode:t,begin:function(){l=Date.now()},end:function(){var b=Date.now();g=b-l;n=Math.min(n,g);o=Math.max(o,g);k.textContent=g+" MS ("+n+"-"+o+")";var a=Math.min(30,30-30*(g/200));e.appendChild(e.firstChild).style.height=a+"px";r++;b>m+1E3&&(h=Math.round(1E3*r/(b-m)),p=Math.min(p,h),q=Math.max(q,h),i.textContent=h+" FPS ("+p+"-"+q+")",a=Math.min(30,30-30*(h/100)),c.appendChild(c.firstChild).style.height=
a+"px",m=b,r=0);return b},update:function(){l=this.end()}}};"object"===typeof module&&(module.exports=Stats);

; browserify_shim__define__module__export__(typeof Stats != "undefined" ? Stats : window.Stats);

}).call(global, undefined, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js":[function(require,module,exports){
/**
 * Defines build settings for the thrust-engine
 *
 * @namespace thrust-engine
 * @module properties
 * @class
 * @static
 * @type {{enableJoypad: boolean, fatalCollisions: boolean, scale: {mode: number}, drawStats: boolean}}
 */
module.exports = {
	debugPhysics: false,
	collideWorldBounds: true,
	freeOrbLocking: false,
	enableJoypad: true,
	fatalCollisions: true,
	scale: {
		mode: Phaser.ScaleManager.SHOW_ALL
	},
	drawStats: false,
	drawMontains: false
};

},{}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/boot.js":[function(require,module,exports){
var Stats = require('Stats');
var properties = require('../properties');

/**
 * The boot state
 *
 * @namespace states
 * @module boot
 * @type {{create: Function, update: Function}}
 */
module.exports = {
	preload: function() {
		//game.load.script('joystick', 'javascripts/browserify/phaser-virtual-joystick.min.js');
		game.scale.scaleMode = properties.scale.mode;
		game.scale.setScreenSize();
	},

	create: function() {
		if (properties.drawStats) {
			window.stats = new Stats();
			stats.setMode(0);
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.left = '0px';
			stats.domElement.style.top = '0px';

			document.body.appendChild( stats.domElement );

			setInterval(function () {
				stats.begin();
				stats.end();
			}, 1000 / 60);
		}

		game.state.start('play');

	},
	update: function() {

	}
};
},{"../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js","Stats":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/libs/stats.js/stats.min.js"}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/load.js":[function(require,module,exports){
/**
 * The load state
 *
 * @namespace states
 * @module load
 * @type {{create: Function, update: Function}}
 */
module.exports = {
	create: function() {

	},
	update: function() {

	}
};
},{}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/menu.js":[function(require,module,exports){
/**
 * The menu state
 *
 * @namespace states
 * @module menu
 * @type {{create: Function, update: Function}}
 */
module.exports = {
	create: function() {

	},
	update: function() {

	}
};
},{}],"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/states/play.js":[function(require,module,exports){
//imports
var properties = require('../properties');
var Physics = require('../environment/Physics');
var Collisions = require('../environment/Collisions');
var Groups = require('../environment/Groups');
var Player = require('../actors/Player');
var Orb = require('../actors/Orb');
var Map = require('../actors/Map');
var Background = require('../actors/Background');

//privates
var game = window.game;
/**
 * Prevent fatal collisions by setting this value to false in properties
 *
 * @property fatalCollisions
 * @type {boolean}
 */
var fatalCollisions = properties.fatalCollisions;
var player;
var orb;
var cursors;
var ground;
var graphics;
var actors;
var terrain;
var stars;
var bulletBitmap;
var map;
var background;

//controls;
var pad;
var buttonA;
var buttonB;
var buttonADown = false;
var buttonBDown = false;
var isXDown     = false;
var joypad = properties.enableJoypad;

//modules
var physics;
var collisions;
var groups;

var tractorBeam;
var beamGfx;
var tractorBeamTimer;
var isTractorBeamActive = false;
var orbLockEnabled = false;
var isOrbLocked = false;


/**
 * The play state - this is where the magic happens
 *
 * @namespace states
 * @module play
 * @type {{create: Function, update: Function}}
 */
module.exports = {

	preload: function() {
		game.load.image('thrustmap', 'images/thrust-level2.png');
		game.load.physics('physicsData', 'images/thrust-level2.json');
		game.load.image('stars', 'images/starfield.png');
		if (joypad) {
			game.load.atlas('dpad', 'images/virtualjoystick/skins/dpad.png', 'images/virtualjoystick/skins/dpad.json');
		}
	},

	create: function() {
		if (joypad) {
			pad = game.plugins.add(Phaser.VirtualJoystick);
			this.stick = pad.addDPad(0, 0, 200, 'dpad');
			this.stick.alignBottomLeft();

			buttonA = pad.addButton(505, 420, 'dpad', 'button1-up', 'button1-down');
			buttonA.onDown.add(this.pressButtonA, this);
			buttonA.onUp.add(this.upButtonA, this);

			buttonB = pad.addButton(615, 370, 'dpad', 'button2-up', 'button2-down');
			buttonB.onDown.add(this.pressButtonB, this);
			buttonB.onUp.add(this.upButtonB, this);
		}

		game.world.setBounds(0, 0, 928, 1280);

		physics = new Physics();
		groups = new Groups();
		collisions = new Collisions();
		background = new Background();
		player = new Player(collisions);
		orb = new Orb(collisions);
		map = new Map(collisions);

		collisions.set(orb, [collisions.players, collisions.terrain, collisions.bullets]);
		collisions.set(map, [collisions.players, collisions.terrain, collisions.bullets]);
		player.body.collides(collisions.terrain, this.crash, this);

		beamGfx = new Phaser.Graphics(game, 0,0);
		tractorBeam = game.add.sprite(0,0);
		tractorBeam.addChild(beamGfx);

		groups.terrain.add(background.sprite);
		if (background.mountains) groups.terrain.add(background.mountains);
		groups.actors.add(player.sprite);
		groups.actors.add(orb.sprite);

		game.world.swap(groups.terrain, groups.actors);

		bulletBitmap = game.make.bitmapData(5,5);
		bulletBitmap.ctx.fillStyle = '#ffffff';
		bulletBitmap.ctx.beginPath();
		bulletBitmap.ctx.arc(1.0,1.0,2, 0, Math.PI*2, true);
		bulletBitmap.ctx.closePath();
		bulletBitmap.ctx.fill();

		game.camera.follow(player.sprite);

		cursors 			 = game.input.keyboard.createCursorKeys();
		var spacePress = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		var xKey	     = game.input.keyboard.addKey(Phaser.Keyboard.X);
		var cKey       = game.input.keyboard.addKey(Phaser.Keyboard.C);
		spacePress.onDown.add(this.fire, this);
		cKey.onDown.add(this.lockOrb, this);
		xKey.onDown.add(this.xDown, this);
		xKey.onUp.add(this.xUp, this);

		tractorBeamTimer = game.time.create(false);

	},
	update: function() {

		if (cursors.left.isDown) {
			player.body.rotateLeft(100);
		} else if (cursors.right.isDown) {
			player.body.rotateRight(100);
		} else {
			player.body.setZeroRotation();
		}
		if (cursors.up.isDown || buttonADown){
			player.body.thrust(400);
		}
		if (isXDown || buttonBDown) {
			this.checkDistance();
		}

		if (isOrbLocked) {
			this.drawTractorBeam();
		}



		if (joypad) {
			if (this.stick.isDown) {
				if (this.stick.direction === Phaser.LEFT) {
					player.body.rotateLeft(100);
				} else if (this.stick.direction === Phaser.RIGHT) {
					player.body.rotateRight(100);
				}
			}

		}

		game.world.wrap(player.body, 0, false);
	},

	fire: function() {
		var magnitue = 240;
		var bullet = game.make.sprite(player.sprite.position.x, player.sprite.position.y, bulletBitmap);
		bullet.anchor.setTo(0.5,0.5);
		game.physics.p2.enable(bullet);
		var angle = player.body.rotation + (3 * Math.PI) / 2;
		bullet.body.collidesWorldBounds = false;
		bullet.body.setCollisionGroup(collisions.bullets);
		bullet.body.collides(collisions.terrain, this.bulletDeath, this);
		bullet.body.data.gravityScale = 0;
		bullet.body.velocity.x = magnitue * Math.cos(angle) + player.body.velocity.x;
		bullet.body.velocity.y = magnitue * Math.sin(angle) + player.body.velocity.y;
		groups.bullets.add(bullet);
	},

	enableOrbLock: function() {
		orbLockEnabled = true;
	},

	releaseTractorBeam: function() {
		orbLockEnabled = false;
		isTractorBeamActive = false;
		beamGfx.clear();
		tractorBeamTimer.stop(true);
	},

	drawTractorBeam: function() {
		beamGfx.clear();
		beamGfx.lineStyle(5, 0x00ff00, 0.5);
		beamGfx.moveTo(player.sprite.position.x, player.sprite.position.y);
		beamGfx.lineTo(orb.sprite.position.x, orb.sprite.position.y);
	},

	checkDistance: function() {
		var distance = this.distAtoB(player.sprite.position, orb.sprite.position);
		if (distance < 100) {
			this.drawTractorBeam();
			if (!isTractorBeamActive) {
				isTractorBeamActive = true;
				tractorBeamTimer.start();
				tractorBeamTimer.add(1500, this.enableOrbLock);
			}
		} else if (distance >= 100 && distance < 110) {
			if (orbLockEnabled) {
				this.lockOrb();
			}
		} else {
			if (isTractorBeamActive) {
				this.releaseTractorBeam();
			}
		}

	},

	lockOrb: function() {
		if (isOrbLocked) {
			return;
		}
		var maxForce = 10000;
		var beamSpr = game.add.sprite(orb.sprite.x, orb.sprite.y);
		game.physics.p2.enable(beamSpr, properties.debugPhysics);
		var diffX = player.sprite.position.x - orb.sprite.position.x;
		var diffY = player.sprite.position.y - orb.sprite.position.y;
		beamSpr.body.collideWorldBounds = properties.collideWorldBounds;
		beamSpr.body.mass = 0.1;
		beamSpr.body.clearShapes();
		game.physics.p2.createRevoluteConstraint(beamSpr, [0, 0], orb.sprite, [0,0], maxForce);
		game.physics.p2.createRevoluteConstraint(beamSpr, [diffX,diffY], player.sprite, [0,0], maxForce);
		orb.move();
		isOrbLocked = true;

	},

	render: function() {
		game.debug.cameraInfo(game.camera, 500, 20);
	},

	crash: function(playerBody) {
		if (fatalCollisions) {
			console.log('die!', player.crash());
		}
	},

	bulletDeath: function(bulletBody) {
		bulletBody.sprite.kill();
		groups.bullets.remove(bulletBody.sprite);
	},

	pressButtonA: function() {
		buttonADown = true;
	},

	upButtonA: function() {
		buttonADown = false;
	},

	pressButtonB: function() {
		buttonBDown = true;
	},

	upButtonB: function() {
		buttonBDown = false;
	},

	xDown: function () {
		isXDown = true;
	},

	xUp: function() {
		isXDown = false;
		this.releaseTractorBeam();
	},

	distAtoB: function(pointA, pointB) {

		var A = pointB.x - pointA.x;
		var B = pointB.y - pointA.y;

		return Math.sqrt(A*A + B*B);

	}
};

},{"../actors/Background":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Background.js","../actors/Map":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Map.js","../actors/Orb":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Orb.js","../actors/Player":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/actors/Player.js","../environment/Collisions":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Collisions.js","../environment/Groups":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Groups.js","../environment/Physics":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/environment/Physics.js","../properties":"/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/properties.js"}]},{},["/Users/hayesmaker/Workspace/hayesmaker/thrust-engine/src/game.js"])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvYWN0b3JzL0JhY2tncm91bmQuanMiLCJzcmMvYWN0b3JzL01hcC5qcyIsInNyYy9hY3RvcnMvT3JiLmpzIiwic3JjL2FjdG9ycy9QbGF5ZXIuanMiLCJzcmMvZW52aXJvbm1lbnQvQ29sbGlzaW9ucy5qcyIsInNyYy9lbnZpcm9ubWVudC9Hcm91cHMuanMiLCJzcmMvZW52aXJvbm1lbnQvUGh5c2ljcy5qcyIsInNyYy9nYW1lLmpzIiwic3JjL2xpYnMvc3RhdHMuanMvc3RhdHMubWluLmpzIiwic3JjL3Byb3BlcnRpZXMuanMiLCJzcmMvc3RhdGVzL2Jvb3QuanMiLCJzcmMvc3RhdGVzL2xvYWQuanMiLCJzcmMvc3RhdGVzL21lbnUuanMiLCJzcmMvc3RhdGVzL3BsYXkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcblxuLyoqXG4gKlxuICpcbiAqIEB0eXBlIHtQaGFzZXIuR3JhcGhpY3N9XG4gKi9cbnZhciBncmFwaGljcztcblxuLyoqXG4gKiBCYWNrZ3JvdW5kIGRlc2NyaXB0aW9uXG4gKlxuICogZGVmaW5lcyBhIHB1YmxpYyB2YXJpYWJsZSBhbmQgY2FsbHMgaW5pdCAtIGNoYW5nZSB0aGlzIGNvbnN0cnVjdG9yIHRvIHN1aXQgeW91ciBuZWVkcy5cbiAqIG5iLiB0aGVyZSdzIG5vIHJlcXVpcmVtZW50IHRvIGNhbGwgYW4gaW5pdCBmdW5jdGlvblxuICpcbiAqIEBjbGFzcyBCYWNrZ3JvdW5kXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gQmFja2dyb3VuZCgpIHtcblx0dGhpcy5zcHJpdGUgPSBnYW1lLm1ha2UudGlsZVNwcml0ZSgwLCAwLCA5MjgsIDYwMCwgJ3N0YXJzJyk7XG5cdHRoaXMuaW5pdCgpO1xufVxuXG52YXIgcCA9IEJhY2tncm91bmQucHJvdG90eXBlO1xuXG4vKipcbiAqIEJhY2tncm91bmQgaW5pdGlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kIGluaXRcbiAqL1xucC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuc3RhcnMgPSB0aGlzLnNwcml0ZTtcblxuXHRpZiAocHJvcGVydGllcy5kcmF3TW91bnRhaW5zKSB7XG5cdFx0dGhpcy5tb3VudGFpbnMgPSBnYW1lLmFkZC5zcHJpdGUoMCwgNzAwKTtcblx0XHRncmFwaGljcyA9IG5ldyBQaGFzZXIuR3JhcGhpY3MoZ2FtZSwgMCwwKTtcblx0XHRncmFwaGljcy5saW5lU3R5bGUoMiwgMHhmZmZmZmYsIDAuNyk7XG5cdFx0dmFyIGdyb3VuZFdpZHRoID0gMjAwMDtcblx0XHR2YXIgcGVha1cgPSAyMDA7XG5cdFx0dmFyIHBlYWtIID0gMTAwO1xuXHRcdHZhciB1cCA9IHRydWU7XG5cdFx0dmFyIGk7XG5cdFx0Zm9yIChpID0gMDsgaSA8IGdyb3VuZFdpZHRoOyBpKyspIHtcblx0XHRcdGlmIChpICUgcGVha1cgPT09IDApIHtcblx0XHRcdFx0Z3JhcGhpY3MubGluZVRvKCBwZWFrVyArIGksIHVwPyAtTWF0aC5yYW5kb20oKSAqIHBlYWtIIDogMCApO1xuXHRcdFx0XHR1cCA9ICF1cDtcblx0XHRcdH1cblx0XHR9XG5cdFx0dGhpcy5tb3VudGFpbnMuYWRkQ2hpbGQoZ3JhcGhpY3MpO1xuXHR9XG5cblxufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tncm91bmQ7IiwidmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9wcm9wZXJ0aWVzJyk7XG52YXIgZ2FtZSA9IHdpbmRvdy5nYW1lO1xuXG4vKipcbiAqIEEgcHJpdmF0ZSB2YXIgZGVzY3JpcHRpb25cbiAqXG4gKiBAcHJvcGVydHkgbXlQcml2YXRlVmFyXG4gKiBAdHlwZSB7bnVtYmVyfVxuICogQHByaXZhdGVcbiAqL1xudmFyIG15UHJpdmF0ZVZhciA9IDA7XG5cbi8qKlxuICogTWFwIGRlc2NyaXB0aW9uXG4gKlxuICogZGVmaW5lcyBhIHB1YmxpYyB2YXJpYWJsZSBhbmQgY2FsbHMgaW5pdCAtIGNoYW5nZSB0aGlzIGNvbnN0cnVjdG9yIHRvIHN1aXQgeW91ciBuZWVkcy5cbiAqIG5iLiB0aGVyZSdzIG5vIHJlcXVpcmVtZW50IHRvIGNhbGwgYW4gaW5pdCBmdW5jdGlvblxuICpcbiAqIEBjbGFzcyBNYXBcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBNYXAoY29sbGlzaW9ucykge1xuXHR0aGlzLmNvbGxpc2lvbnMgPSBjb2xsaXNpb25zO1xuXG5cdHRoaXMuc3ByaXRlID0gZ2FtZS5hZGQuc3ByaXRlKDAsMCwgJ3RocnVzdG1hcCcpO1xuXG5cdHRoaXMuaW5pdCgpO1xufVxuXG52YXIgcCA9IE1hcC5wcm90b3R5cGU7XG5cbi8qKlxuICogTWFwIGluaXRpYWxpc2F0aW9uXG4gKlxuICogQG1ldGhvZCBpbml0XG4gKi9cbnAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnNwcml0ZS5wb3NpdGlvbi5zZXRUbyh0aGlzLnNwcml0ZS53aWR0aC8yLCA5NzApO1xuXG5cdGdhbWUucGh5c2ljcy5wMi5lbmFibGUodGhpcy5zcHJpdGUsIHByb3BlcnRpZXMuZGVidWdQaHlzaWNzKTtcblxuXHR0aGlzLmJvZHkgPSB0aGlzLnNwcml0ZS5ib2R5O1xuXG5cdHRoaXMuYm9keS5zdGF0aWMgPSB0cnVlO1xuXG5cdHRoaXMuYm9keS5jbGVhclNoYXBlcygpO1xuXHR0aGlzLmJvZHkubG9hZFBvbHlnb24oJ3BoeXNpY3NEYXRhJywgJ3RocnVzdG1hcCcpO1xuXG5cdHRoaXMuYm9keS5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLmNvbGxpc2lvbnMudGVycmFpbik7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gTWFwO1xuIiwidmFyIGdhbWUgPSB3aW5kb3cuZ2FtZTtcbnZhciBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vcHJvcGVydGllcycpO1xuLyoqXG4gKiBBIHByaXZhdGUgdmFyIGRlc2NyaXB0aW9uXG4gKlxuICogQHByb3BlcnR5IG15UHJpdmF0ZVZhclxuICogQHR5cGUge251bWJlcn1cbiAqIEBwcml2YXRlXG4gKi9cbnZhciBteVByaXZhdGVWYXIgPSAwO1xuXG4vKipcbiAqIE9yYiBkZXNjcmlwdGlvblxuICogY2FsbHMgaW5pdFxuICpcbiAqIEBjbGFzcyBPcmJcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBPcmIgKGNvbGxpc2lvbnMpIHtcblx0LyoqXG5cdCAqIEEgY29sbGlzaW9ucyBjb250YWluZXJcblx0ICpcblx0ICogQHByb3BlcnR5IGNvbGxpc2lvbnNcblx0ICogQHR5cGUge0NvbGxpc2lvbnN9XG5cdCAqL1xuXHR0aGlzLmNvbGxpc2lvbnMgPSBjb2xsaXNpb25zO1xuXG5cdHZhciBibWQgPSBnYW1lLm1ha2UuYml0bWFwRGF0YSgyMiwyMik7XG5cdGJtZC5jdHguc3Ryb2tlU3R5bGUgPSAnIzk5OTk5OSc7XG5cdGJtZC5jdHgubGluZVdpZHRoID0gMjtcblx0Ym1kLmN0eC5iZWdpblBhdGgoKTtcblx0Ym1kLmN0eC5hcmMoMTEsIDExLCAxMCwgMCwgTWF0aC5QSSoyLCB0cnVlKTtcblx0Ym1kLmN0eC5jbG9zZVBhdGgoKTtcblx0Ym1kLmN0eC5zdHJva2UoKTtcblx0LyoqXG5cdCAqIEBwcm9wZXJ0eSBzcHJpdGVcblx0ICovXG5cdHRoaXMuc3ByaXRlID0gZ2FtZS5tYWtlLnNwcml0ZSgzMDAsIDY3MCwgYm1kKTtcblx0dGhpcy5zcHJpdGUuYW5jaG9yLnNldFRvKDAuNSwwLjUpO1xuXG5cdHRoaXMuaW5pdCgpO1xufVxuXG52YXIgcCA9IE9yYi5wcm90b3R5cGU7XG5cbi8qKlxuICogT3JiIGluaXRpYWxpc2F0aW9uXG4gKlxuICogQG1ldGhvZCBpbml0XG4gKi9cbnAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG5cdGdhbWUucGh5c2ljcy5wMi5lbmFibGUodGhpcy5zcHJpdGUsIHByb3BlcnRpZXMuZGVidWdQaHlzaWNzKTtcblxuXHQvL21vdGlvblN0YXRlID0gMTsgLy9mb3IgZHluYW1pY1xuXHQvL21vdGlvblN0YXRlID0gMjsgLy9mb3Igc3RhdGljXG5cdC8vbW90aW9uU3RhdGUgPSA0OyAvL2ZvciBraW5lbWF0aWNcblxuXHR0aGlzLmJvZHkgPSB0aGlzLnNwcml0ZS5ib2R5O1xuXG5cdHRoaXMuYm9keS5tb3Rpb25TdGF0ZSA9IDI7XG5cblx0dGhpcy5ib2R5LnNldENvbGxpc2lvbkdyb3VwKHRoaXMuY29sbGlzaW9ucy50ZXJyYWluKTtcblxuXHR0aGlzLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gcHJvcGVydGllcy5jb2xsaWRlV29ybGRCb3VuZHM7XG5cblx0Ly90aGlzLmJvZHkuY29sbGlkZXModGhpcy5jb2xsaXNpb25zLmJ1bGxldHMsIHRoaXMubW92ZSwgdGhpcylcbn07XG5cbnAubW92ZSA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLmJvZHkubW90aW9uU3RhdGUgPSAxO1xuXHR0aGlzLmJvZHkubWFzcyA9IDAuNTU7XG5cdHRoaXMuYm9keS5maXhlZFJvdGF0aW9uID0gdHJ1ZTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBPcmI7XG4iLCJ2YXIgZ2FtZSA9IHdpbmRvdy5nYW1lO1xudmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9wcm9wZXJ0aWVzJyk7XG5cblxuLyoqXG4gKiBQbGF5ZXIgZGVzY3JpcHRpb25cbiAqIGNhbGxzIGluaXRcbiAqXG4gKiBAcGFyYW0gY29sbGlzaW9ucyB7Q29sbGlzaW9uc30gT3VyIGNvbGxpc2lvbnMgY29udGFpbmVyIG9mIGNvbGxpc2lvbkdyb3Vwc1xuICogQGNsYXNzIFBsYXllclxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFBsYXllcihjb2xsaXNpb25zKSB7XG5cdC8qKlxuXHQgKiBUaGUgQ29sbGlzaW9ucyBPYmplY3Rcblx0ICpcblx0ICogQHByb3BlcnR5IGNvbGxpc2lvbnNcblx0ICogQHR5cGUge0NvbGxpc2lvbnN9XG5cdCAqL1xuXHR0aGlzLmNvbGxpc2lvbnMgPSBjb2xsaXNpb25zO1xuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIHRoZSBwbGF5ZXIgc3ByaXRlIHdoaWNoIGlzIHJldHVybmVkIGZvciBlYXN5IHJlZmVyZW5jZSBieSB0aGUgY29udGFpbmluZyBzdGF0ZVxuXHQgKlxuXHQgKiBAcHJvcGVydHkgc3ByaXRlXG5cdCAqIEB0eXBlIHtQaGFzZXIuU3ByaXRlfVxuXHQgKi9cblx0dGhpcy5zcHJpdGUgPSBnYW1lLm1ha2Uuc3ByaXRlKGdhbWUud29ybGQuY2VudGVyWCwgMzAwKTtcblxuXHR0aGlzLmluaXQoKTtcbn1cblxudmFyIHAgPSBQbGF5ZXIucHJvdG90eXBlO1xuXG4vKipcbiAqIFBsYXllciBpbml0aWFsaXNhdGlvblxuICpcbiAqIEBtZXRob2QgaW5pdFxuICovXG5wLmluaXQgPSBmdW5jdGlvbigpIHtcblxuXHRnYW1lLnBoeXNpY3MucDIuZW5hYmxlKHRoaXMuc3ByaXRlLCBwcm9wZXJ0aWVzLmRlYnVnUGh5c2ljcyk7XG5cblx0dGhpcy5ib2R5ID0gdGhpcy5zcHJpdGUuYm9keTtcblxuXHR2YXIgZ3JhcGhpY3MgPSBuZXcgUGhhc2VyLkdyYXBoaWNzKGdhbWUsIDAsMCk7XG5cdC8vZ3JhcGhpY3MuYmVnaW5GaWxsKDB4MDAwMDAwKTtcblx0Z3JhcGhpY3MubGluZVN0eWxlKDQsMHhmZmZmZmYpO1xuXHRncmFwaGljcy5saW5lVG8oMjAsNDApO1xuXHRncmFwaGljcy5saW5lVG8oMjUsNDApO1xuXHRncmFwaGljcy5hcmMoMCw0MCwyNSxnYW1lLm1hdGguZGVnVG9SYWQoMCksIGdhbWUubWF0aC5kZWdUb1JhZCgxODApLCBmYWxzZSk7XG5cdGdyYXBoaWNzLmxpbmVUbygtMjAsNDApO1xuXHRncmFwaGljcy5saW5lVG8oMCwwKTtcblx0Ly9ncmFwaGljcy5lbmRGaWxsKCk7XG5cdHRoaXMuc3ByaXRlLmFkZENoaWxkKGdyYXBoaWNzKTtcblxuXHR0aGlzLnNwcml0ZS5zY2FsZS5zZXRUbygwLjMsMC4zKTtcblx0dGhpcy5zcHJpdGUucGl2b3QueCA9IDA7XG5cdHRoaXMuc3ByaXRlLnBpdm90LnkgPSA0MDtcblxuXHR0aGlzLmJvZHkuY2xlYXJTaGFwZXMoKTtcblx0dGhpcy5ib2R5LmFkZFJlY3RhbmdsZSgtMTAsLTE3LCAwLC0yKTtcblx0dGhpcy5ib2R5LmNvbGxpZGVXb3JsZEJvdW5kcyA9IHByb3BlcnRpZXMuY29sbGlkZVdvcmxkQm91bmRzO1xuXHR0aGlzLmJvZHkubWFzcyA9IDE7XG5cdHRoaXMuYm9keS5zZXRDb2xsaXNpb25Hcm91cCh0aGlzLmNvbGxpc2lvbnMucGxheWVycyk7XG59O1xuXG5wLmNyYXNoID0gZnVuY3Rpb24oKSB7XG5cdHJldHVybiBcIm1vbyBtb28gbGFuZFwiO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjtcbiIsInZhciBnYW1lID0gd2luZG93LmdhbWU7XG52YXIgcHJvcGVydGllcyA9IHJlcXVpcmUoJy4uL3Byb3BlcnRpZXMnKTtcblxuLyoqXG4gKiBBIHByaXZhdGUgdmFyIGRlc2NyaXB0aW9uXG4gKlxuICogQHByb3BlcnR5IG15UHJpdmF0ZVZhclxuICogQHR5cGUge251bWJlcn1cbiAqIEBwcml2YXRlXG4gKi9cbnZhciBteVByaXZhdGVWYXIgPSAwO1xuXG4vKipcbiAqIENvbGxpc2lvbnMgZGVzY3JpcHRpb25cbiAqIGNhbGxzIGluaXRcbiAqXG4gKiBAY2xhc3MgQ29sbGlzaW9uc1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIENvbGxpc2lvbnMgKGNvbGxpc2lvbnMpIHtcblx0LyoqXG5cdCAqIEEgcHVibGljIHZhciBkZXNjcmlwdGlvblxuXHQgKlxuXHQgKiBAcHJvcGVydHkgbXlQdWJsaWNWYXJcblx0ICogQHR5cGUge251bWJlcn1cblx0ICovXG5cdHRoaXMubXlQdWJsaWNWYXIgPSAxO1xuXHR0aGlzLmluaXQoKTtcbn1cblxudmFyIHAgPSBDb2xsaXNpb25zLnByb3RvdHlwZTtcblxuLyoqXG4gKiBDb2xsaXNpb25zIGluaXRpYWxpc2F0aW9uXG4gKlxuICogQG1ldGhvZCBpbml0XG4gKi9cbnAuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXHR0aGlzLnBsYXllcnMgPSBnYW1lLnBoeXNpY3MucDIuY3JlYXRlQ29sbGlzaW9uR3JvdXAoKTtcblx0dGhpcy50ZXJyYWluID0gZ2FtZS5waHlzaWNzLnAyLmNyZWF0ZUNvbGxpc2lvbkdyb3VwKCk7XG5cdHRoaXMuYnVsbGV0cyA9IGdhbWUucGh5c2ljcy5wMi5jcmVhdGVDb2xsaXNpb25Hcm91cCgpO1xuXG5cdGdhbWUucGh5c2ljcy5wMi51cGRhdGVCb3VuZHNDb2xsaXNpb25Hcm91cCgpO1xufTtcblxuLyoqXG4qXG4qL1xucC5zZXQgPSBmdW5jdGlvbihzcHJpdGUsIGNvbGxpc2lvbkdyb3Vwcykge1xuXHRzcHJpdGUuYm9keS5jb2xsaWRlcyhjb2xsaXNpb25Hcm91cHMpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbGxpc2lvbnM7XG4iLCIvKipcbiAqIEEgcHJpdmF0ZSB2YXIgZGVzY3JpcHRpb25cbiAqXG4gKiBAcHJvcGVydHkgbXlQcml2YXRlVmFyXG4gKiBAdHlwZSB7bnVtYmVyfVxuICogQHByaXZhdGVcbiAqL1xudmFyIG15UHJpdmF0ZVZhciA9IDA7XG5cbi8qKlxuICogR3JvdXBzIGRlc2NyaXB0aW9uXG4gKiBjYWxscyBpbml0XG4gKlxuICogQGNsYXNzIEdyb3Vwc1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIEdyb3VwcyAoKSB7XG5cdC8qKlxuXHQgKiBBIHB1YmxpYyB2YXIgZGVzY3JpcHRpb25cblx0ICpcblx0ICogQHByb3BlcnR5IG15UHVibGljVmFyXG5cdCAqIEB0eXBlIHtudW1iZXJ9XG5cdCAqL1xuXHR0aGlzLm15UHVibGljVmFyID0gMTtcblx0dGhpcy5pbml0KCk7XG59XG5cbnZhciBwID0gR3JvdXBzLnByb3RvdHlwZTtcblxuLyoqXG4gKiBHcm91cHMgaW5pdGlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kIGluaXRcbiAqL1xucC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdHRoaXMuYWN0b3JzID0gZ2FtZS5hZGQuZ3JvdXAoKTtcblx0dGhpcy50ZXJyYWluID0gZ2FtZS5hZGQuZ3JvdXAoKTtcblx0dGhpcy5idWxsZXRzID0gZ2FtZS5hZGQuZ3JvdXAoKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBHcm91cHM7IiwidmFyIGdhbWUgPSB3aW5kb3cuZ2FtZTtcblxuLyoqXG4gKiBBIHByaXZhdGUgdmFyIGRlc2NyaXB0aW9uXG4gKlxuICogQHByb3BlcnR5IG15UHJpdmF0ZVZhclxuICogQHR5cGUge251bWJlcn1cbiAqIEBwcml2YXRlXG4gKi9cbnZhciBteVByaXZhdGVWYXIgPSAwO1xuXG4vKipcbiAqIFBoeXNpY3MgZGVzY3JpcHRpb25cbiAqIGNhbGxzIGluaXRcbiAqXG4gKiBAY2xhc3MgUGh5c2ljc1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIFBoeXNpY3MgKCkge1xuXHQvKipcblx0ICogQSBwdWJsaWMgdmFyIGRlc2NyaXB0aW9uXG5cdCAqXG5cdCAqIEBwcm9wZXJ0eSBteVB1YmxpY1ZhclxuXHQgKiBAdHlwZSB7bnVtYmVyfVxuXHQgKi9cblx0dGhpcy5teVB1YmxpY1ZhciA9IDE7XG5cdHRoaXMuaW5pdCgpO1xufVxuXG52YXIgcCA9IFBoeXNpY3MucHJvdG90eXBlO1xuXG4vKipcbiAqIFBoeXNpY3MgaW5pdGlhbGlzYXRpb25cbiAqXG4gKiBAbWV0aG9kIGluaXRcbiAqL1xucC5pbml0ID0gZnVuY3Rpb24oKSB7XG5cdGdhbWUucGh5c2ljcy5zdGFydFN5c3RlbShQaGFzZXIuUGh5c2ljcy5QMkpTKTtcblx0Z2FtZS5waHlzaWNzLnAyLnNldEltcGFjdEV2ZW50cyh0cnVlKTtcblx0Z2FtZS5waHlzaWNzLnAyLmdyYXZpdHkueSA9IDEwMDtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBQaHlzaWNzOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgZ2FtZSA9IG5ldyBQaGFzZXIuR2FtZSg3MDAsNTAwLCBQaGFzZXIuQVVUTyk7XG53aW5kb3cuZ2FtZSA9IGdhbWU7XG5cbmdhbWUuc3RhdGUuYWRkKCdwbGF5JywgcmVxdWlyZSgnLi9zdGF0ZXMvcGxheScpKTtcbmdhbWUuc3RhdGUuYWRkKCdsb2FkJywgcmVxdWlyZSgnLi9zdGF0ZXMvbG9hZCcpKTtcbmdhbWUuc3RhdGUuYWRkKCdtZW51JywgcmVxdWlyZSgnLi9zdGF0ZXMvbWVudScpKTtcbmdhbWUuc3RhdGUuYWRkKCdib290JywgcmVxdWlyZSgnLi9zdGF0ZXMvYm9vdCcpKTtcblxuLy9nYW1lLnNjYWxlLnNjYWxlTW9kZSA9IFBoYXNlci5TY2FsZU1hbmFnZXIuU0hPV19BTEw7XG4vL2dhbWUuc2NhbGUuc2V0U2NyZWVuU2l6ZSgpO1xuXG5nYW1lLnN0YXRlLnN0YXJ0KCdib290Jyk7IiwiOyB2YXIgX19icm93c2VyaWZ5X3NoaW1fcmVxdWlyZV9fPXJlcXVpcmU7KGZ1bmN0aW9uIGJyb3dzZXJpZnlTaGltKG1vZHVsZSwgZXhwb3J0cywgcmVxdWlyZSwgZGVmaW5lLCBicm93c2VyaWZ5X3NoaW1fX2RlZmluZV9fbW9kdWxlX19leHBvcnRfXykge1xuLy8gc3RhdHMuanMgLSBodHRwOi8vZ2l0aHViLmNvbS9tcmRvb2Ivc3RhdHMuanNcbnZhciBTdGF0cz1mdW5jdGlvbigpe3ZhciBsPURhdGUubm93KCksbT1sLGc9MCxuPUluZmluaXR5LG89MCxoPTAscD1JbmZpbml0eSxxPTAscj0wLHM9MCxmPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7Zi5pZD1cInN0YXRzXCI7Zi5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsZnVuY3Rpb24oYil7Yi5wcmV2ZW50RGVmYXVsdCgpO3QoKytzJTIpfSwhMSk7Zi5zdHlsZS5jc3NUZXh0PVwid2lkdGg6ODBweDtvcGFjaXR5OjAuOTtjdXJzb3I6cG9pbnRlclwiO3ZhciBhPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7YS5pZD1cImZwc1wiO2Euc3R5bGUuY3NzVGV4dD1cInBhZGRpbmc6MCAwIDNweCAzcHg7dGV4dC1hbGlnbjpsZWZ0O2JhY2tncm91bmQtY29sb3I6IzAwMlwiO2YuYXBwZW5kQ2hpbGQoYSk7dmFyIGk9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtpLmlkPVwiZnBzVGV4dFwiO2kuc3R5bGUuY3NzVGV4dD1cImNvbG9yOiMwZmY7Zm9udC1mYW1pbHk6SGVsdmV0aWNhLEFyaWFsLHNhbnMtc2VyaWY7Zm9udC1zaXplOjlweDtmb250LXdlaWdodDpib2xkO2xpbmUtaGVpZ2h0OjE1cHhcIjtcbmkuaW5uZXJIVE1MPVwiRlBTXCI7YS5hcHBlbmRDaGlsZChpKTt2YXIgYz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2MuaWQ9XCJmcHNHcmFwaFwiO2Muc3R5bGUuY3NzVGV4dD1cInBvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOjc0cHg7aGVpZ2h0OjMwcHg7YmFja2dyb3VuZC1jb2xvcjojMGZmXCI7Zm9yKGEuYXBwZW5kQ2hpbGQoYyk7NzQ+Yy5jaGlsZHJlbi5sZW5ndGg7KXt2YXIgaj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtqLnN0eWxlLmNzc1RleHQ9XCJ3aWR0aDoxcHg7aGVpZ2h0OjMwcHg7ZmxvYXQ6bGVmdDtiYWNrZ3JvdW5kLWNvbG9yOiMxMTNcIjtjLmFwcGVuZENoaWxkKGopfXZhciBkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7ZC5pZD1cIm1zXCI7ZC5zdHlsZS5jc3NUZXh0PVwicGFkZGluZzowIDAgM3B4IDNweDt0ZXh0LWFsaWduOmxlZnQ7YmFja2dyb3VuZC1jb2xvcjojMDIwO2Rpc3BsYXk6bm9uZVwiO2YuYXBwZW5kQ2hpbGQoZCk7dmFyIGs9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbmsuaWQ9XCJtc1RleHRcIjtrLnN0eWxlLmNzc1RleHQ9XCJjb2xvcjojMGYwO2ZvbnQtZmFtaWx5OkhlbHZldGljYSxBcmlhbCxzYW5zLXNlcmlmO2ZvbnQtc2l6ZTo5cHg7Zm9udC13ZWlnaHQ6Ym9sZDtsaW5lLWhlaWdodDoxNXB4XCI7ay5pbm5lckhUTUw9XCJNU1wiO2QuYXBwZW5kQ2hpbGQoayk7dmFyIGU9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtlLmlkPVwibXNHcmFwaFwiO2Uuc3R5bGUuY3NzVGV4dD1cInBvc2l0aW9uOnJlbGF0aXZlO3dpZHRoOjc0cHg7aGVpZ2h0OjMwcHg7YmFja2dyb3VuZC1jb2xvcjojMGYwXCI7Zm9yKGQuYXBwZW5kQ2hpbGQoZSk7NzQ+ZS5jaGlsZHJlbi5sZW5ndGg7KWo9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIiksai5zdHlsZS5jc3NUZXh0PVwid2lkdGg6MXB4O2hlaWdodDozMHB4O2Zsb2F0OmxlZnQ7YmFja2dyb3VuZC1jb2xvcjojMTMxXCIsZS5hcHBlbmRDaGlsZChqKTt2YXIgdD1mdW5jdGlvbihiKXtzPWI7c3dpdGNoKHMpe2Nhc2UgMDphLnN0eWxlLmRpc3BsYXk9XG5cImJsb2NrXCI7ZC5zdHlsZS5kaXNwbGF5PVwibm9uZVwiO2JyZWFrO2Nhc2UgMTphLnN0eWxlLmRpc3BsYXk9XCJub25lXCIsZC5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIn19O3JldHVybntSRVZJU0lPTjoxMixkb21FbGVtZW50OmYsc2V0TW9kZTp0LGJlZ2luOmZ1bmN0aW9uKCl7bD1EYXRlLm5vdygpfSxlbmQ6ZnVuY3Rpb24oKXt2YXIgYj1EYXRlLm5vdygpO2c9Yi1sO249TWF0aC5taW4obixnKTtvPU1hdGgubWF4KG8sZyk7ay50ZXh0Q29udGVudD1nK1wiIE1TIChcIituK1wiLVwiK28rXCIpXCI7dmFyIGE9TWF0aC5taW4oMzAsMzAtMzAqKGcvMjAwKSk7ZS5hcHBlbmRDaGlsZChlLmZpcnN0Q2hpbGQpLnN0eWxlLmhlaWdodD1hK1wicHhcIjtyKys7Yj5tKzFFMyYmKGg9TWF0aC5yb3VuZCgxRTMqci8oYi1tKSkscD1NYXRoLm1pbihwLGgpLHE9TWF0aC5tYXgocSxoKSxpLnRleHRDb250ZW50PWgrXCIgRlBTIChcIitwK1wiLVwiK3ErXCIpXCIsYT1NYXRoLm1pbigzMCwzMC0zMCooaC8xMDApKSxjLmFwcGVuZENoaWxkKGMuZmlyc3RDaGlsZCkuc3R5bGUuaGVpZ2h0PVxuYStcInB4XCIsbT1iLHI9MCk7cmV0dXJuIGJ9LHVwZGF0ZTpmdW5jdGlvbigpe2w9dGhpcy5lbmQoKX19fTtcIm9iamVjdFwiPT09dHlwZW9mIG1vZHVsZSYmKG1vZHVsZS5leHBvcnRzPVN0YXRzKTtcblxuOyBicm93c2VyaWZ5X3NoaW1fX2RlZmluZV9fbW9kdWxlX19leHBvcnRfXyh0eXBlb2YgU3RhdHMgIT0gXCJ1bmRlZmluZWRcIiA/IFN0YXRzIDogd2luZG93LlN0YXRzKTtcblxufSkuY2FsbChnbG9iYWwsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZnVuY3Rpb24gZGVmaW5lRXhwb3J0KGV4KSB7IG1vZHVsZS5leHBvcnRzID0gZXg7IH0pO1xuIiwiLyoqXG4gKiBEZWZpbmVzIGJ1aWxkIHNldHRpbmdzIGZvciB0aGUgdGhydXN0LWVuZ2luZVxuICpcbiAqIEBuYW1lc3BhY2UgdGhydXN0LWVuZ2luZVxuICogQG1vZHVsZSBwcm9wZXJ0aWVzXG4gKiBAY2xhc3NcbiAqIEBzdGF0aWNcbiAqIEB0eXBlIHt7ZW5hYmxlSm95cGFkOiBib29sZWFuLCBmYXRhbENvbGxpc2lvbnM6IGJvb2xlYW4sIHNjYWxlOiB7bW9kZTogbnVtYmVyfSwgZHJhd1N0YXRzOiBib29sZWFufX1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGRlYnVnUGh5c2ljczogZmFsc2UsXG5cdGNvbGxpZGVXb3JsZEJvdW5kczogdHJ1ZSxcblx0ZnJlZU9yYkxvY2tpbmc6IGZhbHNlLFxuXHRlbmFibGVKb3lwYWQ6IHRydWUsXG5cdGZhdGFsQ29sbGlzaW9uczogdHJ1ZSxcblx0c2NhbGU6IHtcblx0XHRtb2RlOiBQaGFzZXIuU2NhbGVNYW5hZ2VyLlNIT1dfQUxMXG5cdH0sXG5cdGRyYXdTdGF0czogZmFsc2UsXG5cdGRyYXdNb250YWluczogZmFsc2Vcbn07XG4iLCJ2YXIgU3RhdHMgPSByZXF1aXJlKCdTdGF0cycpO1xudmFyIHByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9wcm9wZXJ0aWVzJyk7XG5cbi8qKlxuICogVGhlIGJvb3Qgc3RhdGVcbiAqXG4gKiBAbmFtZXNwYWNlIHN0YXRlc1xuICogQG1vZHVsZSBib290XG4gKiBAdHlwZSB7e2NyZWF0ZTogRnVuY3Rpb24sIHVwZGF0ZTogRnVuY3Rpb259fVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0cHJlbG9hZDogZnVuY3Rpb24oKSB7XG5cdFx0Ly9nYW1lLmxvYWQuc2NyaXB0KCdqb3lzdGljaycsICdqYXZhc2NyaXB0cy9icm93c2VyaWZ5L3BoYXNlci12aXJ0dWFsLWpveXN0aWNrLm1pbi5qcycpO1xuXHRcdGdhbWUuc2NhbGUuc2NhbGVNb2RlID0gcHJvcGVydGllcy5zY2FsZS5tb2RlO1xuXHRcdGdhbWUuc2NhbGUuc2V0U2NyZWVuU2l6ZSgpO1xuXHR9LFxuXG5cdGNyZWF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHByb3BlcnRpZXMuZHJhd1N0YXRzKSB7XG5cdFx0XHR3aW5kb3cuc3RhdHMgPSBuZXcgU3RhdHMoKTtcblx0XHRcdHN0YXRzLnNldE1vZGUoMCk7XG5cdFx0XHRzdGF0cy5kb21FbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcblx0XHRcdHN0YXRzLmRvbUVsZW1lbnQuc3R5bGUubGVmdCA9ICcwcHgnO1xuXHRcdFx0c3RhdHMuZG9tRWxlbWVudC5zdHlsZS50b3AgPSAnMHB4JztcblxuXHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggc3RhdHMuZG9tRWxlbWVudCApO1xuXG5cdFx0XHRzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdHN0YXRzLmJlZ2luKCk7XG5cdFx0XHRcdHN0YXRzLmVuZCgpO1xuXHRcdFx0fSwgMTAwMCAvIDYwKTtcblx0XHR9XG5cblx0XHRnYW1lLnN0YXRlLnN0YXJ0KCdwbGF5Jyk7XG5cblx0fSxcblx0dXBkYXRlOiBmdW5jdGlvbigpIHtcblxuXHR9XG59OyIsIi8qKlxuICogVGhlIGxvYWQgc3RhdGVcbiAqXG4gKiBAbmFtZXNwYWNlIHN0YXRlc1xuICogQG1vZHVsZSBsb2FkXG4gKiBAdHlwZSB7e2NyZWF0ZTogRnVuY3Rpb24sIHVwZGF0ZTogRnVuY3Rpb259fVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Y3JlYXRlOiBmdW5jdGlvbigpIHtcblxuXHR9LFxuXHR1cGRhdGU6IGZ1bmN0aW9uKCkge1xuXG5cdH1cbn07IiwiLyoqXG4gKiBUaGUgbWVudSBzdGF0ZVxuICpcbiAqIEBuYW1lc3BhY2Ugc3RhdGVzXG4gKiBAbW9kdWxlIG1lbnVcbiAqIEB0eXBlIHt7Y3JlYXRlOiBGdW5jdGlvbiwgdXBkYXRlOiBGdW5jdGlvbn19XG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXG5cdH0sXG5cdHVwZGF0ZTogZnVuY3Rpb24oKSB7XG5cblx0fVxufTsiLCIvL2ltcG9ydHNcbnZhciBwcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vcHJvcGVydGllcycpO1xudmFyIFBoeXNpY3MgPSByZXF1aXJlKCcuLi9lbnZpcm9ubWVudC9QaHlzaWNzJyk7XG52YXIgQ29sbGlzaW9ucyA9IHJlcXVpcmUoJy4uL2Vudmlyb25tZW50L0NvbGxpc2lvbnMnKTtcbnZhciBHcm91cHMgPSByZXF1aXJlKCcuLi9lbnZpcm9ubWVudC9Hcm91cHMnKTtcbnZhciBQbGF5ZXIgPSByZXF1aXJlKCcuLi9hY3RvcnMvUGxheWVyJyk7XG52YXIgT3JiID0gcmVxdWlyZSgnLi4vYWN0b3JzL09yYicpO1xudmFyIE1hcCA9IHJlcXVpcmUoJy4uL2FjdG9ycy9NYXAnKTtcbnZhciBCYWNrZ3JvdW5kID0gcmVxdWlyZSgnLi4vYWN0b3JzL0JhY2tncm91bmQnKTtcblxuLy9wcml2YXRlc1xudmFyIGdhbWUgPSB3aW5kb3cuZ2FtZTtcbi8qKlxuICogUHJldmVudCBmYXRhbCBjb2xsaXNpb25zIGJ5IHNldHRpbmcgdGhpcyB2YWx1ZSB0byBmYWxzZSBpbiBwcm9wZXJ0aWVzXG4gKlxuICogQHByb3BlcnR5IGZhdGFsQ29sbGlzaW9uc1xuICogQHR5cGUge2Jvb2xlYW59XG4gKi9cbnZhciBmYXRhbENvbGxpc2lvbnMgPSBwcm9wZXJ0aWVzLmZhdGFsQ29sbGlzaW9ucztcbnZhciBwbGF5ZXI7XG52YXIgb3JiO1xudmFyIGN1cnNvcnM7XG52YXIgZ3JvdW5kO1xudmFyIGdyYXBoaWNzO1xudmFyIGFjdG9ycztcbnZhciB0ZXJyYWluO1xudmFyIHN0YXJzO1xudmFyIGJ1bGxldEJpdG1hcDtcbnZhciBtYXA7XG52YXIgYmFja2dyb3VuZDtcblxuLy9jb250cm9scztcbnZhciBwYWQ7XG52YXIgYnV0dG9uQTtcbnZhciBidXR0b25CO1xudmFyIGJ1dHRvbkFEb3duID0gZmFsc2U7XG52YXIgYnV0dG9uQkRvd24gPSBmYWxzZTtcbnZhciBpc1hEb3duICAgICA9IGZhbHNlO1xudmFyIGpveXBhZCA9IHByb3BlcnRpZXMuZW5hYmxlSm95cGFkO1xuXG4vL21vZHVsZXNcbnZhciBwaHlzaWNzO1xudmFyIGNvbGxpc2lvbnM7XG52YXIgZ3JvdXBzO1xuXG52YXIgdHJhY3RvckJlYW07XG52YXIgYmVhbUdmeDtcbnZhciB0cmFjdG9yQmVhbVRpbWVyO1xudmFyIGlzVHJhY3RvckJlYW1BY3RpdmUgPSBmYWxzZTtcbnZhciBvcmJMb2NrRW5hYmxlZCA9IGZhbHNlO1xudmFyIGlzT3JiTG9ja2VkID0gZmFsc2U7XG5cblxuLyoqXG4gKiBUaGUgcGxheSBzdGF0ZSAtIHRoaXMgaXMgd2hlcmUgdGhlIG1hZ2ljIGhhcHBlbnNcbiAqXG4gKiBAbmFtZXNwYWNlIHN0YXRlc1xuICogQG1vZHVsZSBwbGF5XG4gKiBAdHlwZSB7e2NyZWF0ZTogRnVuY3Rpb24sIHVwZGF0ZTogRnVuY3Rpb259fVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuXHRwcmVsb2FkOiBmdW5jdGlvbigpIHtcblx0XHRnYW1lLmxvYWQuaW1hZ2UoJ3RocnVzdG1hcCcsICdpbWFnZXMvdGhydXN0LWxldmVsMi5wbmcnKTtcblx0XHRnYW1lLmxvYWQucGh5c2ljcygncGh5c2ljc0RhdGEnLCAnaW1hZ2VzL3RocnVzdC1sZXZlbDIuanNvbicpO1xuXHRcdGdhbWUubG9hZC5pbWFnZSgnc3RhcnMnLCAnaW1hZ2VzL3N0YXJmaWVsZC5wbmcnKTtcblx0XHRpZiAoam95cGFkKSB7XG5cdFx0XHRnYW1lLmxvYWQuYXRsYXMoJ2RwYWQnLCAnaW1hZ2VzL3ZpcnR1YWxqb3lzdGljay9za2lucy9kcGFkLnBuZycsICdpbWFnZXMvdmlydHVhbGpveXN0aWNrL3NraW5zL2RwYWQuanNvbicpO1xuXHRcdH1cblx0fSxcblxuXHRjcmVhdGU6IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChqb3lwYWQpIHtcblx0XHRcdHBhZCA9IGdhbWUucGx1Z2lucy5hZGQoUGhhc2VyLlZpcnR1YWxKb3lzdGljayk7XG5cdFx0XHR0aGlzLnN0aWNrID0gcGFkLmFkZERQYWQoMCwgMCwgMjAwLCAnZHBhZCcpO1xuXHRcdFx0dGhpcy5zdGljay5hbGlnbkJvdHRvbUxlZnQoKTtcblxuXHRcdFx0YnV0dG9uQSA9IHBhZC5hZGRCdXR0b24oNTA1LCA0MjAsICdkcGFkJywgJ2J1dHRvbjEtdXAnLCAnYnV0dG9uMS1kb3duJyk7XG5cdFx0XHRidXR0b25BLm9uRG93bi5hZGQodGhpcy5wcmVzc0J1dHRvbkEsIHRoaXMpO1xuXHRcdFx0YnV0dG9uQS5vblVwLmFkZCh0aGlzLnVwQnV0dG9uQSwgdGhpcyk7XG5cblx0XHRcdGJ1dHRvbkIgPSBwYWQuYWRkQnV0dG9uKDYxNSwgMzcwLCAnZHBhZCcsICdidXR0b24yLXVwJywgJ2J1dHRvbjItZG93bicpO1xuXHRcdFx0YnV0dG9uQi5vbkRvd24uYWRkKHRoaXMucHJlc3NCdXR0b25CLCB0aGlzKTtcblx0XHRcdGJ1dHRvbkIub25VcC5hZGQodGhpcy51cEJ1dHRvbkIsIHRoaXMpO1xuXHRcdH1cblxuXHRcdGdhbWUud29ybGQuc2V0Qm91bmRzKDAsIDAsIDkyOCwgMTI4MCk7XG5cblx0XHRwaHlzaWNzID0gbmV3IFBoeXNpY3MoKTtcblx0XHRncm91cHMgPSBuZXcgR3JvdXBzKCk7XG5cdFx0Y29sbGlzaW9ucyA9IG5ldyBDb2xsaXNpb25zKCk7XG5cdFx0YmFja2dyb3VuZCA9IG5ldyBCYWNrZ3JvdW5kKCk7XG5cdFx0cGxheWVyID0gbmV3IFBsYXllcihjb2xsaXNpb25zKTtcblx0XHRvcmIgPSBuZXcgT3JiKGNvbGxpc2lvbnMpO1xuXHRcdG1hcCA9IG5ldyBNYXAoY29sbGlzaW9ucyk7XG5cblx0XHRjb2xsaXNpb25zLnNldChvcmIsIFtjb2xsaXNpb25zLnBsYXllcnMsIGNvbGxpc2lvbnMudGVycmFpbiwgY29sbGlzaW9ucy5idWxsZXRzXSk7XG5cdFx0Y29sbGlzaW9ucy5zZXQobWFwLCBbY29sbGlzaW9ucy5wbGF5ZXJzLCBjb2xsaXNpb25zLnRlcnJhaW4sIGNvbGxpc2lvbnMuYnVsbGV0c10pO1xuXHRcdHBsYXllci5ib2R5LmNvbGxpZGVzKGNvbGxpc2lvbnMudGVycmFpbiwgdGhpcy5jcmFzaCwgdGhpcyk7XG5cblx0XHRiZWFtR2Z4ID0gbmV3IFBoYXNlci5HcmFwaGljcyhnYW1lLCAwLDApO1xuXHRcdHRyYWN0b3JCZWFtID0gZ2FtZS5hZGQuc3ByaXRlKDAsMCk7XG5cdFx0dHJhY3RvckJlYW0uYWRkQ2hpbGQoYmVhbUdmeCk7XG5cblx0XHRncm91cHMudGVycmFpbi5hZGQoYmFja2dyb3VuZC5zcHJpdGUpO1xuXHRcdGlmIChiYWNrZ3JvdW5kLm1vdW50YWlucykgZ3JvdXBzLnRlcnJhaW4uYWRkKGJhY2tncm91bmQubW91bnRhaW5zKTtcblx0XHRncm91cHMuYWN0b3JzLmFkZChwbGF5ZXIuc3ByaXRlKTtcblx0XHRncm91cHMuYWN0b3JzLmFkZChvcmIuc3ByaXRlKTtcblxuXHRcdGdhbWUud29ybGQuc3dhcChncm91cHMudGVycmFpbiwgZ3JvdXBzLmFjdG9ycyk7XG5cblx0XHRidWxsZXRCaXRtYXAgPSBnYW1lLm1ha2UuYml0bWFwRGF0YSg1LDUpO1xuXHRcdGJ1bGxldEJpdG1hcC5jdHguZmlsbFN0eWxlID0gJyNmZmZmZmYnO1xuXHRcdGJ1bGxldEJpdG1hcC5jdHguYmVnaW5QYXRoKCk7XG5cdFx0YnVsbGV0Qml0bWFwLmN0eC5hcmMoMS4wLDEuMCwyLCAwLCBNYXRoLlBJKjIsIHRydWUpO1xuXHRcdGJ1bGxldEJpdG1hcC5jdHguY2xvc2VQYXRoKCk7XG5cdFx0YnVsbGV0Qml0bWFwLmN0eC5maWxsKCk7XG5cblx0XHRnYW1lLmNhbWVyYS5mb2xsb3cocGxheWVyLnNwcml0ZSk7XG5cblx0XHRjdXJzb3JzIFx0XHRcdCA9IGdhbWUuaW5wdXQua2V5Ym9hcmQuY3JlYXRlQ3Vyc29yS2V5cygpO1xuXHRcdHZhciBzcGFjZVByZXNzID0gZ2FtZS5pbnB1dC5rZXlib2FyZC5hZGRLZXkoUGhhc2VyLktleWJvYXJkLlNQQUNFQkFSKTtcblx0XHR2YXIgeEtleVx0ICAgICA9IGdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5YKTtcblx0XHR2YXIgY0tleSAgICAgICA9IGdhbWUuaW5wdXQua2V5Ym9hcmQuYWRkS2V5KFBoYXNlci5LZXlib2FyZC5DKTtcblx0XHRzcGFjZVByZXNzLm9uRG93bi5hZGQodGhpcy5maXJlLCB0aGlzKTtcblx0XHRjS2V5Lm9uRG93bi5hZGQodGhpcy5sb2NrT3JiLCB0aGlzKTtcblx0XHR4S2V5Lm9uRG93bi5hZGQodGhpcy54RG93biwgdGhpcyk7XG5cdFx0eEtleS5vblVwLmFkZCh0aGlzLnhVcCwgdGhpcyk7XG5cblx0XHR0cmFjdG9yQmVhbVRpbWVyID0gZ2FtZS50aW1lLmNyZWF0ZShmYWxzZSk7XG5cblx0fSxcblx0dXBkYXRlOiBmdW5jdGlvbigpIHtcblxuXHRcdGlmIChjdXJzb3JzLmxlZnQuaXNEb3duKSB7XG5cdFx0XHRwbGF5ZXIuYm9keS5yb3RhdGVMZWZ0KDEwMCk7XG5cdFx0fSBlbHNlIGlmIChjdXJzb3JzLnJpZ2h0LmlzRG93bikge1xuXHRcdFx0cGxheWVyLmJvZHkucm90YXRlUmlnaHQoMTAwKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cGxheWVyLmJvZHkuc2V0WmVyb1JvdGF0aW9uKCk7XG5cdFx0fVxuXHRcdGlmIChjdXJzb3JzLnVwLmlzRG93biB8fCBidXR0b25BRG93bil7XG5cdFx0XHRwbGF5ZXIuYm9keS50aHJ1c3QoNDAwKTtcblx0XHR9XG5cdFx0aWYgKGlzWERvd24gfHwgYnV0dG9uQkRvd24pIHtcblx0XHRcdHRoaXMuY2hlY2tEaXN0YW5jZSgpO1xuXHRcdH1cblxuXHRcdGlmIChpc09yYkxvY2tlZCkge1xuXHRcdFx0dGhpcy5kcmF3VHJhY3RvckJlYW0oKTtcblx0XHR9XG5cblxuXG5cdFx0aWYgKGpveXBhZCkge1xuXHRcdFx0aWYgKHRoaXMuc3RpY2suaXNEb3duKSB7XG5cdFx0XHRcdGlmICh0aGlzLnN0aWNrLmRpcmVjdGlvbiA9PT0gUGhhc2VyLkxFRlQpIHtcblx0XHRcdFx0XHRwbGF5ZXIuYm9keS5yb3RhdGVMZWZ0KDEwMCk7XG5cdFx0XHRcdH0gZWxzZSBpZiAodGhpcy5zdGljay5kaXJlY3Rpb24gPT09IFBoYXNlci5SSUdIVCkge1xuXHRcdFx0XHRcdHBsYXllci5ib2R5LnJvdGF0ZVJpZ2h0KDEwMCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdGdhbWUud29ybGQud3JhcChwbGF5ZXIuYm9keSwgMCwgZmFsc2UpO1xuXHR9LFxuXG5cdGZpcmU6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBtYWduaXR1ZSA9IDI0MDtcblx0XHR2YXIgYnVsbGV0ID0gZ2FtZS5tYWtlLnNwcml0ZShwbGF5ZXIuc3ByaXRlLnBvc2l0aW9uLngsIHBsYXllci5zcHJpdGUucG9zaXRpb24ueSwgYnVsbGV0Qml0bWFwKTtcblx0XHRidWxsZXQuYW5jaG9yLnNldFRvKDAuNSwwLjUpO1xuXHRcdGdhbWUucGh5c2ljcy5wMi5lbmFibGUoYnVsbGV0KTtcblx0XHR2YXIgYW5nbGUgPSBwbGF5ZXIuYm9keS5yb3RhdGlvbiArICgzICogTWF0aC5QSSkgLyAyO1xuXHRcdGJ1bGxldC5ib2R5LmNvbGxpZGVzV29ybGRCb3VuZHMgPSBmYWxzZTtcblx0XHRidWxsZXQuYm9keS5zZXRDb2xsaXNpb25Hcm91cChjb2xsaXNpb25zLmJ1bGxldHMpO1xuXHRcdGJ1bGxldC5ib2R5LmNvbGxpZGVzKGNvbGxpc2lvbnMudGVycmFpbiwgdGhpcy5idWxsZXREZWF0aCwgdGhpcyk7XG5cdFx0YnVsbGV0LmJvZHkuZGF0YS5ncmF2aXR5U2NhbGUgPSAwO1xuXHRcdGJ1bGxldC5ib2R5LnZlbG9jaXR5LnggPSBtYWduaXR1ZSAqIE1hdGguY29zKGFuZ2xlKSArIHBsYXllci5ib2R5LnZlbG9jaXR5Lng7XG5cdFx0YnVsbGV0LmJvZHkudmVsb2NpdHkueSA9IG1hZ25pdHVlICogTWF0aC5zaW4oYW5nbGUpICsgcGxheWVyLmJvZHkudmVsb2NpdHkueTtcblx0XHRncm91cHMuYnVsbGV0cy5hZGQoYnVsbGV0KTtcblx0fSxcblxuXHRlbmFibGVPcmJMb2NrOiBmdW5jdGlvbigpIHtcblx0XHRvcmJMb2NrRW5hYmxlZCA9IHRydWU7XG5cdH0sXG5cblx0cmVsZWFzZVRyYWN0b3JCZWFtOiBmdW5jdGlvbigpIHtcblx0XHRvcmJMb2NrRW5hYmxlZCA9IGZhbHNlO1xuXHRcdGlzVHJhY3RvckJlYW1BY3RpdmUgPSBmYWxzZTtcblx0XHRiZWFtR2Z4LmNsZWFyKCk7XG5cdFx0dHJhY3RvckJlYW1UaW1lci5zdG9wKHRydWUpO1xuXHR9LFxuXG5cdGRyYXdUcmFjdG9yQmVhbTogZnVuY3Rpb24oKSB7XG5cdFx0YmVhbUdmeC5jbGVhcigpO1xuXHRcdGJlYW1HZngubGluZVN0eWxlKDUsIDB4MDBmZjAwLCAwLjUpO1xuXHRcdGJlYW1HZngubW92ZVRvKHBsYXllci5zcHJpdGUucG9zaXRpb24ueCwgcGxheWVyLnNwcml0ZS5wb3NpdGlvbi55KTtcblx0XHRiZWFtR2Z4LmxpbmVUbyhvcmIuc3ByaXRlLnBvc2l0aW9uLngsIG9yYi5zcHJpdGUucG9zaXRpb24ueSk7XG5cdH0sXG5cblx0Y2hlY2tEaXN0YW5jZTogZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGRpc3RhbmNlID0gdGhpcy5kaXN0QXRvQihwbGF5ZXIuc3ByaXRlLnBvc2l0aW9uLCBvcmIuc3ByaXRlLnBvc2l0aW9uKTtcblx0XHRpZiAoZGlzdGFuY2UgPCAxMDApIHtcblx0XHRcdHRoaXMuZHJhd1RyYWN0b3JCZWFtKCk7XG5cdFx0XHRpZiAoIWlzVHJhY3RvckJlYW1BY3RpdmUpIHtcblx0XHRcdFx0aXNUcmFjdG9yQmVhbUFjdGl2ZSA9IHRydWU7XG5cdFx0XHRcdHRyYWN0b3JCZWFtVGltZXIuc3RhcnQoKTtcblx0XHRcdFx0dHJhY3RvckJlYW1UaW1lci5hZGQoMTUwMCwgdGhpcy5lbmFibGVPcmJMb2NrKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKGRpc3RhbmNlID49IDEwMCAmJiBkaXN0YW5jZSA8IDExMCkge1xuXHRcdFx0aWYgKG9yYkxvY2tFbmFibGVkKSB7XG5cdFx0XHRcdHRoaXMubG9ja09yYigpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoaXNUcmFjdG9yQmVhbUFjdGl2ZSkge1xuXHRcdFx0XHR0aGlzLnJlbGVhc2VUcmFjdG9yQmVhbSgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9LFxuXG5cdGxvY2tPcmI6IGZ1bmN0aW9uKCkge1xuXHRcdGlmIChpc09yYkxvY2tlZCkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR2YXIgbWF4Rm9yY2UgPSAxMDAwMDtcblx0XHR2YXIgYmVhbVNwciA9IGdhbWUuYWRkLnNwcml0ZShvcmIuc3ByaXRlLngsIG9yYi5zcHJpdGUueSk7XG5cdFx0Z2FtZS5waHlzaWNzLnAyLmVuYWJsZShiZWFtU3ByLCBwcm9wZXJ0aWVzLmRlYnVnUGh5c2ljcyk7XG5cdFx0dmFyIGRpZmZYID0gcGxheWVyLnNwcml0ZS5wb3NpdGlvbi54IC0gb3JiLnNwcml0ZS5wb3NpdGlvbi54O1xuXHRcdHZhciBkaWZmWSA9IHBsYXllci5zcHJpdGUucG9zaXRpb24ueSAtIG9yYi5zcHJpdGUucG9zaXRpb24ueTtcblx0XHRiZWFtU3ByLmJvZHkuY29sbGlkZVdvcmxkQm91bmRzID0gcHJvcGVydGllcy5jb2xsaWRlV29ybGRCb3VuZHM7XG5cdFx0YmVhbVNwci5ib2R5Lm1hc3MgPSAwLjE7XG5cdFx0YmVhbVNwci5ib2R5LmNsZWFyU2hhcGVzKCk7XG5cdFx0Z2FtZS5waHlzaWNzLnAyLmNyZWF0ZVJldm9sdXRlQ29uc3RyYWludChiZWFtU3ByLCBbMCwgMF0sIG9yYi5zcHJpdGUsIFswLDBdLCBtYXhGb3JjZSk7XG5cdFx0Z2FtZS5waHlzaWNzLnAyLmNyZWF0ZVJldm9sdXRlQ29uc3RyYWludChiZWFtU3ByLCBbZGlmZlgsZGlmZlldLCBwbGF5ZXIuc3ByaXRlLCBbMCwwXSwgbWF4Rm9yY2UpO1xuXHRcdG9yYi5tb3ZlKCk7XG5cdFx0aXNPcmJMb2NrZWQgPSB0cnVlO1xuXG5cdH0sXG5cblx0cmVuZGVyOiBmdW5jdGlvbigpIHtcblx0XHRnYW1lLmRlYnVnLmNhbWVyYUluZm8oZ2FtZS5jYW1lcmEsIDUwMCwgMjApO1xuXHR9LFxuXG5cdGNyYXNoOiBmdW5jdGlvbihwbGF5ZXJCb2R5KSB7XG5cdFx0aWYgKGZhdGFsQ29sbGlzaW9ucykge1xuXHRcdFx0Y29uc29sZS5sb2coJ2RpZSEnLCBwbGF5ZXIuY3Jhc2goKSk7XG5cdFx0fVxuXHR9LFxuXG5cdGJ1bGxldERlYXRoOiBmdW5jdGlvbihidWxsZXRCb2R5KSB7XG5cdFx0YnVsbGV0Qm9keS5zcHJpdGUua2lsbCgpO1xuXHRcdGdyb3Vwcy5idWxsZXRzLnJlbW92ZShidWxsZXRCb2R5LnNwcml0ZSk7XG5cdH0sXG5cblx0cHJlc3NCdXR0b25BOiBmdW5jdGlvbigpIHtcblx0XHRidXR0b25BRG93biA9IHRydWU7XG5cdH0sXG5cblx0dXBCdXR0b25BOiBmdW5jdGlvbigpIHtcblx0XHRidXR0b25BRG93biA9IGZhbHNlO1xuXHR9LFxuXG5cdHByZXNzQnV0dG9uQjogZnVuY3Rpb24oKSB7XG5cdFx0YnV0dG9uQkRvd24gPSB0cnVlO1xuXHR9LFxuXG5cdHVwQnV0dG9uQjogZnVuY3Rpb24oKSB7XG5cdFx0YnV0dG9uQkRvd24gPSBmYWxzZTtcblx0fSxcblxuXHR4RG93bjogZnVuY3Rpb24gKCkge1xuXHRcdGlzWERvd24gPSB0cnVlO1xuXHR9LFxuXG5cdHhVcDogZnVuY3Rpb24oKSB7XG5cdFx0aXNYRG93biA9IGZhbHNlO1xuXHRcdHRoaXMucmVsZWFzZVRyYWN0b3JCZWFtKCk7XG5cdH0sXG5cblx0ZGlzdEF0b0I6IGZ1bmN0aW9uKHBvaW50QSwgcG9pbnRCKSB7XG5cblx0XHR2YXIgQSA9IHBvaW50Qi54IC0gcG9pbnRBLng7XG5cdFx0dmFyIEIgPSBwb2ludEIueSAtIHBvaW50QS55O1xuXG5cdFx0cmV0dXJuIE1hdGguc3FydChBKkEgKyBCKkIpO1xuXG5cdH1cbn07XG4iXX0=
