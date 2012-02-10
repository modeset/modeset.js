var TrackNavigation = Class.create({
  // elements
  content_container: false,
  container: false,
  dragger: false,
  track: false,
  track_bg: false,
  track_segments: false,
  
  // state and measurements
  num_sections: 0,
  cur_index: 0,
  dragger_width: 0,
  dragger_x: 0,
  dragger_target_x: 0,
  dragger_grabbed: false,
  dragger_resting: false,
  track_width: 0,
  dragger_top: 0,
  
  // parallax layers
  layer_bg: false,
  layer_fg: false,
  layer_bg_offset: 229,
  layer_fg_offset: 200,
  
  // util
  platform_helper: false,
  touch_tracker: false,
  move_bg_callback: false,
  timer_fps: Math.round(1000/30),
  delegate: false,
  time_factor: 1,
  last_time: false,
  date: false,
  
  // screensaver mode
  is_screensavering : false,
  inactivity_timer : false,
  screensaver_timer : false,
  screensaver_time : 8 * 1000,
  inactivity_timeout : 8 * 1000,
  inactivity_timeout_initial : 6 * 1000,
  screensaver_disabled: false,
  screensaver_rotations : 0,
  screensaver_rotations_max : 2,
  
  // class functions
  initialize: function(container, numSections, delegate) {
    this.container = container;
    this.platform_helper = delegate.platform_helper;
    this.num_sections = numSections;
    this.delegate = delegate;
    var self = this;
    
    // grab elements
    this.content_container = $(this.container).find('#content').get(0);
    this.dragger = $(this.container).find('#dragger').get(0);
    this.track_bg = $(this.container).find('#track_bg').get(0);
    //this.track = $(this.container).find('#trackbar').get(0);
    this.track = $("#trackbar",this.container)[0];
    
    // get dimensions
    this.track_width = DOMUtil.getWidth(this.container);
    this.dragger_width = this.track_width / this.num_sections;
    
    // get top position of dragger and initialize for aniamtion
    this.dragger_top = parseInt( this.getStyle(this.dragger,'top') );
    this.platform_helper.convertPosToWebkitTransform(this.dragger);
    
    // custom hand cursor for Chrome and IE
    if( this.platform_helper.is_chrome || this.platform_helper.is_msie ) $(this.track).addClass('custom_cursor');
    
    // update elements' style
    this.dragger.style.width = Math.round(this.dragger_width) + 'px';
    
    // build parallax layers
    var content_bg_container = $(this.content_container).find('#content_bg').get(0);
    var content_fg_container = $(this.content_container).find('#content_fg').get(0);

    //BG Pages
    this.delegate.content_bg_pages = $('.page', content_bg_container);

    this.layer_bg = new ParallaxLayer(content_bg_container, this.platform_helper, this.track_width + this.layer_bg_offset, this.num_sections, 5);
    this.layer_fg = new ParallaxLayer(content_fg_container, this.platform_helper, this.track_width + this.layer_fg_offset, this.num_sections, 3);
    this.layer_bg.layer_x = this.layer_bg.layer_target_x = -this.layer_bg_offset;

    // add custom mouse/touch events
    this.touch_tracker = new MouseAndTouchTracker( this.track, this, false );
    
    // initialize time-based calcs
    this.date = new Date();
    this.last_time = this.date.getTime();

    // start timer for screensaver - moved to loading complete in the app
    // this.startInactivityTimer(this.inactivity_timeout_initial);
    
    // kick off timer
    //this.setNewIndex(0);
    this.runTimer();    
  },
  
  getStyle: function(el,styleProp) {
    if (el.currentStyle) {
      var y = el.currentStyle[styleProp];
    } else if (window.getComputedStyle) {
      var y = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
    }
    return y;
  },

  runTimer: function () {
    // get time-based calc factor
    this.date = new Date();
    var curTime = this.date.getTime();
    this.time_diff = curTime - this.last_time;
    this.time_factor = this.time_diff / this.timer_fps;
    this.last_time = curTime;

    this.time_factor = (this.time_factor >= 2) ? 1.5 : this.time_factor;

    // tell 2 parallax layers to animate continuously
    this.layer_bg.runTimer(this.time_factor);
    this.layer_fg.runTimer(this.time_factor);
    
    // ease dragger into position if not grabbing
    this.dragger_x = this.easeTo(this.dragger_x, this.dragger_target_x, (this.dragger_grabbed) ? 3 : 5);
    this.constrainDragger();
    
    // TODO: reimplement this.dragger_resting
    if(Math.abs( this.dragger_x - this.dragger_target_x ) < 0.2) {
      this.dragger_x = this.dragger_target_x;
    }

    this.platform_helper.update2DPosition(this.dragger, this.dragger_x, this.dragger_top);
    this.delegate.setScrubberPercentage( MathUtil.getPercentWithinRange( 0, this.track_width - this.dragger_width, this.dragger_x ) );
    
    // keep timer timing
    var self = this;
    setTimeout( function() { self.runTimer(); }, this.timer_fps);
  },
  
  constrainDragger: function () {
    if(this.dragger_x < 0) {
      this.dragger_x = 0;
    } else if(this.dragger_x > this.track_width - this.dragger_width) {
      this.dragger_x = this.track_width - this.dragger_width;
    }
  },

  easeTo: function( current, target, easeFactor ) {  
    return current -= ( ( current - target ) / easeFactor ) * this.time_factor;
  },
  
  setHandCursor: function(isGrabbing) {
    if(isGrabbing) {
      $(this.track).addClass('grabbing');
    } else {
      $(this.track).removeClass('grabbing');
      this.dragger_resting = false;
    }
  },
  
  recalculateClosestIndex: function () {
    //this.dragger_x = parseInt( $(this.dragger).position().left);
    var curIndex = Math.round( this.dragger_target_x / this.dragger_width );
    if(this.cur_index != curIndex) {
      this.setNewIndex(curIndex);
    }
  },
  
  setNewIndex: function(newIndex) {
    // constrain & store new index 
    newIndex = (newIndex < 0) ? 0 : newIndex;
    newIndex = (newIndex >= this.num_sections) ? this.num_sections - 1 : newIndex;
    this.cur_index = newIndex;
    
    // call delegate method
    this.delegate.setNewIndex(this.cur_index);
    // and set 2 parallax layers
    this.layer_bg.setNewIndex(this.cur_index, -this.layer_bg_offset);
    this.layer_fg.setNewIndex(this.cur_index);
  },
    
    
  // Touch tracker delegate methods
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
    }
  },
  onStart : function(touchEvent) { 
    this.setHandCursor(true);
    this.dragger_grabbed = true;
    this.onMove(touchEvent);
    //this.setScreensaverDisabled(true);
  },
  onMove : function(touchEvent) {
    //this.dragger_x = this.touch_tracker.touchcurrent.x - this.dragger_width / 2;
    this.dragger_target_x = this.touch_tracker.touchcurrent.x - this.dragger_width / 2;
    this.constrainDragger();
    this.recalculateClosestIndex();
        
    // IE-safe method of stopping event
    if (touchEvent.preventDefault) { touchEvent.preventDefault(); } else { touchEvent.returnValue = false; }
  },
  onEnd : function(touchEvent) {
    this.setHandCursor(false);
    this.dragger_grabbed = false;
    this.recalculateClosestIndex();
    this.dragger_target_x = this.dragger_width * this.cur_index;
    
    //this.setScreensaverDisabled(false);
  },
  
  
  
  
  // screensaver mode codes --------------------------
  clearScreensaverTimers : function() {
    clearTimeout( this.inactivity_timer );
    clearTimeout( this.screensaver_timer );
  },
  
  startInactivityTimer: function(time) {
    
    if (this.screensaver_rotations < this.screensaver_rotations_max && !this.delegate.video_playing) {

      this.clearScreensaverTimers();
    
      // when we stop touching, set timer for screensaver
      var self = this;
      this.inactivity_timer = setTimeout(function(){
        self.startScreensaver();
      }, time);
    }
  },
  
  startScreensaver: function() {
    this.clearScreensaverTimers();

    if( !this.is_screensavering ) {
      this.is_screensavering = true;
      this.advancePageScreensaver();
    }
  },
  
  advancePageScreensaver: function() {
    if (this.screensaver_rotations < this.screensaver_rotations_max) {
      if( this.cur_index == this.num_sections - 1 ) {
        this.setNewIndex( 0 );
        this.screensaver_rotations += 1;
      } else {
        this.setNewIndex(this.cur_index+=1);
      }

      this.dragger_target_x = this.dragger_width * this.cur_index;

      var self = this;
      if( this.is_screensavering ) {
        this.screensaver_timer = setTimeout( function() { self.advancePageScreensaver(); } , this.screensaver_time);
      }
    };
  },
  
  // called externally -----
  userTouchedSomething : function() {
    if( !this.screensaver_disabled ) {
      this.is_screensavering = false;        
      this.startInactivityTimer(this.inactivity_timeout);
    }
  },
  
  setScreensaverDisabled : function( isDisabled ) {
    this.screensaver_disabled = isDisabled;
    var self = this;
    if( this.screensaver_disabled ) {
      this.is_screensavering = false;        
      setTimeout(function(){
        self.clearScreensaverTimers();
      }, 10);
    } else {
      this.userTouchedSomething();
    }
  }
  
});
