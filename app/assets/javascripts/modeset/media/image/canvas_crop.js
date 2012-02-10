CanvasCrop = function ( container, width, height, origW, origH, scaleType ) {
  this.container = container;
  this.width = width;
  this.height = height;
  this.img_width = origW;
  this.img_height = origH;
  this.resized_width = width;
  this.resized_height = height;
  this.scale_type = scaleType;
  this.scale = 1;
  
  var canvas = this.container.getElementsByTagName('canvas')[0] || null;
  this.img = null;
  
  if( canvas && typeof DOMUtil !== 'undefined' ) DOMUtil.recurseDisableElements( canvas );
  
  this.init();
};

CanvasCrop.CROP = 'CROP';
CanvasCrop.CROP_TOP = 'CROP_TOP';
CanvasCrop.LETTERBOX = 'LETTERBOX';

CanvasCrop.prototype.init = function () { 
  // grab image element
  this.resize();
};

CanvasCrop.prototype.getImg = function () { 
  return this.canvas;
};

CanvasCrop.prototype.getContainer = function () { 
  return this.container;
};

// called externally if the container doesn't already have an <img> element as the child
CanvasCrop.prototype.buildEmptyImageForCrop = function () { 
  var img = document.createElement('img');
  img.width = this.img_width;
  img.height = this.img_height;
  this.container.appendChild( img );

  if( typeof DOMUtil !== 'undefined' ) DOMUtil.recurseDisableElements( img );
};

CanvasCrop.prototype.setImagePath = function ( path ) { 
  var img = this.container.getElementsByTagName('img')[0] || null;
  if( img ) {
    img.setAttribute( canvas_pool.DATA_PATH_ATTR , path );
  }
}

CanvasCrop.prototype.deQueueCanvas = function () { 
  var canvas = this.container.getElementsByTagName('canvas')[0] || null;
  if( canvas ) canvas_pool_queue.removeCanvasFromQueue( canvas );
};


CanvasCrop.prototype.deactivateCanvas = function () { 
  var canvas = this.container.getElementsByTagName('canvas')[0] || null;
  if( typeof canvas !== 'undefined' && canvas != null ) {
    canvas_pool_queue.removeCanvasFromQueue( canvas );
    canvas_pool.replaceCanvasWithImage( canvas, this.img_width, this.img_height );
  }
};

// called by work_scroller to fit letterboxed size to outer container
CanvasCrop.prototype.activateCanvas = function () { 
  var img = this.container.getElementsByTagName('img')[0] || null;
  if( img ) {
    canvas_pool_queue.addImage( img );
  }
  // force a reposition/resize after converting to canvas. 
  this.updateContainerSize( this.width, this.height );
  this.setContainerSizeToImageSize();
  // also disable clicking on the thing
  var canvas = this.container.getElementsByTagName('canvas')[0] || null;
  if( canvas && typeof DOMUtil !== 'undefined' ) DOMUtil.recurseDisableElements( canvas );
};

// called by app_background to fade in new image
CanvasCrop.prototype.activateCanvasNoQueue = function ( callback ) { 
  var img = this.container.getElementsByTagName('img')[0] || null;
  if( img ) {
    canvas_pool.replaceImageWithCanvas( img, callback, false );
  }
  // force a reposition/resize after converting to canvas. 
  this.updateContainerSize( this.width, this.height );
  this.setContainerSizeToImageSize();
  // also disable clicking on the thing
  var canvas = this.container.getElementsByTagName('canvas')[0] || null;
  if( canvas && typeof DOMUtil !== 'undefined' ) DOMUtil.recurseDisableElements( canvas );
};

// culture-specific loader for its own queue system
CanvasCrop.prototype.activateCultureCanvas = function ( callback ) { 
  var img = this.container.getElementsByTagName('img')[0] || null;
  if( img ) {
    // canvas_pool_queue.addImage( img );
    canvas_pool.replaceImageWithCanvas( img, callback, false );
  }
};

CanvasCrop.prototype.setCropSizeWithLoadedCanvas = function ( callback ) { 
  var canvas = this.container.getElementsByTagName('canvas')[0] || null;
  if( canvas ) {
    this.img_width = canvas.width;
    this.img_height = canvas.height;
    this.resize();
  }
};

CanvasCrop.prototype.deactivateCultureCanvas = function () { 
  var canvas = this.container.getElementsByTagName('canvas')[0] || null;
  if( canvas ) {
    canvas_pool.replaceCanvasWithImage( canvas, this.img_width, this.img_height );
  }
};



CanvasCrop.prototype.updateContainerSize = function ( width, height ) { 
  this.width = width;
  this.height = height;
  this.resize();
};

CanvasCrop.prototype.setContainerSizeToImageSize = function () { 
  this.container.style.width = this.resized_width+'px';
  this.container.style.height = this.resized_height+'px';
  this.setPositionAndScale( 0, 0, this.scale );
};

CanvasCrop.prototype.resize = function () {  
  // set outer container size
  this.container.style.width = this.width+'px';
  this.container.style.height = this.height+'px';

  // get ratios of 2 sides
  var ratio_w = this.width / this.img_width;
  var ratio_h = this.height / this.img_height;
  var shorterRatio = ( ratio_w > ratio_h ) ? ratio_h : ratio_w;
  var longerRatio = ( ratio_w > ratio_h ) ? ratio_w : ratio_h;

  // get shorter ratio, so we fill the target area
  this.resized_width = ( this.scale_type == CanvasCrop.CROP || this.scale_type == CanvasCrop.CROP_TOP ) ? this.img_width * longerRatio : this.img_width * shorterRatio;
  this.resized_height = ( this.scale_type == CanvasCrop.CROP || this.scale_type == CanvasCrop.CROP_TOP ) ? this.img_height * longerRatio : this.img_height * shorterRatio;
  this.resized_width = Math.round( this.resized_width );
  this.resized_height = Math.round( this.resized_height );
  
  // calc scale and position
  this.scale =  ( this.scale_type == CanvasCrop.CROP || this.scale_type == CanvasCrop.CROP_TOP ) ? longerRatio : shorterRatio;
  var x = Math.round(this.width / 2 - this.resized_width / 2);
  var y = ( this.scale_type == CanvasCrop.CROP_TOP ) ? 0 : Math.round(this.height / 2 - this.resized_height / 2);
  
  // update css
  this.setPositionAndScale( x, y, this.scale );
};

CanvasCrop.prototype.setPositionAndScale = function ( x, y, scale ) {  
  // resize and position image
  var canvas = this.container.getElementsByTagName('canvas')[0] || null;
  if( canvas != null ) {
    var new_transform = "translate3d(" + x + "px, " + y + "px, 0px) scale(" + scale + ")";
    if( canvas.style.webkitTransform != new_transform ) {
      canvas.style.webkitTransform = new_transform; 
    }
  }
}

CanvasCrop.prototype.dispose = function () {
  this.container = null;
  this.width = null;
  this.height = null;
  this.img_width = null;
  this.img_height = null;
  this.scale_type = null;
  this.canvas = null;
  
};