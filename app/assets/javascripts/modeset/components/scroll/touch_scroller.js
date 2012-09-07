/**
 * Base touch tracking on an html element
 * @requires touch_tracker.js
 * @requires cursor.js
 * @requires css_helper.js
 */
var TouchScroller = function( element, elementInner, hasScrollBar, cursor, isPaged, defaultOrientation, scrollerDelegate, disableElements ) {
    // internal positioning & size objects
    var Size2d = function( w, h ) {
        this.w = w || 0;
        this.h = h || 0;
    };

    var Position2d = function( x, y ) {
        this.x = x || 0;
        this.y = y || 0;
    };

    // directional locking constants and state vars
    var DECIDE_DIR_THRESHOLD = 15,
        PAST_BOUNDS_FRICTION = 0.2,
        BOUNCEBACK_FACTOR = -0.2,
        NON_PAGED_FRICTION_SHORT = 0.3,
        NON_PAGED_FRICTION = 0.8,
        BEYOND_BOUNDS_FRICTION = 0.4,
        AXIS_X = 'x',
        AXIS_Y = 'y',
        SIZE_W = 'w',
        SIZE_H = 'h',
        _has_locked_drag_axis = false,
        _drag_lock_axis = null,
        _orientation = defaultOrientation,
        _stays_in_bounds = true,
        _was_dragged_beyond_bounds = new Position2d( false, false ),
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
        _speed = new Position2d(),
        _cur_position = new Position2d(),
        _end_position = new Position2d(),
        _container_size = new Size2d(),
        _content_size = new Size2d(),

        // deal with pages
        PAGED_EASING_FACTOR = 5,
        PAGE_TURN_RATIO = 0.2,
        _is_paged = isPaged,

        _doesnt_need_scroll = new Position2d( false, false ),
        _num_pages = new Position2d(),
        _page_index = new Position2d(),
        _closest_scroll_index = new Position2d(),

        _timer_fps = 33,
        _timer_active = false,

        // deal with direction of scroller
        _has_scroll_bar = false || hasScrollBar,
        _scrollbars = null,
        _axis = null,   // will be x/y for Position2d
        _length = null, // will be w/h for Size2d
        _scrollsX = false,
        _scrollsY = false;


    var init = function() {
        _css_helper = new CSSHelper();
        _touch_tracker = new MouseAndTouchTracker( element, touchUpdated, false, disableElements );
        if( _has_scroll_bar ) _scrollbars = new Position2d( new ScrollBar( AXIS_X, SIZE_W ), new ScrollBar( AXIS_Y, SIZE_H ) );

        setOrientation( _orientation );
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
        showScrollbars();
        if( _scroller_delegate && _scroller_delegate.touchStart ) _scroller_delegate.touchStart();
    };

    var onMove = function( touchEvent ) {
        if( _timer_active == false ) return;
        // if we're locked to an axis, drag a bit before deciding to scroll, then preventDefault on the touch event below to allow page scrolling in the non-locked axis directino
        if( !_has_locked_drag_axis && _orientation != TouchScroller.UNLOCKED ) {
            if( Math.abs( _touch_tracker.touchmoved.x ) > DECIDE_DIR_THRESHOLD ) decideDragAxis( TouchScroller.HORIZONTAL );
            else if( Math.abs( _touch_tracker.touchmoved.y ) > DECIDE_DIR_THRESHOLD ) decideDragAxis( TouchScroller.VERTICAL );
        } else {
            // scroll once we've decided a direction
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
        // cancel clickthrough if touch moved. theoretically should allow clicks to go through, but right now this might not work on Android
        if( _touch_tracker.touchmoved.x != 0 && _touch_tracker.touchmoved.y != 0 ) eventStopPropa( touchEvent );

        // set flags and store last known page index before recalculating
        _has_locked_drag_axis = false;
        _drag_lock_axis = null;
        var prevIndexX = _page_index.x;
        var prevIndexY = _page_index.y;

        // get mouse speed for non-paged mode
        var speedX = getTouchSpeedForAxis( AXIS_X );
        var speedY = getTouchSpeedForAxis( AXIS_Y );
        // if dragging against the boundaries (no toss speed), hide scroller?? hmm..
        if( speedX == false && speedY == false ) hideScrollbars();

        // hide the scrollbar if touch was just a tap
        if( ( _touch_tracker.touchmoved.x == 0 && _touch_tracker.touchmoved.y == 0 ) || ( speedX == 0 && speedY == 0 ) ) {
            hideScrollbars();
        }

        sendBackInBounds( AXIS_X );
        sendBackInBounds( AXIS_Y );
        detectPageChangeOnTouchEnd( prevIndexX, AXIS_X );
        detectPageChangeOnTouchEnd( prevIndexY, AXIS_Y );

        if( _scroller_delegate && _scroller_delegate.touchEnd ) _scroller_delegate.touchEnd();
    };

    var getTouchSpeedForAxis = function( axis ) {
        if( _touch_tracker.touchspeed[ axis ] != 0 ) {
            var tossStartInBounds = ( _touch_tracker.touchspeed[ axis ] > 0 && _cur_position[ axis ] < 0 );
            var tossEndInBounds = ( _touch_tracker.touchspeed[ axis ] < 0 && _cur_position[ axis ] > _end_position[ axis ] );
            _speed[ axis ] = -_touch_tracker.touchspeed[ axis ];
            if( tossStartInBounds || tossEndInBounds ) {
                // apply speed after tossing if in-bounds
                return _speed[ axis ];
            } else {
                return false;
            }
        } else {
            _speed[ axis ] = 0;
        }
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

            if( _scrollsX ) checkForClosestIndex( AXIS_X, SIZE_W );
            if( _scrollsY ) checkForClosestIndex( AXIS_Y, SIZE_H );

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
            _end_position.x = _container_size.w - _content_size.w;
            _end_position.y = _container_size.h - _content_size.h;
            _num_pages.x = Math.ceil( _content_size.w / _container_size.w );
            _num_pages.y = Math.ceil( _content_size.h / _container_size.h );
            _doesnt_need_scroll.x = ( _container_size.w > _content_size.w );
            _doesnt_need_scroll.y = ( _container_size.h > _content_size.h );
            if( _page_index.x > _num_pages.x - 1 ) _page_index.x = _num_pages.x - 1;
            if( _page_index.y > _num_pages.y - 1 ) _page_index.y = _num_pages.y - 1;
            if( _scrollsX ) sendBackInBounds( AXIS_X );
            if( _scrollsY ) sendBackInBounds( AXIS_Y );
            if( _scrollsX ) _scrollbars.x.resizeScrollbar();
            if( _scrollsY ) _scrollbars.y.resizeScrollbar();
        }
    };

    var decideDragAxis = function( direction ) {
        _has_locked_drag_axis = true;
        _drag_lock_axis = direction;
    };

    // update scroll position
    var updatePositionFromTouch = function( moveX, moveY ) {
        // update position for either/both axis depending on orientation mode
        ( _scrollsX ) ? updateAxisPosition( AXIS_X, moveX ) : constrainContent( AXIS_X );
        ( _scrollsY ) ? updateAxisPosition( AXIS_Y, moveY ) : constrainContent( AXIS_Y );

        // update DOM and report back
        update2DPosition( _element_inner, _cur_position.x, _cur_position.y );
        updateScrollbar();
        if( _scroller_delegate && _scroller_delegate.updatePosition ) _scroller_delegate.updatePosition( _cur_position.x, _cur_position.y, true );
    };

    var updateAxisPosition = function( axis, axisTouchMove ) {
        // handle bounce-back and lessened swipe-ability at ends of scroll area
        if( _cur_position[ axis ] > 0 && _touch_tracker.touchspeed[ axis ] > 0 ) {
            _cur_position[ axis ] += axisTouchMove * PAST_BOUNDS_FRICTION;
        } else if( _cur_position[ axis ] < _end_position[ axis ] && _touch_tracker.touchspeed[ axis ] < 0 ) {
            _cur_position[ axis ] += axisTouchMove * PAST_BOUNDS_FRICTION;
        } else {
            _cur_position[ axis ] += axisTouchMove;
        }
        if( !_bounces ) {
            if( _cur_position[ axis ] < _end_position[ axis ] ) _cur_position[ axis ] = _end_position[ axis ]
            if( _cur_position[ axis ] > 0 ) _cur_position[ axis ] = 0
        }
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
        if( hasSlowedToStop( null ) ) {
            handleDestination();
            _speed.x = _speed.y = 0;
        } else {
            if( _scroller_delegate && _scroller_delegate.updatePosition && isDirty ) _scroller_delegate.updatePosition( _cur_position.x, _cur_position.y, false );
        }
        if( isDirty ) {
            update2DPosition( _element_inner, _cur_position.x, _cur_position.y );
            updateScrollbar();
        }
    }

    var hasSlowedToStop = function( axis ) {
        if( axis ) {
            return hasSlowedToStopForAxis( axis );
        } else {
            return ( hasSlowedToStopForAxis( AXIS_X ) && hasSlowedToStopForAxis( AXIS_Y ) );
        }
    };

    var hasSlowedToStopForAxis = function( axis ) {
        return (Math.abs( _speed[ axis ] ) <= 0.1);
    };

    var easeToIndex = function() {
        ( _scrollsX ) ? easeToIndexForAxis( AXIS_X, SIZE_W ) : constrainContent( AXIS_X );
        ( _scrollsY ) ? easeToIndexForAxis( AXIS_Y, SIZE_H ) : constrainContent( AXIS_Y );
    };

    var easeToIndexForAxis = function( axis, dimension ) {
        var lastLoc = _cur_position[ axis ];
        _cur_position[ axis ] = getNextEasedLocation( _page_index[ axis ], _cur_position[ axis ], _container_size[ dimension ] );
        _speed[ axis ] = Math.abs( _cur_position[ axis ] - lastLoc );
    };

    var applyInertia = function() {
        ( _scrollsX ) ? applyInertiaForAxis( AXIS_X ) : constrainContent( AXIS_X );
        ( _scrollsY ) ? applyInertiaForAxis( AXIS_Y ) : constrainContent( AXIS_Y );
    };

    var applyInertiaForAxis = function( axis ) {
        _speed[ axis ] *= NON_PAGED_FRICTION;
        _cur_position[ axis ] -= _speed[ axis ];

        // reverse direction if inertia has brought the content out of bounds
        var headingOutOfBounds = ( ( _cur_position[ axis ] > 0 && _speed[ axis ] < 0 ) || ( _cur_position[ axis ] < _end_position[ axis ] && _speed[ axis ] > 0 ) );
        if( headingOutOfBounds ) {
            if( _bounces ) {
                _speed[ axis ] *= BEYOND_BOUNDS_FRICTION;
                if( hasSlowedToStop( axis ) ) {
                    sendBackInBounds( axis );
                }
            } else {
                _speed[ axis ] = 0;
                constrainContent( axis );
            }
        }
        // check to see if content is back in bounds after sliding off
        if ( _cur_position[ axis ] < 0 && _cur_position[ axis ] > _end_position[ axis ] ) {
            _was_dragged_beyond_bounds[ axis ] = false;
        }
    };

    var constrainContent = function( axis ) {
        if( _cur_position[ axis ] > 0 ) _cur_position[ axis ] = 0;
        if( _cur_position[ axis ] < _end_position[ axis ] ) _cur_position[ axis ] = _end_position[ axis ];
    };

    var sendBackInBounds = function( axis ) {
        // calculate speed to get back to edge if content was dragged out-of-bounds
        if( _stays_in_bounds == true && _bounces ) {
            if( isOutOfBoundsForAxis( axis ) || _doesnt_need_scroll[ axis ] ) {
                _was_dragged_beyond_bounds[ axis ] = true;
                var distanceFromEdge = 0;

                // apply speed so we can treat it as if we dragged as far as the drag speed added
                _cur_position[ axis ] -= _speed[ axis ];

                // send back to top, or bottom
                if( _cur_position[ axis ] > 0 || _doesnt_need_scroll[ axis ] == true )
                  distanceFromEdge = _cur_position[ axis ];
                else if( _cur_position[ axis ] < _end_position[ axis ] )
                  distanceFromEdge = _cur_position[ axis ] - _end_position[ axis ];

                // solve for initial speed, given distance and friction
                if( distanceFromEdge != 0 ) {
                    _speed[ axis ] = getSpeedToReachDestination( distanceFromEdge );
                }
            }
        }
    };

    var isOutOfBoundsForAxis = function( axis ) {
        return _cur_position[ axis ] - _speed[ axis ] > 0 || _cur_position[ axis ] - _speed[ axis ] < _end_position[ axis ];
    };

    var detectPageChangeOnTouchEnd = function( prevIndex, axis ) {
        // snap to page and constrain page calculation
        if( _is_paged == true ) {
            var dimension = getDimensionForAxis( axis );
            var pageChanged = false;
            // have we swiped far enough to turn the page
            if( _touch_tracker.touchmoved[ axis ] > _container_size[ dimension ] * PAGE_TURN_RATIO ) {
                _page_index[ axis ] = ( _page_index[ axis ] == 0 ) ? 0 : _page_index[ axis ] - 1;
                pageChanged = true;
            } else if ( _touch_tracker.touchmoved[ axis ] < -_container_size[ dimension ] * PAGE_TURN_RATIO ) {
                _page_index[ axis ] = ( _page_index[ axis ] < _num_pages[ axis ] - 1 ) ? _page_index[ axis ] + 1 : _num_pages[ axis ] - 1;
                pageChanged = true;
            }

            // checks whether we've gone more than halfway to a page, or allows above code to let us swipe slightly for next/prev pages
            if( !( prevIndex == _closest_scroll_index[ axis ] && prevIndex != _page_index[ axis ] ) ) {
                _page_index[ axis ] = _closest_scroll_index[ axis ];
                pageChanged = true;
            }

            if( pageChanged == true ) {
                if( _scroller_delegate && _scroller_delegate.pageChanged ) _scroller_delegate.pageChanged( _page_index[ axis ], axis );
            }
        }
    };

    var updateScrollbar = function() {
        if( _scrollsX ) _scrollbars.x.updateScrollbarPosition( _cur_position.x );
        if( _scrollsY ) _scrollbars.y.updateScrollbarPosition( _cur_position.y );
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
        return distance / ( ( NON_PAGED_FRICTION ) * ( 1 / ( 1 - NON_PAGED_FRICTION ) ) );
    };

    var checkForClosestIndex = function( axis, dimension ) {
        // set closest index and update indicator
        var closestIndex = Math.round( _cur_position[ axis ] / -_container_size[ dimension ] );
        if( _closest_scroll_index[ axis ] != closestIndex ) {
            _closest_scroll_index[ axis ] = closestIndex;
            closestIndexChanged( axis );
        }
    };

    var closestIndexChanged = function( axis ) {
        if( _closest_scroll_index[ axis ] < 0 ) _closest_scroll_index[ axis ] = 0;
        if( _closest_scroll_index[ axis ] > _num_pages[ axis ] - 1 ) _closest_scroll_index[ axis ] = _num_pages[ axis ] - 1;
        if( _scroller_delegate && _scroller_delegate.closestIndexChanged ) _scroller_delegate.closestIndexChanged( _closest_scroll_index[ axis ], axis );
    };

    var handleDestination = function () {
        hideScrollbars();
        _cur_position.x = Math.round( _cur_position.x );
        _cur_position.y = Math.round( _cur_position.y );
        if( _scroller_delegate && _scroller_delegate.handleDestination ) _scroller_delegate.handleDestination();
    };

    var setOrientation = function( orientation ) {
        _orientation = orientation;
        if( _orientation == TouchScroller.VERTICAL ) {
            _scrollsX = false;
            _scrollsY = true;
            _length = SIZE_H;
            _cur_position.y = ( _is_paged ) ? _page_index.y * _container_size.h : _cur_position.x;
            _cur_position.x = 0;
            if( _is_paged ) setPage( _page_index.y, true );
        } else if( _orientation == TouchScroller.HORIZONTAL ) {
            _scrollsX = true;
            _scrollsY = false;
            _axis = AXIS_X;
            _length = SIZE_W;
            _cur_position.x = ( _is_paged ) ? _page_index.x * _container_size.w : _cur_position.y;
            _cur_position.y = 0;
            if( _is_paged ) setPage( _page_index.x, true );
        } else {
            _scrollsX = true;
            _scrollsY = true;
            _axis = null;
            _length = null;
        }
        calculateDimensions();
        update2DPosition( _element_inner, _cur_position.x, _cur_position.y );
        if( _scrollsX ) _scrollbars.x.resizeScrollbar();
        if( _scrollsY ) _scrollbars.y.resizeScrollbar();
        hideScrollbars();
    };

    var getDimensionForAxis = function( axis ) {
        if( axis == AXIS_X ) return SIZE_W;
        else if( axis == AXIS_Y ) return SIZE_H;
        else return null;
    };

    var setBounces = function( bounces ) {
        _bounces = bounces;
    };

    var showScrollbars = function() {
        if( _scrollsX ) _scrollbars.x.showScrollbar();
        if( _scrollsY ) _scrollbars.y.showScrollbar();
    };

    var hideScrollbars = function() {
        _scrollbars.x.hideScrollbar();
        _scrollbars.y.hideScrollbar();
    };

    var setIsPaged = function( isPaged ) {
        _is_paged = isPaged;
    };

    var setPage = function ( index, immediately, axis ) {
        var curAxis = ( _axis ) ? _axis : axis;
        if( !curAxis ) return;

        if( _timer_active == false ) return;
        _page_index[ axis ] = index;
        if (immediately) {
            calculateDimensions();
            _cur_position[ _axis ] = _page_index[ axis ] * -_container_size[ _length ];
            _cur_position[ _axis ] += 1; // makes sure it snaps back to place, given the easing/isDirty check above
        }
    };

    var getPage = function ( axis ) {
        var curAxis = ( _axis ) ? _axis : axis;
        if( !curAxis ) return;

        return ( _is_paged ) ? _page_index[ axis ] : -1;
    };

    var getNumPages = function ( axis ) {
        var curAxis = ( _axis ) ? _axis : axis;
        if( !curAxis ) return;

        return ( _is_paged ) ? _num_pages[ axis ] : -1;
    };

    var getScrollLength = function( axis ) {
        var curAxis = ( _axis ) ? _axis : axis;
        if( !curAxis ) return -1;
        return _end_position[ curAxis ];
    };

    var prevPage = function ( loops, immediately, axis ) {
        var curAxis = ( _axis ) ? _axis : axis;
        if( !curAxis ) return;

        if( _timer_active == false ) return;
        if( loops == true && _page_index[ axis ] == 0 )
            _page_index[ axis ] = _num_pages[ axis ] - 1;
        else
            _page_index[ axis ] = ( _page_index[ axis ] > 0 ) ? _page_index[ axis ] - 1 : 0;
        if (immediately) _cur_position[ curAxis ] = _page_index[ axis ] * -_container_size[ getDimensionForAxis( curAxis ) ];
        showScrollbars();
    };

    var nextPage = function ( loops, immediately, axis ) {
        var curAxis = ( _axis ) ? _axis : axis;
        if( !curAxis ) return;

        if( _timer_active == false ) return;
        if( loops == true && _page_index[ axis ] == _num_pages[ axis ] - 1 )
            _page_index[ axis ] = 0;
        else
            _page_index[ axis ] = ( _page_index[ axis ] < _num_pages[ axis ] - 1 ) ? _page_index[ axis ] + 1 : _num_pages[ axis ] - 1;
        if (immediately) _cur_position[ curAxis ] = _page_index[ axis ] * -_container_size[ getDimensionForAxis( curAxis ) ];
        showScrollbars();
    };

    var scrollToEnd = function ( axis ) {
        var curAxis = ( _axis ) ? _axis : axis;
        if( !curAxis ) return;

        var offsetToEnd = _cur_position[ curAxis ] - _end_position[ curAxis ];
        setOffsetPosition( offsetToEnd );
    };

    var scrollToTop = function ( axis ) {
        var curAxis = ( _axis ) ? _axis : axis;
        if( !curAxis ) return;

        setOffsetPosition( _cur_position[ curAxis ] );
    };

    var scrollToPosition = function ( position, axis ) {
        var curAxis = ( _axis ) ? _axis : axis;
        if( !curAxis ) return;

        var offsetToPosition = _cur_position[ curAxis ] - position;
        setOffsetPosition( offsetToPosition );
    };

    var scrollToPercent = function ( percent, axis ) {
        scrollToPosition( getScrollLength() * percent, axis );
    };

    var setOffsetPosition = function ( offsetFromCurPosition, axis ) {
        var curAxis = ( _axis ) ? _axis : axis;
        if( !curAxis ) return;

        _speed[ curAxis ] = getSpeedToReachDestination( offsetFromCurPosition );   //  - _cur_position[ _axis ]
        showScrollbars();
    };

    var updateOnResize = function() {
        setPage( _page_index.x, true, AXIS_X );
        setPage( _page_index.y, true, AXIS_Y );
    };

    var getCurScrollPosition = function() {
        return _cur_position[ _axis ];
    };

    var getCurScrollPercent = function() {
        return _cur_position[ _axis ] / _end_position[ _axis ];
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
        NON_PAGED_FRICTION = ( isShort ) ? NON_PAGED_FRICTION_SHORT : NON_PAGED_FRICTION;
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
        hideScrollbars();
        if( _cursor ) _cursor.setDefault();
    };

    var activate = function() {
        if( _timer_active == false ) {
            _timer_active = true;
            runTimer();
        }
    };

    var reset = function() {
        _page_index.x = 0;
        _page_index.y = 0;
        _cur_position.x = 0;
        _cur_position.y = 0;
        update2DPosition( _element_inner, _cur_position.x, _cur_position.y );
        _scrollbars.x.updateScrollbarPosition( 0 );
        _scrollbars.y.updateScrollbarPosition( 0 );
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

        hideScrollbars();
    };


    /* Scrollbar functionality ----------------------------- */

    var ScrollBar = function( axis, dimension ) {
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

        var init = function() {
            _has_scroll_bar = true;

            // create divs for scrollbar
            _scroll_bar = document.createElement('div');
            _scroll_bar.className = ( axis == AXIS_Y ) ? 'scroll_bar vertical' : 'scroll_bar horizontal';
            _scroll_bar_pill = document.createElement('div');
            _scroll_bar_pill.className = 'scroll_bar_pill';
            _scroll_bar.appendChild(_scroll_bar_pill);
            _element_outer.appendChild(_scroll_bar);
        };

        var resizeScrollbar = function() {
            if( !_has_scroll_bar ) return;

            _scroll_pill_padding = ( axis == AXIS_Y ) ? parseInt(getStyle(_scroll_bar,'padding-top')) : parseInt(getStyle(_scroll_bar,'padding-left'));
            if( isNaN( _scroll_pill_padding ) ) _scroll_pill_padding = 0;

            _container_length = ( axis == AXIS_Y ) ? _container_size[ dimension ] : _container_size[ dimension ];
            _container_length -= _scroll_pill_padding * 2;

            _pill_length = ( _container_length / _content_size[ dimension ] ) * _container_length;
            _scroll_end_position = _container_length - _pill_length;

            _scroll_bar.style.width = ( axis == AXIS_X ) ? _container_length + 'px' : '';
            _scroll_bar.style.height = ( axis == AXIS_Y ) ? _container_length + 'px' : '';

            _scroll_bar.style.marginLeft = ( axis == AXIS_X ) ? _scroll_pill_padding + 'px' : '';
            _scroll_bar.style.marginTop = ( axis == AXIS_Y ) ? _scroll_pill_padding + 'px' : '';

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
            _scroll_bar_pill.style.width = ( axis == AXIS_X ) ? Math.round( realPillLength ) + 'px' : '';
            _scroll_bar_pill.style.height = ( axis == AXIS_Y ) ? Math.round( realPillLength ) + 'px' : '';
        };

        var updateScrollbarPosition = function( scrollPosition ) {
            if( !_has_scroll_bar ) return;
            if( _scroll_bar && _scroll_bar_pill ) {
                // calculate the position of the scrollbar, relative to scroll content
                var distanceRatio = getPercentWithinRange( 0, _end_position[ axis ], scrollPosition );
                _pill_position = Math.round( distanceRatio * ( _container_length - _pill_length ) );

                // create temporary location in case scrollbar is out of bounds
                var displayPillPosition = ( _pill_position > 0 ) ? _pill_position : 0;

                // position the scroll bar pill
                if( axis == AXIS_Y ) {
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
            if( _container_size[ dimension ] < _content_size[ dimension ] || _container_size[ dimension ] < _content_size[ dimension ] ) {
                _is_showing = true;
                addClassName( _scroll_bar_pill, 'showing' );
            }
        };

        var hideScrollbar = function() {
            if( !_has_scroll_bar || _is_showing == false ) return;
            _is_showing = false;
            removeClassName( _scroll_bar_pill, 'showing' );
        };

        init();

        return {
            resizeScrollbar: resizeScrollbar,
            updateScrollbarPosition: updateScrollbarPosition,
            showScrollbar: showScrollbar,
            hideScrollbar: hideScrollbar
        }
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

    var getStyle = function( el, styleProp ) {
        var style;
        if ( el.currentStyle )
            style = el.currentStyle[styleProp];
        else if (window.getComputedStyle)
            style = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
        return style;
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
        scrollToPercent : scrollToPercent,
        setOffsetPosition : setOffsetPosition,
        getCurScrollPosition : getCurScrollPosition,
        getCurScrollPercent : getCurScrollPercent,
        setIsHardwareAcceleratedCSS : setIsHardwareAcceleratedCSS,
        getIsHardwareAcceleratedCSS : getIsHardwareAcceleratedCSS,
        setNonPagedFrictionIsShort : setNonPagedFrictionIsShort,
        setStayInBounds : setStayInBounds,
        showScrollbars : showScrollbars,
        setScrollerDelegate : setScrollerDelegate,
        reset : reset,
        dispose : dispose
    };
};

TouchScroller.HORIZONTAL = 'horizontal';
TouchScroller.VERTICAL = 'vertical';
TouchScroller.UNLOCKED = null;
