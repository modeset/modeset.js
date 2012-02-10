/**
 * Fires an HTML Event.
 */

var EventUtil = {};

EventUtil.dispatch = function() {
  var $el, $type, evt;
  // only one value passed, assume we are given the type and dispatch from the document.
  if (arguments.length == 1) {
    $el = document;
    $type = arguments[0];
  }
  // if two value are passed, assume we are given the element and type.
  if (arguments.length > 1) {
    $el = arguments[0];
    $type = arguments[1];
  }
  // dispatch for IE
  if ($el.fireEvent) {
    // try to do a normal fire
    try {
      $el.fireEvent($type);
    }
    // if it fails, we likely have a 'custom' event IE doesn't support. to get it working, employ hackery.
    catch(err) {
      evt = document.createEventObject();
      evt.type = $type;
      evt.target = $el;
      if (EventUtil.events && EventUtil.events[$type]) {
        for (var callbackID in EventUtil.events[$type]) {
          EventUtil.events[$type][callbackID].call($el, evt);
        }
      }
    }
  }
  // dispatch for Gecko
  else if (document.createEvent) {
    evt = document.createEvent('HTMLEvents');
    if (evt.initEvent) {
      evt.initEvent($type, true, true);
    }
    if ($el.dispatchEvent) {
      $el.dispatchEvent(evt);
    }
  }
};

EventUtil.bind = (function(window, document) {
  if (document.addEventListener) {
    return function(elem, type, cb) {
      elem.addEventListener(type, cb, false);
    };
  }
  else if (document.attachEvent) {
    // setup prototype function to generate unique IDs for objects under IE.
    var id = 0;
    Object.prototype.uniqueId = function() {
      if( typeof this.__id == 'undefined' ) {
        this.__id = ++id;
      }
      return this.__id;
    };
    return function (elem, type, cb) {
      if (elem && type && cb) {
        if (!EventUtil.events) EventUtil.events = {};
        if (!EventUtil.events[type]) EventUtil.events[type] = {};
        var handler = function( e ) {
          return cb.call(elem, e);
        };
        EventUtil.events[type][cb.uniqueId()] = handler;
        elem.attachEvent('on' + type, handler);
      }
    };
  }
})(this, document);


EventUtil.unbind = (function(window, document) {
  if (document.removeEventListener) {
    return function(elem, type, cb) {
      elem.removeEventListener(type, cb, false);
    }
  } else if (document.detachEvent) {
    return function(elem, type, cb) {
      elem.detachEvent('on' + type, EventUtil.events[type][cb.uniqueId()]);
      delete EventUtil.events[type][cb.uniqueId()];
    }
  }
})(this, document);


// allows binding to the document ready event.
// some code taken from Dean Edwards: http://dean.edwards.name/weblog/2006/06/again/
EventUtil.documentReady = (function(window, document) {
  if (/WebKit/i.test(navigator.userAgent)) { // sniff
    return function( cb ) {
      var _timer = setInterval(function() {
        if (/loaded|complete/.test(document.readyState)) {
          clearInterval(_timer);
          cb.call( document );
        }
      }, 10);
    }
  }
  else if(/MSIE/i.test(navigator.userAgent)) {
    return function( cb ) {
      document.write("<script id=__ie_onload defer src=javascript:void(0)><\/script>");
      var script = document.getElementById("__ie_onload");
      script.onreadystatechange = function() {
        if (this.readyState == "complete") {
          cb.call( document );
        }
      };
    }
  }
  else {
    return function( cb ) {
      EventUtil.bind( document, 'DOMContentLoaded', cb );
    }
  }

})(this, document);