var VerticalContentScroller = Class.create(ScrollViewLocksDirection, {
	
	speed : 0,
	friction : 0.8,
	bounceback_factor : -0.2,
	timer_active : false,
	timer_fps : 1000/30,
	was_dragged_beyond_bounds : false,
	scroll_indicator : false,
		
	initialize : function( $super, scrollContainer, scrollContentElement ) {
		$super( scrollContainer, scrollContentElement );
		
		this.scroll_enabled_x = false;
		this.scroll_enabled_y = true;
		this.was_dragged_beyond_bounds = false;
		
		this.bottom_limit = this.container_size.height - this.content_size.height;
		
		this.scroll_indicator = new VerticalScrollIndicator( this.touch_tracker.container, this.container_size.width, this.container_size.height, this.content_size.height );
		
    //      var self = this;
    // document.observe( app_events.VERTICAL_SCROLLER_CONTENT_SIZE_CHANGED, function(e) { self.updateOnContentSizeChange(e); } );
    //      document.observe( app_events.HARDWARE_ACTIVE_CHANGED, function(e) { self.updateFPS(e); } );
    //      
		this.activate();
	},
	calculateDimensions : function($super) {
		$super();
		
		// recalc scroller maths
    this.bottom_limit = this.container_size.height - this.content_size.height;

    // resize scroll indicator
    if( this.scroll_indicator ) this.scroll_indicator.resize( this.container_size.width, this.container_size.height, this.content_size.height );

    // scroll to top
    var distanceFromEdge = this.cur_position.y;
    this.speed = ( distanceFromEdge / 3.95 );
    this.was_dragged_beyond_bounds = true;    // hack flag       
	},
	runTimer : function() {
    // check to see if we've slid back into bounds, so that bounceback detection starts working again if we've thrown the content within limits
    if (this.was_dragged_beyond_bounds) {
      if (this.cur_position.y < 0 && this.cur_position.y > this.bottom_limit ) {
        this.was_dragged_beyond_bounds = false;
      }
    }

    // set local speed as current mouse/touch speed
    if (this.touch_tracker.is_touching) {
      platform_helper.update2DPosition( this.scroll_content, 0, this.cur_position.y );
      if( this.scroll_indicator ) this.scroll_indicator.show();
    } else {
      // update y position and apply friction after release
      if (Math.abs(this.speed) > 0.2) {
        this.speed *= this.friction;
        this.cur_position.y -= this.speed;
        if (this.cur_position.y > 0 && this.was_dragged_beyond_bounds == false) {
          this.cur_position.y = 0;
          this.speed *= this.bounceback_factor;
        }
        if (this.cur_position.y < this.bottom_limit && this.was_dragged_beyond_bounds == false) {
          this.cur_position.y = this.bottom_limit;
          this.speed *= this.bounceback_factor;
        }
        platform_helper.update2DPosition( this.scroll_content, 0, this.cur_position.y );
      } else {
        this.speed = 0;
        this.cur_position.y = Math.round( this.cur_position.y );    // settle on a whole pixel
      }     

      // fade out scroller is not touching, and speed is low
      if( Math.abs(this.speed) < 2 ) {
        if( this.scroll_indicator ) this.scroll_indicator.hide();
      }
    }

    //  move the indicator
		this.scroll_indicator.update( this.cur_position.y );
		
		// keep timer running
		if( this.timer_active ) setTimeout( function(t) { t.runTimer(); } , this.timer_fps, this);
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
	    this.cur_position.y = 0;
	    this.speed = 0;
        platform_helper.update2DPosition( this.scroll_content, 0, this.cur_position.y );                     
		if( this.scroll_indicator ) this.scroll_indicator.update( 0 );
	},
	onStart : function($super, touchEvent) {   
	    // reset state flags and disable main nav until we decide a direction 
		$super( touchEvent );        
    // app_events.fireEvent( app_events.VERTICAL_SCROLL_START, null );
	},
	updatePositionFromTouch : function( $super, moveX, moveY ) {
	    // update position on drag
        // slow down drag amount when beyond boundaries
        if( this.cur_position.y > 0 || this.cur_position.y <= this.bottom_limit )
            this.cur_position.y += moveY * 0.3;
        else
            this.cur_position.y += moveY;
        
        // update css on screen
		this.updatePositionCSS();
	},
	onMove : function($super, touchEvent) {
	    // only fire events while in bounds
		var relativeTouchY = this.touch_tracker.touchcurrent.y + this.touch_tracker.container_position.y;
		var relativeContainerY = this.touch_tracker.container_position.y;
		
		// only pass along move event if inside container & we haven't decided on the other direction
		//if( relativeTouchY > relativeContainerY && relativeTouchY < relativeContainerY + this.container_size.height && this.touch_lock_direction != this.HORIZONTAL ) {
		  if( this.touch_lock_direction != this.HORIZONTAL ) {
	        this.speed = -this.touch_tracker.touchspeed.y;
            
	    }	
	    $super( touchEvent );
	},
	hasDecidedDirection : function ( $super, direction ) {
	    $super( direction );
	    
	    // toggle behavior when swipe direction is decided from super
	    if( direction == this.HORIZONTAL ) {
            //app_events.fireEvent( app_events.VERTICAL_SCROLL_END, null );
    		if( this.scroll_indicator ) this.scroll_indicator.hide();
        } else if( direction == this.VERTICAL ) {
    		//if( this.scroll_indicator ) this.scroll_indicator.show();
        }
	},
	onEnd : function($super, touchEvent) {
	    // set speed to head towards the proper resting point
	    // distance = speed x time
	    if( this.cur_position.y > 0 || this.cur_position.y < this.bottom_limit || this.container_size.height > this.content_size.height )
        {
            this.was_dragged_beyond_bounds = true;
            var distanceFromEdge = ( this.cur_position.y > 0 || this.container_size.height > this.content_size.height ) ? this.cur_position.y : this.cur_position.y - this.bottom_limit;
            this.speed = ( distanceFromEdge / 3.95 );

            // Linear acceleration a for a distance d going from a starting speed Vi to a final speed Vf:
            // a = (Vf*Vf - Vi*Vi)/(2 * d)
            // but how to implement?
            // 3.95 works for 0.8 friction
            /*
            // load this into browser to figure out a function to handle any friction/speed/distance
            var distanceTraveled = 0;
            var friction = 0.75;
            var speed = 100;
            while(speed > 0.1){
              speed = speed*friction;
              distanceTraveled += speed;
              debug.log(Math.round(distanceTraveled)+' <br/>');
              debug.log(speed+' <br/>');
            }
            */
        }
	    
        // pass on touch end event, and quickly re-enable main navigation
		$super( touchEvent );
    // setTimeout( function(){ app_events.fireEvent( app_events.VERTICAL_SCROLL_END, null ); }, 100 ); 
	},
	updateOnContentSizeChange : function() {
	    if( this.timer_active )
	    {
	        this.calculateDimensions();
	    }
	},
	updateFPS : function(e) {
        this.timer_fps = e.memo.fps;
	},
	dispose : function($super) {
		this.timer_active = false;
		$super();
	}
});
