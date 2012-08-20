var ModeSetLogo = function( holder, size ) {
  // init canvas & properties
  var _canvas = document.createElement('canvas');
  _canvas.width = _canvas.height = size;
  holder.appendChild( _canvas );
  var _context = _canvas.getContext("2d");
  var _size = size;
  var _touch_tracker = null;
  
  // draw mode flags
  var _drawNumbers = false;
  var _drawLines = true;
  
  // logo points and inner connections 
  var _points = [];
  var _numPoints;
  var _subTriangles = [];
  var _numTriangles;

  // keep track of mouse
  var _mouseX = -10;
  var _mouseY = -10;
  var _frameCount = 0;
  
  // displacement properties
  var _range = _size / 4;
  var _fric = .65;
  var _accel = .4;
  

  // toggle draw modes
  var handleKeyPress = function(evt) {
    // if(evt.keyCode == 78) _drawNumbers = !_drawNumbers;
    // if(evt.keyCode == 76) _drawLines = !_drawLines;
  };

  // kickstart my heart
  var init = function() {
    createPoints();
    _touch_tracker = new MouseAndTouchTracker( _canvas, touchUpdated, true, 'canvas' );
    MobileUtil.trackOrientation();
    _shake_gesture = new ShakeGesture( onShake, 20, 20, 1 );
    document.addEventListener('keydown',handleKeyPress,false);
    setTimeout( function() { draw(); }, 30 );
  };
  
  // calculate position in any touch state
  var touchUpdated = function( state, touchEvent ) {
    // keep track of drag distance
    switch (state) {
      case MouseAndTouchTracker.state_start:
        break;
      case MouseAndTouchTracker.state_move:
        _mouseX = _touch_tracker.touchcurrent.x;
        _mouseY = _touch_tracker.touchcurrent.y;
        _frameCount = 0;
        break;
      case MouseAndTouchTracker.state_end:
        break;
    }
  };

  var onShake = function( curX, curY, curZ ) {
    if( _touch_tracker ) {
      _touch_tracker.dispose();
      _touch_tracker = null;
    }
    _mouseX = _size/2 + curX;
    _mouseY = _size/2 + curY;
    // if( curX + curY > 100 ) _frameCount = 0;
  };
  
  // set up hard-coded coordinates
  var createPoints = function() {
    // points here are based on a 1000x1000 pixel square
    var sizeRatio = _size/1000;
    var displaceDist = _size/5;
    // set up hard-coded outer logo _points in a 1000x1000 px space
    _points.push( new DisplacementPoint( 148 * sizeRatio, 346 * sizeRatio, _fric, _accel, displaceDist ) );
    _points.push( new DisplacementPoint( 148 * sizeRatio, 662 * sizeRatio, _fric, _accel, displaceDist ) );
    _points.push( new DisplacementPoint( 236 * sizeRatio, 790 * sizeRatio, _fric, _accel, displaceDist ) );
    _points.push( new DisplacementPoint( 236 * sizeRatio, 644 * sizeRatio, _fric, _accel, displaceDist ) );
    _points.push( new DisplacementPoint( 436 * sizeRatio, 932 * sizeRatio, _fric, _accel, displaceDist ) );
    _points.push( new DisplacementPoint( 436 * sizeRatio, 726 * sizeRatio, _fric, _accel, displaceDist ) );
    _points.push( new DisplacementPoint( 492 * sizeRatio, 658 * sizeRatio, _fric, _accel, displaceDist ) );
    _points.push( new DisplacementPoint( 492 * sizeRatio, 974 * sizeRatio, _fric, _accel, displaceDist ) );
    _points.push( new DisplacementPoint( 694 * sizeRatio, 782 * sizeRatio, _fric, _accel, displaceDist ) );
    _points.push( new DisplacementPoint( 694 * sizeRatio, 622 * sizeRatio, _fric, _accel, displaceDist ) );
    _points.push( new DisplacementPoint( 738 * sizeRatio, 582 * sizeRatio, _fric, _accel, displaceDist ) );
    _points.push( new DisplacementPoint( 738 * sizeRatio, 668 * sizeRatio, _fric, _accel, displaceDist ) );
    _points.push( new DisplacementPoint( 848 * sizeRatio, 568 * sizeRatio, _fric, _accel, displaceDist ) );
    _points.push( new DisplacementPoint( 848 * sizeRatio, 22 * sizeRatio,  _fric, _accel, displaceDist ) );
    _points.push( new DisplacementPoint( 738 * sizeRatio, 128 * sizeRatio, _fric, _accel, displaceDist ) );
    _points.push( new DisplacementPoint( 738 * sizeRatio, 284 * sizeRatio, _fric, _accel, displaceDist ) );
    _points.push( new DisplacementPoint( 694 * sizeRatio, 326 * sizeRatio, _fric, _accel, displaceDist ) );
    _points.push( new DisplacementPoint( 694 * sizeRatio, 238 * sizeRatio, _fric, _accel, displaceDist ) );
    _points.push( new DisplacementPoint( 590 * sizeRatio, 336 * sizeRatio, _fric, _accel, displaceDist ) );
    _points.push( new DisplacementPoint( 402 * sizeRatio, 64 * sizeRatio,  _fric, _accel, displaceDist ) );
    _points.push( new DisplacementPoint( 402 * sizeRatio, 336 * sizeRatio, _fric, _accel, displaceDist ) );
    _points.push( new DisplacementPoint( 206 * sizeRatio, 52 * sizeRatio,  _fric, _accel, displaceDist ) );
    _points.push( new DisplacementPoint( 206 * sizeRatio, 282 * sizeRatio, _fric, _accel, displaceDist ) );
    
    // connect sub-triangles to fill in the inside of the logo
    _subTriangles.push( [0,1,3] );
    _subTriangles.push( [1,2,3] );
    _subTriangles.push( [3,4,5] );
    _subTriangles.push( [3,5,6] );
    _subTriangles.push( [0,3,6] );
    _subTriangles.push( [6,7,8] );
    _subTriangles.push( [6,8,9] );
    _subTriangles.push( [10,11,12] );
    _subTriangles.push( [10,12,15] );
    _subTriangles.push( [12,15,13] );
    _subTriangles.push( [13,14,15] );
    _subTriangles.push( [10,15,16] );
    _subTriangles.push( [16,17,18] );
    _subTriangles.push( [9,10,16] );
    _subTriangles.push( [9,16,18] );
    _subTriangles.push( [6,9,18] );
    _subTriangles.push( [6,20,18] );
    _subTriangles.push( [18,19,20] );
    _subTriangles.push( [0,6,20] );
    _subTriangles.push( [20,21,22] );
    _subTriangles.push( [0,20,22] );
    
    // store numbers of _points for easy looping
    _numPoints = _points.length;
    _numTriangles = _subTriangles.length;
  };
  
  // updated @ 30fps to draw
  var draw = function() {
    _context.fillStyle = 'rgba(255,255,255,255)';
    _context.fillRect( 0, 0, _size, _size );
    // _context.clearRect( 0, 0, _size, _size );
    setDrawProperties();
    drawTriangles();
    recalcMouseDisplacement();
    if( _drawNumbers ) drawPointNumbers();
    _frameCount++;
    if(_frameCount >= 30) {
      _mouseX = -10;
      _mouseY = -10;
    }
    
    // keep timer running
    setTimeout(function(){ draw(); },30);
  };
  
  // sets initial canvas drawing props before 
  var setDrawProperties = function() {
    _context.fillStyle = 'rgba(0,188,229,255)';
    _context.strokeStyle = 'rgba(0,188,229,255)';
    _context.lineWidth = 0.4;
  };
  
  // loop through all points and recalc their displacement position from the mouse 
  var recalcMouseDisplacement = function() {
    for( var i=0; i < _numPoints; i++ ) {
      _points[i].update( _mouseX, _mouseY );
    }
  };
  
  // loop through triangles and draw each one 
  var drawTriangles = function() {
    var triangleDisplaceTotal = 0;
    var triangleDisplaceDir = 0;
    var sizeColorFactor = ( _range / _size );

    for( var i=0; i < _numTriangles; i++ ) {
      // get the indexes of the 3 triangle Point objects, and grab the last one to start drawing from
      var curTrianglePointIndexes = _subTriangles[i];
      var point = _points[ curTrianglePointIndexes[2] ];

      // get aggregate displacement for the triangle
      triangleDisplaceTotal = triangleDisplaceDir = 0;
      for( var j=0; j < curTrianglePointIndexes.length; j++ ) triangleDisplaceTotal += _points[ curTrianglePointIndexes[j] ].displaceAmount();
      for( var j=0; j < curTrianglePointIndexes.length; j++ ) triangleDisplaceDir += _points[ curTrianglePointIndexes[j] ].displaceDir();
      
      // base fill color on displacement - make it relative to the size of the canvas 
      triangleDisplaceTotal *= ( 1000 / _size ) * 0.01;
      // triangleDisplaceTotal *= 0.003;
      var r = Math.round( 0 + triangleDisplaceDir * triangleDisplaceTotal );
      var g = Math.round( 188 + triangleDisplaceDir * triangleDisplaceTotal );
      var b = Math.round( 229 + triangleDisplaceDir * triangleDisplaceTotal );
      var a = 255;//( triangleDisplaceTotal + 0.1 ) / 100;
      _context.fillStyle = 'rgba('+r+','+g+','+b+','+a+')';

      // draw the 3 points
      _context.beginPath();
      _context.moveTo( point.x(), point.y() );

      for( var j=0; j < curTrianglePointIndexes.length; j++ ) {
        point = _points[ curTrianglePointIndexes[j] ];
        _context.lineTo( point.x(), point.y() );
      }
      _context.closePath();
      if(_drawLines) _context.stroke();
      _context.fill();
    }
    // draw mouse
    // _context.fillStyle = 'rgba(0,0,0,255)';
    // _context.fillRect( _mouseX, _mouseY, 4, 4 );

  };
  
  // draws the index number for each point, which really just helped with figuring out which outer points to connect for the triangles
  var drawPointNumbers = function() {
    // draw point indexes so we can figure out subdivision
    _context.fillStyle = 'rgba(0,0,0,255)';
    for( var i=0; i < _numPoints; i++ ) {
      // draw text
      _context.textBaseline = "top";
      _context.fillText(''+i, _points[i].x(), _points[i].y());
    }
  };
  
  init();
};