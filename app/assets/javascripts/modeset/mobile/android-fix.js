!function(){
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
}();