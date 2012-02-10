CircleNav = function ()
{
    this.app_delegate = false;
    this.container_div = false;
    this.outer_ring_img = false;
    this.touch_track_div = false;
    this.touch_tracker = false;
    this.platform_helper = false;
    this.camera_jq_obj = false;
    this.camera_div = false;
    this.camera_raphael = false;
    this.control_center_point = false;
    this.camera_radius_bounds = false;
    this.camera_radius = false;
    this.camera_size = false;
    this.camera_position = false;
    this.timer_fps = false;
    this.position_it = false;
    this.num_total_frames = false;
    this.num_resting_points = false;
    this.num_displayed_frames = false;
    this.frame_interval = false;
    this.frame_offset = false;
    this.resting_points = false;
    this.display_points = false;
    this.total_points = false;
    this.segment_radians_resting = false;
    this.segment_radians_display = false;
    this.segment_radians_total = false;
    this.current_segment_index = false;
    this.closest_display_index = false;
    this.TWO_PI = false;
    return this;
};

CircleNav.prototype.init = function ( navDiv, totalFrames, displayedFrames, restingPoints, frameInterval, delegate )
{
    // constants
    this.TWO_PI = 2 * Math.PI;
    
    // store refs
    this.app_delegate = delegate;
    this.container_div = navDiv;
    this.camera_jq_obj = $( this.container_div ).children("#camera");
    this.camera_div = this.camera_jq_obj.get(0);
    this.touch_track_div = $( this.container_div ).children("#touch_track").get(0);
    this.outer_ring_img = $( this.container_div ).children("#circle_nav_outer").get(0);
    
    // set up control parameters
    this.control_center_point = { x:100, y:70 };
    this.camera_radius_bounds = { inner:15, outer:110 };
    this.camera_radius = 55;
    this.camera_size = 16;
    this.camera_position = { current_radians: 0, target_radians: 0, ease_factor: 5 };
    this.timer_fps = 1000/30;
    this.current_segment_index = -1;
    this.num_total_frames = totalFrames;
    this.num_displayed_frames = displayedFrames;
    this.num_resting_points = restingPoints;
    this.frame_interval = frameInterval;
    this.frame_offset = 2;
        
    // init touch tracking
	this.touch_tracker = new MouseAndTouchTracker();
	this.touch_tracker.init( this.touch_track_div, this );
	this.platform_helper = this.app_delegate.platform_helper;
	this.container_div.onmousedown=function(){return false;}
	
    // disable clicking on the drag element
	this.touch_track_div.onmousedown = function(){return false;}
	this.touch_track_div.onselectstart = function(){return false;}  // ie-specific drag-select disabling
	
	// draw parts
	this.drawCamera();
	this.buildStoppingPoints();
	$( this.outer_ring_img ).hide();
	
  this.setInitialCustomAngle();
	
	// start timer
	var self = this;
	self.runTimer();
	setInterval( function(){ self.runTimer(); }, this.timer_fps );
};

CircleNav.prototype.setInitialCustomAngle = function ()
{
    // set initial target radians for the starting angle
    if( this.display_points.length > 10 )
        this.camera_position.target_radians = this.camera_position.current_radians = 0.53;
    else
        this.camera_position.target_radians = this.camera_position.current_radians = 0.8;
    if(this.app_delegate.carline === "a7") this.camera_position.target_radians = this.camera_position.current_radians = 0;
    this.current_segment_index = this.findClosestPointIndexOnCircle( this.display_points, this.segment_radians_display );
    this.camera_position.target_radians = this.findClosestPointIndexOnCircle( this.display_points, this.segment_radians_display ) * this.segment_radians_display;
    
    this.app_delegate.segmentIndexUpdated( this.current_segment_index );
};

CircleNav.prototype.drawCamera = function ()
{
    // replace with Raphael in IE for rotation
    if( this.platform_helper.is_msie )  // && this.platform_helper.is_msie8 == false
    {
        var cameraElement = this.camera_div;

        // remove default camera image and clear background
        while( this.camera_div.childNodes.length > 0 ){
    		this.camera_div.removeChild( this.camera_div.childNodes[0] );
        }

        // draw camera
        var cameraDrawing = Raphael( this.camera_div, 0, 0 );
        this.camera_raphael = cameraDrawing.image( this.app_delegate.base_img_dir + "camera.png", 0, 0, 17, 17);
        
        this.camera_div.style.width = '22px';
        this.camera_div.style.height = '22px';
        this.camera_div.style.overflow = 'hidden';
    }
    /*
    // special case no longer needed with <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7"> ???
    else if( this.platform_helper.is_msie8 == true )
    {
        // damn IE8 with our (any) DOCTYPE won't render Raphael/SVG... though my simple demo does... not sure what's breaking it, but have wasted too much time
        var cameraImg = this.camera_div.childNodes[0];
        var curCameraImgSrc = cameraImg.src;
        curCameraImgSrc = curCameraImgSrc.replace("camera", "camera_fallback");
        cameraImg.src = curCameraImgSrc;
    }*/
    
    // replace background image with raphael instead of pngfix
    if( this.platform_helper.is_msie6 )
    {
        // redraw circle nav bg image
        var backgroundDiv = $( this.container_div ).children("#circle_nav_bg").get(0);
	
        // remove default bg image and clear background
        while( backgroundDiv.childNodes.length > 0 )
    		backgroundDiv.removeChild( backgroundDiv.childNodes[0] );
    
        // draw camera
        var bgDrawing = Raphael( backgroundDiv, 0, 0 );
        var bgRaphael = bgDrawing.image( this.app_delegate.base_img_dir + "camera_track.png", 0, 0, 140, 140);
    }
};

CircleNav.prototype.buildStoppingPoints = function ()
{
    // calculate all points
    this.total_points = this.buildCirclePointObjArray( this.num_total_frames );
    this.segment_radians_total = this.TWO_PI / this.total_points;
    
    // calculate resting points
    this.resting_points = this.buildCirclePointObjArray( this.num_resting_points );
    this.segment_radians_resting = this.TWO_PI / this.num_resting_points;
    
    // calculate display points
    this.display_points = this.buildCirclePointObjArray( this.num_displayed_frames );
    this.segment_radians_display = this.TWO_PI / this.num_displayed_frames;
};

CircleNav.prototype.buildCirclePointObjArray = function( numPoints ) 
{
    var radiansPerSegment = this.TWO_PI / numPoints;
    var objsArray = [];
    for( var i=0; i < numPoints; i++ )
    {
        var radians = i * radiansPerSegment;
        var newX = this.control_center_point.x + this.camera_radius * Math.sin( radians );
        var newY = this.control_center_point.y + this.camera_radius * Math.cos( radians );
        objsArray.push( { x:newX, y:newY, radians:radians } );
    }
    return objsArray;
};

CircleNav.prototype.runTimer = function() 
{
    // EASE CAMERA POSITION TO TARGET & NORMALIZE RADIANS ON THE WAY
    // handle the radians crossover from 180 -> -180
    if( Math.abs( this.camera_position.target_radians - this.camera_position.current_radians ) > Math.PI )
    {
        if( this.camera_position.target_radians > this.camera_position.current_radians )
            this.camera_position.current_radians += this.TWO_PI;
        else 
            this.camera_position.current_radians -= this.TWO_PI;
    }
    // ease camera position into place
    if( this.camera_position.current_radians != this.camera_position.target_radians )
    {
        this.camera_position.current_radians = this.easeTo( this.camera_position.current_radians, this.camera_position.target_radians, this.camera_position.ease_factor );
        // stop easing once we're close enough
        if( Math.abs( this.camera_position.target_radians - this.camera_position.current_radians ) < 0.001 )
        {
            this.camera_position.current_radians = this.camera_position.target_radians;
            // if camera has eased to a resting position, call the function
            if( !this.touch_tracker.is_touching ) 
                this.cameraResting();
        }
    }
    
    // UPDATE CAMERA VIEW ON CIRCLE
    // pull cartesian coordinates & camera angle from radians
    var newX = this.control_center_point.x - this.camera_size/2 + this.camera_radius * Math.sin( this.camera_position.current_radians );
    var newY = this.control_center_point.y - this.camera_size/2 + this.camera_radius * Math.cos( this.camera_position.current_radians ) + 2;
	var cameraAngle = ( -this.camera_position.current_radians + Math.PI/2 ) * (180/Math.PI);
	
	// update camera position and angle
	if( !this.platform_helper.is_msie ) {   // && !this.platform_helper.is_android22
	    this.platform_helper.updatePosition( this.camera_div, newX, newY, cameraAngle );
    } else {
        this.platform_helper.updatePosition( this.camera_div, newX, newY, 0 );
        if( this.camera_raphael != false ){ this.camera_raphael.rotate( cameraAngle, true ); }
    }
    
    // CALCULATE CURRENT CAR ANGLE FROM CURRENT CAMERA RADIANS
    // find closest display point to camera
    // if index switches, call delegate to swap angle view
    this.closest_display_index = this.findClosestPointIndexOnCircle( this.display_points, this.segment_radians_display );
    if( this.current_segment_index != this.closest_display_index || this.current_segment_index == -1 )
    {
        this.current_segment_index = this.closest_display_index;
        // this.app_delegate.segmentIndexUpdated( this.getOffsetIndex( this.closest_display_index ) );
        this.app_delegate.segmentIndexUpdated( this.closest_display_index );
        this.app_delegate.touchMoved();
    }
};

CircleNav.prototype.cameraResting = function ()
{
    var restingIndex = this.findClosestPointIndexOnCircle( this.display_points, this.segment_radians_display );
    restingIndex *= this.frame_interval;
    this.app_delegate.showCallouts( restingIndex );
};

CircleNav.prototype.getOffsetIndex = function ( circleIndex )
{
    // offset frame index and keep it within 0-35
    var offsetIndex = circleIndex;// - this.frame_offset;
    if( offsetIndex < 0 ) offsetIndex += this.num_total_frames;

    offsetIndex %= this.num_total_frames;

    // reverse the frame index to line up camera movement with order of 360 animation
    return offsetIndex;
};

CircleNav.prototype.getDistance = function ( a, b )
{
    return Math.abs( Math.sqrt(a*a + b*b) );
};

CircleNav.prototype.easeTo = function( current, target, easeFactor ) {  
    return current -= ( ( current - target ) / easeFactor );
};


/****** Delegate methods from MouseAndTouchTracker ******/

CircleNav.prototype.touchUpdated = function ( touchState )
{
	// get distance from center point
	var xPos = this.touch_tracker.touchcurrent.x - this.control_center_point.x;
	var yPos = this.touch_tracker.touchcurrent.y - this.control_center_point.y;
	var mouseRadius = this.getDistance( xPos, yPos );

	// keep touchpoint inside bounds
	if( mouseRadius > this.camera_radius_bounds.inner && mouseRadius < this.camera_radius_bounds.outer ) 
	{
        // set target radians
        this.camera_position.target_radians = Math.atan2(-xPos, -yPos) + Math.PI;
        var degrees = this.camera_position.target_radians * 180/Math.PI;
	}
	
    // handle different touch states
    if( touchState == this.touch_tracker.state_start )
    {
        // on touch start, tell app to hide menus
        this.app_delegate.touchStarted();
        
        // show outer ring
	    ( this.platform_helper.animations_enabled == false ) ? $( this.outer_ring_img ).show() : $( this.outer_ring_img ).fadeIn();
    } 
    else if( touchState == this.touch_tracker.state_move && this.touch_tracker.is_touching == true )
    {
        // hide callouts if dragged far enough
        if( Math.abs( this.touch_tracker.touchmove.x ) + Math.abs( this.touch_tracker.touchmove.y ) > 5 )
            this.app_delegate.touchMoved();
    }
    else if( touchState == this.touch_tracker.state_end )
	{
	    // on touch end, set closest index as radian target
	    this.camera_position.target_radians = this.findClosestPointIndexOnCircle( this.display_points, this.segment_radians_display ) * this.segment_radians_display;

	    // hide outer ring
	    ( this.platform_helper.animations_enabled == false ) ? $( this.outer_ring_img ).hide() : $( this.outer_ring_img ).fadeOut();
    }
    
	// cancel tracking if touch/mouse leaves the touch radius
	if( mouseRadius > this.camera_radius_bounds.outer && this.touch_tracker.is_touching )
	    this.touch_tracker.onEnd(null);	
};

CircleNav.prototype.findClosestPointIndexOnCircle = function( circlePointsArray, segmentRadians ) 
{
    var closestIndex = 0;
    var smallestRadianDistance = Math.PI*2;
    var current_radians_normalized = this.camera_position.current_radians % this.TWO_PI;
    if( current_radians_normalized < 0 ) current_radians_normalized += this.TWO_PI;
    
    for( var i=0; i < circlePointsArray.length; i++ )
    {
        var radianDistance = Math.abs( current_radians_normalized - circlePointsArray[i].radians );
        if( radianDistance < smallestRadianDistance )
        {
            smallestRadianDistance = radianDistance;
            closestIndex = i;
        }
    }
    if( closestIndex == circlePointsArray.length - 1 )
    {
        if( smallestRadianDistance > segmentRadians/2 )
        {
            closestIndex = 0;
        }
    }
    
    return closestIndex;
};


/****** Public methods called from Experience ******/

CircleNav.prototype.updateFromCarDrag = function( dragSpeed ) 
{
    if( this.touch_tracker.is_touching != true ) {
        this.touch_tracker.is_touching = true;  // hacky...
        // show outer ring
	    ( this.platform_helper.animations_enabled == false ) ? $( this.outer_ring_img ).show() : $( this.outer_ring_img ).fadeIn();
    }
    this.camera_position.target_radians += dragSpeed * 0.005;
    if( this.camera_position.target_radians < 0 ) this.camera_position.target_radians += this.TWO_PI;     // handle crossover to negative radians
    this.camera_position.target_radians %= this.TWO_PI;                                                   // keep within 0 - Math.PI*2
};

CircleNav.prototype.carDragEnd = function( dragSpeed ) 
{
    this.touch_tracker.is_touching = false;  // end hacky...
    this.camera_position.target_radians = this.findClosestPointIndexOnCircle( this.display_points, this.segment_radians_display ) * this.segment_radians_display;
    // hide outer ring
    ( this.platform_helper.animations_enabled == false ) ? $( this.outer_ring_img ).hide() : $( this.outer_ring_img ).fadeOut();
};


CircleNav.prototype.hide = function() 
{
    $( this.container_div ).hide();
};

CircleNav.prototype.show = function( duration ) 
{
    $( this.container_div ).fadeIn( duration );
};

CircleNav.prototype.prev = function () {
  this.camera_position.target_radians += this.segment_radians_display;
};

CircleNav.prototype.next = function () {
  this.camera_position.target_radians -= this.segment_radians_display;
};



