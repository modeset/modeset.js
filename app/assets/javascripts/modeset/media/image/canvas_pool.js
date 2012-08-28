var CanvasPool = function( numCanvases ){
  var _canvases = null;
  var _num_canvases = 0;
  var _active_canvases = 0;
  
  var DATA_PATH_ATTR = 'data-img-src';
  
  var init = function(){
    _canvases = [];
    _num_canvases = numCanvases;
    
    // create pool
    for ( var i = 0, len = _num_canvases; i < len; i += 1 ) {
      var newCanvas = document.createElement( 'canvas' );
      _canvases.push({ element: newCanvas, is_active: false });
    }
  };
  
  var getFreeCanvas = function () {
    for (var i = 0, len = _num_canvases; i < len; i += 1) {
      if ( _canvases[i].is_active === false ) {
        _canvases[i].is_active = true;
        updateNumActiveCanvii();
        return _canvases[i].element;
      }
    }
    updateNumActiveCanvii();
    return null;
  };
  
  var deactivateCanvas = function ( canvas_element ) {
    var context = canvas_element.getContext("2d");
    var w = parseInt(canvas_element.width);
    var h = parseInt(canvas_element.height);
    context.clearRect(0, 0, w, h);
    canvas_element.width = 1;
    canvas_element.height = 1;
    canvas_element.className = '';

    // _active_canvases = 0;
    for (var i = 0, len = _num_canvases; i < len; i += 1) {
      if (canvas_element === _canvases[i].element) {
        _canvases[i].is_active = false;
      }
    }
    
    updateNumActiveCanvii();
  };
  
  var updateNumActiveCanvii = function() {
    _active_canvases = 0;
    for ( var i = 0, len = _num_canvases; i < len; i += 1 ) {
      if ( _canvases[i].is_active === true ) {
        _active_canvases += 1;
      }
    }
  };
  
  var replaceImageWithCanvas = function ( imgElement, callback, async ) {
    // get props from img
    var src = imgElement.getAttribute( DATA_PATH_ATTR );
    // var w = imgElement.getAttribute('width');
    // var h = imgElement.getAttribute('height');
    // var className = imgElement.className+"";
    
    // create canvas, size it and replace the image element it got its data from
    var canvas = getFreeCanvas();
    // if( !canvas ) debug.log('ERROR: OUT OF CANVII');
    // canvas.width = w;
    // canvas.height = h;
    // canvas.className = className;
    canvas.setAttribute( DATA_PATH_ATTR , src );
    
    // swap img for canvas
    DOMUtil.replaceElement( imgElement, canvas );
    
    var loadImageObj = {
      load : function(){
        // get canvas context and create image loader
        var context = canvas.getContext("2d");
        var image = new Image();

        var cleanup = function(){
          delete image.src;
          image.onload = null;
          image.onerror = null;
          image = null;
          if( callback ) callback();
        };

        // load image, with callback
        image.onload = function () {
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0);
          cleanup();
          canvas.className += ' loaded';
        };
        image.onerror = function () {
          cleanup();
          canvas.className += ' loaded error';
        };
        // kick off the image load
        image.src = src;
      },
      canvas : canvas
    };
    
    if( async == true ) 
      return loadImageObj;
    else {
      loadImageObj.load();
    }
  };
  
  var replaceCanvasWithImage = function( canvas, w, h ) {
    var imgElement = document.createElement( 'img' );
    imgElement.width = w || canvas.width;   // HACK: had to do this since the image w&h is lost when we stop the initial queued loading
    imgElement.height = h || canvas.height;
    imgElement.setAttribute( DATA_PATH_ATTR, canvas.getAttribute( DATA_PATH_ATTR ) );
    // imgElement.className = canvas.className+"";

    deactivateCanvas( canvas );
    
    DOMUtil.replaceElement( canvas, imgElement );
  };
  
  
  init();
  
  return {
    DATA_PATH_ATTR : DATA_PATH_ATTR,
    getFreeCanvas : getFreeCanvas,
    deactivateCanvas : deactivateCanvas,
    replaceImageWithCanvas : replaceImageWithCanvas,
    replaceCanvasWithImage : replaceCanvasWithImage
  };
};
