/*
 *  Requires a <div> (container) with an <img> as the first child. 
 *  Also requires a little CSS.
 */

ImageCrop = function ( container, width, height, origW, origH, scaleType ) {
  this.container = container;
  this.width = width;
  this.height = height;
  this.img_width = origW;
  this.img_height = origH;
  this.resized_width = width;
  this.resized_height = height;
  this.scale_type = scaleType;
  
  this.img = this.container.getElementsByTagName('img')[0] || null;
  
  if( typeof DOMUtil !== 'undefined' ) DOMUtil.recurseDisableElements( this.img );
  
  this.init();
};

ImageCrop.CROP = 'CROP';
ImageCrop.CROP_TOP = 'CROP_TOP';
ImageCrop.LETTERBOX = 'LETTERBOX';

ImageCrop.prototype.init = function () { 
  // grab image element
  this.resize();
};

ImageCrop.prototype.getImg = function () { 
  return this.img;
};

ImageCrop.prototype.getContainer = function () { 
  return this.container;
};

// called externally if the container doesn't already have an <img> element as the child
ImageCrop.prototype.buildImageForCrop = function () { 
  this.img = document.createElement('img');
  this.img.width = this.img_width;
  this.img.height = this.img_height;
  this.container.appendChild( this.img );
  this.resize();

  if( typeof DOMUtil !== 'undefined' ) DOMUtil.recurseDisableElements( this.img );
};

ImageCrop.prototype.setOriginalSizeOnLoad = function ( callback ) { 
  var self = this;
  var image = new Image();
  
  // hack for now
  $( this.img ).hide();
  
  var cleanup = function(){
    image.onload = null;
    image.onerror = null;
    image = null;
  };

  // load image, with callback
  image.onload = function () {
    self.img_width = image.width;
    self.img_height = image.height;
    $( self.img ).show();
    if( callback ) callback();
    self.resize();
    cleanup();
  };
  image.onerror = function () {
    self.img.className += ' loaded error';
    cleanup();
  };
  // preload... naughty double load?
  image.src = this.img.getAttribute( canvas_pool.DATA_PATH_ATTR );
};

ImageCrop.prototype.unloadImage = function () { 
  this.img.src = '';
};


ImageCrop.prototype.updateContainerSize = function ( width, height ) { 
  this.width = width;
  this.height = height;
  this.resize();
};

ImageCrop.prototype.setContainerSizeToImageSize = function () { 
  this.container.style.width = this.resized_width+'px';
  this.container.style.height = this.resized_height+'px';
  this.img.style.top = '0px';
  this.img.style.left = '0px';
};

ImageCrop.prototype.resize = function () {  
  if( this.img ) {  
    // set outer container size
    this.container.style.width = this.width+'px';
    this.container.style.height = this.height+'px';

    // get ratios of 2 sides
    var ratio_w = this.width / this.img_width;
    var ratio_h = this.height / this.img_height;
    var shorterRatio = ( ratio_w > ratio_h ) ? ratio_h : ratio_w;
    var longerRatio = ( ratio_w > ratio_h ) ? ratio_w : ratio_h;

    // get shorter ratio, so we fill the target area
    this.resized_width = ( this.scale_type == ImageCrop.CROP || this.scale_type == ImageCrop.CROP_TOP ) ? this.img_width * longerRatio : this.img_width * shorterRatio;
    this.resized_height = ( this.scale_type == ImageCrop.CROP || this.scale_type == ImageCrop.CROP_TOP ) ? this.img_height * longerRatio : this.img_height * shorterRatio;
    this.resized_width = Math.round( this.resized_width );
    this.resized_height = Math.round( this.resized_height );
    
    // resize and position image
    this.img.width = this.resized_width;
    this.img.height = this.resized_height;
    this.img.style.left = Math.round(this.width / 2 - this.resized_width / 2)+'px';
    this.img.style.top = ( this.scale_type == ImageCrop.CROP_TOP ) ? '0px' : Math.round(this.height / 2 - this.resized_height / 2)+'px';
  }
};

ImageCrop.prototype.dispose = function () {
  this.container = null;
  this.width = null;
  this.height = null;
  this.img_width = null;
  this.img_height = null;
  this.scale_type = null;
  this.img = null;
  
};