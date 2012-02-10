var SectionFormScroller = function( scrollOuter, scrollInner, scrollBar ) {
	
	// app objects & elements
	var _scroll_holder = scrollOuter;
	var _scroll_inner = scrollInner;
	var _scroll_bar = scrollBar;
	var _css_helper = new CSSHelper();
	var _scroller;
	var _focused_element = null;
	var TARGET_Y_SCROLL = 100;
	var INPUT_SELECTOR = 'input, select'; // textarea
	var _windowOffsetInterval = null;
	var _defeatNativeInputFocusCount = 0;
	var _isScrolling = false;

	var init = function() {
		_scroller = new TouchScroller( _scroll_holder[0], _scroll_inner[0], _scroll_bar[0], null, false, createScrollDelegate() );
		setVertical();
		enableInputFocusScrolling();
		document.addEventListener("pause", onDeviceEnteredBackground, false);
    document.addEventListener("resume", onDeviceEnteredForeground, false);
    
    // $(scrollInner).removeClass('scroll_inner');
	};
	
	var setVertical = function() {
		_scroll_holder.addClass('vertical');
		_scroller.setOrientation( _scroller.VERTICAL );
	};
	
	var setHorizontal = function() {
		_scroll_holder.removeClass('vertical');
		_scroller.setOrientation( _scroller.HORIZONTAL );
	};
	
	var createScrollDelegate = function() {
		return {
			updatePosition : function( touchMovedX, touchMovedY, isTouching ) {
				if( isTouching && Math.abs( touchMovedY ) > 25 ) {
				  if( _focused_element != null ) {
				    _focused_element = null;
            removeInputFocus();
				  }
					_scroller.setNonPagedFrictionIsShort( false );
				}
			},
			touchEnd : function() {
				//removeInputFocus();
			},
			handleDestination : function() {
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
			}
		}
	};
	
	var recalculateDimensions = function() {
	  _scroller.calculateDimensions();
	};
	
	var forceContainerDefaultPosition = function(){
    // if(window.pageXOffset != 0 || window.pageXOffset != 0)
    window.scrollTo(0, 0);
	};
	
	var removeInputFocus = function() {
		document.activeElement.blur();
		$( INPUT_SELECTOR ).blur();
		if( _scroller ) _scroller.setStayInBounds( true );
		forceContainerDefaultPosition();
	};
	
	var scrollToElement = function( element ){
  	_scroller.setStayInBounds( false );
	  // find current position, and animate to location by setting scroller velocity
  	var jOffset = $( element ).offset();
  	console.log('element = '+ element+ "  id = "+element.id);
  	console.log('jOffset = '+ jOffset.top);
  	var offset = TARGET_Y_SCROLL - jOffset.top;
  	console.log('offset = '+ offset);
		_focused_element = element;
    // if( offset >= 1 ) {
    if( offset >= 1 ) {
      _scroller.setNonPagedFrictionIsShort( true );
  	}
  	_scroller.setOffsetPosition( -offset );
		forceContainerDefaultPosition();
		_isScrolling = true;
	};

  var scrollToEnd = function() {
    _scroller.scrollToEnd();
  };
	
  var scrollToTop = function() {
    _scroller.scrollToTop();
  };
	
	var fixWindowPosition = function() {
	  _defeatNativeInputFocusCount = 0;
    fixWindowStep();
	  // TODO: try this instead?
    // $('html, body').animate({scrollTop:0,scrollLeft:0}, 'slow'); 
	};
	
	var fixWindowStep = function() {
    // $(_focused_element).closest('.scroll_outer').css({position: 'relative', top: '6px'})
    // if(2 % _defeatNativeInputFocusCount == 0) {
    //      $(_focused_element).closest('.scroll_outer').css({left: '1px'})
    // } else {
    //      $(_focused_element).closest('.scroll_outer').css({left: '0px'})
    // }

    var parent = $(_focused_element).parent()[0];
    var scrollInner = $(_focused_element).closest('.scroll_inner')[0];
    var body = $('body')[0];
    // while( parent != body && $(parent).parent().length > 0 ) {
    //   if( $(parent).parent()[0] != scrollInner ) {
    //     $(parent).parent().css({ position: 'relative', top: 0, left: 0, '-webkit-transform':'translate3d(0px, 0px, 0px);' })
    //     $(parent).parent().animate({top: 0, left: 0}, 'slow'); 
    //     // console.log('parent = '+parent.nodeType);
    //   }
    //   parent = $($(parent)[0]).parent()[0];
    // }
    
    // $(_focused_element).closest('.scroll_outer').offset({ position: 'relative', top: 0, left: 0 })
    // $(_focused_element).closest('.scroll_inner').offset({ position: 'relative', top: 0, left: 0 })
    // $(_focused_element).closest('.article').offset({ position: 'relative', top: 0, left: 0 })
	  
	  if( _defeatNativeInputFocusCount > 100) return;
	  if( _focused_element == null ) return;
	  setTimeout(function(){
      forceContainerDefaultPosition();
	    fixWindowStep();
	    _defeatNativeInputFocusCount++;
	  },2);
	};
	
	var enableInputFocusScrolling = function() {
	  // some of this doesn't work perfectly in a browser, but should in iOS
	  // listen to focus, and scroll to the form element
    scrollInner.find( INPUT_SELECTOR ).bind('focus',function(e) {
      e.preventDefault();
      e.stopPropagation();
      var element = this;
      if( _focused_element == null || _focused_element != element ) {
        scrollToElement( element );
        fixWindowPosition();
      }
    });
    
    // clear currently-focused input, but check after a timeout to see if another's been focused. otherwise, set scroller to stay in bounds again
    scrollInner.find( INPUT_SELECTOR ).bind('blur',function() {
      _focused_element = null;
      removeInputFocus();
      fixWindowPosition();
    });
	
		forceContainerDefaultPosition();
	};
	
	var onDeviceEnteredBackground = function(e) {
	  _scroller.deactivate();
	}
	
	var onDeviceEnteredForeground = function(e) {
	  _scroller.activate();
	}
	
	var dispose = function() {
	  removeInputFocus();
		if( _scroller ) _scroller.dispose();
		_scroller = null;
		_focused_element = null;
		_css_helper = null;
    scrollInner.find( INPUT_SELECTOR ).unbind();
		document.removeEventListener("pause", onDeviceEnteredBackground);
    document.removeEventListener("resume", onDeviceEnteredForeground);
    clearInterval( _windowOffsetInterval );
	};
	
	return {
		init : init,
		scrollToElement : scrollToElement,
    scrollToEnd : scrollToEnd,
    scrollToTop : scrollToTop,
		recalculateDimensions : recalculateDimensions,
		dispose : dispose
	}
};
