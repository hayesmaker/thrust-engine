var UiComponent = require('./ui-component');
var gameState = require('../data/game-state');
var dialogs = require('../data/dialogs');

var p = UiLevelsComplete.prototype = Object.create(UiComponent.prototype, {
  constructor: UiLevelsComplete
});

module.exports = UiLevelsComplete;

p.group = null;

p.padding = 20;

/**
 * Shown when the regular levels get completed on game over.
 *
 * @class UiLevelsComplete
 * @param group
 * @param name
 * @param playState
 * @constructor
 */
function UiLevelsComplete(group, name, playState) {
  UiComponent.call(this, group, name, true, true);
  this.playState = playState;
  this.scale = gameState.gameScale;
}

/**
 * @method render
 */
p.render = function () {
  UiComponent.prototype.render.call(this);
  this.createDisplay();
  this.enable();
};

/**
 * @method createDisplay
 */
p.createDisplay = function () {
  var titleFontSize = Math.floor(24 * this.scale);
  var defaultFontSize = Math.floor(16 * this.scale);
  this.styles = {
    title: {font: titleFontSize + 'px thrust_regular', fill: '#ffffff', align: 'left'},
    default: {font: defaultFontSize + 'px thrust_regular', fill: '#ffffff', align: 'left'}
  };
  this.renderImage();
  this.renderText();
};

/**
 * @method renderText
 */
p.renderText = function () {
  this.title = game.add.text(this.layoutRect.x + this.layoutRect.halfWidth, 0, "CONGRATULATIONS", this.styles.title, this.group);
  this.title.anchor.setTo(0.5);
  this.title.y = this.layoutRect.y + this.layoutRect.height * 0.1;
  var para1Str = dialogs.getLevelsCompleteText();
  this.paragraph1 = game.add.text(this.layoutRect.x + this.padding * 2, 0, para1Str, this.styles.default, this.group);
  this.paragraph1.width = this.layoutRect.width - this.padding * 4;

  this.paragraph1.x = this.layoutRect.x + this.layoutRect.halfWidth;
  this.paragraph1.y = this.layoutRect.y + this.layoutRect.halfHeight;
  this.paragraph1.anchor.setTo(0.5);

  this.pressFire = game.add.text(this.layoutRect.x + this.layoutRect.halfWidth, 0, "PRESS FIRE TO CONTINUE", this.styles.default, this.group);
  this.pressFire.anchor.setTo(0.5);

  this.pressFire.y = this.layoutRect.y + this.layoutRect.height * 0.9;

  this.title.stroke = this.paragraph1.stroke = this.pressFire.stroke = '#000000';
  this.title.strokeThickness = this.paragraph1.strokeThickness = this.pressFire.strokeThickness = 6;
  this.title.fill = this.paragraph1.fill = this.pressFire.fill = '#ffffff';
};

/**
 * @method renderImage
 */
p.renderImage = function () {
  var image = game.add.image(0, 0, 'coverImage', '', this.group);
  var scaleX = (game.width - game.width / 30) / image.width;
  image.alpha = 0.5;
  image.scale.setTo(scaleX);
  image.x = image.y = game.width / 2 - image.width / 2;

  this.layoutRect = new Phaser.Rectangle(
    this.padding,
    this.padding,
    game.width - this.padding * 2,
    game.height - this.padding * 2
  );

  var mask = game.add.graphics(0, 0, this.group);
  mask.beginFill(0xff0000, 1);
  mask.drawRect(this.layoutRect.x, this.layoutRect.y, this.layoutRect.width, this.layoutRect.height);
  mask.endFill();

  var rect = game.add.graphics(0, 0, this.group);
  rect.lineStyle(2, 0xffffff, 1);
  rect.drawRect(this.layoutRect.x, this.layoutRect.y, this.layoutRect.width, this.layoutRect.height);
  rect.endFill();

  image.mask = mask;
};

/**
 * @method enable
 */
p.enable = function () {
  this.enabled = true;
  if (game.controls.useKeys) {
    game.controls.spacePress.onDown.add(this.spacePressed, this);
  }
  if (game.controls.advancedTouchControlsGroup) {
    game.controls.fireButtonDown.add(this.spacePressed, this);
    //use new advanced touch controls
    //game.controls.buttonB.onDown.add(this.spacePressed, this);
  }
  if (game.controls.useExternalJoypad) {
    game.controls.buttonB.onDown.add(this.spacePressed, this);
  }
};

/**
 * @method disable
 */
p.disable = function () {
  this.enabled = false;
  if (game.controls.useKeys) {
    game.controls.spacePress.onDown.remove(this.spacePressed, this);
  }
  if (game.controls.advancedTouchControlsGroup) {
    game.controls.fireButtonDown.remove(this.spacePressed, this);
  }
  if (game.controls.useExternalJoypad) {
    game.controls.buttonB.onDown.remove(this.spacePressed, this);
  }
};

/**
 * @method update
 */
p.update = function() {
  if (!this.enabled) {
    return;
  }
  if (game.controls.gamepad.justPressed(Phaser.Gamepad.BUTTON_1)) {
    this.spacePressed();
  }
};

/**
 * @method spacePressed
 */
p.spacePressed = function () {
  //todo add logging to debug high scores after game complete
  gameState.doHighScoreCheck(true);
  gameState.doBestTimeCheck();
  this.playState.showCurrentScreenByState.call(this.playState, gameState.PLAY_STATES.HIGH_SCORES);
};