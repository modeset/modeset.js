var GetImageSize = function( src, callback ) {
  this.src = src;
  this.callback = callback;
  this.image = new Image();
  this.requestImageSize()
};

GetImageSize.prototype.requestImageSize = function () { 
  var self = this;
  // create load/error callbacks
  this.image.onload = function () {
    // TODO: look at naturalWidth & naturalHeight
    if( self.callback ) self.callback( self.image.width, self.image.height );
    self.cleanup();
  };
  this.image.onerror = function () {
    if( self.callback ) self.callback( -1, -1 );
    self.cleanup();
  };
  // load it
  this.image.src = this.src;
};

GetImageSize.prototype.cleanup = function() {
  delete this.image.onload;
  delete this.image.onerror;
  delete this.image;
  delete this.src;
  delete this.callback;
};
