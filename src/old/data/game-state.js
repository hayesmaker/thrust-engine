var _ = require('lodash');
var levelManager = require('./level-manager');
var utils = require('../utils');
var options = require('./options-model');
var sound = require('../utils/sound');

/**
 * keeps a record of current game state data
 * defines score and bonuses
 *
 * @class game-state
 * @static
 * @type {{PLAY_STATES: {MENU: string, PLAY: string, HIGH_SCORES: string, INTERSTITIAL: string, GAME_OVER: string}, currentState: null, highScoreTable: *[], getScoreIndex: module.exports.getScoreIndex, insertNewHighScore: module.exports.insertNewHighScore, newScoreEntered: module.exports.newScoreEntered, shouldEnterHighScore: boolean, SCORES: {FUEL: number, LIMPET: number, PLANET_BUSTER: number, ORB_RECOVERED: number, LIMPETS_DESTROYED: number}, getScoreByValueId: module.exports.getScoreByValueId, POWER_STATION_HEALTH: number, ENEMY_BULLET_DURATION: number, PLAYER_BULLET_DURATION: number, FUEL_AMOUNT: number, init: module.exports.init, levelStart: module.exports.levelStart, newPlayer: module.exports.newPlayer, newGame: module.exports.newGame, doHighScoreCheck: module.exports.doHighScoreCheck, nextLevel: module.exports.nextLevel, bonuses: {planetBuster: boolean, orbRecovered: boolean}, score: number, fuel: number, lives: number, isGameOver: boolean}}
 */
module.exports = {
  /**
   * Keeps track of extra lives awarded. Necessary
   * for the algorithm which awards extra lives
   * check1Up
   *
   * @property numExtraLives
   */
  numExtraLives: 0,

  /**
   * @property score
   * @type {number}
   */
  score: 0,

  /**
   * @property fuel
   * @type {number}
   */
  fuel: 0,

  /**
   * @property lives
   * @type {number}
   */
  lives: 0,

  /**
   * @property isGameOver
   */
  isGameOver: false,

  /**
   * @property POWER_STATION_HEALTH
   * @type {number}
   */
  POWER_STATION_HEALTH: 1000,

  /**
   * @property ENEMY_BULLET_DURATION
   * @type {number}
   */
  ENEMY_BULLET_DURATION: 2500,

  /**
   * @property PLAYER_BULLET_DURATION
   * @type {number}
   */
  PLAYER_BULLET_DURATION: 3000,

  /**
   * The amount of fuel a fuel cell can refuel the player
   * before it is removed
   *
   * @property FUEL_AMOUNT
   * @type {Number}
   */
  FUEL_AMOUNT: 600,

  /**
   *
   * @property gameScale
   */
  gameScale: 1,

  /**
   * @todo Activate cheats enabled via konami code
   *
   * @property cheats
   * @property cheats.enabled
   * @property cheats.infiniteFuel
   * @property cheats.infiniteLives
   * @property cheats.fatalCollisions
   */
  cheats: {
    enabled: true,
    infiniteFuel: false,
    infiniteLives: false,
    fatalCollisions: true,
    startDebugLevel: false
  },

  /**
   * When player plays Flight Training, this flag is set to true.
   * It controls many aspects of in game logic, specific to Flight Training Mode.
   *
   * @property trainingMode
   * @type {Boolean}
   */
  trainingMode: false,

  /**
   * @property gameComplete
   * @type {boolean}
   */
  gameComplete: false,

  /**
   * @property PLAY_STATES
   * @type {Object}
   */
  PLAY_STATES: {
    MENU: "MENU",
    PLAY: "PLAY",
    HIGH_SCORES: "HIGH_SCORES",
    INTERSTITIAL: "INTERSTITIAL",
    GAME_OVER: "GAME_OVER",
    OPTIONS: "OPTIONS",
    COMPLETE: "GAME_COMPLETE",
    GAME_COMPLETE: "GAME_COMPLETE"
  },

  /**
   * @property currentState
   * @type {String}
   */
  currentState: null,

  /**
   * @property highScoreTable
   * @type {Array}
   */
  highScoreTable: [
    {
      name: "Andy",
      score: 60000
    },
    {
      name: "Joe",
      score: 50000
    },
    {
      name: "Malcolm",
      score: 30000
    },
    {
      name: "Rodney",
      score: 20000
    },
    {
      name: "Simon",
      score: 10000
    },
    {
      name: "Christopher",
      score: 5000
    },
    {
      name: "Bilbo",
      score: 2500
    },
    {
      name: "Baggins",
      score: 200
    }
  ],

  /**
   * If high score state is entered when this is true
   * then insert high score is called.
   *
   * @property shouldEnterHighScore
   * @type {boolean}
   * @default false
   */
  shouldEnterHighScore: false,

  /**
   * @property shouldUpdateBestTime
   * @type {boolean}
   * @default false
   */
  shouldUpdateBestTime: false,

  /**
   * Set when a timed run has completed
   * (only in training mode currently)
   *
   * @property playTime
   */
  playTime: "0",

  /**
   * @property SCORES
   * @type {object}
   */
  SCORES: {
    FUEL_COLLECTED: 300,
    FUEL_DESTROYED: 150,
    LIMPET: 750,
    PLANET_BUSTER: 2000,
    ORB_RECOVERED: 2000,
    LIMPETS_DESTROYED: 500,
    DRONES_PASSED: 29,
    TIMED_RUN: 0,
    XTRA_LIFE: 10000,
    LEVEL_MULTIPLIER: 400
  },

  /**
   * Best Time counter
   *
   * @property counter
   */
  counter: 0,

  /**
   * @property bestTimeMs
   */
  bestTimeMs: 0,

  /**
   * @property stopwatchCacheTxt
   */
  stopwatchCacheTxt: "",

  /**
   * @property planetBusterMode
   */
  planetBusterMode: false,

  /**
   * Set to true when a condition is satisfied
   * This can be used in a level interstitial to add any bonuses
   * and check mission completion.
   *
   * @property bonuses
   */
  bonuses: {
    planetBuster: false,
    orbRecovered: false
  },

  /**
   * @method getScoreIndex
   */
  getScoreIndex: function() {
    return _.findIndex(this.highScoreTable, function(data) {
      return this.score > data.score;
    }.bind(this));
  },

  /**
   * 
   * @param scoreIndex
   */
  insertNewHighScore: function(scoreIndex) {
    this.highScoreTable.splice(scoreIndex, 0, {
      dirty: true,
      name: "",
      score: this.score
    });
    this.highScoreTable.pop();
  },

  /**
   * @method newScoreEntered
   * @param name
   */
  newScoreEntered: function(name) {
    _.each(this.highScoreTable, function(data) {
      if (data.dirty) {
        data.name = name;
        data.dirty = false;
      }
    });
    this.setHighscoresStorage();
  },

  /**
   * @method getScoreByValueId
   * @param valueId
   * @return {*}
   */
  getScoreByValueId: function(valueId) {
    console.log('gameState :: getScoreByValueId :', valueId, this.SCORES[valueId]);
    if (valueId === "TIMED_RUN") {
      return this.playTime;
    } else if (valueId === "ORB_RECOVERED") {
      return this.SCORES[valueId] + levelManager.levelIndex * this.SCORES.LEVEL_MULTIPLIER;
    } else {
      return this.SCORES[valueId];
    }
  },

  /**
   * @method init
   */
  init: function () {
    this.gameScale = game.width / 1024;
    this.currentState = this.PLAY_STATES.MENU;
    this.highscoreStorage();
    this.getBestTimeStorage();
    this.newPlayer();
    this.newGame();
    this.levelsCompleted = new Phaser.Signal();
  },

  /**
   * @method setBestTimeStorage
   */
  setBestTimeStorage: function() {
    this.bestTimeMs = this.counter;
    this.bestTimeStr = this.stopwatchCacheTxt;
    if (utils.features.isLocalStorageAvailable) {
      window.localStorage.setItem('bestTime', JSON.stringify({
        bestTimeMs: this.bestTimeMs,
        bestTimeStr: this.stopwatchCacheTxt
      }));
    }
  },

  /**
   * @method getBestTimeStorage
   */
  getBestTimeStorage: function() {
    if (utils.features.isLocalStorageAvailable) {
      if (window.localStorage.getItem('bestTime')) {
        var bestTimesData = JSON.parse(window.localStorage.getItem('bestTime'));
        this.bestTimeMs = bestTimesData.bestTimeMs;
        this.bestTimeStr = bestTimesData.bestTimeStr;
      }
    }
  },

  /**
   * @method setHighscoresStorage
   */
  setHighscoresStorage: function() {
    if (utils.features.isLocalStorageAvailable) {
      window.localStorage.setItem('highscores', JSON.stringify(this.highScoreTable));
    }
  },

  /**
   * @method highscoresStorage
   */
  highscoreStorage: function() {
    if (utils.features.isLocalStorageAvailable) {
      if (window.localStorage.getItem('highscores')) {
        this.highScoreTable = JSON.parse(window.localStorage.getItem('highscores'));
      }
    }

  },

  /**
   * @method levelStart
   */
  resetBonuses: function() {
    console.log('game-state :: levelStart : currentLevel', levelManager.currentLevel);
    this.gameComplete = false;
    this.bonuses.planetBuster = false;
    this.bonuses.orbRecovered = false;
  },

  /**
   * @method newPlayer
   */
  newPlayer: function() {
    this.numExtraLives = 0;
    this.score = 0;
    this.fuel = 5000;
    this.lives = 4;
  },

  /**
   * Maybe needs to reset gameover vars here
   *
   * @method newGame
   */
  newGame: function() {
    this.resetTimes();
    this.resetBonuses();
    levelManager.newGame();
  },

  /**
   * @method startTraining
   */
  startTraining: function() {
    this.resetTimes();
    this.resetBonuses();
    levelManager.startTraining();
  },

  /**
   * @method doHighScoreCheck
   * @param [gameComplete] {boolean}
   */
  doHighScoreCheck: function(gameComplete) {
    if (gameComplete) {
      this.gameComplete = true;
    }
    this.shouldEnterHighScore = this.getScoreIndex() >= 0;
  },

  /**
   * @method doBestTimeCheck
   */
  doBestTimeCheck: function() {
    if (options.gameModes.speedRun.enabled) {
      this.shouldUpdateBestTime = this.isBestTime();
    }
  },

  /**
   * @method isPlanetDestroyed
   * @return {boolean}
   */
  isPlanetDestroyed: function() {
    return this.bonuses.planetBuster;
  },

  /**
   * @method nextLevelCheck
   */
  nextLevelCheck: function () {
    if (levelManager.startDebugLevel) {
      levelManager.nextLevel();
      return;
    }
    if (this.trainingMode) {
      this.startTraining();
      return;
    }
    var isPlanetDestroyed = this.isPlanetDestroyed();
    var objectiveComplete = false;
    if (this.planetBusterMode && isPlanetDestroyed) {
        objectiveComplete = true;
    } else {
      if (this.bonuses.orbRecovered || isPlanetDestroyed) {
        objectiveComplete = true;
      }
    }
    if (objectiveComplete && !this.isGameOver) {
      if (levelManager.levels.length - 1 === levelManager.levelIndex &&
        !options.gameModes.endlessMode.enabled) {
        this.levelsCompleted.dispatch();
      } else {
        this.resetBonuses();
        levelManager.nextLevel();
      }
    }
  },

  /**
   * @method isBestTime
   * @return {boolean}
   */
  isBestTime: function() {
    if (this.counter > this.bestTimeMs) {
      this.setBestTimeStorage();
      return true;
    }
    return false;
  },

  /**
   * @method cacheTime
   * @param ms
   * @param text
   */
  cacheTime: function(ms, text){
    this.counter = ms;
    this.stopwatchCacheTxt = text;

  },

  /**
   * @method getCachedTime
   * @return {number}
   */
  getCachedTime: function() {
    return this.counter;
  },

  /**
   * @method getCachedTimeStr
   * @return\ {string}
   */
  getCachedTimeStr: function() {
    return this.stopwatchCacheTxt;
  },

  /**
   * @method resetTimes
   */
  resetTimes: function() {
    this.counter = 0;
    this.stopwatchCacheTxt = "";
  },

  /**
   * @method setScore
   * @param value
   */
  setScore: function(value) {
    this.score = value;
    this.check1Up();
  },

  /**
   * @method addScore
   * @param value
   */
  addScore: function(value) {
    this.score += value;
    this.check1Up();
  },

  /**
   * @method check1Up
   */
  check1Up: function() {
    if (this.score / (this.SCORES.XTRA_LIFE * (this.numExtraLives + 1)) >= 1) {
      sound.playSound(sound.PLAYER_1UP, 3);
      this.lives += 1;
      this.numExtraLives++;
    }
  }
};