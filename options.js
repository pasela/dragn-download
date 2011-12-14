/*
 * options page script - Drag'n Download
 *
 * Author : Yuki <paselan@gmail.com>
 * Date   : December 14, 2011
 * License: MIT License
 */

// Definition of OptionItem objects. {{{

// (abstract) An option item object.
function OptionItem() {
  this.initialize.apply(this, arguments);
}

OptionItem.prototype = {
  // Settings object.
  settings : undefined,

  // Option name.
  name : undefined,

  initialize : function (name, settings) {
    this.name = name;
    this.settings = settings;
  },

  initItem : function () {
    this.loadItem();
  },

  load : function () {
    return this.settings.get(this.name);
  },

  save : function (value) {
    this.settings.set(this.name, value);
  },

  loadItem : function () {
    this.setItemValue(this.load());
  },

  saveItem : function () {
    this.save(this.getItemValue());
  },

  resetItem : function () {
    var value = this.settings.getDefault(this.name);
    this.save(value);
    this.setItemValue(value);
  },

  // Set value to the element.
  setItemValue : function (value) {
    $('#' + this.name).val(value);
  },

  // Get value from the element.
  getItemValue : function () {
    return $('#' + this.name).val();
  }
};

// Text option item object.
function TextOptionItem() { OptionItem.apply(this, arguments); }
TextOptionItem.prototype = $.extend({}, OptionItem.prototype);

// Checkbox opton item object.
function CheckboxOptionItem() { OptionItem.apply(this, arguments); }
CheckboxOptionItem.prototype = $.extend({}, OptionItem.prototype);

// Radio opton item object.
function RadioOptionItem() { OptionItem.apply(this, arguments); }
RadioOptionItem.prototype = $.extend({}, OptionItem.prototype);

// Select opton item object.
function SelectOptionItem() { OptionItem.apply(this, arguments); }
SelectOptionItem.prototype = $.extend({}, OptionItem.prototype);

// }}}

// Options object. {{{

var settings = new DDSettings();

var options = {
  items : {},

  add : function (option) {
    this.items[option.name] = option;
  },

  get : function (name) {
    return this.items[name];
  },

  initItems : function () {
    for (var name in this.items)
      this.items[name].initItem();
  }
};

options.add(new TextOptionItem('ignore-urls', settings));

// Run initializer when DOM constructed.
$(function () {
  options.initItems();
});

// }}}

//----------------------------------------------------------

// Interface functions. {{{

function saveOption(name) {
  options.get(name).saveItem();
}

function resetOption(name) {
  options.get(name).resetItem();
}

// }}}

// vim: set ts=2 sw=2 sts=2 fdm=marker:
