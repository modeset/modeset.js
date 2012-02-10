var ImageAnimation = function( width, height, imageHolder, image, numFrames, frameRate ) {
  // private vars
  var _width = width;
  var _height = height;
  var _num_frames = numFrames;
  var _cur_frame = 0;
  var _timeout = null;
  var _framerate = frameRate || Math.round( 1000/30 );
  
  // grab container refs
  var _img_holder = imageHolder;
  var _img_sprite = image;

  /* private methods */
  var runTimer = function(){
    // advance image sequence
    _cur_frame++;
    if(_cur_frame == _num_frames) _cur_frame = 0;
    if( typeof platform_helper !== 'undefined' ) {
      platform_helper.update2DPosition( _img_sprite, -_width * _cur_frame, 0 );
    } else {
      _img_sprite.style.left = ( -_width * _cur_frame ) + 'px';
    }
    // keep timer running
    _timeout = setTimeout( function() { runTimer(); } , _framerate );
  };
  
  var stopTimer = function() {
    if( typeof _timeout !== 'undefined' ) {
      clearTimeout( _timeout );
    }
  };
  
  /* public methods */
  return {
    start: function() {
      stopTimer();
      _timeout = setTimeout( function() { runTimer(); } , _framerate );
    },
    
    stop: function() {
      stopTimer();
    }
  };
};