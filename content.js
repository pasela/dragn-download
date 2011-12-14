/*
 * content script - Drag'n Download
 *
 * Author : Yuki <paselan@gmail.com>
 * Date   : December 14, 2011
 * License: MIT License
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
