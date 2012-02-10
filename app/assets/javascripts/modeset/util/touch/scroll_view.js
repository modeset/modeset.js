/**
 * Base touch tracking on an html element
 * @requires touch_tracker.js
 */
var ScrollViewTouchTracker = Class.create( {
	initialize : function( element ) {
		this.touch_tracker = new MouseAndTouchTracker( element, this );
	},
	touchUpdated : function ( touchState, touchEvent ) {
    switch( touchState ) {
      case MouseAndTouchTracker.state_start :
        this.onStart(touchEvent);
        break;
      case MouseAndTouchTracker.state_move :
        this.onMove(touchEvent);
        break;
      case MouseAndTouchTracker.state_end :
        this.onEnd(touchEvent);
        break;
      case MouseAndTouchTracker.state_enter :
        this.onEnter(touchEvent);
        break;
      case MouseAndTouchTracker.state_leave :
        this.onLeave(touchEvent);
        break;
    }
  },
	onStart : function(touchEvent) { },
	onMove : function(touchEvent) { },
	onEnd : function(touchEvent) { },
	onEnter : function() {},
	onLeave : function() {},
	dispose : function() {
		this.touch_tracker.dispose();
		delete this.touch_tracker;
	}
});

/**
 * @requires platform_helper.js
 */
var ScrollView = Class.create(ScrollViewTouchTracker, {
  platform_helper : false,
	cur_position : false,
	container_size : false,
	content_size : false,
	scroll_enabled_x : true,
	scroll_enabled_y : true,
	scroll_content : false,
	base_inline_css : false,
	cursor : false,
	
	initialize : function( $super, touchObject, scrollElementInner ) {
		$super( touchObject );

		this.cur_position = { x:0, y:0 };
		this.container_size = { width:0, height:0 };
		this.content_size = { width:0, height:0 };
		this.scroll_content = scrollElementInner;
		
		this.cursor = new Cursor();
    
    this.platform_helper = ( typeof platform_helper !== 'undefined' ) ? platform_helper : new PlatformHelper(); // check to see if it already exists in global space....
    this.platform_helper.convertPosToWebkitTransform( this.scroll_content );
		this.platform_helper.update2DPosition( this.scroll_content, 0, 0 );                     
		
		this.calculateDimensions();
	},
	calculateDimensions : function() {
		this.container_size.width = this.touch_tracker.container.offsetWidth;
		this.container_size.height = this.touch_tracker.container.offsetHeight;
		this.content_size.width = this.scroll_content.offsetWidth;
		this.content_size.height = this.scroll_content.offsetHeight;
	},
	updatePositionFromTouch : function( moveX, moveY ) {
		// update container position	    
		if( this.scroll_enabled_x ) this.cur_position.x += moveX;
		if( this.scroll_enabled_y ) this.cur_position.y += moveY;
		this.updatePositionCSS();
	},
	updatePositionCSS : function() {
	  this.platform_helper.update2DPosition( this.scroll_content, this.cur_position.x, this.cur_position.y );                     
	},
	onStart : function($super, touchEvent) {
		$super( touchEvent );
    this.cursor.cursorSetGrabbyHand();
	},
	onMove : function($super, touchEvent) {
		$super( touchEvent );
		this.updatePositionFromTouch( ( this.touch_tracker.touchmoved.x - this.touch_tracker.touchmovedlast.x ), ( this.touch_tracker.touchmoved.y - this.touch_tracker.touchmovedlast.y ) );
	},
	onEnd : function($super, touchEvent) {
		$super( touchEvent );
		if(this.touch_tracker.touch_is_inside) this.cursor.cursorSetHand();
		else this.cursor.cursorSetDefault();
	},
	onEnter : function($super, touchEvent) {
		$super( touchEvent );
		if(!this.touch_tracker.is_touching) this.cursor.cursorSetHand();
	},
	onLeave : function($super, touchEvent) {
		$super( touchEvent );
		if(this.touch_tracker.is_touching) this.cursor.cursorSetGrabbyHand();
		else this.cursor.cursorSetDefault();
	},
	dispose : function($super) {
	  this.cursor.dispose();
	  this.cursor = null;
		this.timer_active = false;
		this.cur_position = false;
		this.container_size = false;
		this.content_size = false;
		this.base_inline_css = false;
		this.platform_helper.update2DPosition( this.scroll_content, 0, 0 );
		this.platform_helper = null;
		$super();
	}
});


var ScrollViewLocksDirection = Class.create(ScrollView, {
	HORIZONTAL : 'horizontal',
	VERTICAL : 'vertical',
	UNLOCKED : 'unlocked',
	
	decide_threshold : 15,
	has_decided_a_direction : false,
	touch_lock_direction : false,
	
	initialize : function( $super, scrollContainer, scrollContentElement ) {
		$super( scrollContainer, scrollContentElement );

		this.has_decided_a_direction = false;
		this.touch_lock_direction = this.UNLOCKED;
	},
	onStart : function($super, touchEvent) {   
    // reset state flags until we decide a direction
		$super( touchEvent );
	},
	onMove : function($super, touchEvent) {
    // if we haven't moved far enough in a direction, watch for which direction (x/y) moves to the threshold first
    // once a direction is decided, start passing through onMove events
    if( !this.has_decided_a_direction ) {
      if( Math.abs( this.touch_tracker.touchmoved.x ) > this.decide_threshold ) {
        this.hasDecidedDirection( this.HORIZONTAL );
      } else if( Math.abs( this.touch_tracker.touchmoved.y ) > this.decide_threshold ) {
        this.hasDecidedDirection( this.VERTICAL );
      }
    } else {
      $super( touchEvent );
    }
    if( typeof touchEvent.preventDefault !== 'undefined' ) touchEvent.preventDefault();
	},
	onEnd : function($super, touchEvent) {   
		$super( touchEvent );
		this.has_decided_a_direction = false;
    this.touch_lock_direction = this.UNLOCKED;
	},
	hasDecidedDirection : function( direction ) {
	  this.has_decided_a_direction = true;
    this.touch_lock_direction = direction;
	}
});
