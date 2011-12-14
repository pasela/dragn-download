/*
 * settings - Drag'n Download
 *
 * Author : Yuki <paselan@gmail.com>
 * Date   : December 14, 2011
 * License: MIT License  {{{
 *     Permission is hereby granted, free of charge, to any person obtaining
 *     a copy of this software and associated documentation files (the
 *     "Software"), to deal in the Software without restriction, including
 *     without limitation the rights to use, copy, modify, merge, publish,
 *     distribute, sublicense, and/or sell copies of the Software, and to
 *     permit persons to whom the Software is furnished to do so, subject to
 *     the following conditions:
 *
 *     The above copyright notice and this permission notice shall be included
 *     in all copies or substantial portions of the Software.
 *
 *     THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 *     OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 *     MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 *     IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 *     CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 *     TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 *     SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * }}}
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
