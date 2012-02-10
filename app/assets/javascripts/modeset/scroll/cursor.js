/* 
 * Adds grabby-hand cursor functionality on-demand
 * Absolute paths to .cur files are needed for IE
 */
function Cursor( openHandCursor, closedHandCursor ){
  openHandCursor = openHandCursor || '/images/cursors/openhand.cur';
  closedHandCursor = closedHandCursor || '/images/cursors/closedhand.cur';
  
  this.is_chrome = !!navigator.userAgent.toLowerCase().match(/chrome/i);
  this.is_msie = !!navigator.userAgent.toLowerCase().match(/msie/i);
  this.is_iphone = !!navigator.userAgent.toLowerCase().match(/iphone/i);
  this.element = document.body;
  this.base_inline_css = this.element.getAttribute("style") || '';
  
  this.CSS_HAND = 'cursor:hand; cursor:grab; cursor:-moz-grab; cursor:-webkit-grab;';
	this.CSS_HAND_CUR = 'cursor: url(' + openHandCursor + '), default !important;';
	this.CSS_HAND_GRAB = 'cursor:grabbing; cursor:-moz-grabbing; cursor:-webkit-grabbing;';
	this.CSS_HAND_GRAB_CUR = 'cursor: url(' + closedHandCursor + '), default !important;';
}

Cursor.prototype.cursorSetDefault = function() {
  if( !this.is_msie ) {
    this.element.setAttribute('style', this.base_inline_css);
  } else { 
    DOMUtil.removeClass( this.element, 'ie_hand' );
    DOMUtil.removeClass( this.element, 'ie_hand_grab' );
  }
};

Cursor.prototype.cursorSetHand = function() {
  if( this.is_chrome ) {
    this.element.setAttribute('style', this.base_inline_css + this.CSS_HAND + this.CSS_HAND_CUR);
  } else if( this.is_msie ) {
    DOMUtil.removeClass( this.element, 'ie_hand_grab' );
    DOMUtil.addClass( this.element, 'ie_hand' );
  } else {
    this.element.setAttribute('style', this.base_inline_css + this.CSS_HAND);
  }
};

Cursor.prototype.cursorSetGrabbyHand = function() {
  if( this.is_chrome ) {
    this.element.setAttribute('style', this.base_inline_css + this.CSS_HAND_GRAB + this.CSS_HAND_GRAB_CUR);
  } else if( this.is_msie ) {
    DOMUtil.removeClass( this.element, 'ie_hand' );
    DOMUtil.addClass( this.element, 'ie_hand_grab' );
    // IE hack for updating cursor after mousedown - actually just creates an error that repaints the cursor
    //document.execCommand("SelectAll");
    //document.body.focus();
    //document.selection.clear()
    setTimeout(function(){
      //document.selection.clear()
      //document.execCommand("Unselect");
      
    },50);
    
    //qtfMate();
    // window.blur();
    // window.focus();
    //window.resizeBy(1,0); window.resizeBy(-1,0);    
  } else {
    this.element.setAttribute('style', this.base_inline_css + this.CSS_HAND_GRAB);
  }
};

Cursor.prototype.dispose = function(){
  this.cursorSetDefault();
  
  this.is_chrome = false;
  this.is_msie = false;
  this.is_iphone = false;
  this.element = false;
  this.base_inline_css = false;
  
  this.CSS_HAND = false;
	this.CSS_HAND_CUR = false;
	this.CSS_HAND_GRAB = false;
	this.CSS_HAND_GRAB_CUR = false;
  
};

