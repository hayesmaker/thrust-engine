var UIComponent = require('./ui-component');
var _ = require('lodash');
var gameState = require('../data/game-state');
var levelManager = require('../data/level-manager');

var p = UIHighScores.prototype = Object.create(UIComponent.prototype, {
  constructor: UIHighScores
});

module.exports = UIHighScores;

/**
 *
 *
 * @class UIHighScores
 * @param group
 * @param name
 * @param playState
 * @constructor
 */
function UIHighScores(group, name, playState) {
  UIComponent.call(this, group, name, true, true);
  this.playState = playState;
  _.bindAll(this, 'keyboardOnPress');
  _.bindAll(this, 'swallowBackspace');
}

p.joypadThrustButton = true;
p.joypadDownButton = true;
p.joypadUpButton = true;
p.joypadFireButton = true;
p.highScoreInputEnabled = false;
p.items = [];
p.padding = 0;
p.margin = 0;
p.maxY = 0;
p.styles = {
  title: {font: '26px thrust_regular', fill: '#ffffff', align: 'left'},
  scores: {font: '16px thrust_regular', fill: '#ffffff', align: 'left'},
  subtitle: {font: '18px thrust_regular', fill: '#ffffff', align: 'left'}
};
p.selectedIndex = 0;
p.itemSelected = null;
p.layoutRect = null;
p.newScoreName = "";
p.mobileCharsIndex = 0;
p.mobileChars = [
  " ", "A", "B", "C", "D", "E",
  "F", "G", "H", "I", "J", "K",
  "L", "M", "N", "O", "P", "Q",
  "R", "S", "T", "U", "V",
  "W", "X", "Y", "Z", "<", ":)",
  "END"
];
p.mobileCharDirty = false;

/**
 * @method render
 */
p.render = function () {
  UIComponent.prototype.render.call(this);
  this.items = [];
  this.initSignals();
  this.createDisplay();
  this.drawPressFire();
};

/**
 *
 */
p.initFullLayout = function () {
  UIComponent.prototype.initFullLayout.call(this);
  this.margin = game.width * levelManager.hiscoreLayout.margin;
  this.padding = game.width * levelManager.hiscoreLayout.padding;
  this.layoutRect = new Phaser.Rectangle(this.margin, this.margin, game.width - this.margin * 2, game.height - this.margin * 2);
};

p.initSmallLayout = function () {
  UIComponent.prototype.initSmallLayout.call(this);
  this.margin = game.width * levelManager.hiscoreLayout.margin;
  this.padding = game.width * levelManager.hiscoreLayout.padding;
  this.layoutRect = new Phaser.Rectangle(this.margin, this.margin, game.width - this.margin * 2, game.height - this.margin * 2);
  this.styles = {
    title: {font: '14px thrust_regular', fill: '#ffffff', align: 'left'},
    scores: {font: '10px thrust_regular', fill: '#ffffff', align: 'left'},
    subtitle: {font: '12px thrust_regular', fill: '#ffffff', align: 'left'}
  };
};



p.initSignals = function () {

};

p.createDisplay = function () {
  var rect = game.add.graphics(0, 0, this.group);
  rect.beginFill(0xff0000, 0.35);
  rect.drawRect(this.layoutRect.x, this.layoutRect.y, this.layoutRect.width, this.layoutRect.height);
  rect.endFill();
  this.createTitle();
  _.each(gameState.highScoreTable, _.bind(this.addHighScore, this));
  this.drawBestTime();
  this.createSubtitles();
};

p.centerDisplay = function () {
  this.group.x = game.width / 2 - this.layoutRect .width / 2;
  this.group.y = game.height / 2 - this.layoutRect.height / 2;
};

p.createTitle = function () {
  this.title = game.add.text(this.layoutRect.x + this.layoutRect.halfWidth, 0, "HIGH SCORES", this.styles.title, this.group);
  this.title.anchor.setTo(0.5);
  this.title.y = this.layoutRect.y + this.layoutRect.height * 0.08;
};

p.addHighScore = function (highscore, index) {
  var numberTf = game.add.text(0, 0, index + 1, this.styles.scores, this.group);
  var nameTf = game.add.text(0, 0, highscore.name, this.styles.scores, this.group);
  var scoreTf = game.add.text(0, 0, highscore.score, this.styles.scores, this.group);
  var y = this.layoutRect.y + this.layoutRect.height * 0.2 + (numberTf.height + 5) * index;
  numberTf.x = this.layoutRect.x + this.padding / 2;
  numberTf.y = nameTf.y = scoreTf.y = y;
  nameTf.x = numberTf.x + numberTf.width + this.layoutRect.width * 0.04;
  scoreTf.x = this.layoutRect.x + this.layoutRect.width - scoreTf.width - this.padding / 2;
  this.items.push({
    number: numberTf,
    name: nameTf,
    score: scoreTf
  });
  this.paddingLeft = numberTf.x;
  this.lineHeight = nameTf.height + 5;
  this.maxY = y;
};

/**
 * @method renderHighScores
 */
p.renderHighScores = function () {
  _.each(gameState.highScoreTable, function (highScore, index) {
    this.items[index].name.text = highScore.name;
    var scoreTf = this.items[index].score;
    scoreTf.text = highScore.score;
    scoreTf.x = this.layoutRect.x + this.layoutRect.width - scoreTf.width - this.padding / 2;
  }.bind(this));
};

/**
 * if a high score was achieved scoreIndex >= 0
 *
 * @method insertNewScore
 */
p.insertNewScore = function () {
  var scoreIndex = gameState.getScoreIndex();
  if (scoreIndex >= 0) {
    var currentScoreItem = this.items[scoreIndex];
    this.cursor = game.add.text(this.layoutRect.x + 20, this.layoutRect.y + 20, "_", this.styles.scores, this.group);
    this.cursor.x = currentScoreItem.name.x;
    this.cursor.y = currentScoreItem.name.y;
    gameState.insertNewHighScore(scoreIndex);
    this.renderHighScores();
    this.newHighScoreSubTitle();
    this.enableKeyboardEntry();
  } else {
    this.gameOverSubTitle();
  }
};

p.drawPressFire = function () {
  this.subTitle3.visible = true;
};

p.drawBestTime = function() {
  var style = this.styles.subtitle;
  this.bestTimeLabel = game.add.text(this.layoutRect.width/2, this.maxY + this.lineHeight * 2, "Fastest Run", style, this.group);
  this.bestTimeLabel.anchor.set(0.5, 0.5);
  this.bestTimeValue = game.add.text(this.layoutRect.width/2, this.bestTimeLabel.y + this.lineHeight, "-- : -- : --", style, this.group);
  this.bestTimeValue.anchor.set(0.5, 0.5);
  if (gameState.bestTimeMs > 0) {
    this.bestTimeValue.text = gameState.bestTimeStr;
  }
};

p.createSubtitles = function () {
  var style = this.styles.subtitle;
  this.subTitle1 = game.add.text(this.layoutRect.x + this.layoutRect.halfWidth, this.layoutRect.y + this.layoutRect.height * 0.8, "", style, this.group);
  this.subTitle1.anchor.setTo(0.5);
  this.subTitle2 = game.add.text(this.layoutRect.x + this.layoutRect.halfWidth, this.subTitle1.y + this.subTitle1.height + 10, "", style, this.group);
  this.subTitle2.anchor.setTo(0.5);
  this.subTitle3 = game.add.text(this.layoutRect.x + this.layoutRect.halfWidth, 0, "PRESS FIRE", this.styles.scores, this.group);
  this.subTitle3.anchor.setTo(0.5);
  this.subTitle3.y = this.layoutRect.y + this.layoutRect.height - this.layoutRect.height * 0.075;
  this.subTitle1.visible = false;
  this.subTitle2.visible = false;
  this.subTitle3.visible = false;
};

p.newHighScoreSubTitle = function () {
  this.subTitle1.visible = this.subTitle2.visible = true;
  this.subTitle1.text = "NEW HIGH SCORE";
  this.subTitle2.text = "ENTER YOUR NAME";
};

p.gameOverSubTitle = function () {
  this.subTitle1.visible = this.subTitle2.visible = true;
  this.subTitle1.text = "GAME OVER";
  this.subTitle2.text = "YOU REACHED LEVEL " + parseInt(levelManager.levelIndex + 1, 10);
  this.subTitle3.visible = true;

  if (gameState.gameComplete) {
    gameState.newGame();
    this.subTitle2.text = "YOU COMPLETED ALL LEVELS";
  }
};

/*
p.bestTimeCheck = function() {
  if (gameState.shouldUpdateBestTime) {
    this.bestTimeValue.text = gameState.stopwatchCacheTxt;
  }
};
*/

p.checkTouchInput = function () {
  if (!this.highScoreInputEnabled) {
    return;
  }

  //* @todo touch controls
  /*
  var stick = game.controls.stick;
  if (stick) {
    if (stick.isDown) {
      if (stick.direction === Phaser.UP) {
        this.stickUpPressed = true;
        this.stickDownPressed = false;
      } else if (stick.direction === Phaser.DOWN) {
        this.stickUpPressed = false;
        this.stickDownPressed = true;
      }
    } else {
      if (this.stickDownPressed) {
        this.stickDownPressed = false;
        this.stepDownMobileChar();
      }
      if (this.stickUpPressed) {
        this.stickUpPressed = false;
        this.stepUpMobileChar();
      }
    }
  }
  */
  this.renderMobileChar();
};

/**
 * @method checkJoypadInput
 */
p.checkJoypadInput = function() {
  game.input.gamepad.pad1.onUpCallback = function(buttonCode) {
    if (buttonCode === Phaser.Gamepad.BUTTON_1) {
      this.joypadFireButton = true;
    }
    if (buttonCode === Phaser.Gamepad.BUTTON_0) {
      this.joypadThrustButton = true;
    }
    if (buttonCode === Phaser.Gamepad.BUTTON_12) {
      this.joypadUpButton = true;
    }
    if (buttonCode === Phaser.Gamepad.BUTTON_13) {
      this.joypadDownButton = true;
    }
  }.bind(this);
  game.input.gamepad.pad1.onDownCallback = function(buttonCode) {
    if (buttonCode === Phaser.Gamepad.BUTTON_1 && this.joypadFireButton) {
      this.joypadFireButton = false;
      if (this.highScoreInputEnabled) {
        this.upButtonA();
      } else {
        this.spacePressed();
      }
    }
    if (!this.highScoreInputEnabled) {
      return;
    }
    if (buttonCode === Phaser.Gamepad.BUTTON_12 && this.joypadUpButton) {
      this.joypadUpButton = false;
      this.stepUpMobileChar();
      this.renderMobileChar();
    }
    
    if (buttonCode === Phaser.Gamepad.BUTTON_13 && this.joypadDownButton) {
      this.joypadDownButton = false;
      this.stepDownMobileChar();
      this.renderMobileChar();
    }
    if (buttonCode === Phaser.Gamepad.BUTTON_0 && this.joypadThrustButton) {
      this.joypadThrustButton = false;
      this.upButtonB();
    }
  }.bind(this);
};

/**
 * @method stepUpMobileChar
 */
p.stepUpMobileChar = function () {
  if (this.mobileCharsIndex + 1 === this.mobileChars.length) {
    this.mobileCharsIndex = 0;
  } else {
    this.mobileCharsIndex++;
  }
  this.mobileCharDirty = true;
};

/**
 * @method stepDownMobileChar
 */
p.stepDownMobileChar = function () {
  if (this.mobileCharsIndex === 0) {
    this.mobileCharsIndex = this.mobileChars.length - 1;
  } else {
    this.mobileCharsIndex--;
  }
  this.mobileCharDirty = true;
};

/**
 * @method renderMobileChar
 */
p.renderMobileChar = function () {
  if (this.mobileCharDirty) {
    this.mobileCharDirty = false;
    this.char = this.mobileChars[this.mobileCharsIndex];
    this.renderScoreInput(this.newScoreName + this.char);
  }
};

/**
 * @method assignMobileChar
 */
p.assignMobileChar = function () {
  if (this.char === this.mobileChars[this.mobileChars.length - 1]) {
    this.commitScore();
    return;
  }
  if (this.newScoreName.length < 13) {
    if (this.char === "<") {
      this.doScoreBackspace();
    } else {
      this.newScoreName = this.newScoreName + this.char;
      this.mobileCharsIndex = 0;
      this.char = this.mobileChars[this.mobileCharsIndex];
      this.renderScoreInput(this.newScoreName + this.char);
    }
  } else {
    this.char = this.mobileChars[this.mobileChars.length - 1];
    this.renderScoreInput(this.newScoreName + this.char);
  }
};

/**
 * @method update
 */
p.update = function() {
  if (game.controls.useVirtualJoypad) {
    this.checkTouchInput();
  } else if (game.controls.useExternalJoypad) {
    this.checkJoypadInput();
  }
};

/**
 * @method enable
 */
p.enable = function () {
  if (game.controls.useKeys) {
    game.controls.spacePress.onDown.add(this.spacePressed, this);
  }
  if (game.controls.useVirtualJoypad) {
    // @todo touch menu
    //game.controls.buttonB.onDown.add(this.spacePressed, this);
  }
};

/**
 * @method disable
 */
p.disable = function () {
  if (game.controls.useKeys) {
    game.controls.spacePress.onDown.remove(this.spacePressed, this);
  }
  if (game.controls.useVirtualJoypad) {
    // @todo touch menu
    //game.controls.buttonB.onDown.remove(this.spacePressed, this);
  }
};

/**
 * @method spacePressed
 */
p.spacePressed = function () {
  this.playState.showCurrentScreenByState.call(this.playState, gameState.PLAY_STATES.MENU);
};

/**
 * @method upButtonB
 */
p.upButtonB = function() {
  this.assignMobileChar();
};

/**
 * @method upButtonA
 */
p.upButtonA = function() {
  this.assignMobileChar();
};

/**
 * @method enableKeyboardEntry
 */
p.enableKeyboardEntry = function () {
  this.subTitle3.visible = false;
  this.highScoreInputEnabled = true;
  /* @todo touch menu
  if (game.controls.stick) {
    //game.controls.buttonB.onDown.add(this.pressButtonB, this);
    this.char = this.mobileChars[this.mobileCharsIndex];
    this.renderScoreInput(this.newScoreName + this.char);
    game.controls.buttonB.onUp.add(this.upButtonB, this);
    game.controls.buttonA.onUp.add(this.upButtonA, this);

  }
  */
  this.disable();
  window.addEventListener('keydown', this.swallowBackspace);
  window.addEventListener('keypress', this.keyboardOnPress);
};

/**
 * @method disableKeyboardEntry
 */
p.disableKeyboardEntry = function () {
  this.subTitle3.visible = true;
  this.highScoreInputEnabled = false;
  //if (game.controls.stick) {
    // @todo touch menu
    //game.controls.buttonB.onUp.remove(this.upButtonB, this);
    //game.controls.buttonA.onUp.remove(this.upButtonA, this);
  //}
  window.removeEventListener('keydown', this.swallowBackspace);
  window.removeEventListener('keypress', this.keyboardOnPress);
  this.enable();
};

/**
 * @method swallowBackspace
 * @param e
 */
p.swallowBackspace = function (e) {
  if (e.keyCode === 8) {
    e.preventDefault();
    if (this.newScoreName.length) {
      this.doScoreBackspace();
    }
  }
};

/**
 * @method doScoreBackspace
 */
p.doScoreBackspace = function() {
  this.newScoreName = this.newScoreName.substring(0, this.newScoreName.length - 1);
  this.renderScoreInput(this.newScoreName);
};

/**
 * @method keyboardOnPress
 * @param e
 */
p.keyboardOnPress = function (e) {
  var char = String.fromCharCode(e.keyCode);
  if (e.keyCode === 8) {
    this.swallowBackspace(e);
  }
  if (e.keyCode === 13) {
    this.commitScore();
  } else {
    this.newScoreName = this.newScoreName + char;
    this.renderScoreInput(this.newScoreName);
  }
};

/**
 * @method renderScoreInput
 * @param str
 */
p.renderScoreInput = function (str) {
  this.cursor.text = str + "_";
};

/**
 * @method commitScore
 */
p.commitScore = function() {
  this.disableKeyboardEntry();
  this.group.remove(this.cursor);
  this.cursor.text = "";
  this.cursor = null;
  gameState.newScoreEntered(this.newScoreName);
  this.newScoreName = "";
  this.renderHighScores();
  this.gameOverSubTitle();
};