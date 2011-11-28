/*
 * content script - Drag'n Download
 *
 * Author : Yuki <paselan@gmail.com>
 * Date   : November 25, 2011
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

function cancelEvent(event) {
  event.preventDefault();
}

// Add drag and drop handler.
function addDragHandler(elm) {
  if (elm.nodeType !== Node.ELEMENT_NODE)
    return false;

  var href = elm.getAttribute('href');
  if (href === null || href === '')
    return false;

  elm.draggable = true;
  elm.addEventListener('dragstart', function (event) {
    event.dataTransfer.setData('DownloadURL', buildTransferData(href));
  }, false);
  elm.addEventListener('dragenter', cancelEvent);
  elm.addEventListener('dragover',  cancelEvent);
  elm.addEventListener('drop',      cancelEvent);

  return true;
}

var links = document.getElementsByTagName('a');
for (var i = 0; i < links.length; i++) {
  addDragHandler(links[i]);
}
