var _ = require('lodash');
var UiComponent = require('../ui-component');
var UiSwitch = require('../ui-switch');
var optionsModel = require('../../data/options-model');
var user

var p = ControlOptions.prototype = Object.create(UiComponent.prototype, {
  constructor: ControlOptions
});

module.exports = ControlOptions;

/**
 * @property group
 * @type {null}
 */
p.group = null;

p.marginTop = 0;

/**
 *
 *
 * @class ControlOptions
 * @param group
 * @param name
 * @param layoutRect
 * @constructor
 */
function ControlOptions(group, name, layoutRect) {
  UiComponent.call(this, group, name, true, false);
  this.layoutRect = layoutRect;
}

/**
 *
 */
p.render = function () {
  UiComponent.prototype.render.call(this);
  this.createDisplay();
  this.renderDefaults();
};

/**
 *
 */
p.createDisplay = function () {

  var style = this.getStyle();
  var rightAlignedStyle = _.clone(style);
  rightAlignedStyle.align = "right";

  var centerStyle = _.clone(style);
  centerStyle.align = "center";

  var text1 = game.add.text(0, 0, "ROTATE\nLEFT", style, this.group);
  var text2 = game.add.text(0, 0, "ROTATE\nRIGHT", rightAlignedStyle, this.group);
  var text3 = game.add.text(0, 0, "THRUST", style, this.group);
  var text4 = game.add.text(0, 0, "FIRE", style, this.group);
  //text1.anchor.setTo(0.5);
  //text2.anchor.setTo(0.5);
  text1.x = this.layoutRect.halfWidth * 0.05;
  text1.y = this.layoutRect.height * 0.45;
  text2.x = this.layoutRect.halfWidth * 0.45;
  text2.y = this.layoutRect.height * 0.45;
  text3.x = this.layoutRect.width * 0.65;
  text3.y = this.layoutRect.height * 0.6;
  text4.x = this.layoutRect.width * 0.85;
  text4.y = this.layoutRect.height * 0.5;

  var graphics = game.add.graphics(0, 0, this.group);
  graphics.lineStyle(1, 0xff00c6, 1);

  var dpad = game.controls.stick;
  var aButton = game.controls.buttonA;
  var bButton = game.controls.buttonB;

  var buttonLeftPos = new Phaser.Point(
    dpad.posX - dpad.sprite.width * 0.25 - this.group.parent.position.x,
    dpad.posY - this.group.parent.position.y
  );

  var buttonRightPos = new Phaser.Point(
    dpad.posX + dpad.sprite.width * 0.25 - this.group.parent.position.x,
    buttonLeftPos.y
  );

  var aButtonPos = new Phaser.Point(
    aButton.posX - this.group.parent.position.x,
    aButton.posY - this.group.parent.position.y

  );
  var bButtonPos = new Phaser.Point(
    bButton.posX - this.group.parent.position.x,
    bButton.posY - this.group.parent.position.y
  );

  var coords = [
    {x: text1.x + text1.width * 0.5, y: text1.y + text1.height},
    {x: buttonLeftPos.x, y: text1.y + text1.height},
    {x: buttonLeftPos.x, y: buttonLeftPos.y},
    {x: text2.x + text2.width * 0.5, y: text2.y + text2.height},
    {x: text2.x + text2.width * 0.5, y: buttonRightPos.y},
    {x: buttonRightPos.x, y: buttonRightPos.y},
    {x: text3.x + text3.width * 0.5, y: text3.y + text3.height},
    {x: text3.x + text3.width * 0.5, y: aButtonPos.y},
    {x: aButtonPos.x, y: aButtonPos.y},
    {x: text4.x + text4.width * 0.5, y: text4.y + text4.height},
    {x: text4.x + text4.width * 0.5, y: bButtonPos.y},
    {x: bButtonPos.x, y: bButtonPos.y}
  ];


  graphics.moveTo(coords[0].x, coords[0].y);
  graphics.lineTo(coords[1].x, coords[1].y);
  graphics.lineTo(coords[2].x, coords[2].y);
  graphics.moveTo(coords[3].x, coords[3].y);
  graphics.lineTo(coords[4].x, coords[4].y);
  graphics.lineTo(coords[5].x, coords[5].y);
  graphics.moveTo(coords[6].x, coords[6].y);
  graphics.lineTo(coords[7].x, coords[7].y);
  graphics.lineTo(coords[8].x, coords[8].y);
  graphics.moveTo(coords[9].x, coords[9].y);
  graphics.lineTo(coords[10].x, coords[10].y);
  graphics.lineTo(coords[11].x, coords[11].y);

  var style = this.getStyle();
  var helperTxt = game.add.text(0, 0, "Control ship using the virutual joypad\nConnect joypad and restart app\nto enable joypad", centerStyle, this.group);
  helperTxt.anchor.setTo(0.5);
  helperTxt.x = this.layoutRect.halfWidth;
  helperTxt.y = this.marginTop;
  /*
  var gamePadEnabled = new UiSwitch(this.group, "VIRTUAL JOYPAD");
  gamePadEnabled.render();
  gamePadEnabled.group.x = this.layoutRect.halfWidth - gamePadEnabled.originPos.x;
  gamePadEnabled.group.y = this.marginTop;
  gamePadEnabled.switchedOn.add(this.virtualJoypadOn, this, 0);
  gamePadEnabled.switchedOff.add(this.virtualJoypadOff, this, 0);
  if (optionsModel.controls.virtualJoypad) {
    gamePadEnabled.switch(true, true);
  }
  this.components.push(gamePadEnabled);
  */
};

/**
 *
 */
p.renderDefaults = function () {
  /*
   if (optionsModel.controls.virtualJoypad) {
   this.components[0].switch(true);
   }
   */
};

//todo fix this dispose
p.dispose = function () {
  _.each(this.components, function (component) {
    //component.switchOn.removeAll();
    //component.switchOff.removeAll();
  });
  UiComponent.prototype.dispose.call(this);
};

/**
 *
 */
p.virtualJoypadOn = function () {
  game.controls.show();
  optionsModel.controls.virtualJoypad = true;
};

/**
 *
 */
p.virtualJoypadOff = function () {
  game.controls.hide();
  optionsModel.controls.virtualJoypad = false;
};