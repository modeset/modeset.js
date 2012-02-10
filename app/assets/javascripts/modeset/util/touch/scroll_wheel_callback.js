// merged from:
// http://www.ogonek.net/mousewheel/demo.html
// http://www.switchonthecode.com/tutorials/javascript-tutorial-the-scroll-wheel

var ScrollWheelCallback = function( container, callback ) {
  
  var init = function(){
    addListener(container, 'mousewheel', scrollWheel);
  };
  
  var addListener = function(element, eventName, callback) {
    if(typeof(element) == "string")
      element = document.getElementById(element);
    if(element == null)
      return;
    if(element.addEventListener) {
      debug.log('eventName = '+eventName);
      if(eventName == 'mousewheel') element.addEventListener('DOMMouseScroll', callback, false);  
      element.addEventListener(eventName, callback, false);
    }
    else if(element.attachEvent)
      element.attachEvent("on" + eventName, callback);
  };

  var removeListener = function(element, eventName, callback) {
    if(typeof(element) == "string")
      element = document.getElementById(element);
    if(element == null)
      return;
    if(element.removeEventListener) {
      if(eventName == 'mousewheel')
        element.removeEventListener('DOMMouseScroll', callback, false);  
      element.removeEventListener(eventName, callback, false);
    }
    else if(element.detachEvent) {
      element.detachEvent("on" + eventName, callback);
    }
  };
  
  var cancelEvent = function(e) {
    e = e ? e : window.event;
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble = true;
    e.cancel = true;
    e.returnValue = false;
    debug.log('cancel event');
    return false;
  };

  var scrollWheel = function(e) {
    // handles the different ways that different browsers handle scroll wheel values
    var delta = 0;
  	if (!e) e = window.event;
  	if (e.wheelDelta) {
  		delta = e.wheelDelta/120; 
  		if (window.opera) delta = -delta;
  	} else if (e.detail) { 
  	  delta = -e.detail/3;	
  	}
  	delta = Math.round(delta); //Safari Round
    if( callback ) callback( delta );
    cancelEvent(e);
  };
  
  var dispose = function() {
    removeListener( container, 'mousewheel', scrollWheel );
  }
  
  init();
  
  return {
    dispose : dispose
  };
};