var UiComponent = require('./ui-component');
var UiButton = require('./ui-button');
var canvas = require('../utils/canvas');
var TimelineMax = global.TimelineMax;
var TweenMax = global.TweenMax;
var Quad = global.Quad;

var p = UiSelect.prototype = Object.create(UiComponent.prototype, {
  constructor: UiSelect
});

module.exports = UiSelect;

p.backgroundSkin = null;
p.buttonSkin = null;
p.selectionSkin = null;
p.isOn = false;
p.switchedOn = null;
p.switchedOff = null;
p.gamepadSelector = null;
p.originPos = null;
p.dataProvider = [];
p.padding = 10;
p.optionTexts = [];
p.selectedIndex = 0;

/**
 * Skinnable Ui select options list
 *
 * @class UiSelect
 * @param group
 * @param name
 * @param dataProvider
 * @constructor
 */
function UiSelect(group, name, dataProvider) {
  UiComponent.call(this, group, name, true, false);
  this.originPos = new Phaser.Point();
  this.label = this.name;
  this.dataProvider = dataProvider;
  this.optionTexts = [];

}

/**
 * @method render
 */
p.render = function () {
  UiComponent.prototype.render.call(this);

  this.initOptions();
  this.createDisplay();
  this.addOptions();
  this.createLabel();
  this.alignToLabel();
  this.drawSelector();
  this.initEvents();
};

p.initOptions = function() {
  var option;
  var w = 1,h = 1;

  var optionSkin = game.make.bitmapData(w, h);
  optionSkin.ctx.fillStyle = 'rgba(255, 0, 0, 1)';
  canvas.drawRoundRect(optionSkin.ctx, 0, 0, w, h, 0, true, false);
  this.optionBg = game.make.sprite(-this.padding, -this.padding, optionSkin, '');
  this.optionBg.visible = false;
  this.optionBg.alpha = 0;


  _.each(this.dataProvider, function(optionData, index) {

    option = game.make.text(0,0, optionData.str, this.style);
    option.x = 0;
    option.y = (index) * (option.height + this.padding * 2);

    if (option.width > w) {
      w = option.width;
      this.optionBg.width = w + this.padding * 2;
      this.optionBg.height = option.height + this.padding * 2;
    }
    h = option.y + option.height;
    this.optionTexts.push(option);
    option.alpha = 0;
    option.visible = false;
  }.bind(this));

  this.maxW = w + this.padding * 2;
  this.maxH = h + this.padding * 2;
};

p.addOptions = function() {
  this.group.add(this.optionBg);
  _.each(this.optionTexts, function(txt) {
    this.group.add(txt);
  }.bind(this));
};

/**
 * @method createDisplay
 */
p.createDisplay = function () {
  this.button = new UiButton(this.group, "V");
  this.button.padding = 5;
  this.button.render();

  this.backgroundSkin = game.make.bitmapData(this.maxW + this.padding * 2, this.maxH + this.padding * 2);
  this.backgroundSkin.ctx.fillStyle = 'rgba(20, 51, 87, 1)';
  canvas.drawRoundRect(this.backgroundSkin.ctx, 0, 0, this.maxW, this.maxH, 0, true, false);
  this.selectBoxBg = game.make.sprite(-this.padding, -this.padding, this.backgroundSkin, '');
  this.group.add(this.selectBoxBg);
  this.selectBoxBg.visible = false;
  this.selectBoxBg.alpha = 0;

};

p.dropDownSelect = function() {
  console.log('dropDownSelect');

};

p.createLabel = function() {
  this.label = game.add.text(0, 0, this.label, this.style, this.group);
  this.optionLabel = game.add.text(0, 0, this.dataProvider[0].str, this.style, this.group);
  this.optionLabel.alpha = 0;
  this.optionLabel.visible = false;
  //this.label.anchor.setTo(0, 0.5);
  //this.label.x = -this.button.x - this.label.width - 10;
  //this.label.y = this.backgroundSkin.height / 2 + 2;
};

p.alignToLabel = function() {
  this.button.group.x = this.label.x + this.label.width;
  this.button.group.y = this.label.y - this.button.buttonElements.spr.height * 0.5;
};

p.alignToNewLabel = function() {
  var bg = this.button.group;
  bg.x = this.optionLabel.x + this.optionLabel.width;
  this.gamepadSelector.x = bg.x - 5;
};

p.drawSelector = function() {
  var bg = this.button.group;
  var w = bg.width + 10, h = bg.height + 10;
  var selector = game.make.bitmapData(w , h);
  selector.ctx.translate(0.5, 0.5);
  selector.ctx.beginPath();
  selector.ctx.strokeStyle =  '#ffffff';
  selector.ctx.lineWidth = 2;
  selector.ctx.setLineDash([3,2]);
  canvas.drawRoundRect(selector.ctx, 2, 2, w - 4, h-4, 2, false, true );
  this.gamepadSelector = game.add.sprite(bg.x - 5, bg.y -5, selector, '', this.group);
};

p.initEvents = function () {

  /*
  this.button.inputEnabled = true;
  this.button.input.useHandCursor = true;
  this.button.events.onInputDown.add(this.mouseDown, this);
  */
  /*
  this.background.inputEnabled = true;
  this.background.input.useHandCursor = true;
  this.background.events.onInputDown.add(this.mouseDown, this);
  */
  this.switchedOn = new Phaser.Signal();
  this.switchedOff = new Phaser.Signal();

  this.button.onItemSelected.add(this.switch, this);

};

p.dispose = function() {

  this.button.onItemSelected.remove(this.switch, this);
  /*
  this.button.inputEnabled = false;
  this.background.inputEnabled = false;
  this.button.input.useHandCursor = false;
  this.button.events.onInputDown.remove(this.mouseDown, this);
  this.background.inputEnabled = false;
  this.background.input.useHandCursor = false;
  this.background.events.onInputDown.remove(this.mouseDown, this);
  this.switchedOn = null;
  this.switchedOff = null;
  */
};

/**
 * @method mouseDown
 */
p.mouseDown = function () {
  console.log('this mouseDown');
  //this.switch();
};

/**
 * @method switch
 */
p.switch = function (noAnimation) {
  this.isOn = !this.isOn;
  var switchFunc = this.isOn ? this.switchOn : this.switchOff;
  switchFunc.call(this, noAnimation);
};

/**
 * @method switchOn
 */
p.switchOn = function (noAnimation) {

  console.log('this switchOn');

  this.optionLabel.visible = false;
  this.optionLabel.alpha = 0;

  this.overrideUserControl.dispatch();
  this.addActiveEvents();

  if (this.closeAnim) {
    this.closeAnim.progress(1, false);
  }

  var scaleX = 0.5;
  var scaleY = 0.5;
  var posY = "-25";

  this.selectBoxBg.visible = true;
  this.optionBg.visible = true;

  this.openAnim = new TimelineMax();
  var tween1 = new TweenMax(this.label.scale, 0.2, {x: scaleX, y: scaleY, ease: Quad.easeOut});
  var tween2 = new TweenMax(this.label, 0.2, {y: posY, ease: Quad.easeOut});

  var bgTween = new TweenMax(this.optionBg, 0.2, {alpha: 1, ease: Quad.easOut});

  //var tween2 = new TweenMax(this.selection, 0.2, {x: sX, ease: Quad.easeOut});
  this.openAnim.add([tween1, tween2]);
  var txtTweens = [];
  _.each(this.optionTexts, function(txt) {
    txt.visible = true;
    var tween = new TweenMax(txt, 0.2, {alpha: 1, ease: Quad.easeOut});
    txtTweens.push(tween);
  });
  txtTweens.push(bgTween);
  this.openAnim.add(TweenMax.to(this.selectBoxBg, 0.2, {alpha: 1}));
  this.openAnim.add(txtTweens);
  this.openAnim.addCallback(this.enableOptions);

  this.userDeselected();


  //this.tl.add(TweenMax.to(this.background, 0.2, {colorProps: {tint: 0x51b33d, tintAmount: 1, format: "number"}, ease: Quad.easeOut}), 0.1);
  //this.tl.add(TweenMax.to(this.button, 0.2, {colorProps: {tint: 0x2f961f, tintAmount: 1, format: "number"}, ease: Quad.easeOut}), 0.1);
  //this.tl.add(TweenMax.to(this.selection.scale, 0.25, {x: 3, y: 3, ease:Quad.easeOut}), 0.2);
  //this.tl.add(TweenMax.to(this.selection, 0.25, {alpha: 0, ease:Quad.easeOut}), 0.2);
  //this.switchedOn.dispatch();

  /*
  if (noAnimation) {
    this.tl.progress(1, false);
  }
  */


};

p.enableOptions = function() {
  console.log('enableOptions');
};

p.disableOptions = function() {
  console.log('disableOptions');
};

/**
 * @method switchOff
 */
p.switchOff = function (noAnimation) {
  console.log('this switchOff');
  var scaleX = 1;
  var scaleY = 1;
  var posY = 0;

  this.restoreUserControl.dispatch();
  this.removeActiveEvents();

  if (this.openAnim) {
    this.openAnim.progress(1, false);
  }
  this.closeAnim = new TimelineMax();
  var tween1 = new TweenMax(this.label.scale, 0.2, {x: scaleX, y: scaleY, ease: Quad.easeOut});
  var tween2 = new TweenMax(this.label, 0.2, {y: posY, ease: Quad.easeOut});
  var bgTween = new TweenMax(this.optionBg, 0.2, {alpha: 0, ease: Quad.easOut});

  var txtTweens = [];
  _.each(this.optionTexts, function(txt) {
    txt.visible = true;
    var tween = new TweenMax(txt, 0.2, {alpha: 0, ease: Quad.easeOut});
    txtTweens.push(tween);
  });

  txtTweens.push(bgTween);
  txtTweens.push(TweenMax.to(this.selectBoxBg, 0.2, {alpha: 0}));
  this.closeAnim.addCallback(this.disableOptions);
  this.closeAnim.add(txtTweens);
  this.closeAnim.add([tween1, tween2]);

  /*
  if (noAnimation) {
    this.tl.progress(1, false);
  }
  */
  this.isOn = false;

};

p.userSelected = function() {
  this.gamepadSelector.alpha = 1;
};

p.userDeselected = function() {
  this.gamepadSelector.alpha = 0;
};

p.apiSelect = function() {
  this.switch();
};


/**
 *
 */
p.removeActiveEvents = function() {
  this.isActive = false;
  console.log('removeActiveEvents', this);
  if (game.controls.useKeys) {
    game.controls.cursors.up.onDown.remove(this.upPressed, this);
    game.controls.cursors.down.onDown.remove(this.downPressed, this);
    game.controls.cursors.left.onDown.remove(this.leftPressed, this);
    game.controls.cursors.right.onDown.remove(this.rightPressed, this);
    game.controls.spacePress.onDown.remove(this.spacePressed, this);
  }
  if (game.controls.useVirtualJoypad) {
    game.controls.buttonB.onDown.remove(this.spacePressed, this);
  }
  if (game.controls.useExternalJoypad) {
    game.externalJoypad.up.onDown.remove(this.upPressed, this);
    game.externalJoypad.down.onDown.remove(this.downPressed, this);
    game.externalJoypad.left.onDown.remove(this.leftPressed, this);
    game.externalJoypad.right.onDown.remove(this.rightPressed, this);
    game.externalJoypad.fireButton.onDown.remove(this.spacePressed, this);
  }
};

/**
 *
 */
p.addActiveEvents = function() {
  this.isActive = true;
  if (game.controls.useKeys) {
    game.controls.cursors.up.onDown.add(this.upPressed, this);
    game.controls.cursors.down.onDown.add(this.downPressed, this);
    game.controls.cursors.left.onDown.add(this.leftPressed, this);
    game.controls.cursors.right.onDown.add(this.rightPressed, this);
    game.controls.spacePress.onDown.add(this.spacePressed, this);
  }
  if (game.controls.useVirtualJoypad) {
    game.controls.buttonB.onDown.add(this.spacePressed, this);
  }
  if (game.controls.useExternalJoypad) {
    game.externalJoypad.up.onDown.add(this.upPressed, this);
    game.externalJoypad.down.onDown.add(this.downPressed, this);
    game.externalJoypad.left.onDown.add(this.leftPressed, this);
    game.externalJoypad.right.onDown.add(this.rightPressed, this);
    game.externalJoypad.fireButton.onDown.add(this.spacePressed, this);
  }
};

/**
 *
 *
 * p.leftPressed = function() {
  if (this.selectedOptionIndex > 0) {
    this.selectedOptionIndex--;
  }
  this.selectActiveOption();
};

 p.rightPressed = function() {
  if (this.selectedOptionIndex < this.activeOptions.length - 1) {
    this.selectedOptionIndex++;
  }
  this.selectActiveOption();
};

 */
p.update = function() {
  if (!this.isActive) {
    return;
  }
  var stick = game.controls.stick;
  if (stick) {
    if (stick.isDown) {
      this.preparePress(stick.direction);
    } else {
      if (this.stickDownPressed) {
        this.stickDownPressed = false;
        this.downPressed();
      }
      if (this.stickUpPressed) {
        this.stickUpPressed = false;
        this.upPressed();
      }
      if (this.stickLeftPressed) {
        this.stickLeftPressed = false;
        this.leftPressed();
      }
      if (this.stickRightPressed) {
        this.stickRightPressed = false;
        this.rightPressed();
      }
    }
  }
};

/**
 *
 * @param directionStr
 */
p.preparePress = function(directionStr) {
  this.stickUpPressed = directionStr === Phaser.UP;
  this.stickDownPressed = directionStr === Phaser.DOWN;
  this.stickLeftPressed = directionStr === Phaser.LEFT;
  this.stickRightPressed = directionStr === Phaser.RIGHT;
};

p.upPressed = function() {

  if (this.selectedIndex > 0) {
    this.selectedIndex--;
  }

  this.highlightOption();
};

/**
 *
 */
p.downPressed = function() {

  if (this.selectedIndex < this.dataProvider.length - 1) {
    this.selectedIndex++;
  }
  this.highlightOption();
};

/**
 *
 */
p.leftPressed = function() {

};

/**
 *
 */
p.rightPressed = function() {

};

/**
 *
 */
p.spacePressed = function() {

  this.selectCurrentOption();


};

/**
 * @method selectOption
 */
p.highlightOption = function() {
  this.optionBg.y = this.optionTexts[this.selectedIndex].y - this.padding;
};

/**
 * @method selectCurrentOption
 */
p.selectCurrentOption = function() {
  this.optionLabel.text = this.dataProvider[this.selectedIndex].str;
  this.optionLabel.visible = true;
  this.optionLabel.alpha = 1;
  //this.button.realignSelector(this.optionLabel.x + this.optionLabel.width + this.padding);
  this.alignToNewLabel();
  this.selectTween();
};

/**
 * @method selectTween
 */
p.selectTween = function() {

  this.restoreUserControl.dispatch();
  this.removeActiveEvents();

  this.selectAnim = new TimelineMax();
  var bgTween = new TweenMax(this.optionBg, 0.2, {alpha: 0, ease: Quad.easOut});
  var selectBg = new TweenMax(this.selectBoxBg, 0.2, {alpha: 0, ease: Quad.easeOut});

  var txtTweens = [];
  _.each(this.optionTexts, function(txt) {
    var tween = new TweenMax(txt, 0.2, {alpha: 0, ease: Quad.easeOut});
    txtTweens.push(tween);
  });

  txtTweens.push(bgTween);
  txtTweens.push(TweenMax.to(this.selectBoxBg, 0.2, {alpha: 0}));
  this.selectAnim.addCallback(this.disableOptions);
  this.selectAnim.add(txtTweens);
  this.selectAnim.add([selectBg, bgTween]);

  this.isOn = false;
};

