PlatformHelper = function () {
  this.webkit_css_enabled = false;
  this.animations_enabled = false;
  this.is_android = false;
  this.is_android21 = false;
  this.is_android22 = false;
  this.is_idevice = false;
  this.is_touchscreen = false;
  
  this.is_msie = false;
  this.is_msie6 = false;
  this.is_msie8 = false;
  this.is_firefox = false;
  this.is_chrome = false;
  
  this.has_jquery = false;
  this.has_prototypejs = false;
  
  this.has_canvas = false;
  this.has_geolocation = false;
  this.has_history = false;

  this.init();
};

PlatformHelper.prototype.init = function () {   
  if(typeof debug !== 'undefined') debug.log(navigator.userAgent);
  // check for webkit positioning capability
  if( navigator.userAgent.match(/iPhone/i) ) this.webkit_css_enabled = true;
  else if( navigator.userAgent.match(/iPod/i) ) this.webkit_css_enabled = true;
  else if( navigator.userAgent.match(/iPad/i) ) this.webkit_css_enabled = true;
  else if( navigator.userAgent.match(/Chrome/i) ) this.webkit_css_enabled = true;
  else if( navigator.userAgent.match(/Safari/i) ) this.webkit_css_enabled = true;
  
  // check for certain platforms
  if( navigator.userAgent.match(/Android/i) ) this.is_android = true;
  if( navigator.userAgent.match(/Android 2.1/i) ) this.is_android21 = true;
  if( navigator.userAgent.match(/Android 2.2/i) ) this.is_android22 = true;
  if( navigator.userAgent.match(/MSIE/i) ) this.is_msie = true;
  if( navigator.userAgent.match(/MSIE 6/i) ) this.is_msie6 = true;
  if( navigator.userAgent.match(/MSIE 8/i) ) this.is_msie8 = true;
  if( navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i) ) this.is_idevice = true;
  if( navigator.userAgent.match(/Firefox/i) ) this.is_firefox = true;
  if( navigator.userAgent.match(/Chrome/i) ) this.is_chrome = true;
  
  // check for js libraries
  this.has_jquery = (typeof jQuery !== 'undefined');
  this.has_prototypejs = (typeof Prototype !== 'undefined');
  
  // check for certain html5 capabilities - for others use Modernizr
  this.has_canvas = !!document.createElement('canvas').getContext;
  this.has_geolocation = !!navigator.geolocation;
  this.has_history = !!(window.history && history.pushState);
  
  // special cases for touchscreens
  if( this.is_android == true || this.is_idevice == true ) this.is_touchscreen = true;
};

PlatformHelper.prototype.update2DPosition = function ( element, x, y ) {
  if( !element ) return;

  if( !this.webkit_css_enabled || this.is_android22 ) {
    element.style.left = x + 'px';
    element.style.top = y + 'px';
  } else {
    // stop any previous webkit animations
    element.style.webkitTransition = '';
    element.style.webkitTransform = '';
    // set new position transform
    var new_transform = "translate3d(" + x + "px, " + y + "px, 0px)";
    if( element.style.webkitTransform != new_transform ) {
      element.style.webkitTransform = new_transform; // only apply style if not already in position
    }
  }
};

PlatformHelper.prototype.updatePositionAndRotation = function ( element, xPos, yPos, rotation ) {
  if( !element ) return;

  if( !this.webkit_css_enabled || this.is_android22 ) {
    element.style.left = xPos + 'px';
    element.style.top = yPos + 'px';
    element.style.MozTransform = 'rotate(' + rotation + 'deg)';
    element.style.webkitTransform = 'rotate(' + rotation + 'deg)';
  } else {
    var new_transform = "translate3d(" + xPos + "px, " + yPos + "px, 0px) rotate(" + rotation + "deg)";
    if( element.style.webkitTransform != new_transform ) {
      element.style.webkitTransform = new_transform; // only apply style if not already in position
    }
  }
};

PlatformHelper.prototype.animate2DPosition = function ( element, x, y, duration ) {
  if( !element ) return;

  if( !this.webkit_css_enabled || this.is_android22 ) {
    //new Effect.Move( element, { x: x, y: y, mode: 'absolute', duration:duration });		
    $(element).animate({ 'left': x, 'top': y}, duration * 1000);
  } else {
    element.style.left = element.style.top = "0px";
    element.style.webkitTransition = "-webkit-transform " + duration + "s";		
    var new_transform = "translate3d(" + x + "px, " + y + "px, 0px)";
    if( element.style.webkitTransform != new_transform ) {
      element.style.webkitTransform = new_transform; // only apply style if not already in position
    }
  }
};

PlatformHelper.prototype.convertPosToWebkitTransform = function ( element ) {
  if( !element ) return;

  // simply ditch standard top/left positioning - requires CSS ton contain webkitTransform AND standard top/left CSS
  if( this.webkit_css_enabled ) {
    element.style.left = 0;
    element.style.top = 0;
	}
};

PlatformHelper.prototype.copyLink = function(data) {
    if (window.clipboardData && clipboardData.setData) {
        clipboardData.setData('Text', data);
    } else {
        // Unsupported browser
    }
};
