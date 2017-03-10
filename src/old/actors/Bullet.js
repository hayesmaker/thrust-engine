/**
 * @class Bullet
 * @constructor
 * @param collisions
 * @param isPlayer
 */
function Bullet(collisions, isPlayer) {
  this.isPlayer = isPlayer;
  var bulletBitmap;
  if (isPlayer) {
    bulletBitmap = this.drawPlayerBullet();
  } else {
    bulletBitmap = this.drawEnemyBullet();
  }
  Phaser.Sprite.call(this, game, 0, 0, bulletBitmap);
  this.collisions = collisions;
  this.collisionGroup = isPlayer ? this.collisions.bullets : this.collisions.enemyBullets;
  this.collidesArr = isPlayer ?
    [
      this.collisions.terrain,
      this.collisions.enemies,
      this.collisions.fuels,
      this.collisions.orb
    ] :
    [
      this.collisions.terrain,
      this.collisions.enemies,
      this.collisions.fuels,
      this.collisions.players,
      this.collisions.orb
    ];
  this.anchor.set(0.5);
  this.checkWorldBounds = true;
  this.outOfBoundsKill = true;
  this.exists = false;
}

var p = Bullet.prototype = Object.create(Phaser.Sprite.prototype, {
  constructor: Bullet
});

/**
 * @method drawPlayerBullet
 * @return {*|Phaser.BitmapData}
 */
p.drawPlayerBullet = function () {
  var bulletBitmap = game.make.bitmapData(15, 2);
  bulletBitmap.ctx.beginPath();
  bulletBitmap.ctx.strokeStyle = '#4affff';
  bulletBitmap.ctx.lineWidth = 2;
  bulletBitmap.ctx.moveTo(1, 1);
  bulletBitmap.ctx.lineTo(15, 1);
  bulletBitmap.ctx.stroke();
  return bulletBitmap;
};

/**
 *
 *
 * @method drawEnemyBullet
 * @return {Phaser.BitmapData|*}
 */
p.drawEnemyBullet = function () {
  var bulletBitmap = game.make.bitmapData(4, 4);
  bulletBitmap.ctx.fillStyle = '#ff93ff';
  bulletBitmap.ctx.beginPath();
  bulletBitmap.ctx.lineWidth = 1;
  bulletBitmap.ctx.arc(2, 2, 2, 0, Math.PI * 2, true);
  bulletBitmap.ctx.closePath();
  bulletBitmap.ctx.fill();
  return bulletBitmap;
};

/**
 * @method fire
 * @param x
 * @param y
 * @param angle
 * @param speed
 * @param lifespan
 */
p.fire = function (x, y, angle, speed, lifespan) {
  this.reset(x, y);
  this.exists = true;
  this.body.velocity.x = speed * Math.cos(angle);
  this.body.velocity.y = speed * Math.sin(angle);
  this.body.collideWorldBounds = false;
  this.body.setCollisionGroup(this.collisionGroup);
  this.body.collides(this.collidesArr, this.remove, this);
  this.lifespan = lifespan;
  this.body.rotation = angle;
};

/**
 * Calling sprite.kill here causes bullets to sometimes
 * missfire (reset and stop in mid air)
 * This is fixed by ONLY calling exists.false on the bullet
 *
 * @method remove
 */
p.remove = function () {
  this.exists = false;
};


module.exports = Bullet;

