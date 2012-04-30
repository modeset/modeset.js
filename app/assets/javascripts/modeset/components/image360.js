// JME API: http://protofunc.com/jme/documentation/documentation-api.html

var ImageRotator = function( holder, numImages, baseImgDir, imgExtension, delegate, instructions, continueButton ) {

	var _num_images = numImages;
	var _num_images_loaded = 0;
	var _image_divs = [];
	var _frame_interval = 1;
	var _cur_index = 0;
	var _drag_adjust = -0.05;
	var _instructions_hidden = false;

	var _holder = holder;
	var _delegate = delegate;
	var _instructions = instructions;
	var _continue_button = continueButton;

	var _load_bar_holder = $('#loader_bar');
	var _load_bar = $('#bar');

	var init = function(){
		createImages();
	};

	var show = function() {
		setIndex();
	};

	var imageLoaded = function( numLoaded, numTotal ) {
		_num_images_loaded++;
		_load_bar.css({ width: 965*( _num_images_loaded / _num_images ) })
        if( _num_images_loaded == _num_images ) {
            loadingComplete();
        }
	};

	var loadingComplete = function( numLoaded, numTotal ) {
		_image_divs = _holder.find('img');
		_image_divs.css({ visibility:'visible' });
		_image_divs.hide();
		_delegate.rotatorReady();

		_load_bar_holder.hide();
	};

	var createImages = function() {
	    // create new html elements
	    for( var i=0; i < _num_images; i++ ) {
	        // use index to find appropriate image
	        var imagePathIndex = i * _frame_interval;

	        // create image element, add to DOM & store it
	        var image = document.createElement("img");
	        image.className = "";
	        _holder.append( image );

			// handle onload and onerror with the same callback
	        image.onerror = image.onload = function() {
	            imageLoaded();
	        };

			// create image path and add attreibute to img, kicking off the load
	        var leadingZero = ( imagePathIndex < 10 ) ? "0" : '';
	        image.src = baseImgDir + leadingZero + imagePathIndex + '.' + imgExtension;
	        //$( image ).css({ visibility:"hidden" });	//, display:'none'
	    }
	};

	var setIndex = function() {
		if( _cur_index < 0 ) _cur_index = 0;
		if( _cur_index >= _num_images ) _cur_index = _num_images - 1;
		_image_divs.hide();
		$( _image_divs[ Math.floor( _cur_index ) ] ).show();

		// hide instructions if we've changed index and we haven't hidden yet
		if( !_instructions_hidden && _cur_index > 0 ) {
			_instructions.fadeOut();
		}

		// if we're on the last frame, show the continue button
		if( Math.floor( _cur_index ) == _num_images - 1 ) {
			_continue_button.fadeIn();
		} else {
			_continue_button.fadeOut();
		}
	};

	var addRotation = function( amount ) {
		_cur_index += amount * _drag_adjust;
		setIndex();
	};

	init();

	// returns the public interface for the ImageRotator object
	return {
		show : show,
		addRotation : addRotation
	}
};

var HTMLDemo = function() {
	// scope helper
	// var self = this;

	var _isIOS = false;
	if( navigator.userAgent.match(/iPhone/i) ) _isIOS = true;
    else if( navigator.userAgent.match(/iPod/i) ) _isIOS = true;
    else if( navigator.userAgent.match(/iPad/i) ) _isIOS = true;

	if( _isIOS ) {
		document.addEventListener('touchmove',function(e){
		    e.preventDefault();
		});
	}

	// app objects
	var _outer_holder = null;
	var _jme_player = null;
	var _image_rotator = null;
	var _image_rotator_holder = null;
	var _continue_button = null;
	var _cursor = null;
	var _touch_tracker = null;
	var _touch_delegate = {};
	var _touch_speed = 0;

	// app state
	var TARGET_INTERACTION_TIME = 9.16;
	var _hasInteracted = false;

	// element selection
	_outer_holder = $('#video_container');

	var init = function() {
		setUpVideo();
		setUpRotator( this );
		$('#content').removeClass('no-js');
		runTimer();
	};

	var setUpRotator = function( self ) {
		_image_rotator_holder = $('#image_rotator');
		_continue_button = $('#continue');
		var imagesContainer = $('#image_rotator_images');
		var instructions = $('#instructions');

		_continue_button.hide();
		_continue_button.bind('click', function(){
			rotatorDone();
		});

		_cursor = new Cursor('../images/cur/openhand.cur','../images/cur/closedhand.cur');
		_image_rotator = new ImageRotator( imagesContainer, 32, 'videos/stills/', 'jpg', self, instructions, _continue_button );
		_touch_tracker = new MouseAndTouchTracker( _image_rotator_holder[0], _touch_delegate, false );

		rotatorReady();
	};

	var setUpVideo = function(){
		// embed video with JME & store the video element
		_jme_player = $('video').jmeEmbed({
			removeControls: true,
			jwPlayer: {
				path: 'player/player.swf',
				params: {
		            wmode: 'transparent'
		        }
			}
		});

		// autoplay... replace with with images loaded for spinner
		_jme_player.jmeReady(function(){
		});

		// attach video event listeners
		// _jme_player.bind('play', function(e){ console.log('playing'); });
		// _jme_player.bind('timechange', function(e,obj){ console.log('time: '+obj.time); });
		_jme_player.bind('ended', function(e){
			_outer_holder.animate({ opacity:0 });
		});

		if( _isIOS ) _jme_player.hide();
	};

	var rotatorReady = function(){
		_outer_holder.css({ visibility:'visible', opacity:0 });
		_outer_holder.animate({ opacity:1 });

		if( !_isIOS ) {
			_jme_player.play();
			showVideo();
		}
	};

	var rotatorDone = function(){
		if( !_isIOS ) {
			_jme_player.play();
			showVideo();
		}
	};

	var showVideo = function(){
		_jme_player.css({ top:0 });
		_image_rotator_holder.css({ top:-953 });
	};

	var showRotator = function(){
		_jme_player.css({ top:0 });
		_image_rotator_holder.css({ top:-953 });
	};

	var checkVideoTime = function(){
		if( _jme_player && !_hasInteracted ) {
			var curTime = _jme_player.currentTime();
			if( curTime >= TARGET_INTERACTION_TIME ) {
				_hasInteracted = true;
				_jme_player.pause();
				_jme_player.css({ top:-953 });
				_image_rotator_holder.css({ top:0 });
				_image_rotator.show();
			}
		}
	};

	var runTimer = function(){
		checkVideoTime();

		// decelerate mouse speed down if not touching
		if( Math.abs( _touch_speed ) > 0.1 && !_touch_tracker.is_touching ) {
			_touch_speed *= 0.9;
			if( Math.abs( _touch_speed ) < 0.1 ) _touch_speed = 0;
			_image_rotator.addRotation( _touch_speed );
		}

		// keep timer running
		setTimeout(function(){ runTimer(); },33);
	};

	_touch_delegate.touchUpdated = function( state, touchEvent ){
		switch( state ) {
			case MouseAndTouchTracker.state_start :
				_cursor.setGrabbyHand();
				break;
			case MouseAndTouchTracker.state_move :
				_image_rotator.addRotation( _touch_tracker.touchspeed.x );
				break;
			case MouseAndTouchTracker.state_end :
		        if( _touch_tracker.touch_is_inside ) _cursor.setHand();
		        else _cursor.setDefault();
				_touch_speed = _touch_tracker.touchspeed.x;
				break;
			case MouseAndTouchTracker.state_enter :
				if( !_touch_tracker.is_touching ) _cursor.setHand();
				break;
			case MouseAndTouchTracker.state_leave :
				if(_touch_tracker.is_touching) _cursor.setGrabbyHand();
				else _cursor.setDefault();
				break;
		}
	};

	return {
		init : init,
		rotatorReady : rotatorReady,
		setUpRotator : setUpRotator
	}
};

var demo = new HTMLDemo();
demo.init( demo );