var YouTubeCustomVideo = function( videoContainerId, videoId, width, height, origWidth, origHeight, playbackCallback, stateCallback ) {
  
  // player consts
	var DEFAULT_QUALITY = 'default';
  var SWF_ID = "ytplayer";
  
  // Classname constants
	var READY_CLASS = 'ready';
	var CUED_CLASS = 'cued';
	var INITIATED_CLASS = 'initiated';
	var PLAYING_CLASS = 'playing';
	var MUTE_CLASS = 'mute';
	var UPDATING_CLASS = 'updating';

	// Player states
	var UNSTARTED = -1;
	var ENDED = 0;
	var PLAYING = 1;
	var PAUSED = 2;
	var BUFFERING = 3;
	var VIDEO_CUED = 5;

	// Error codes
	var NOT_FOUND = 100;
	var EMBEDDING_NOT_ALLOWED_1 = 101;
	var EMBEDDING_NOT_ALLOWED_2 = 150;
  
  // player vars
  var _youtube_id = videoId;
  var _swf = null;
  var _state = null;
  var _video_duration = 0;
  var _video_cur_time = 0;
  var _bytes_loaded = 0;
  var _bytes_total = 0;
  var _timer_active = false;
  var _timerFPS = Math.round(1000/30);

  var _playback_callback = playbackCallback; 
  var _state_callback = stateCallback; 
  
  
  var init = function(){
    // set up global listener for swf loaded - cue video
    window.onYouTubePlayerReady = function(domID) {
      _swf = document.getElementById( SWF_ID );
      _swf.cueVideoById( _youtube_id, 0, DEFAULT_QUALITY );
      
      addVideoObjectListeners();
      play();
    };
    
    // embed player
    var params = { playerapiid: SWF_ID, allowScriptAccess: "always", allowFullScreen: "true", wmode:"transparent", rel:"0", controls:"0", showsearch:"0", egm:"0", autoplay:"0", loop:"0", disablekb:"0", border:"0", showinfo:"0", fs:"0", iv_load_policy:"3", cc_load_policy:"0", color1:"f26522", color2:"f26522" };
    var atts = { id: SWF_ID, play:"false", quality:"autohigh", menu:"true", loop:"false" };
    var embed = swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&version=3", videoContainerId, width, height, "9", null, null, params, atts );
  };
  
  var addVideoObjectListeners = function(){
    
    window.ytOnStateChange = function( newState ){
      // store for seeking state
      _state = newState;
      // get metadata once the video starts
      if( newState == PLAYING ) {
        onPlayStarted();
      } 
      // start timer if video's started doing something
      if( newState == PLAYING || newState == BUFFERING ) {
        if( !_timer_active ) {
    		  _timer_active = true;
    		  runTimer();
    		}
      }
      // send back state to delegate
      _state_callback( newState );
    };
    
    window.ytOnError = function( errorCode ){
			switch (errorCode) {
				case NOT_FOUND:
					break;
				case EMBEDDING_NOT_ALLOWED_1:
					break;
				case EMBEDDING_NOT_ALLOWED_2:
					break;
			}			
    };
    
    _swf.addEventListener( 'onStateChange', 'ytOnStateChange' );
    _swf.addEventListener( 'onError', 'ytOnError' );
    // _swf.addEventListener( 'onPlaybackQualityChange', listener:String);
  };
  
  var onPlayStarted = function(){
    _video_duration = _swf.getDuration();
  };
  
  var runTimer = function(){
    // get video playback data
    if( _swf ) {
      if( _swf.getDuration ) _video_duration = _swf.getDuration();
      if( _swf.getCurrentTime ) _video_cur_time = _swf.getCurrentTime();
      if( _swf.getVideoBytesLoaded ) _bytes_loaded = _swf.getVideoBytesLoaded();
      if( _swf.getVideoBytesTotal ) _bytes_total = _swf.getVideoBytesTotal();
      _playback_callback( _video_cur_time, _video_duration, _bytes_loaded, _bytes_total, formatTime(_video_cur_time) );
    }
    
    // keep timer running unless disposed
    setTimeout( function(){
      if( _timer_active ) runTimer();
    }, _timerFPS );
  };
  
  var play = function() {
	  _swf.playVideo();
	};

	var pause = function() {
		_swf.pauseVideo();
	};

	var seek = function( percent ) {
    _swf.seekTo( percent * _video_duration, true );
    if ( _state == PAUSED || _state == ENDED ) pause();
	};
	
	var pad = function(n) {
		return (n > 9) ? n : '0' + n ;
	};
	
	var formatTime = function(time) {
		var min = Math.floor(time / 60);
		var sec = Math.round(time % 60);

		return [pad(min), ':', pad(sec)].join('');
	};
	
  
  var dispose = function(){
    // swfobject.removeSWF( SWF_ID );
    window.onYouTubePlayerReady = null;
    window.ytOnStateChange = null;
    window.ytOnError = null;
    _playback_callback = null;
    _state_callback = null;
    _swf = null;
    _timer_active = false;
  };
  
  // auto-init
  init();
  
  return {
    play : play,
    pause : pause,
    seek : seek,
    dispose : dispose,
    PLAYING : PLAYING,
    PAUSED : PAUSED,
    ENDED : ENDED
  };
  
};
