//var gameState = require('./game-state');
//var inAppPurchaes = require('./in-app-purchases');

module.exports = {

  /**
   * @todo return dynamic based on demo/full version
   * @returns {*}
   */
  getLevelsCompleteText: function() {
    return this.levelsComplete[0];
  },

  levelsComplete: [
    "You have successfully completed all the Thrust Missions\n" +
    "Thrust missions based on the SPECTRUM version level layouts" +
    "\n\n" +
    "Thank you for playing Thrust 30\n" +
    "Coming Soon on IOS & Android \n" +
    "CREDITS: \nMusic: Matt Gray & Martin Keary \n" +
    "PROGRAMMING: ANDY HAYES\n" +
    "SFX MATT GRAY\n" +
    "GRAPHICS: Martin Keary & Andy Hayes\n\n",

    "You have successfully completed all Classic Thrust Missions\n" +
    "All these levels have been totally redesigned for Thrust 30\n" +
    "based on the original SPECTRUM game's levels\n" +
    "More Levels Will be Available Spring 2017\n" +
        "CREDITS: \nMusic: Matt Gray & Martin Keary \n" +
        "PROGRAMMING: ANDY HAYES\n" +
        "SFX MATT GRAY\n" +
        "GRAPHICS: Martin Keary & Andy Hayes\n\n" +
        "Thank you for playing Thrust 30"
  ],

  training: [
    'Flight training stage 1\n' +
    'Use left, right and thrust to pilot your ship between the highlighted drones.\n' +
    'Try to keep your ship pointed upwards as much as possible, and use your thrust to counter ' +
    'the planet\'s gravity.\n' +
    'Press Fire to begin.',

    'Flight training stage 2\n' +
    'Mastering Thrust requires precise control of your ship despite the gravitational forces acting on it.\n' +
    'Fly to the right to find the drones arranged in diamond formation.  ' +
    'Hover between each set of drones for 4 seconds to activate it, then move on to the next.\n' +
    'Press Fire to continue',

    'Flight training stage 3: Recovering The Orb\n' +
    'To complete each mission, you must recover an orb positioned somewhere on or beneath the planet\'s surface.  ' +
    'You can attach the orb by hovering next to it for 1 second.  ' +
    'Then pilot your ship high enough from the planet\'s surface so your warp drive can engage\n' +
    'Press Fire to continue.',

    'Flight Training Complete!\n' +
    'Congratulations, you successfully completed flight training.\n' +
    'You\'re now ready to begin real life Thrust missions.\n\n' +
    'Press Fire to return to the Menu'
  ]
};