var manager = require('./manager');
var _ = require('lodash');

/**
 * @class UiComponent
 * @constructor
 * @param group
 * @param name
 * @param shouldAddNewGroup
 * @param shouldAutoManage
 * @constructor
 */
function UiComponent(group, name, shouldAddNewGroup, shouldAutoManage) {
  this.group = group;
  this.shouldAddNewGroup = shouldAddNewGroup;
  this.group = this.shouldAddNewGroup? game.add.group(this.group) : this.group;
  this.name = name;
  if (shouldAutoManage) {
    manager.add(this);
  }
  this.components = [];
}

var p = UiComponent.prototype = Object.create(UiComponent.prototype, {
  constructor: UiComponent
});

module.exports = UiComponent;

UiComponent.VERTICAL = "VERTICAL";
UiComponent.HORIZONTAL = "HORIZONTAL";

/**
 * @property group
 * @type {Phaser.Group}
 */
p.group = null;

/**
 * Default style for text in a uicomponent
 * Only currently used in ui-lists until a proper refactor of styling ui-components is added
 * 
 * @property style
 * @type {{font: string, fill: string, align: string}}
 */
p.style = {font: "16px thrust_regular", fill: "#ffffff", align: "left"};

/**
 * @property name
 * @type {string}
 */
p.name = "";

/**
 * Prevents this ui component being enabled automatically when shown.
 * 
 * @property preventAutoEnable
 * @type {boolean}
 * @default false
 */
p.preventAutoEnable = false;

/**
 * @property isRendered
 * @type {boolean}
 * @private
 */
p.isRendered = false;

/**
 * @property hasNewGroup
 * @type {boolean}
 * @private
 */
p.hasNewGroup = false;

/**
 * List of display components, which can be cached here
 * and disposed of properly 
 *
 * @property components
 * @type {Array}
 */
p.components = [];

/**
 * Make this uiComponent a subscreen
 * If the ui-component is autoManaged (via the constructor)
 * this should not be called
 * todo maybe refactor this so it's not possible to be called if autoManaged
 *
 * @method addAsSubScreen
 */
p.addAsSubScreen = function() {
  manager.addSubScreen(this);
};

p.add = function(component) {
  this.components.push(component);
};

p.render = function () {
  this.isRendered = true;
  console.log('ui-component :: render sub components', this.components, this);
};

p.remove = function () {
  console.log('ui-component : remove');
  this.isRendered = false;
  this.group.removeAll();
  this.dispose();
};

p.dispose = function() {
  _.each(this.components, function(component) {
    component.dispose();
  });
};

p.enable = function () {
  console.log('abstract ui-component enable');
};
  
p.disable = function () {
  console.log('abstract ui-component disable');
};

p.show = function () {
  this.group.visible = true;
  if (!this.preventAutoEnable) {
    this.enable();
  }
};

p.hide = function () {
  this.group.visible = false;
  this.disable();
};

p.showAndAdd = function () {
  console.log('showAndAdd :: ', this);
  if (!this.isRendered) {
    this.render();
    this.show();
  }
};

p.hideAndRemove = function () {
  console.log('hideAndRemove', this);
  if (this.isRendered) {
    this.remove();
    this.hide();
  }
};

p.initLayout = function () {
  if (game.width > 1000) {
    this.initFullLayout();
  } else {
    this.initSmallLayout();
  }
};

p.initFullLayout = function() {
  
};

p.initSmallLayout = function() {
  
};

p.centerDisplay = function () {
  this.group.x = game.width / 2 - this.group.width / 2;
  this.group.y = game.height / 2 - this.group.height / 2;
  console.log('centerDisplay', this, this.group);
  console.log('centerDisplay', this.group.x, this.group.y);
};





