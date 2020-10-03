var _ = require('lodash');
/**
 * @class options-model
 * @type {{}}
 * @static
 * @type {{gameModes: {speedRun: {unlocked: boolean, enabled: boolean}, endlessMode: {unlocked: boolean, enabled: boolean}}, sound: {soundFx: boolean, music: boolean}, display: {webGl: boolean, filters: *[]}, controls: {virtualJoypad: boolean, keyboard: boolean, externalGamepad: boolean}, general: {}, getFilterByName: module.exports.getFilterByName}}
 */
module.exports = {

  /**
   * @method init
   */
  init: function() {
    this.initFps();
    this.initDisplay();
    this.initEvents();

  },

  /**
   * @method setLevels
   * @param value
   */
  setLevels: function(value) {
    this.gameModes.levels.dirty = value !== this.gameModes.levels.current;
    this.gameModes.levels.selected = value;
  },

  /**
   *
   * @method getLevelsJsonUrl
   * @return {*}
   */
  getLevelsJsonUrl: function() {
    var jsonUrl;
    if (this.gameModes.levels.dirty) {
      this.gameModes.levels.current = this.gameModes.levels.selected;
    }
    switch(this.gameModes.levels.selected) {
      case 'classic' :
        jsonUrl = process.env.THRUST_ENV === 'demo'? 'assets/levels/demo.json' : 'assets/levels/classic.json';
        console.log("JSON url=", jsonUrl);
        break;
      case '2016' :
        jsonUrl = 'assets/levels/2016.json';
        break;
      default:
        jsonUrl = 'assets/levels/classic.json';
        console.warn('no json url found for selected levels - using default classic.json');
        break;
    }
    console.log('getLevelsJsonUrl :: jsonUrl=', jsonUrl);
    return jsonUrl;
  },

  lockGameModes: function() {
    this.gameModes.speedRun.unlocked = false;
    this.gameModes.endlessMode.unlocked = false;
  },

  unlockGameModes: function() {
    this.gameModes.speedRun.unlocked = true;
    this.gameModes.endlessMode.unlocked = true;
  },
  version: "",
  versionSuffix: "",
  /**
   *
   * @property gameModes
   */
  gameModes: {
    allLevels: false,
    sandbox: {
      enabled: false
    },
    levels: {
      dirty: false,
      current: 'classic',
      selected: 'classic'
    },
    speedRun: {
      unlocked: true,
      enabled: false
    },
    endlessMode: {
      unlocked: true,
      enabled: false
    },
    gravity: {
      unlocked: false,
      enabled: false,
      options: {
        light: 100,
        heavy: 150
      }
    }
  },
  /**
   * @property sound
   */
  sound: {
    soundFx: true,
    music: true
  },
  /**
   * @property display
   */
  display: {
    showFps: false,
    fps: 60,
    fullscreen: true,
    fx: {
      background: true,
      particles: true
    }
  },
  /**
   * @property controls
   */
  controls: {
    classicKeys: false,
    virtualJoypad: false,
    keyboard: true,
    externalGamepad: false
  },
  /**
   * @property general
   */
  general: {},

  /**
   * @method initFps
   */
  initFps: function() {
    //if (game.device.iOS || game.device.android || game.device.windowsPhone || )
    if (this.display.fps === 30) {
      //game.device.isMobile = true;
      game.time.desiredFps = this.display.fps = 30;
    } else {
      game.time.desiredFps = this.display.fps = 60;
      //game.device.isMobile = false;
    }
  },

  /**
   * @method initDisplay
   */
  initDisplay: function() {
    // if (game.device.iOS || game.device.android || game.device.windowsPhone) {
    //   this.display.fx.particles = false;
    // }
  },

  /**
   * @method getFilterByName
   * @param name {String}
   * @return {Object} returns a filter option object eg: `getFilterByName('scanlines')` returns `{scanlines: false}`
   */
  getFilterByName: function(name) {
    return _.find(this.display.filters, function(val) {
      return  !_.isUndefined(val[name]);
    });
  },

  /**
   * @method initEvents
   */
  initEvents: function() {
    this.loadNewLevels = new Phaser.Signal();
    this.fxParticlesOn = new Phaser.Signal();
    this.fxParticlesOff = new Phaser.Signal();
    this.fxBackgroundOn = new Phaser.Signal();
    this.fxBackgroundOff = new Phaser.Signal();
  },

  /**
   * @method dispose
   */
  dispose: function() {
    this.loadNewLevels.removeAll();
    this.loadNewLevels = null;
    this.fxParticlesOn.removeAll();
    this.fxParticlesOn = null;
    this.fxParticlesOff.removeAll();
    this.fxParticlesOff = null;
    this.fxBackgroundOn.removeAll();
    this.fxBackgroundOn = null;
    this.fxBackgroundOff.removeAll();
    this.fxBackgroundOff = null;
  }
};