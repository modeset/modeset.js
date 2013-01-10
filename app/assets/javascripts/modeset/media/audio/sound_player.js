function SoundPlayer( file, context, loadedCallback ) {
  this.audioContext = context || new webkitAudioContext();
  this.file = file;
  this.loadAudio();
  this.playOnLoad = false;
  this.loadedCallback = loadedCallback;
}

SoundPlayer.prototype.playSound = function() {
  if( !this.buffer ) {
    this.playOnLoad = true;
  } else {
    var sourceNode = this.audioContext.createBufferSource();
    sourceNode.buffer = this.buffer;
    sourceNode.loop = false;
    sourceNode.connect( this.audioContext.destination );
    this.sound = sourceNode;
    this.sound.noteOn(0);
  }
}

SoundPlayer.prototype.stopSound = function() {
  if (this.sound) this.sound.noteOff(0);
  // this.sound = null;
}

SoundPlayer.prototype.loadAudio = function() {
  var self = this;
  var request = new XMLHttpRequest();
  request.open("GET", this.file, true);
  request.responseType = "arraybuffer";
  request.onload = function() {
    self.audioContext.decodeAudioData( request.response, function(buffer) { 
        self.buffer = buffer;
        if( self.playOnLoad ) self.playSound();
        if( self.loadedCallback ) self.loadedCallback( self.file )
    } );
  }
  request.send();
}
