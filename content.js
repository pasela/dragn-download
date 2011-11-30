/*
 * content script - Drag'n Download
 *
 * Author : Yuki <paselan@gmail.com>
 * Date   : November 30, 2011
 * License: MIT License
 */

var state = { disabled : false };

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

// Build data for DataTransfer.
function buildTransferData(url, filename, mime) {
  if (url == null || url === '')
    return null;

  if (mime == null)
    mime = 'application/octet-stream';

  if (filename == null)
    filename = Path.basename(Path.stripFragment(url));

  return [mime, filename, url].join(':');
}

function onDragStart(event) {
  console.log(event);
  if (!state.disabled) {
    // Get anchor if srcElement is anchor's children.
    var anchor = event.srcElement;
    while (!(anchor instanceof HTMLAnchorElement) && anchor.parentNode) {
      anchor = anchor.parentNode;
    }
    if (anchor)
      event.dataTransfer.setData('DownloadURL', buildTransferData(anchor.href));
  }
}

// Add drag and drop handler.
function addDragHandler(elm) {
  // Note: Element.getAttribute('href') returns a value as is. and it maybe a relative path.
  //       HTMLAnchorElement.href has an absolute path. (DOM 2)
  if (!(elm instanceof HTMLAnchorElement))
    return false;

  if (elm.href === null || elm.href === '' || elm.href.charAt(0) === '#')
    return false;

  elm.draggable = true;
  elm.addEventListener('dragstart', onDragStart, false);

  return true;
}

var links = document.getElementsByTagName('a');
for (var i = 0; i < links.length; i++) {
  addDragHandler(links[i]);
}

// Get current state.
chrome.extension.sendRequest({type : "getState"}, function (response) {
  state = response;
});

// Receive new state when updated.
chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
  // Receive settings from background page.
  if (request.type === 'updateState') {
    state = request.data;
  }
  sendResponse({});
});
