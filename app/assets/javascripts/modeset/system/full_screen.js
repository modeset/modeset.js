var FullScreenToggle = function( buttonEl, viewport ) {

  var dispose = function() {
    buttonEl.removeEventListener( "click", launchFullScreen, false );
  };

  var launchFullScreen = function() {
    if( viewport.requestFullscreen ) {
      viewport.requestFullscreen();
    } else if( viewport.mozRequestFullScreen ) {
      viewport.mozRequestFullScreen();
    } else if( viewport.webkitRequestFullScreen ) {
      viewport.webkitRequestFullScreen();
    }
  };

  // init the click handler
  buttonEl.addEventListener( "click", launchFullScreen, false );

  return {
    dispose: dispose
  }
};
