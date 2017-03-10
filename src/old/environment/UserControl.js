/**
 * UserControl description
 *
 * defines a public variable and calls init - change this constructor to suit your needs.
 * nb. there's no requirement to call an init function
 *
 * @class UserControl
 * @constructor
 * @param features {Object} passed from the boot state.
 */
function UserControl(features) {
  this.features = features;
  this.initExternalJoypad();
  if (!this.externalGamePadDetected && this.features.isTouchScreen) {
    this.useVirtualJoypad = true;
    this.pad = game.plugins.add(Phaser.VirtualJoystick);
  }
  this.initKeys();
}

var p = UserControl.prototype;

p.gamepad = null;
p.useKeys = false;
p.useVirtualJoypad = false;
p.useExternalJoypad = false;
p.externalGamePadDetected = false;
p.virtualJoyInit = false;
p.isHidden = false;

/**
 * @method initExternalJoypad
 */
p.initExternalJoypad = function() {
  this.gamepad = game.input.gamepad.pad1;
  this.gamepad.addCallbacks(this, {
    onConnect: function() {
      this.useExternalJoypad = true;
      this.useVirtualJoypad = false;
      game.externalJoypad = {};
      game.externalJoypad.fireButton = this.gamepad.getButton(Phaser.Gamepad.BUTTON_1);
      game.externalJoypad.thrustButton = this.gamepad.getButton(Phaser.Gamepad.BUTTON_0);
      game.externalJoypad.up = this.gamepad.getButton(Phaser.Gamepad.BUTTON_12);
      game.externalJoypad.down = this.gamepad.getButton(Phaser.Gamepad.BUTTON_13);
      game.externalJoypad.left = this.gamepad.getButton(Phaser.Gamepad.BUTTON_14);
      game.externalJoypad.right = this.gamepad.getButton(Phaser.Gamepad.BUTTON_15);
    }.bind(this)
  });
  game.input.gamepad.start();
};



/**
 * UserControl initialisation
 *
 * @method init
 */
p.initKeys = function () {
  this.useKeys = true;
  this.cursors = game.input.keyboard.createCursorKeys();
  this.spacePress = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  this.xKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
  this.esc = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
};

/**
 *
 */
p.reInit = function() {
  console.log('virtualJoypadReinitialised', this.stick, this.buttonA, this.buttonB);
};

p.destroy = function() {
  if (this.useVirtualJoypad) {
    this.virtualJoyInit = false;
    this.pad.destroy();
  }
};

p.show = function() {
  this.isHidden = false;
  this.stick.visible = true;
  this.buttonA.visible = true;
  this.buttonB.visible = true;
};

p.hide = function() {
  this.isHidden = true;
  this.stick.visible = false;
  this.buttonA.visible = false;
  this.buttonB.visible = false;
};

/**
 * @method initJoypad
 */
p.initVirtualJoypad = function () {
  if (this.virtualJoyInit || this.isHidden) {
    this.reInit();
    return;
  }
  this.virtualJoyInit = true;
  this.stick = this.pad.addDPad(game.width * 0.15, game.height*0.8, 200, 'dpad');
  this.buttonA = this.pad.addButton(game.width * 0.78, game.height * 0.85, 'dpad', 'button1-up', 'button1-down');
  this.buttonB = this.pad.addButton(game.width * 0.92, game.height * 0.78, 'dpad', 'button2-up', 'button2-down');
  if (game.width < 1000) {
    this.stick.scale = 0.75;
    this.buttonA.scale = 0.8;
    this.buttonB.scale = 0.8;
  }
};

p.refresh = function() {
  if (this.stick) {
    this.stick.posX = game.width * 0.15;
    this.stick.posY = game.height * 0.8;
    this.buttonA.posX = game.width * 0.78;
    this.buttonA.posY = game.height * 0.85;
    this.buttonB.posX = game.width * 0.92;
    this.buttonB.posY = game.height * 0.78;
  }
};

module.exports = UserControl;
