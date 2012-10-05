var ImageUtil = ImageUtil || {};

ImageUtil.getOffsetAndSizeToCrop = function(containerW, containerH, imageW, imageH, cropFill) {
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

ImageUtil.preloadImageWithCallback = function(src, callback) {
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
  console.log('load: '+src);
};
