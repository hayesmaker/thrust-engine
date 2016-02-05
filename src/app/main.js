'use strict';

var properties = require('./properties');

/**
 * Main game entry point
 * * called on window.onload to make sure fonts registered to html page are loaded first.
 * * initilise the Phaser.Game and register game states
 * * start state: boot.
 *
 * @module main
 * @main
 * @method init
 */

var init = function() {
  global.game = new Phaser.Game(properties.width,properties.height, Phaser.AUTO);

  game.state.add('play', require('./states/play'));
  game.state.add('load', require('./states/load'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('boot', require('./states/boot'));

  game.state.start('boot');
};

/**
 * to ensure fonts are loaded, an invisible element using the font must be placed on the app's page
 * This will work fine... In the future we could implement Google's WebFontLoader
 * @method
 */
window.onload = init;
