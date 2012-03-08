var TouchScrollerFormFocus = function( scrollerObj, scrollOuter ) {
    
  // app objects & elements
  var _scroller = scrollerObj,
      _focused_element = null,
      IPHONE_SCROLL_TARGET = 56,
      IPAD_KEYBOARD_HEIGHT = 264,
      INPUT_SELECTOR = 'input, select', // textarea
      BLUR_DRAG_DISTANCE = 25,
      _windowOffsetInterval = null,
      _defeatNativeInputFocusCount = 0,
      _isScrolling = false,
      _isiPhone = navigator.userAgent.match(/iPhone/i),
      _isiPad = navigator.userAgent.match(/iPad/i);

  var init = function() {
    enableInputFocusScrolling();
    fixWindow();
  };

  var fixWindow = function() {
    requestAnimationFrame( fixWindow );
    forceContainerDefaultPosition();
  };
      
  var forceContainerDefaultPosition = function(){
    // if(window.pageXOffset != 0 || window.pageXOffset != 0)
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.body.scrollLeft = 0;
  };
  
  var removeInputFocus = function( shouldBlur ) {
    if( shouldBlur ) {
      document.activeElement.blur();
      $( INPUT_SELECTOR ).blur();
    }
    if( _scroller ) _scroller.setNonPagedFrictionIsShort( false );
    if( _scroller ) _scroller.setStayInBounds( true );
    forceContainerDefaultPosition();
  };
  
  var scrollToElement = function( element ){
    _focused_element = element;

      // find current position, and animate to location by setting scroller velocity
    var outerOffset = $( scrollOuter ).offset().top;
    var elemOffset = $( element ).offset().top;

    var targetOffset = 0;
    if( _isiPhone ) {
      // iphone always focuses current element in the same spot
      targetOffset = IPHONE_SCROLL_TARGET - elemOffset + outerOffset;
    } else {
      // scroll on larger screens if needed - only scroll if the input is off the screen in either direction
      var topPad = 15;
      var bottomPad = 70;
      bottomPad += ( _isiPad ) ? IPAD_KEYBOARD_HEIGHT : 0;
      var screenH = $(window).height() - bottomPad - outerOffset;
      // scroll up if fields would be hidden by soft keyboard when tabbing between fields
      if( elemOffset > screenH ) targetOffset = screenH - elemOffset;
      // scroll down if tabbing backwards
      if( elemOffset < outerOffset + topPad ) targetOffset = outerOffset + topPad;
    }
    
    // if we have to manually scroll, set props to allow fast scrolling to the focused element
    _scroller.setStayInBounds( false );
    _scroller.setNonPagedFrictionIsShort( true );
    _scroller.setOffsetPosition( -targetOffset );
    _isScrolling = true;
  };
    
  var fixWindowPosition = function() {
    _defeatNativeInputFocusCount = 0;
    fixWindowStep();
  };
    
  var fixWindowStep = function() {
    var parent = $(_focused_element).parent()[0];
    var inner = $(_focused_element).closest('.scroll_inner')[0];
    var body = $('body')[0];
    
    if( _defeatNativeInputFocusCount > 100) return;
    if( _focused_element == null ) return;

    // use optimal method to animate 60+ fps
    if( window.requestAnimationFrame ) {
      window.requestAnimationFrame( fixWindowStep );
      _defeatNativeInputFocusCount++;
    }
    else
      setTimeout( function() { 
        fixWindowStep();
        _defeatNativeInputFocusCount++;
      }, 16 );
  };
  
  var enableInputFocusScrolling = function() {
    // handle the funky native browser scrolling that takes place if display:hidden is on the outer container
    // the developer will have to use z-indexes and hide the scroll overflow under other elements, like a header and footer.
    $( scrollOuter ).css({ overflow:'visible' });

    // some of this doesn't work perfectly in a browser, but should in iOS
    // listen to focus, and scroll to the form element
    $(scrollOuter).find( INPUT_SELECTOR ).bind('focus',function(e) {
      e.preventDefault();
      e.stopPropagation();
      var element = this;
      if( _focused_element == null || _focused_element != element ) {
        scrollToElement( element );
        fixWindowPosition();
      }
    });
    
    // clear currently-focused input, but check after a timeout to see if another's been focused. otherwise, set scroller to stay in bounds again
    $(scrollOuter).find( INPUT_SELECTOR ).bind('blur',function() {
      _focused_element = null;
      removeInputFocus( false );
      fixWindowPosition();
    });
  };
  
  var dispose = function() {
    removeInputFocus( true );
    if( _scroller ) _scroller.dispose();
    _scroller = null;
    _focused_element = null;
    _css_helper = null;
    $(scrollOuter).find( INPUT_SELECTOR ).unbind();
    clearInterval( _windowOffsetInterval );
  };

  // TouchScroller delegate methods ---------------------------------------------------
  var updatePosition = function( touchMovedX, touchMovedY, isTouching ) {
    if( isTouching && Math.abs( touchMovedY ) > BLUR_DRAG_DISTANCE ) {
      if( _focused_element != null ) {
        _focused_element = null;
        removeInputFocus( true );
      }
      _scroller.setNonPagedFrictionIsShort( false );
    }
  };

  var handleDestination = function() {
    if( _focused_element && _isScrolling ) {
      _isScrolling = false;
      // add/remove zero at end of input value to reset the caret position... hacky.
      var inputEl = $( _focused_element );
      var inputType = inputEl.attr('type');
      if( inputType == 'text' || inputType == 'tel' || inputType == 'email' ) {
        var inputVal = inputEl.val();
        $( _focused_element ).val( inputVal+'0' );
        $( _focused_element ).val( inputVal );
      }
    }
  };
  
  // Public interface ---------------------------------------------------
  return {
    init : init,
    scrollToElement : scrollToElement,
    updatePosition : updatePosition,
    handleDestination : handleDestination,
    dispose : dispose
  }
};
