var ImageUtil = ImageUtil || {};


ImageUtil.preloadImageWithCallback = function( src, callback ) {
  var image = new Image();
  image.onload = image.onerror = function () {
    image.onload = image.onerror = null;
    callback(image);
  };
  // image.crossOrigin = '';  also: crossorigin="anonymous" in the <img> 
  image.src = src;
};


ImageUtil.getImageSizeWithCallback = function( src, callback ) {
  var image = new Image();
  image.onload = function () {
    // TODO: look at naturalWidth & naturalHeight
    if( callback ) callback( image.width, image.height );
    image.onload = image.onerror = null;
  };
  image.onerror = function () {
    if( callback ) callback( -1, -1 );
    image.onload = image.onerror = null;
  };
  // load it
  image.src = src;
};


ImageUtil.getOffsetAndSizeToCrop = function( containerW, containerH, imageW, imageH, cropFill ) {
  var ratioW = containerW / imageW;
  var ratioH = containerH / imageH;
  var shorterRatio = ratioW > ratioH ? ratioH : ratioW;
  var longerRatio = ratioW > ratioH ? ratioW : ratioH;
  var resizedW = cropFill ? Math.ceil(imageW * longerRatio) : Math.ceil(imageW * shorterRatio);
  var resizedH = cropFill ? Math.ceil(imageH * longerRatio) : Math.ceil(imageH * shorterRatio);
  var offsetX = Math.ceil((containerW - resizedW) * 0.5);
  var offsetY = Math.ceil((containerH - resizedH) * 0.5);
  return [offsetX, offsetY, resizedW, resizedH];
};


ImageUtil.CROP = 'CROP';
ImageUtil.CROP_TOP = 'CROP_TOP';
ImageUtil.CROP_BOTTOM = 'CROP_BOTTOM';
ImageUtil.LETTERBOX = 'LETTERBOX';

ImageUtil.cropImage = function ( containerEl, containerW, containerH, imageEl, imageW, imageH, cropType ) {
  var cropFill = ( cropType == ImageUtil.CROP || cropType == ImageUtil.CROP_TOP || cropType == ImageUtil.CROP_BOTTOM );
  var offsetAndSize = ImageUtil.getOffsetAndSizeToCrop(containerW, containerH, imageW, imageH, cropFill);

  // set outer container size
  containerEl.style.width = containerW+'px';
  containerEl.style.height = containerH+'px';

  // resize image
  imageEl.width = offsetAndSize[2];
  imageEl.height = offsetAndSize[3];
  imageEl.style.width = offsetAndSize[2]+'px';
  imageEl.style.height = offsetAndSize[3]+'px';

  // position image
  imageEl.style.left = offsetAndSize[0]+'px';
  imageEl.style.top = offsetAndSize[1]+'px';

  // special y-positioning 
  if( cropType == ImageUtil.CROP_TOP ) {
    imageEl.style.top = '0px';
    imageEl.style.bottom = '';
  } else if( cropType == ImageUtil.CROP_BOTTOM ) {
    imageEl.style.top = '';
    imageEl.style.bottom = '0px';
  }
};

