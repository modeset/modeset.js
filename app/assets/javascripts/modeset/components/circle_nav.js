CircleNav = function ()
{
    this.delegate = false;
    this.container_div = false;
    this.touch_tracker = false;
    this.touchpoint = false;
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
    this.num_stopping_points = false;
    this.stopping_points = false;
    this.segment_radians = false;
    this.current_segment_index = false;
    return this;
}

CircleNav.prototype.init = function ( navDiv, delegate )
{
    // store refs
    this.delegate = delegate;
    this.container_div = navDiv;
    this.touchpoint = $("#touchpoint");
    this.touchpoint.hide();
    this.camera_jq_obj = $("#camera");
    this.camera_div = this.camera_jq_obj.get(0);

    // set up control parameters
    this.control_center_point = { x:70, y:95 };
    this.camera_radius_bounds = { inner:15, outer:70 };
    this.camera_radius = 55;
    this.camera_size = 16;
    this.camera_position = { current_radians: 0, target_radians: 0, ease_factor: 5 };
    this.timer_fps = 1000/50;
    this.current_segment_index = -1;
    this.num_stopping_points = 4;

    // init touch tracking
	this.touch_tracker = new MouseAndTouchTracker();
	this.touch_tracker.init( navDiv, this );
	this.platform_helper = new PlatformHelper();
	this.platform_helper.init();
	// disable any clicking on the image
	this.camera_div.onmousedown=function(){return false;}

	// draw parts
	this.drawCamera();
	this.buildStoppingPoints();

	// start timer
	var self = this;
	self.runTimer();
	setInterval( function(){ self.runTimer(); }, this.timer_fps );
}

CircleNav.prototype.drawCamera = function ()
{
    if( this.platform_helper.is_msie )
    {
        var cameraElement = this.camera_div;

        // remove default camera image and clear background
        while( this.camera_div.childNodes.length > 0 ){
    		this.camera_div.removeChild( this.camera_div.childNodes[0] );
        }

        // draw camera
        var cameraDrawing = Raphael( this.camera_div, 0, 0 );
        this.camera_raphael = cameraDrawing.image("images/camera.png", 0, 0, 17, 17);
    }
}

CircleNav.prototype.buildStoppingPoints = function ()
{
    this.segment_radians = 2*Math.PI / this.num_stopping_points;
    this.stopping_points = [];
    for( var i=0; i < this.num_stopping_points; i++ )
    {
        var radians = i * this.segment_radians;

        var point = document.createElement("div");
        point.className = "stopping_point";
        this.container_div.appendChild(point);

        var newX = -3 + this.control_center_point.x + this.camera_radius * Math.sin( radians );
        var newY = -3 + this.control_center_point.y + this.camera_radius * Math.cos( radians );

    	// update camera position and angle
    	this.platform_helper.updatePosition( point, newX, newY, 0 );

        this.stopping_points.push( { div:point, x:newX, y:newY, radians:radians } );
    }
}

CircleNav.prototype.runTimer = function() {

    // find closest resting point to camera
    var closestSegmentIndex = 0;
    var smallestRadianDistance = Math.PI*2;
    for( var i=0; i < this.stopping_points.length; i++ )
    {
        var radianDistance = Math.abs( this.camera_position.current_radians - this.stopping_points[i].radians )
        if( radianDistance < smallestRadianDistance )
        {
            this.stopping_points[closestSegmentIndex].div.style.backgroundColor = "#ffbbbb";

            smallestRadianDistance = radianDistance;
            closestSegmentIndex = i;
            this.stopping_points[i].div.style.backgroundColor = "#000000";
        } else {
            this.stopping_points[i].div.style.backgroundColor = "#ffbbbb";
        }
    }
    if( closestSegmentIndex == this.stopping_points.length - 1 )
    {
        if( smallestRadianDistance > this.segment_radians/2 )
        {
            this.stopping_points[closestSegmentIndex].div.style.backgroundColor = "#ffbbbb";
            closestSegmentIndex = 0;
            this.stopping_points[closestSegmentIndex].div.style.backgroundColor = "#000000";
        }
    }

    // if index switches, call delegate to update view
    if( this.current_segment_index != closestSegmentIndex || this.current_segment_index == -1 )
    {
        this.current_segment_index = closestSegmentIndex;
        this.delegate.segmentIndexUpdated( this.current_segment_index );
    }

    // handle the radians crossover from 180 -> -180
    if( Math.abs( this.camera_position.target_radians - this.camera_position.current_radians ) > Math.PI )
    {
        if( this.camera_position.target_radians > this.camera_position.current_radians )
            this.camera_position.current_radians += Math.PI * 2;
        else
            this.camera_position.current_radians -= Math.PI * 2;
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

    // pull cartesian coordinates & camera angle from radians
    var newX = this.control_center_point.x - this.camera_size/2 + this.camera_radius * Math.sin( this.camera_position.current_radians );
    var newY = this.control_center_point.y - this.camera_size/2 + this.camera_radius * Math.cos( this.camera_position.current_radians );
	var cameraAngle = ( -this.camera_position.current_radians + Math.PI/2 ) * (180/Math.PI);

	// update camera position and angle
	if( !this.platform_helper.is_msie ) {
	    this.platform_helper.updatePosition( this.camera_div, newX, newY, cameraAngle );
    } else {
        this.platform_helper.updatePosition( this.camera_div, newX, newY, 0 );
        if( this.camera_raphael != false ){ this.camera_raphael.rotate( cameraAngle, true ); }
    }
}

CircleNav.prototype.cameraResting = function ()
{
    debug.log('CAMERA RESTING, DROP CALLOUTS');
}

CircleNav.prototype.getDistance = function ( a, b )
{
    return Math.abs( Math.sqrt(a*a + b*b) );
}

CircleNav.prototype.easeTo = function( current, target, easeFactor ) {
    return current -= ( ( current - target ) / easeFactor );
}


/****** Delegate methods from MouseAndTouchTracker ******/

CircleNav.prototype.touchUpdated = function ( touchState )
{
	// get distance from center point
	var xPos = this.touch_tracker.touchcurrent.x - this.control_center_point.x;
	var yPos = this.touch_tracker.touchcurrent.y - this.control_center_point.y;
	var mouseRadius = this.getDistance( xPos, yPos );

	// keep touchpoint inside bounds
	if( mouseRadius > this.camera_radius_bounds.inner && mouseRadius < this.camera_radius_bounds.outer ) {
    	// position touchpoint
    	this.touchpoint.css( 'left', this.touch_tracker.touchcurrent.x - 4 );
    	this.touchpoint.css( 'top', this.touch_tracker.touchcurrent.y - 4 );

        // set target radians
        this.camera_position.target_radians = Math.atan2(-xPos, -yPos) + Math.PI;
        var degrees = this.camera_position.target_radians * 180/Math.PI;
	}

	// cancel tracking if touch/mouse leaves the touch radius
	if( mouseRadius > this.camera_radius_bounds.outer && this.touch_tracker.is_touching )
	    this.touch_tracker.onEnd(null);

	// on touch end, set closest index as radian target
	if( !this.touch_tracker.is_touching )
	{
	    this.camera_position.target_radians = this.current_segment_index * this.segment_radians;
    }
}


/****** Public methods called from A8Experience ******/

CircleNav.prototype.updateFromCarDrag = function( dragSpeed )
{
    this.touch_tracker.is_touching = true;  // hacky...
    this.camera_position.target_radians += dragSpeed * 0.01;
    if( this.camera_position.target_radians < 0 ) this.camera_position.target_radians += Math.PI*2;     // handle crossover to negative radians
    this.camera_position.target_radians %= Math.PI*2;                                                   // keep within 0 - Math.PI*2
}

CircleNav.prototype.carDragEnd = function( dragSpeed )
{
    this.touch_tracker.is_touching = false;  // end hacky...
    this.camera_position.target_radians = this.current_segment_index * this.segment_radians;
}