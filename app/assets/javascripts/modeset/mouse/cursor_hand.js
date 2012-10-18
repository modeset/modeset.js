/*
 * Requires: _cursor-grab.css
 * Adds grabby-hand cursor functionality on-demand, and handles cases for different browsers
 * Absolute paths to .cur files are needed for IE. Chrome likes the cursor files too
 * TODO: IE might only want the .cur style def, and not want the plain css class
 */
function CursorHand( element ){
  this.is_chrome = !!navigator.userAgent.toLowerCase().match(/chrome/i);
  this.is_msie = !!navigator.userAgent.toLowerCase().match(/msie/i);
  this.is_iphone = !!navigator.userAgent.toLowerCase().match(/iphone/i);
  this.element = element || document.body;
}

CursorHand.prototype.setDefault = function() {
  if( this.is_chrome || this.is_msie ) {
    this.removeClass( 'hand handCursor' );
    this.removeClass( 'handGrab handGrabCursor' );
  } else {
    this.removeClass( 'hand' );
    this.removeClass( 'handGrab' );
  }
};

CursorHand.prototype.setHand = function() {
  this.setDefault();
  if( this.is_chrome || this.is_msie ) {
    this.addClass( 'hand handCursor' );
  } else {
    this.addClass( 'hand' );
  }
};

CursorHand.prototype.setGrabHand = function() {
  this.setDefault();
  if( this.is_chrome || this.is_msie ) {
    this.addClass( 'handGrab handGrabCursor' );
  } else {
    this.addClass( 'handGrab' );
  }
};

CursorHand.prototype.addClass = function( className ) {
  if($)
    $(this.element).addClass( className );
  else
    DOMUtil.addClass( className );
};

CursorHand.prototype.removeClass = function( className ) {
  if($)
    $(this.element).removeClass( className );
  else
    DOMUtil.removeClass( className );
};

CursorHand.prototype.dispose = function(){
  this.setDefault();
  delete this.is_chrome;
  delete this.is_msie;
  delete this.is_iphone;
  delete this.element;
};

// static helper for raw MouseAndTouchTracker usage
CursorHand.setCursorFromTouchTrackerState = function( touchTracker, cursor, state ) {
  switch( state ) {
    case MouseAndTouchTracker.state_start :
      cursor.setGrabHand();
      break;
    case MouseAndTouchTracker.state_move :
      break;
    case MouseAndTouchTracker.state_end :
      if( touchTracker.touch_is_inside ) cursor.setHand();
      else cursor.setDefault();
      break;
    case MouseAndTouchTracker.state_enter :
      if( !touchTracker.is_touching ) cursor.setHand();
      break;
    case MouseAndTouchTracker.state_leave :
      if(touchTracker.is_touching) cursor.setGrabHand();
      else cursor.setDefault();
      break;
  }

};

