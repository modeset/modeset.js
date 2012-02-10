var ScrollViewPagedBase = Class.create(ScrollViewLocksDirection, {
	num_pages : 0,
	page_index : 0,
	closest_scroll_index : 0,
	easing_factor : 4,
	page_turn_ratio : 0.2,
	timer_active : false,
	timer_fps : 1000/30,
	
	initialize : function( $super, scrollContainer, scrollContentElement ) {
		$super( scrollContainer, scrollContentElement );
	},
	
	runTimer : function() {
    if( this.timer_active ) {
      // ease to the cosest index while not touching
      if( !this.touch_tracker.is_touching ) {
        this.easeToIndex(); // override easeToIndex to decide which axis to ease on
        platform_helper.update2DPosition( this.scroll_content, this.cur_position.x, this.cur_position.y );                     
      }
      this.checkForClosestIndex();

      // keep timer running
      var self = this;
      setTimeout( function() { self.runTimer(); }, this.timer_fps );
    }
	},
	
	updateFPS : function(e) {
    this.timer_fps = e.memo.fps;
	},

	getNextEasedLocation : function( pageIndex, curPosition, containerSize ) {
	  // get x-location based on current position
	  var targetPos = pageIndex * -containerSize;
		if( curPosition !== targetPos ) {
			if (Math.abs( curPosition - targetPos ) <= 0.5 ) {        
				curPosition = targetPos;
				this.handleDestination();
			}
		}
		// ease position to target
		return curPosition -= ( ( curPosition - targetPos ) / this.easing_factor );
	},
	
	checkForClosestIndex : function( position, containerSize ) {
		// set closest index and update indicator
		var closestIndex = Math.round( position / -containerSize );
		if( this.closest_scroll_index != closestIndex ) {
			this.closest_scroll_index = closestIndex;
			this.closestIndexChanged();
		}
	},
	
	closestIndexChanged : function() {
	    
	},
	
	deactivate : function() {
    this.timer_active = false;
    this.reset();
	},
	
	activate : function() {
    if( this.timer_active == false ) {
      this.timer_active = true;
      this.runTimer();
    }
	},
	
	reset : function() {
    this.page_index = 0;
    this.cur_position.x = 0;
    this.cur_position.y = 0;
    platform_helper.update2DPosition( this.scroll_content, this.cur_position.x, this.cur_position.y );  
	},
	
	dispose : function($super) {
		this.timer_active = false;
		$super();
	}
});


var ScrollViewPagedHorizontal = Class.create(ScrollViewPagedBase, {
	cancels_main_nav : false,
	indicator : false,
	vscroll_indicator : false,
	vscroll_indicator_disabled : false,
	closest_scroll_index : 0,
	axis : 'x',
	length : 'width',
	last_y : 0,
	speed : 0,
	
	initialize : function( $super, scrollContainer, scrollContentElement, indicator ) {
		$super( scrollContainer, scrollContentElement );

    this.indicator = indicator;
		
		this.activate();
	},
	
	setOrientation : function( orientation ){
	  if( orientation == this.VERTICAL ) {
    	this.axis = 'y';
    	this.length = 'height';
  	  if( !this.vscroll_indicator && !this.vscroll_indicator_disabled ) {
  	    this.vscroll_indicator = new VerticalScrollIndicator( this.touch_tracker.container, this.container_size.width, this.container_size.height, this.content_size.height );
      }
	  } else {
	    this.axis = 'x';
    	this.length = 'width';
	  }
	  // this expects the css on the inner/outer containers to have been set externally
	  this.calculateDimensions();
	},
	
	disableVScrollIndicator : function(){
	  this.vscroll_indicator_disabled = true;
	},
	
  setNewIndicator : function(indicator) {
    if (this.indicator) this.indicator.dispose();
    this.indicator = indicator;
  },
  
  easeToIndex : function() {
    this.cur_position[this.axis] = this.getNextEasedLocation( this.page_index, this.cur_position[this.axis], this.container_size[this.length] );
  },
  
  checkForClosestIndex : function( $super ) {
    $super( this.cur_position[this.axis], this.container_size[this.length] );
    
    if( this.vscroll_indicator ) {
      this.speed = this.cur_position.y - this.last_y;
  		this.last_y = this.cur_position.y;
      this.vscroll_indicator.update( this.cur_position.y );
  		if( Math.abs(this.speed) < 2 && !this.touch_tracker.is_touching ) if( this.vscroll_indicator ) this.vscroll_indicator.hide();
    }
  },
    
	closestIndexChanged : function( $super ) {
    $super();
    
    if( this.closest_scroll_index < 0 ) this.closest_scroll_index = 0;
    if( this.closest_scroll_index > this.num_pages - 1 ) this.closest_scroll_index = this.num_pages - 1;
    if( this.indicator ) this.indicator.setIndex( this.closest_scroll_index );
    
    // if( this.indicator ) this.indicator.setIndex( this.closest_scroll_index );
	},
	
	calculateDimensions : function( $super ) {
		$super();
		this.num_pages = Math.ceil( this.content_size[this.length] / this.container_size[this.length] );
		
		if( this.vscroll_indicator ) this.vscroll_indicator.resize( this.container_size.width, this.container_size.height, this.content_size.height );
	},
	
	updatePositionFromTouch : function( $super, moveX, moveY ) {
    // handle bounce-back and lessened swipe-ability at ends of scroll area
    
    var move = ( this.axis == 'x' ) ? moveX : moveY;
    if( this.scroll_enabled_x ) {
      if( this.cur_position[this.axis] > 0 && this.touch_tracker.touchmoved[this.axis] > 0 ) {
        this.cur_position[this.axis] += move * 0.3;
      } else if( this.cur_position[this.axis] < -(this.content_size[this.length] - this.container_size[this.length]) && this.touch_tracker.touchmoved[this.axis] < 0 ) {
        this.cur_position[this.axis] += move * 0.3;
      } else {
        this.cur_position[this.axis] += move;
      }
    }
    this.updatePositionCSS();
	},
	
	onStart : function($super, touchEvent) {
		$super( touchEvent );
		
		if( this.vscroll_indicator ) this.vscroll_indicator.show();
	},
	onMove : function($super, touchEvent) {
    // check that the mouse is within the boundaries, to ensure that events only fire while in-bounds. this may not always be the desired outcome...
    var relativeContainerX = this.touch_tracker.container_position[this.axis];
    // only pass along move event if inside container
    if( this.touch_lock_direction != this.VERTICAL ) {
    }
    $super( touchEvent );
	},
	onEnd : function($super, touchEvent) {
	  // store current index so we know if we've gone more than halfway or multiple pages away
		var prevIndex = this.page_index;
		
    // snap to page and constrain page calculation
		if( this.touch_tracker.touchmoved[this.axis] > this.container_size[this.length] * this.page_turn_ratio ) {
			this.page_index = ( this.page_index == 0 ) ? 0 : this.page_index - 1;
		} else if ( this.touch_tracker.touchmoved[this.axis] < -this.container_size[this.length] * this.page_turn_ratio ) {
			this.page_index = ( this.page_index < this.num_pages - 1 ) ? this.page_index + 1 : this.num_pages - 1;
		}

		// checks whether we've gone more than halfway, or allows above code to let us swipe slightly for next/prev pages
    if( !(prevIndex == this.closest_scroll_index && prevIndex != this.page_index) ) {
      this.page_index = this.closest_scroll_index;
    }
    
		$super( touchEvent );
	},
	handleDestination: function () {
    // generally used by subclasses.
    if( this.indicator ) this.indicator.setIndex( this.page_index );
	},
	setPage: function ( index, immediately ) {
    this.page_index = index;
    if (immediately) this.cur_position[this.axis] = this.page_index * -this.container_size[this.length];
	},
	prevPage: function ( immediately ) {
    this.page_index = ( this.page_index > 0 ) ? this.page_index - 1 : 0;
    if (immediately) this.cur_position[this.axis] = this.page_index * -this.container_size[this.length];
	},
	nextPage: function ( immediately ) {
    this.page_index = ( this.page_index < this.num_pages - 1 ) ? this.page_index + 1 : this.num_pages - 1;
    if (immediately) this.cur_position[this.axis] = this.page_index * -this.container_size[this.length];
	},
	updateOnResize : function() {
	  this.setPage( this.page_index, true );
	},
	reset : function( $super ) {
    $super();
    if( this.indicator ) this.indicator.setIndex( this.page_index );
	},
	dispose : function( $super ) {
    $super();
    if (this.indicator) {
      this.indicator.dispose();
      delete this.indicator;
    }
	}
});
