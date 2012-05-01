
/*
 *  Requires a <div> (container) with an <img> as the first child.
 *  Also requires a little CSS.
 *
 *  div.section-background
 *    position: relative
 *    overflow: hidden
 *
 *    img
 *      position: absolute
 *      max-width: none
 */

ImageCrop = function ( container, width, height, origW, origH, scaleType, imgIndex ) {
  this.container = container;
  this.width = width;
  this.height = height;
  this.img_width = origW;
  this.img_height = origH;
  this.img_width = origW || -1;
  this.img_height = origH || -1;
  this.resized_width = width;
  this.resized_height = height;
  this.scale_type = scaleType || ImageCrop.CROP;

  imgIndex = imgIndex || 0;
  this.img = this.container.getElementsByTagName('img')[imgIndex] || null;
  if( typeof DOMUtil !== 'undefined' ) DOMUtil.recurseDisableElements( this.img, ['img','div'] );

  this.resize();
};

ImageCrop.CROP = 'CROP';
ImageCrop.CROP_TOP = 'CROP_TOP';
ImageCrop.CROP_BOTTOM = 'CROP_BOTTOM';
ImageCrop.LETTERBOX = 'LETTERBOX';

ImageCrop.prototype.updateContainerSize = function ( width, height ) {
  this.width = width;
  this.height = height;
  this.resize();
};

ImageCrop.prototype.setScaleType = function ( scaleType ) {
  this.scale_type = scaleType;
  this.resize();
}

ImageCrop.prototype.resize = function () {
  if( this.img ) {
    // set outer container size
    this.container.style.width = (this.width)+'px';
    this.container.style.height = (this.height)+'px';

    // get ratios of 2 sides
    var ratio_w = this.width / this.img_width;
    var ratio_h = this.height / this.img_height;
    var shorterRatio = ( ratio_w > ratio_h ) ? ratio_h : ratio_w;
    var longerRatio = ( ratio_w > ratio_h ) ? ratio_w : ratio_h;

    // get shorter ratio, so we fill the target area
    this.resized_width = ( this.scale_type.indexOf('CROP') != -1 ) ? this.img_width * longerRatio : this.img_width * shorterRatio;
    this.resized_height = ( this.scale_type.indexOf('CROP') != -1 ) ? this.img_height * longerRatio : this.img_height * shorterRatio;
    if( this.scale_type == ImageCrop.CROP_BOTTOM ) {
      if( this.resized_width > this.width ) {
        this.resized_width = this.img_width * shorterRatio;
        this.resized_height = this.img_height * shorterRatio;
      }
    }
    this.resized_width = Math.ceil( this.resized_width );
    this.resized_height = Math.ceil( this.resized_height );

    // resize and position image
    this.img.width = this.resized_width;
    this.img.height = this.resized_height;
    this.img.style.left = Math.ceil(this.width / 2 - this.resized_width / 2)+'px';
    this.img.style.top = ( this.scale_type == ImageCrop.CROP_TOP ) ? '0px' : Math.ceil(this.height / 2 - this.resized_height / 2)+'px';
    if( this.scale_type == ImageCrop.CROP_BOTTOM ) {
      this.img.style.top = '';
      this.img.style.bottom = '0px';
    }
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

