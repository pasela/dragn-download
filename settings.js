/*
 * settings - Drag'n Download
 *
 * Author : Yuki <paselan@gmail.com>
 * Date   : December 14, 2011
 * License: MIT License
 */

// Definition of DDSettings objects. {{{

function DDSettings() {
  this.initialize.apply(this, arguments);
}

DDSettings.prototype = {
  // Default values.
  defaults : {
    "ignore-urls" : "http*://mail.google.com/*"
  },

  initialize : function () {
    var settings = this.load();
    for (key in this.defaults) {
      if (settings[key] === undefined)
        settings[key] = this.defaults[key];
    }
    this.save(settings);
  },

  load : function () {
    var settings = {};
    if (localStorage.settings)
      settings = JSON.parse(localStorage.settings);
    return settings;
  },

  save : function (settings) {
    localStorage.settings = JSON.stringify(settings);
  },

  get : function (key) {
    var settings = this.load();
    return settings[key];
  },

  set : function (key, value) {
    var settings = this.load();
    settings[key] = value;
    this.save(settings);
  },

  getDefault : function (key) {
    return this.defaults[key];
  }
};

// }}}

// vim: set ts=2 sw=2 sts=2 fdm=marker:
