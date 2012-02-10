var CanvasPoolQueue = function(){
  _queued_load_obj = null;
  _is_loading = false;
  
  var init = function(){
    _queued_load_obj = [];
  };
  
  var addImage = function( imgElement ){
    // get a load function in return, to be called in sequence
    var loadObject = canvas_pool.replaceImageWithCanvas( imgElement, loadingComplete, true );
    _queued_load_obj.push( loadObject );
    if( !_is_loading ) loadNextImage();
  };
  
  var loadNextImage = function(){
    _is_loading = true;
    var asyncLoadObj = _queued_load_obj.shift();
    if( typeof asyncLoadObj !== 'undefined' && asyncLoadObj.load ) {
      asyncLoadObj.load();
    } else {
      if( _queued_load_obj.length > 0 ) {
        loadNextImage();
      } else {
        _is_loading = false;
      }
    }
  };
  
  var loadingComplete = function(){
    if( _queued_load_obj.length > 0 ){
      setTimeout(function(){
        loadNextImage();
      },100);
    } else {
      _is_loading = false;
    }
  };
  
  var removeCanvasFromQueue = function( canvasElement ){
    for (var i = _queued_load_obj.length - 1; i >= 0; i--){
      if ( canvasElement == _queued_load_obj[i].canvas ) {
        // splice and destroy
        delete _queued_load_obj[i].canvas;
        delete _queued_load_obj[i].load;
        _queued_load_obj.splice( i, 1 );
      }
    };
  };
  
  init();
  
  return {
    addImage : addImage,
    removeCanvasFromQueue : removeCanvasFromQueue
  };
};