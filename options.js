/*
 * options page script - Drag'n Download
 *
 * Author : Yuki <paselan@gmail.com>
 * Date   : December 5, 2011
 * License: MIT License
 */

// Definition of Option objects. {{{

// (abstract) An option item object.
function OptionItem() {
  this.initialize.apply(this, arguments);
}
OptionItem.prototype = {
  // Option name.
  name : undefined,

  // Option's default value.
  defaultValue : undefined,

  // Option's current value.
  currentValue : undefined,

  initialize : function (name, defaultValue) {
    this.name = name;
    this.defaultValue = defaultValue;
  },

  initItem : function () {
    this.loadItem();
  },

  load : function () {
    if (localStorage.settings) {
      var settings = JSON.parse(localStorage.settings);
      this.currentValue = settings[this.name];
    }
    return this.currentValue;
  },

  // Save option's value to the storage.
  save : function (value) {
    this.currentValue = value;

    var settings = {};
    if (localStorage.settings)
      settings = JSON.parse(localStorage.settings);
    settings[this.name] = value;
    localStorage.settings = JSON.stringify(settings);
  },

  loadItem : function () {
    var value = this.load();
    if (value === undefined)
      value = this.defaultValue;
    this.setItemValue(value);
  },

  saveItem : function () {
    this.save(this.getItemValue());
  },

  resetItem : function () {
    this.save(this.defaultValue);
    this.setItemValue(this.defaultValue);
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

// }}}

//----------------------------------------------------------

// Default values.
var defaults = {
  "ignore-urls" : "http*://mail.google.com/*"
};

// Option items. {{{

options.add(new TextOptionItem('ignore-urls', defaults['ignore-urls']));
$(function () {
  options.initItems();
});

// }}}

// Interface functions. {{{

function saveOption(name) {
  options.get(name).saveItem();
}

function resetOption(name) {
  options.get(name).resetItem();
}

// }}}

// vim: set ts=2 sw=2 sts=2 fdm=marker:
