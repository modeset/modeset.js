/**
 * Base touch tracking on an html element
 * @requires touch_tracker.js
 * @requires cursor.js
 * @requires css_helper.js
 */
var TouchScroller = function( element, elementInner, hasScrollBar, cursor, isPaged, defaultOrientation, scrollerDelegate, disableElements ) {
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
    var DECIDE_DIR_THRESHOLD = 15,
        PAST_BOUNDS_FRICTION = 0.2,
        BOUNCEBACK_FACTOR = -0.2,
        NON_PAGED_FRICTION_SHORT = 0.3,
        NON_PAGED_FRICTION = 0.8,
        _non_paged_friction = 0,
        _has_locked_drag_axis = false,
        _drag_lock_axis = false,
        _orientation = null,
        _was_dragged_beyond_bounds = false,
        _stays_in_bounds = true,
        _bounces = true,

        // touch helpers
        _cursor = cursor,
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
        _has_scroll_bar = false || hasScrollBar,
        _axis = null,   // will be x/y for ScrollerPosition
        _length = null; // will be w/h for ScrollerSize


    var init = function() {
        _css_helper = new CSSHelper();
        _touch_tracker = new MouseAndTouchTracker( element, touchUpdated, false, disableElements );

        _cur_position = new ScrollerPosition();
        _container_size = new ScrollerSize();
        _content_size = new ScrollerSize();

        if( _has_scroll_bar ) buildScrollbar();

        _drag_lock_axis = null;
        _non_paged_friction = NON_PAGED_FRICTION;
        setOrientation( defaultOrientation || TouchScroller.HORIZONTAL );
        calculateDimensions();

        activate();
    };

    var touchUpdated = function( state, touchEvent ) {
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

    var onStart = function( touchEvent ) {
        if( _timer_active == false ) return;
        showScrollbar();
        if( _scroller_delegate && _scroller_delegate.touchStart ) _scroller_delegate.touchStart();
    };

    var onMove = function( touchEvent ) {
        if( _timer_active == false ) return;
        if( !_has_locked_drag_axis ) {
            if( Math.abs( _touch_tracker.touchmoved.x ) > DECIDE_DIR_THRESHOLD ) {
                decideDragAxis( TouchScroller.HORIZONTAL );
            } else if( Math.abs( _touch_tracker.touchmoved.y ) > DECIDE_DIR_THRESHOLD ) {
                decideDragAxis( TouchScroller.VERTICAL );
            }
        } else {
            updatePositionFromTouch( ( _touch_tracker.touchmoved.x - _touch_tracker.touchmovedlast.x ), ( _touch_tracker.touchmoved.y - _touch_tracker.touchmovedlast.y ) );
        }

        // prevent page scrolling if we've locked on the opposite axis
        if( ( _orientation == TouchScroller.VERTICAL && _drag_lock_axis == TouchScroller.VERTICAL ) || ( _orientation == TouchScroller.HORIZONTAL && _drag_lock_axis == TouchScroller.HORIZONTAL ) ) {
            eventPreventDefault( touchEvent );
        }
        // disable touch event if allowed
        eventStopPropa( touchEvent );
    };

    var onEnd = function( touchEvent ) {
        if( _timer_active == false ) return;
        if( _touch_tracker.touchmoved.x != 0 && _touch_tracker.touchmoved.y != 0 ) {
            eventStopPropa( touchEvent );
        }
        // set flags and store last known page index before recalculating
        _has_locked_drag_axis = false;
        _drag_lock_axis = null;
        var prevIndex = _page_index;

        // get mouse speed for non-paged mode
        if( _touch_tracker.touchspeed[ _axis ] != 0 ) {
            var tossRightInBounds = ( _touch_tracker.touchspeed[ _axis ] > 0 && _cur_position[ _axis ] < 0 );
            var tossLeftInBounds = ( _touch_tracker.touchspeed[ _axis ] < 0 && _cur_position[ _axis ] > _end_position );
            if( tossRightInBounds || tossLeftInBounds ) {
                // apply speed after tossing if in-bounds
                _speed = -_touch_tracker.touchspeed[ _axis ];
            } else {
                // if dragging against the limit, don't add speed
                hideScrollbar();
            }
        } 
        // hide the scrollbar if touch was just a tap
        if( _touch_tracker.touchmoved[ _axis ] == 0 || _touch_tracker.touchspeed[ _axis ] == 0 ) {
            hideScrollbar();
        }

        sendBackInBounds();
        detectPageChangeOnTouchEnd( prevIndex );

        if( _scroller_delegate && _scroller_delegate.touchEnd ) _scroller_delegate.touchEnd();
    };

    var onEnter = function( touchEvent ) {

    };

    var onLeave = function( touchEvent ) {

    };

    var updateCursor = function( state ) {
        if( _cursor && _timer_active ) {
            switch( state ) {
                case MouseAndTouchTracker.state_start :
                    _cursor.setGrabHand();
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
                    if(_touch_tracker.is_touching) _cursor.setGrabHand();
                    else _cursor.setDefault();
                    break;
            }
        }
    };

    var runTimer = function() {
        if( _timer_active && _cur_position ) {
            calculateDimensions();
            if( !_touch_tracker.is_touching ) {
                updateWhileNotTouching();
            }

            checkForClosestIndex();

            // keep timer running - use requestAnimationFrame if available
            if( window.requestAnimationFrame ) {
                window.requestAnimationFrame( runTimer );
            } else {
                setTimeout( function() { runTimer(); }, _timer_fps );
            }
        }
    };

    var update2DPosition = function( element, x, y ){
        _css_helper.update2DPosition( element, x, y, 1, 0, false );
    };

    var calculateDimensions = function() {
        if( !_timer_active || !_container_size || !_element_outer ) return;
        
        var outerW = _element_outer.offsetWidth;
        var outerH = _element_outer.offsetHeight;
        var contentW = _element_inner.offsetWidth;
        var contentH = _element_inner.offsetHeight;

        if( contentW != _content_size.w || contentH != _content_size.h || outerW != _container_size.w || outerH != _container_size.h ) {
            _container_size.w = outerW;
            _container_size.h = outerH;
            _content_size.w = contentW;
            _content_size.h = contentH;
            _num_pages = Math.ceil( _content_size[ _length ] / _container_size[ _length ] );
            _end_position = _container_size[ _length ] - _content_size[ _length ];
            resizeScrollbar();
            _doesnt_need_scroll = ( _container_size[ _length ] > _content_size[ _length ] );
            if( _page_index > _num_pages - 1 ) _page_index = _num_pages - 1;
            sendBackInBounds();
        }
    };

    var decideDragAxis = function( direction ) {
        _has_locked_drag_axis = true;
        _drag_lock_axis = direction;
    };

    // update scroll position
    var updatePositionFromTouch = function( moveX, moveY ) {
        // handle bounce-back and lessened swipe-ability at ends of scroll area
        var move = ( _axis == 'x' ) ? moveX : moveY;
        if( _cur_position[ _axis ] > 0 && _touch_tracker.touchspeed[ _axis ] > 0 ) {
            _cur_position[ _axis ] += move * PAST_BOUNDS_FRICTION;
        } else if( _cur_position[ _axis ] < _end_position && _touch_tracker.touchspeed[ _axis ] < 0 ) {
            _cur_position[ _axis ] += move * PAST_BOUNDS_FRICTION;
        } else {
            _cur_position[ _axis ] += move;
        }
        if( !_bounces ) {
            if( _cur_position[ _axis ] < _end_position ) _cur_position[ _axis ] = _end_position
            if( _cur_position[ _axis ] > 0 ) _cur_position[ _axis ] = 0
        }
        update2DPosition( _element_inner, _cur_position.x, _cur_position.y );
        if( _scroller_delegate && _scroller_delegate.updatePosition ) _scroller_delegate.updatePosition( _cur_position.x, _cur_position.y, true );
        updateScrollbar();
    };

    var updateWhileNotTouching = function() {
        var curX = _cur_position.x;
        var curY = _cur_position.y;
        var isDirty = false;
        // update position and set dirty flag if the position has actually moved
        if( _is_paged == true ) {
            // ease to the cosest index while not touching
            easeToIndex();
        } else {
            // slide it and apply friction
            applyInertia();
        }
        if( curX != _cur_position.x || curY != _cur_position.y ) isDirty = true;
        // hide scrollbar and set speed to zero when it eases close enough
        if( Math.abs( _speed ) <= 0.01 && _speed != 0 ) {
            handleDestination();
            _speed = 0;
            hideScrollbar();
        } else {
            if( _scroller_delegate && _scroller_delegate.updatePosition && isDirty ) _scroller_delegate.updatePosition( _cur_position.x, _cur_position.y, false );
        }
        if( isDirty ) {
            update2DPosition( _element_inner, _cur_position.x, _cur_position.y );
            updateScrollbar();
        }
    }

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
                // _speed *= BOUNCEBACK_FACTOR;
                _speed = 0;
                hideScrollbar();
            } else if( _cur_position[ _axis ] < _end_position ) {
                _cur_position[ _axis ] = _end_position;
                // _speed *= BOUNCEBACK_FACTOR;
                _speed = 0;
                hideScrollbar();
            }
        }
        // check to see if content is back in bounds after sliding off
        if ( _cur_position[ _axis ] < 0 && _cur_position[ _axis ] > _end_position ) {
            _was_dragged_beyond_bounds = false;
        }
    };

    var sendBackInBounds = function() {
        // calculate speed to get back to edge if content was dragged out-of-bounds
        if( _stays_in_bounds == true && _bounces ) {
            if( _cur_position[ _axis ] - _speed > 0 || _cur_position[ _axis ] - _speed < _end_position || _doesnt_need_scroll ) {
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
    };

    var detectPageChangeOnTouchEnd = function( prevIndex ) {
        // snap to page and constrain page calculation
        if( _is_paged == true ) {
            var pageChanged = false;
            // have we swiped far enough to turn the page
            if( _touch_tracker.touchmoved[ _axis ] > _container_size[ _length ] * PAGE_TURN_RATIO ) {
                _page_index = ( _page_index == 0 ) ? 0 : _page_index - 1;
                pageChanged = true;
            } else if ( _touch_tracker.touchmoved[ _axis ] < -_container_size[ _length ] * PAGE_TURN_RATIO ) {
                _page_index = ( _page_index < _num_pages - 1 ) ? _page_index + 1 : _num_pages - 1;
                pageChanged = true;
            }

            // checks whether we've gone more than halfway to a page, or allows above code to let us swipe slightly for next/prev pages
            if( !( prevIndex == _closest_scroll_index && prevIndex != _page_index ) ) {
                _page_index = _closest_scroll_index;
                pageChanged = true;
            }

            if( pageChanged == true ) {
              if( _scroller_delegate && _scroller_delegate.pageChanged ) _scroller_delegate.pageChanged( _page_index );
            }
        }
    };

    var updateScrollbar = function() {
        if( _orientation == TouchScroller.VERTICAL ) {
            updateScrollbarPosition( _cur_position.y );
        } else {
            updateScrollbarPosition( _cur_position.x );
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
        if( _scroller_delegate && _scroller_delegate.closestIndexChanged ) _scroller_delegate.closestIndexChanged(_closest_scroll_index);
    };

    var handleDestination = function () {
        hideScrollbar();
        _cur_position.x = Math.round( _cur_position.x );
        _cur_position.y = Math.round( _cur_position.y );
        if( _scroller_delegate && _scroller_delegate.handleDestination ) _scroller_delegate.handleDestination();
    };

    var setOrientation = function( orientation ) {
        _orientation = orientation;
        if( _orientation == TouchScroller.VERTICAL ) {
            removeClassName( _element_outer, TouchScroller.HORIZONTAL );
            addClassName( _element_outer, TouchScroller.VERTICAL );
            _axis = 'y';
            _length = 'h';
            _cur_position.y = ( _is_paged ) ? _page_index * _container_size.h : _cur_position.x;
            _cur_position.x = 0;
            if( _is_paged ) setPage( _page_index, true );
        } else {
            removeClassName( _element_outer, TouchScroller.VERTICAL );
            addClassName( _element_outer, TouchScroller.HORIZONTAL );
            _axis = 'x';
            _length = 'w';
            _cur_position.x = ( _is_paged ) ? _page_index * _container_size.w : _cur_position.y;
            _cur_position.y = 0;
            if( _is_paged ) setPage( _page_index, true );
        }
        calculateDimensions();
        resizeScrollbar();
    };

    var setBounces = function( bounces ) {
        _bounces = bounces;
    };

    var setIsPaged = function( isPaged ) {
        _is_paged = isPaged;
    };

    var setPage = function ( index, immediately ) {
        if( _timer_active == false ) return;
        _page_index = index;
        if (immediately) {
            calculateDimensions();
            _cur_position[ _axis ] = _page_index * -_container_size[ _length ];
            _cur_position[ _axis ] += 1; // makes sure it snaps back to place, given the easing/isDirty check above
        }
    };

    var getPage = function () {
        return ( _is_paged ) ? _page_index : -1;
    };

    var getNumPages = function() {
        return ( _is_paged ) ? _num_pages : -1;
    };

    var getScrollLength = function() {
        return _end_position;
    };

    var prevPage = function ( loops, immediately ) {
        if( _timer_active == false ) return;
        if( loops == true && _page_index == 0 )
            _page_index = _num_pages - 1;
        else
            _page_index = ( _page_index > 0 ) ? _page_index - 1 : 0;
        if (immediately) _cur_position[ _axis ] = _page_index * -_container_size[ _length ];
        showScrollbar();
    };

    var nextPage = function ( loops, immediately ) {
        if( _timer_active == false ) return;
        if( loops == true && _page_index == _num_pages - 1 )
            _page_index = 0;
        else
            _page_index = ( _page_index < _num_pages - 1 ) ? _page_index + 1 : _num_pages - 1;
        if (immediately) _cur_position[ _axis ] = _page_index * -_container_size[ _length ];
        showScrollbar();
    };

    var scrollToEnd = function () {
        var offsetToEnd = _cur_position[ _axis ] - _end_position;
        setOffsetPosition( offsetToEnd );
    };

    var scrollToTop = function () {
        setOffsetPosition( _cur_position[ _axis ] );
    };

    var scrollToPosition = function ( position ) {
        var offsetToPosition = _cur_position[ _axis ] - position;
        setOffsetPosition( offsetToPosition );
    };

    var setOffsetPosition = function ( offsetFromCurPosition ) {
        _speed = getSpeedToReachDestination( offsetFromCurPosition );   //  - _cur_position[ _axis ]
        showScrollbar();
    };

    var updateOnResize = function() {
        setPage( _page_index, true );
    };

    var getCurScrollPosition = function() {
        return _cur_position[ _axis ];
    };

    var getCurScrollPercent = function() {
        return _cur_position[ _axis ] / _end_position;
    };

    var setIsHardwareAcceleratedCSS = function( isAccelerated ) {
        if( isAccelerated ) {
            _css_helper.convertToWebkitPositioning( _element_inner );
            _css_helper.convertToWebkitPositioning( _scroll_bar_pill );
        } else {
            _css_helper.convertToNativePositioning( _element_inner );
            _css_helper.convertToNativePositioning( _scroll_bar_pill );
        }
        update2DPosition( _element_inner, _cur_position.x, _cur_position.y );
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

    var setScrollerDelegate = function( delegate ){
        _scroller_delegate = delegate;
    };

    var deactivate = function() {
        _timer_active = false;
        hideScrollbar();
        if( _cursor ) _cursor.setDefault();
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
        update2DPosition( _element_inner, _cur_position.x, _cur_position.y );
        updateScrollbarPosition( 0 );
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

        removeElement( _scroll_bar );
        _scroll_bar = false;
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

    var buildScrollbar = function() {
        _has_scroll_bar = true;
        // create divs for scrollbar
        _scroll_bar = document.createElement('div');
        _scroll_bar.className = 'scroll_bar';
        _scroll_bar_pill = document.createElement('div');
        _scroll_bar_pill.className = 'scroll_bar_pill';
        _scroll_bar.appendChild(_scroll_bar_pill);
        _element_outer.appendChild(_scroll_bar);
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
        if( !_has_scroll_bar ) return;

        _scroll_pill_padding = ( _orientation == TouchScroller.VERTICAL ) ? parseInt(getStyle(_scroll_bar,'padding-top')) : parseInt(getStyle(_scroll_bar,'padding-left'));
        if( isNaN( _scroll_pill_padding ) ) _scroll_pill_padding = 0;
        _container_length = ( _orientation == TouchScroller.VERTICAL ) ? _container_size.h : _container_size.w;
        _container_length -= _scroll_pill_padding * 2;
        _pill_length = ( _orientation == TouchScroller.VERTICAL ) ? ( _container_length / _content_size.h ) * _container_length : ( _container_length / _content_size.w ) * _container_length;
        _scroll_end_position = _container_length - _pill_length;

        _scroll_bar.style.width = ( _orientation == TouchScroller.HORIZONTAL ) ? _container_length + 'px' : '';
        _scroll_bar.style.height = ( _orientation == TouchScroller.VERTICAL ) ? _container_length + 'px' : '';

        _scroll_bar.style.marginLeft = ( _orientation == TouchScroller.HORIZONTAL ) ? _scroll_pill_padding + 'px' : '';
        _scroll_bar.style.marginTop = ( _orientation == TouchScroller.VERTICAL ) ? _scroll_pill_padding + 'px' : '';

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
        if( isNaN( realPillLength ) ) realPillLength = 0;

        // update element
        _scroll_bar_pill.style.width = ( _orientation == TouchScroller.HORIZONTAL ) ? Math.round( realPillLength ) + 'px' : '';
        _scroll_bar_pill.style.height = ( _orientation == TouchScroller.VERTICAL ) ? Math.round( realPillLength ) + 'px' : '';
    };

    var updateScrollbarPosition = function( scrollPosition ) {
        if( !_has_scroll_bar ) return;
        if( _scroll_bar && _scroll_bar_pill ) {
            // calculate the position of the scrollbar, relative to scroll content
            var distanceRatio = getPercentWithinRange( 0, _end_position, scrollPosition );
            _pill_position = Math.round( distanceRatio * ( _container_length - _pill_length ) );

            // create temporary location in case scrollbar is out of bounds
            var displayPillPosition = ( _pill_position > 0 ) ? _pill_position : 0;

            // position the scroll bar pill
            if( _orientation == TouchScroller.VERTICAL ) {
                update2DPosition( _scroll_bar_pill, 0, displayPillPosition );
            } else {
                update2DPosition( _scroll_bar_pill, displayPillPosition, 0 );
            }

            // resize if dragging out of bounds
            updateScrollPillSize();
        }
    };

    var showScrollbar = function() {
        if( !_has_scroll_bar || _timer_active == false || _is_showing == true || !_container_size ) return;
        if( _container_size.h < _content_size.h || _container_size.w < _content_size.w ) {
            _is_showing = true;
            addClassName( _scroll_bar_pill, 'showing' );
        }
    };

    var hideScrollbar = function() {
        if( !_has_scroll_bar || _is_showing == false ) return;
        _is_showing = false;
        removeClassName( _scroll_bar_pill, 'showing' );
    };

    // DOM/Math utility methods -------------------------------------

    var eventPreventDefault = function( touchEvent ) {
        if(touchEvent && typeof touchEvent !== 'undefined' && touchEvent.preventDefault && typeof touchEvent.preventDefault !== 'undefined') touchEvent.preventDefault();
    };

    var eventStopPropa = function( touchEvent ) {
        if(touchEvent && typeof touchEvent !== 'undefined' && touchEvent.stopPropagation && typeof touchEvent.stopPropagation !== 'undefined') touchEvent.stopPropagation();
    };

    var getPercentWithinRange = function( bottomRange, topRange, valueInRange ) {
        topRange += -bottomRange;
        valueInRange += -bottomRange;
        bottomRange += -bottomRange;  // last to not break other offsets
        // return percentage or normalized values 
        return ( valueInRange / ( topRange - bottomRange ) );
    };

    var hasClassName = function(element, className) {
        var regExp = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
        return regExp.test(element.className);
    };

    var addClassName = function(element, className) {
        if (!hasClassName(element, className))
            element.className = [element.className, className].join(' ');
    };

    var removeClassName = function(element, className) {
        if (hasClassName(element, className)) {
            var regExp = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)', 'g');
            var curClasses = element.className;
            element.className = curClasses.replace(regExp, ' ');
        }
    };

    var removeElement = function( elem ) {
        if( elem && elem.parentNode ) {
            elem.parentNode.removeChild( elem );
        }
    };

    init();

    return {
        activate : activate,
        deactivate : deactivate,
        setOrientation : setOrientation,
        setBounces : setBounces,
        setIsPaged : setIsPaged,
        prevPage : prevPage,
        nextPage : nextPage,
        setPage : setPage,
        getPage : getPage,
        getNumPages : getNumPages,
        getScrollLength : getScrollLength,
        scrollToEnd : scrollToEnd,
        scrollToTop: scrollToTop,
        scrollToPosition : scrollToPosition,
        setOffsetPosition : setOffsetPosition,
        getCurScrollPosition : getCurScrollPosition,
        getCurScrollPercent : getCurScrollPercent,
        setIsHardwareAcceleratedCSS : setIsHardwareAcceleratedCSS,
        getIsHardwareAcceleratedCSS : getIsHardwareAcceleratedCSS,
        setNonPagedFrictionIsShort : setNonPagedFrictionIsShort,
        setStayInBounds : setStayInBounds,
        showScrollbar : showScrollbar,
        setScrollerDelegate : setScrollerDelegate,
        reset : reset,
        dispose : dispose
    };
};

TouchScroller.HORIZONTAL = 'horizontal';
TouchScroller.VERTICAL = 'vertical';
