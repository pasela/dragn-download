/*
 * content script - Drag'n Download
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

// Path utilities.
var Path = {
  // Get basename.
  basename : function (path) {
    if (path != null && path !== '') {
      var result = path.match(/([^\/\\]*)$/);
      if (result && result[1] !== '') {
        return result[1];
      }
    }
    return null;
  },

  // Strip fragment string.
  stripFragment : function (path) {
    var hash = path.lastIndexOf('#');
    return hash != -1 ? path.substring(0, hash) : path;
  }
};

var DD = {
  // Current state.
  state : { disabled : false },

  toggle : function () {
    this.state.disabled = !this.state.disabled;
  },

  activate : function () {
    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
      this.addDragHandler(links[i]);
    }
  },

  // Get feedback image for dragging.
  getDragImage : function () {
    if (this.dragImage === undefined) {
      this.dragImage = document.createElement('img');
      this.dragImage.src = chrome.extension.getURL('main-16.png');
    }
    return this.dragImage;
  },

  // Add drag and drop handler.
  addDragHandler : function (elm) {
    // Note: Element.getAttribute('href') returns a value as is. and it maybe a relative path.
    //       HTMLAnchorElement.href has an absolute path. (DOM 2)
    if (!(elm instanceof HTMLAnchorElement))
      return false;

    if (elm.href === null || elm.href === '' || elm.href.charAt(0) === '#')
      return false;

    elm.draggable = true;
    elm.addEventListener('dragstart', this.getDragHandler(), false);

    return true;
  },

  getDragHandler : function () {
    if (this.dragHandler === undefined) {
      var self = this;
      this.dragHandler = function (event) {
        return self.onDragStart(event);
      };
    }
    return this.dragHandler;
  },

  onDragStart : function (event) {
    if (this.state.disabled)
      return;

    // Get anchor if srcElement is anchor's children.
    var anchor = event.srcElement;
    while (!(anchor instanceof HTMLAnchorElement) && anchor.parentNode) {
      anchor = anchor.parentNode;
    }

    if (anchor) {
      event.dataTransfer.setData('DownloadURL', this.buildTransferData(anchor.href));
      event.dataTransfer.setDragImage(this.getDragImage(), -10, 16);
    }
  },

  // Build data for DataTransfer.
  buildTransferData : function (url, filename, mime) {
    if (url == null || url === '')
      return null;

    if (mime == null)
      mime = 'application/octet-stream';

    if (filename == null)
      filename = Path.basename(Path.stripFragment(url));

    return [mime, filename, url].join(':');
  }
};

function onBackgroundRequest(request, sender, sendResponse) {
  var response = {};
  if (request.type === 'toggle') {
    DD.toggle();
    response.state = DD.state;
  }
  sendResponse(response);
}

chrome.extension.sendRequest({type:"init"}, function (response) {
  if (!response.ignored) {
    chrome.extension.onRequest.addListener(onBackgroundRequest);
    DD.activate();
  }
});
