/*
<!-- player -->
<div id="player">
	<video tabindex="0" id="screen" height="360" width="640">
		<source src="Legwork_files/party.mp4" type="video/mp4; codecs=&quot;avc1.42E01E, mp4a.40.2&quot;">
		<source src="Legwork_files/party.txt" type="video/webm; codecs=&quot;vp8, vorbis&quot;">
		<source src="Legwork_files/party.ogv" type="video/ogg; codecs=&quot;theora, vorbis&quot;">
		<p id="not-supported">Sorry, your browser does not support the <em>video</em> element.</p>
	</video>
	<div style="background-position: 0px 0px;" id="play-pause-btn">
	</div>
	<div style="background-position: 0px 0px;" id="seekbar">
	</div>
	<div id="mute-btn">
	</div>
</div>
<!--/player -->
*/


// global vars
var player = null;
var playheadInterval = 0;
var setBg = false;

$(document).ready(function() {
	
	$('<img />').attr('src', 'data/images/end.jpg');
	
	// reference to the player
	player = document.getElementById('screen');
	
	// player events
	player.addEventListener('error', onPlayerError, false);
	player.addEventListener('play', onPlayerPlay, false);
	player.addEventListener('pause', onPlayerPause, false);
	player.addEventListener('seeked', onPlayerSeeked, false);
	player.addEventListener('volumechange', onPlayerVolumeChange, false);
	player.addEventListener('ended', onPlayerEnded, false);
	
	// play/pause button
	$('#play-pause-btn').click(function() {
		playPause();
	});
	
	// seekbar click
	$('#seekbar').click(function(e) {
		var localX = (e.pageX - $(this).offset().left) - 17;
		if(localX > $(this).innerWidth()) localX = $(this).innerWidth();
	
		var percent = localX / $('#seekbar').innerWidth();
		seekToPercent(percent);
	});
	
	// mute button
	$('#mute-btn').click(function() {
		toggleSound();
	});
});

/************************************************ 
 * onPlayerError:void                           *
 *                                              *
 * An error has occured.                        *
 *                                              *
 * e:Object - event argument.                   *
 ************************************************
/                                              */
onPlayerError = function(e) {
	switch (e.target.error.code) {
		case e.target.error.MEDIA_ERR_ABORTED:
			alert('You aborted the video playback.');
			break;
		case e.target.error.MEDIA_ERR_NETWORK:
			alert('A network error caused the video download to fail part-way.');
			break;
		case e.target.error.MEDIA_ERR_DECODE:
			alert('The video playback was aborted due to a corruption problem or because the video used features your browser did not support.');
			break;
		case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
			alert('The video could not be loaded, either because the server or network failed or because the format is not supported.');
			break;
		default:
			alert('An unknown error occurred.');
			break;
	}
}

/************************************************ 
 * onPlayerPlay:void                            *
 *                                              *
 * Player has started playing.                  *
 ************************************************
/                                              */
onPlayerPlay = function() {
	$('#play-pause-btn').css('background-position', '0px -40px');
	playheadInterval = setInterval(updatePlayhead, 33);
}

/************************************************ 
 * onPlayerPause:void                           *
 *                                              *
 * Player has been paused.                      *
 ************************************************
/                                              */
onPlayerPause = function() {
	$('#play-pause-btn').css('background-position', '0px 0px');
	clearInterval(playheadInterval);
}

/************************************************ 
 * onPlayerSeeked:void                          *
 *                                              *
 * Player has been seeked.                      *
 ************************************************
/                                              */
onPlayerSeeked = function() {
	if(player.paused) updatePlayhead();
}

/************************************************ 
 * onPlayerVolumeChange:void                    *
 *                                              *
 * Player volume has changed.                   *
 ************************************************
/                                              */
onPlayerVolumeChange = function() {
	if(player.volume == 0 || player.muted) $('#mute-btn').css('background-position', '0px -40px');
	else $('#mute-btn').css('background-position', '0px 0px');
}

/************************************************ 
 * onPlayerEnded:void                           *
 *                                              *
 * Playback has ended.                          *
 ************************************************
/                                              */
onPlayerEnded = function() {
	player.currentTime = 0;
	player.pause();
	clearInterval(playheadInterval);
}

/************************************************ 
 * updatePlayhead:void                          *
 *                                              *
 * Update the seekbar.                          *
 ************************************************
/                                              */
updatePlayhead = function() {
	var percentage = player.currentTime / player.duration;
	$('#seekbar').css('background-position', Math.round(percentage * $('#seekbar').innerWidth()) + 'px 0px');
	
	if(!setBg && player.currentTime > 2.9) {
    setBg = true;
    $('body').css('background', '#333 url(data/images/end.jpg) no-repeat 50% 0px');
	} else if(setBg && player.currentTime < 2.9) {
    setBg = false;
    $('body').css('background', '#ffff2d url(data/images/start.gif) no-repeat 50% 0px');
	}
}

/************************************************ 
 * playPause:void                               *
 *                                              *
 * Toggle play/pause.                           *
 ************************************************
/                                              */
playPause = function() {
	if(player.paused) {
		player.play();
	} else {
		player.pause();
	}
}

/************************************************ 
 * seekToPercent:void                           *
 *                                              *
 * Seek to the passed percentage.               *
 *                                              *
 * percent:Number - percent to seek to.         *
 ************************************************
/                                              */
seekToPercent = function(percent) {
	var time = percent * player.duration;
	player.currentTime = time;
}

/************************************************ 
 * toggleSound:void                             *
 *                                              *
 * Toggle mute/unmute.                          *
 ************************************************
/                                              */
toggleSound = function() {
	if(player.muted) {
		player.muted = false;
	} else {
		player.muted = true;
	}
}