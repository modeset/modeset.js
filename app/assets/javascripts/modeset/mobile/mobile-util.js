var MobileUtil = MobileUtil || {};

MobileUtil.IS_PORTRAIT = false;
MobileUtil.IS_LANDSCAPE = false;

MobileUtil.PORTRAIT = 0;
MobileUtil.LANDSCAPE_RIGHT = -90;
MobileUtil.LANDSCAPE_LEFT = 90;
MobileUtil.PORTRAIT_REVERSE = 180;

MobileUtil.ORIENTATION = 0;

MobileUtil.ADDRESS_BAR_HEIGHT = ( navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/Android/i) ) ? 60 : 0;

MobileUtil.setContainerToWindowSize = function( element ) {
  element.css({
    width: $(window).width(),
    height: $(window).height()
  });
};

MobileUtil.trackOrientation = function() {
  if (window.orientation !== undefined) {
    window.addEventListener('orientationchange', MobileUtil.orientationUpdated, false);
    MobileUtil.orientationUpdated();
  }
};

MobileUtil.orientationUpdated = function() {
  if( window.orientation !== undefined ) {
    MobileUtil.ORIENTATION = window.orientation;
    if( Math.abs( window.orientation ) % 180 === 90 ) {
      MobileUtil.IS_PORTRAIT = false;
      MobileUtil.IS_LANDSCAPE = true;
    } else {
      MobileUtil.IS_PORTRAIT = true;
      MobileUtil.IS_LANDSCAPE = false;
    }
  }
};

MobileUtil.lockTouchScreen = function( lock ) {
  if( lock == false ) {
    document.ontouchmove = null;
  } else {
    document.ontouchmove = function( event ) {
      event.preventDefault();
    };
  }
};

MobileUtil.hideSoftKeyboard = function() {
  document.activeElement.blur()
  $('input').blur()
};

MobileUtil.addAndroidClasses = function() {
  // adds classes for android, android 4.0+ and not-android
  var is_android = ( navigator.userAgent.toLowerCase().match(/android/i) ) ? true : false;
  var elem = document.documentElement;
  if( is_android == true ) {
    elem.className = [elem.className, 'is-android'].join(' ');
    // check for android 4+ so we can hardware accelerate
    var androidVersion = parseFloat( navigator.userAgent.match(/Android (\d+(?:\.\d+)+)/gi)[0].replace('Android ','') )
    if( androidVersion >= 4 ) {
      elem.className = [elem.className, 'is-android4plus'].join(' ');
    }
  } else {
    elem.className = [elem.className, 'no-android'].join(' ');
  }
};

MobileUtil.openNewWindow = function( href ) {
  // gets around native popup blockers
  var link = document.createElement('a');
  link.setAttribute('href', href);
  link.setAttribute('target','_blank');
  var clickevent = document.createEvent('Event');
  clickevent.initEvent('click', true, false);
  link.dispatchEvent(clickevent);
  return false;
};
