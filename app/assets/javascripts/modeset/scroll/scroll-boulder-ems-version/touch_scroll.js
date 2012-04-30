/**
 * Base touch tracking on an html element
 * @requires touch_tracker.js
 * @requires cursor.js
 * @requires css_helper.js
 */
/*
TODO:
# make it progressively-enhanced - overflow:auto
# put together examples for multiple usages
# numeric indicator
*/
var TouchScroller = function( element, elementInner, scrollBarContainer, cursor, isPaged, scrollerDelegate ) {
	// internal positioning & size objects
	var ScrollerSize = function( w, h ) {
		this.w = w || 0;
		this.h = h || 0;
	};

	var ScrollerPosition = function( x, y ) {
		this.x = x || 0;
		this.y = y || 0;
	};

	// directional locking constants and state vars
	var HORIZONTAL = 'horizontal',
		VERTICAL = 'vertical',
		UNLOCKED = 'unlocked',

		DECIDE_DIR_THRESHOLD = 15,
		PAST_BOUNDS_FRICTION = 0.2,
		BOUNCEBACK_FACTOR = -0.2,
		NON_PAGED_FRICTION_SHORT = 0.3,
		NON_PAGED_FRICTION = 0.8,
		_non_paged_friction = 0,
		_has_decided_a_direction = false,
		_touch_lock_direction = false,
		_orientation = null,
		_was_dragged_beyond_bounds = false,
		_stays_in_bounds = true,

		// touch helpers
		_cursor = cursor,
		_touch_delegate = null,
		_touch_tracker = null,
		_css_helper = null,
		_scroller_delegate = scrollerDelegate,

		// scroll elements
		_element_outer = element,
		_element_inner = elementInner,

		// positioning and css flags
		_speed = 0,
		_cur_position = null,
		_container_size = null,
		_content_size = null,

		_doesnt_need_scroll = false,
		_end_position = 0,

		// deal with pages
		PAGED_EASING_FACTOR = 5,
		PAGE_TURN_RATIO = 0.2,
		_timer_fps = 33,
		_is_paged = isPaged,
		_num_pages = 0,
		_page_index = 0,
		_closest_scroll_index = 0,
		_timer_active = false,

		// deal with direction of scroller
		_indicator = null,
		_has_scroll_bar = null,
		_axis = null,	// will be x/y for ScrollerPosition
		_length = null;	// will be w/h for ScrollerSize


	var init = function() {
		_css_helper = new CSSHelper();
		_touch_delegate = {};
		_touch_tracker = new MouseAndTouchTracker( element, _touch_delegate, false );
		addTouchCallbacks();

		_cur_position = new ScrollerPosition();
		_container_size = new ScrollerSize();
		_content_size = new ScrollerSize();

		if( scrollBarContainer != null ) buildScrollbar( scrollBarContainer );

		_touch_lock_direction = UNLOCKED;
		_non_paged_friction = NON_PAGED_FRICTION;
		setOrientation( HORIZONTAL );
		calculateDimensions();


		activate();
	};

	var addTouchCallbacks = function() {
		_touch_delegate.touchUpdated = function( state, touchEvent ) {
		    switch( state ) {
		      case MouseAndTouchTracker.state_start :
		        onStart(touchEvent);
		        break;
		      case MouseAndTouchTracker.state_move :
		        onMove(touchEvent);
		        break;
		      case MouseAndTouchTracker.state_end :
		        onEnd(touchEvent);
		        break;
		      case MouseAndTouchTracker.state_enter :
		        onEnter(touchEvent);
		        break;
		      case MouseAndTouchTracker.state_leave :
		        onLeave(touchEvent);
		        break;
		    }
			updateCursor( state );
		};
	};

	var onStart = function( touchEvent ) {
    // touchEvent.stopPropagation();
		if( _has_scroll_bar ) showScrollbar();
	};

	var onMove = function( touchEvent ) {
		if( !_has_decided_a_direction ) {
			if( Math.abs( _touch_tracker.touchmoved.x ) > DECIDE_DIR_THRESHOLD ) {
				hasDecidedDirection( HORIZONTAL );
			} else if( Math.abs( _touch_tracker.touchmoved.y ) > DECIDE_DIR_THRESHOLD ) {
				hasDecidedDirection( VERTICAL );
			}
		} else {
			// move it if allowed
			updatePositionFromTouch( ( _touch_tracker.touchmoved.x - _touch_tracker.touchmovedlast.x ), ( _touch_tracker.touchmoved.y - _touch_tracker.touchmovedlast.y ) );
		}
		// disable touch event if allowed
	  if(touchEvent && typeof touchEvent !== 'undefined' && touchEvent.stopPropagation && typeof touchEvent.stopPropagation !== 'undefined') touchEvent.stopPropagation();
	};

	var onEnd = function( touchEvent ) {
	  if( _touch_tracker.touchmoved.x != 0 && _touch_tracker.touchmoved.y != 0 ) {
  	  if(touchEvent && typeof touchEvent !== 'undefined' && touchEvent.stopPropagation && typeof touchEvent.stopPropagation !== 'undefined') touchEvent.stopPropagation();
	  }
		// set flags and store last known page index before recalculating
		_has_decided_a_direction = false;
		_touch_lock_direction = UNLOCKED;
		var prevIndex = _page_index;

		// get mouse speed for non-paged mode
		if( _touch_tracker.touchspeed[ _axis ] != 0 ) _speed = -_touch_tracker.touchspeed[ _axis ];

		// calculate speed to get back to edge if content was dragged out-of-bounds
		if( _stays_in_bounds == true ) {

      if( _cur_position[ _axis ] - _speed > 0 || _cur_position[ _axis ] - _speed < _end_position || _doesnt_need_scroll ) {

        // if( _cur_position[ _axis ] > 0 || _cur_position[ _axis ] < _end_position || _doesnt_need_scroll ) {
  			_was_dragged_beyond_bounds = true;
  			var distanceFromEdge = 0;

  			// apply speed so we can treat it as if we dragged as far as the drag speed added
  			_cur_position[ _axis ] -= _speed;

        // send back to top, or bottom
  			if( _cur_position[ _axis ] > 0 || _doesnt_need_scroll == true )
  			  distanceFromEdge = _cur_position[ _axis ];
  			else if( _cur_position[ _axis ] < _end_position )
  			  distanceFromEdge = _cur_position[ _axis ] - _end_position;

  			// solve for initial speed, given distance and friction
  			if( distanceFromEdge != 0 ) {
    			_speed = getSpeedToReachDestination( distanceFromEdge );
  			}
      }
    }

		// snap to page and constrain page calculation
		if( _is_paged == true ) {
		  // have we swiped far enough to turn the page
  		if( _touch_tracker.touchmoved[ _axis ] > _container_size[ _length ] * PAGE_TURN_RATIO ) {
  			_page_index = ( _page_index == 0 ) ? 0 : _page_index - 1;
  		} else if ( _touch_tracker.touchmoved[ _axis ] < -_container_size[ _length ] * PAGE_TURN_RATIO ) {
  			_page_index = ( _page_index < _num_pages - 1 ) ? _page_index + 1 : _num_pages - 1;
  		}

  		// checks whether we've gone more than halfway to a page, or allows above code to let us swipe slightly for next/prev pages
  		if( !( prevIndex == _closest_scroll_index && prevIndex != _page_index ) ) {
  			_page_index = _closest_scroll_index;
  		}
  	}
	};

	var onEnter = function( touchEvent ) {

	};

	var onLeave = function( touchEvent ) {

	};

	var updateCursor = function( state ) {
    if( _cursor ) {
  		switch( state ) {
  			case MouseAndTouchTracker.state_start :
  				_cursor.setGrabbyHand();
  				break;
  			case MouseAndTouchTracker.state_move :
  				break;
  			case MouseAndTouchTracker.state_end :
  		        if( _touch_tracker.touch_is_inside ) _cursor.setHand();
  		        else _cursor.setDefault();
  				break;
  			case MouseAndTouchTracker.state_enter :
  				if( !_touch_tracker.is_touching ) _cursor.setHand();
  				break;
  			case MouseAndTouchTracker.state_leave :
  				if(_touch_tracker.is_touching) _cursor.setGrabbyHand();
  				else _cursor.setDefault();
  				break;
  		}
  	}
	};

	var calculateDimensions = function() {
		_container_size.w = _element_outer.offsetWidth;
		_container_size.h = _element_outer.offsetHeight;
		_content_size.w = _element_inner.offsetWidth;
		_content_size.h = _element_inner.offsetHeight;
		_num_pages = Math.ceil( _content_size[ _length ] / _container_size[ _length ] );
		_end_position = _container_size[ _length ] - _content_size[ _length ];
		if( _has_scroll_bar ) resizeScrollbar();
		_doesnt_need_scroll = ( _container_size[ _length ] > _content_size[ _length ] );
	};

	// update scroll position
	var updatePositionFromTouch = function( moveX, moveY ) {
		// handle bounce-back and lessened swipe-ability at ends of scroll area
		var move = ( _axis == 'x' ) ? moveX : moveY;
		if( _cur_position[ _axis ] > 0 && _touch_tracker.touchspeed[ _axis ] > 0 ) {
			_cur_position[ _axis ] += move * PAST_BOUNDS_FRICTION;
		} else if( _cur_position[ _axis ] < -_content_size[ _length ] + _container_size[ _length ] && _touch_tracker.touchspeed[ _axis ] < 0 ) {
			_cur_position[ _axis ] += move * PAST_BOUNDS_FRICTION;
		} else {
			_cur_position[ _axis ] += move;
		}
		_css_helper.update2DPosition( _element_inner, _cur_position.x, _cur_position.y );
		if( _scroller_delegate ) _scroller_delegate.updatePosition( _touch_tracker.touchmoved.x, _touch_tracker.touchmoved.y, true );
	};

	var hasDecidedDirection = function( direction ) {
		_has_decided_a_direction = true;
		_touch_lock_direction = direction;
	};

	// paged scroller methods
	var runTimer = function() {
		if( _timer_active ) {
		  calculateDimensions();
			if( !_touch_tracker.is_touching ) {
				if( _is_paged == true ) {
					// ease to the cosest index while not touching
					easeToIndex();
				} else {
					// slide it and apply friction
					applyInertia();
				}
				// hide scrollbar and set speed to zero when it eases close enough
				if( Math.abs( _speed ) <= 0.01 ) {
					if( _speed != 0 ) handleDestination();
					_speed = 0;
					if( _has_scroll_bar ) hideScrollbar();
				}
				_css_helper.update2DPosition( _element_inner, _cur_position.x, _cur_position.y );
			}

			checkForClosestIndex();

			//  move the indicator
			if( _orientation == VERTICAL ) {
				updateScrollbarPosition( _cur_position.y );
			} else {
				updateScrollbarPosition( _cur_position.x );
			}

			// keep timer running
			setTimeout( function() { runTimer(); }, _timer_fps );
		}
	};

	var easeToIndex = function() {
		var lastLoc = _cur_position[ _axis ];
		_cur_position[ _axis ] = getNextEasedLocation( _page_index, _cur_position[ _axis ], _container_size[ _length ] );
		_speed = Math.abs( _cur_position[ _axis ] - lastLoc );
	};

	var applyInertia = function() {
    _speed *= _non_paged_friction;
    _cur_position[ _axis ] -= _speed;

		// reverse direction if inertia has brought the content out of bounds
		if( _num_pages > 1 && _was_dragged_beyond_bounds == false && _stays_in_bounds == true ) {
  		if( _cur_position[ _axis ] > 0 ) {
  			_cur_position[ _axis ] = 0;
  			_speed *= BOUNCEBACK_FACTOR;
  			_speed = 0;
  		} else if( _cur_position[ _axis ] < _end_position ) {
  			_cur_position[ _axis ] = _end_position;
  			_speed *= BOUNCEBACK_FACTOR;
  			_speed = 0;
  		}
  	}
		// check to see if content is back in bounds after sliding off
		if ( _cur_position[ _axis ] < 0 && _cur_position[ _axis ] > _end_position ) {
			_was_dragged_beyond_bounds = false;
		}
	};

	var getNextEasedLocation = function( pageIndex, curPosition, containerSize ) {
		// get location based on current position
		var targetPos = pageIndex * -containerSize;
		if( curPosition !== targetPos ) {
			if (Math.abs( curPosition - targetPos ) <= 0.5 ) {
				curPosition = targetPos;
				handleDestination();
			}
		}
		// ease position to target
		return curPosition -= ( ( curPosition - targetPos ) / PAGED_EASING_FACTOR );
	};

	var getSpeedToReachDestination = function( distance ) {
	  console.log('getSpeedToReachDestination --------');
	  console.log(distance+' / '+ ( ( _non_paged_friction ) * ( 1 / ( 1 - _non_paged_friction ) ) ));
		return distance / ( ( _non_paged_friction ) * ( 1 / ( 1 - _non_paged_friction ) ) );
	};

	var checkForClosestIndex = function() {
		// set closest index and update indicator
		var closestIndex = Math.round( _cur_position[ _axis ] / -_container_size[ _length ] );
		if( _closest_scroll_index != closestIndex ) {
			_closest_scroll_index = closestIndex;
			closestIndexChanged();
		}
	};

	var closestIndexChanged = function() {
		if( _closest_scroll_index < 0 ) _closest_scroll_index = 0;
		if( _closest_scroll_index > _num_pages - 1 ) _closest_scroll_index = _num_pages - 1;
		if( _indicator ) _indicator.setIndex( _closest_scroll_index );
	};

	var handleDestination = function () {
	    // generally used by subclasses.
	    if( _indicator ) _indicator.setIndex( _page_index );
		if( _scroller_delegate ) _scroller_delegate.handleDestination();
	};

	var setOrientation = function( orientation ) {
		_orientation = orientation;
		if( _orientation == VERTICAL ) {
			_axis = 'y';
			_length = 'h';
			_cur_position.x = 0;
			_cur_position.y = _page_index * _container_size.h;
			setPage( _page_index, true );
		} else {
			_axis = 'x';
			_length = 'w';
			_cur_position.x = _page_index * _container_size.w;
			_cur_position.y = 0;
			setPage( _page_index, true );
		}
		calculateDimensions();
		if( _has_scroll_bar ) resizeScrollbar();
	};

	var setIsPaged = function( isPaged ) {
		_is_paged = isPaged;
	};

	var setPage = function ( index, immediately ) {
		_page_index = index;
		if (immediately) _cur_position[ _axis ] = _page_index * -_container_size[ _length ];
	};

	var prevPage = function ( immediately ) {
		_page_index = ( _page_index > 0 ) ? _page_index - 1 : 0;
		if (immediately) _cur_position[ _axis ] = _page_index * -_container_size[ _length ];
		if( _has_scroll_bar ) showScrollbar();
	};

	var nextPage = function ( immediately ) {
		_page_index = ( _page_index < _num_pages - 1 ) ? _page_index + 1 : _num_pages - 1;
		if (immediately) _cur_position[ _axis ] = _page_index * -_container_size[ _length ];
		if( _has_scroll_bar ) showScrollbar();
	};

	var scrollToEnd = function () {
		var offsetToEnd = _cur_position[ _axis ] - _end_position;
		setOffsetPosition( offsetToEnd );
	};

	var scrollToTop = function () {
		setOffsetPosition( _cur_position[ _axis ] );
	};

	var setOffsetPosition = function ( offsetFromCurPosition ) {
		_speed = getSpeedToReachDestination( offsetFromCurPosition );	//  - _cur_position[ _axis ]
    // console.log('setOffsetPosition() :: offsetFromCurPosition = '+offsetFromCurPosition);
    // console.log('setOffsetPosition() :: _speed = '+_speed);
		if( _has_scroll_bar ) showScrollbar();
	};

	var updateOnResize = function() {
		setPage( _page_index, true );
	};

	var getCurScrollPosition = function() {
		return _cur_position[ _axis ];
	};

	var setIsHardwareAcceleratedCSS = function( isAccelerated ) {
		if( isAccelerated ) {
			_css_helper.convertToWebkitPositioning( _element_inner );
			_css_helper.convertToWebkitPositioning( _scroll_bar_pill );
		} else {
			_css_helper.convertToNativePositioning( _element_inner );
			_css_helper.convertToNativePositioning( _scroll_bar_pill );
		}
		_css_helper.update2DPosition( _element_inner, _cur_position.x, _cur_position.y );
	};

	var getIsHardwareAcceleratedCSS = function() {
		return _css_helper.getWebKitCSSEnabled();
	};

	var setNonPagedFrictionIsShort = function( isShort ) {
		_non_paged_friction = ( isShort ) ? NON_PAGED_FRICTION_SHORT : NON_PAGED_FRICTION;
	};

	var setStayInBounds = function( shouldStayInBounds ) {
	  _stays_in_bounds = shouldStayInBounds;
	  if( _stays_in_bounds == true ) {
	    onEnd( null );  // make sure we slide back into bounds if we weren't already
	  }
	};

	var deactivate = function() {
		_timer_active = false;
		reset();
	};

	var activate = function() {
		if( _timer_active == false ) {
			_timer_active = true;
			runTimer();
		}
	};

	var reset = function() {
		_page_index = 0;
		_cur_position.x = 0;
		_cur_position.y = 0;
		_css_helper.update2DPosition( _element_inner, _cur_position.x, _cur_position.y );
	    if( _indicator ) _indicator.setIndex( _page_index );
		if( _has_scroll_bar ) updateScrollbarPosition( 0 );
	};

	var dispose = function() {
		_touch_tracker.dispose();
		delete _touch_tracker;

		if( _cursor ) _cursor.dispose();
		_cursor = null;
		_timer_active = false;
		_cur_position = null;
		_container_size = null;
		_content_size = null;
		_timer_active = false;

		if( _indicator ) {
			_indicator.dispose();
			delete _indicator;
		}
	};


	/* Scrollbar functionality ----------------------------- */

	var _scroll_bar = null,
		_scroll_bar_pill = null,
		_pill_position = 0,
		_pill_length = 0,
		_container_length = 0,
		_scroll_end_position = 0,
		_pill_overflow = 0,
		_scroll_pill_padding = 0,
		_scroll_bar_opacity = 0.5,
		_is_showing = false,
		_fade = false;

	var buildScrollbar = function( scrollBarContainer ) {
		// create div, set size and hide it
		_has_scroll_bar = true;
		_scroll_bar = scrollBarContainer;
		_scroll_bar_pill = _scroll_bar.childNodes[0];
	};

	var getStyle = function( el, styleProp ) {
		var style;
		if ( el.currentStyle )
			style = el.currentStyle[styleProp];
		else if (window.getComputedStyle)
			style = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
		return style;
	};

	var resizeScrollbar = function() {
		_scroll_pill_padding = ( _orientation == VERTICAL ) ? parseInt(getStyle(scrollBarContainer,'padding-top')) : parseInt(getStyle(scrollBarContainer,'padding-left'));
		_container_length = ( _orientation == VERTICAL ) ? _container_size.h : _container_size.w;
		_container_length -= _scroll_pill_padding * 2;
		_pill_length = ( _orientation == VERTICAL ) ? ( _container_length / _content_size.h ) * _container_length : ( _container_length / _content_size.w ) * _container_length;
		_scroll_end_position = _container_length - _pill_length;

		_scroll_bar.style.width = ( _orientation == HORIZONTAL ) ? _container_length + 'px' : '';
		_scroll_bar.style.height = ( _orientation == VERTICAL ) ? _container_length + 'px' : '';

		_scroll_bar.style.marginLeft = ( _orientation == HORIZONTAL ) ? _scroll_pill_padding + 'px' : '';
		_scroll_bar.style.marginTop = ( _orientation == VERTICAL ) ? _scroll_pill_padding + 'px' : '';

		updateScrollPillSize();
	};

	var updateScrollPillSize = function(){
		// check to see how far the pill has gone out-of-bounds
		_pill_overflow = 0;
		if( _pill_position < 0 ) _pill_overflow = -_pill_position;
		if( _pill_position > _scroll_end_position ) _pill_overflow = _pill_position - _scroll_end_position;

		// adjust pill size based on overflow
		var realPillLength = _pill_length - _pill_overflow;
		if( realPillLength > _container_length ) realPillLength = _container_length;

		// update element
		_scroll_bar_pill.style.width = ( _orientation == HORIZONTAL ) ? Math.round( realPillLength ) + 'px' : '';
		_scroll_bar_pill.style.height = ( _orientation == VERTICAL ) ? Math.round( realPillLength ) + 'px' : '';
	};

	var updateScrollbarPosition = function( scrollPosition ) {
		if( _scroll_bar && _scroll_bar_pill ) {
			// calculate the position of the scrollbar, relative to scroll content
			var distanceRatio = getPercentWithinRange( 0, _end_position, scrollPosition );
			_pill_position = Math.round( distanceRatio * ( _container_length - _pill_length ) );

			// create temporary location in case scrollbar is out of bounds
			var displayPillPosition = ( _pill_position > 0 ) ? _pill_position : 0;

			// position the scroll bar pill
			if( _orientation == VERTICAL ) {
				_css_helper.update2DPosition( _scroll_bar_pill, 0, displayPillPosition );
			} else {
				_css_helper.update2DPosition( _scroll_bar_pill, displayPillPosition, 0 );
			}

			// resize if dragging out of bounds
			updateScrollPillSize();
		}
	};

	var showScrollbar = function() {
		if( _is_showing == false ) {
			if( _container_size.h < _content_size.h || _container_size.w < _content_size.w ) {
				_is_showing = true;
				_scroll_bar_pill.style.display = 'block';
				_scroll_bar_pill.style.opacity = _scroll_bar_opacity;
			}
		}
	};

	var hideScrollbar = function() {
		if( _is_showing == true ) {
			_is_showing = false;
			_scroll_bar_pill.style.opacity = 0;
		}
	};

	var getPercentWithinRange = function( bottomRange, topRange, valueInRange ) {
		// normalize values to work off zero
		if( bottomRange < 0 ) {
			var addToAll = Math.abs( bottomRange );
			bottomRange += addToAll;
			topRange += addToAll;
			valueInRange += addToAll;
		} else if( bottomRange > 0 ) {
			var subFromAll = Math.abs( bottomRange );
			bottomRange -= subFromAll;
			topRange -= subFromAll;
			valueInRange -= subFromAll;
		}
		// simple calc to get percentage
		return ( valueInRange / ( topRange - bottomRange ) );
	};

	init();

	return {
		activate : activate,
		deactivate : deactivate,
		setOrientation : setOrientation,
		setIsPaged : setIsPaged,
		calculateDimensions : calculateDimensions,
		HORIZONTAL : HORIZONTAL,
		VERTICAL : VERTICAL,
		prevPage : prevPage,
		nextPage : nextPage,
		setPage : setPage,
		scrollToEnd : scrollToEnd,
		scrollToTop: scrollToTop,
		setOffsetPosition : setOffsetPosition,
		getCurScrollPosition : getCurScrollPosition,
		setIsHardwareAcceleratedCSS : setIsHardwareAcceleratedCSS,
		getIsHardwareAcceleratedCSS : getIsHardwareAcceleratedCSS,
		setNonPagedFrictionIsShort : setNonPagedFrictionIsShort,
		setStayInBounds : setStayInBounds,
		reset : reset,
		dispose : dispose
	};
};