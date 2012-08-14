var ModeSetLogo = function( holder, size ) {
  // init canvas & properties
  var _canvas = document.createElement('canvas');
  _canvas.width = _canvas.height = size;
  holder.appendChild( _canvas );
  var _context = _canvas.getContext("2d");
  var _size = size;
  
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
  
  // displacement point class
  var Point = function( x, y ) {
    var self = this;

    // base location
    this.x = x * (_size/1000);
    this.y = y * (_size/1000);
    
    // current location
    this.curX = this.x;
    this.curY = this.y;
    this.targetX = x;
    this.targetY = y;
    this.xspeed = 0;
    this.yspeed = 0;

    this.displaceAmount = 0;
    
    this.recalcDisplacement = function() {
      // calculate displacement based on mouse distance from point base
      var xdiff = self.x - _mouseX;
      var ydiff = self.y - _mouseY;
      var d = Math.sqrt( xdiff * xdiff + ydiff * ydiff );
      if ( d < _range ) {
        self.targetX = self.x - ( xdiff - _range * ( xdiff / d ) );
        self.targetY = self.y - ( ydiff - _range * ( ydiff / d ) );
      } else {
        self.targetX = self.x;
        self.targetY = self.y;
      }
      // elastically move based on current target poisition vs current position
      self.xspeed = ( ( self.targetX - self.curX ) * _accel + self.xspeed ) * _fric;
      self.yspeed = ( ( self.targetY - self.curY ) * _accel + self.yspeed ) * _fric;
      self.curX += self.xspeed;
      self.curY += self.yspeed;
      
      self.displaceAmount = Math.abs( self.curX - self.x ) + Math.abs( self.curY - self.y );
      self.displaceDir = ( self.curX - self.x ) + ( self.curY - self.y );
    };
  }
  
  var onMouseMoved = function(e) {
    var offset = $(_canvas).offset()
    _mouseX = e.clientX - offset.left;
    _mouseY = e.clientY - offset.top;
    _frameCount = 0;
  };
  
  // toggle draw modes
  var handleKeyPress = function(evt) {
    // if(evt.keyCode == 78) _drawNumbers = !_drawNumbers;
    // if(evt.keyCode == 76) _drawLines = !_drawLines;
  };
  
  // kickstart my heart
  var init = function() {
    createPoints();
    _canvas.addEventListener('mousemove',onMouseMoved,false);
    document.addEventListener('keydown',handleKeyPress,false);
    setTimeout( function() { draw(); }, 30 );
  };
  
  // set up hard-coded coordinates
  var createPoints = function() {
    // set up hard-coded outer logo _points in a 1000x1000 px space
    _points.push( new Point( 148, 346 ) );
    _points.push( new Point( 148, 662 ) );
    _points.push( new Point( 236, 790 ) );
    _points.push( new Point( 236, 644 ) );
    _points.push( new Point( 436, 932 ) );
    _points.push( new Point( 436, 726 ) );
    _points.push( new Point( 492, 658 ) );
    _points.push( new Point( 492, 974 ) );
    _points.push( new Point( 694, 782 ) );
    _points.push( new Point( 694, 622 ) );
    _points.push( new Point( 738, 582 ) );
    _points.push( new Point( 738, 668 ) );
    _points.push( new Point( 848, 568 ) );
    _points.push( new Point( 848, 22 ) );
    _points.push( new Point( 738, 128 ) );
    _points.push( new Point( 738, 284 ) );
    _points.push( new Point( 694, 326 ) );
    _points.push( new Point( 694, 238 ) );
    _points.push( new Point( 590, 336 ) );
    _points.push( new Point( 402, 64 ) );
    _points.push( new Point( 402, 336 ) );
    _points.push( new Point( 206, 52 ) );
    _points.push( new Point( 206, 282 ) );
    
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
    if(_frameCount == 30) {
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
      _points[i].recalcDisplacement();
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
      for( var j=0; j < curTrianglePointIndexes.length; j++ ) triangleDisplaceTotal += _points[ curTrianglePointIndexes[j] ].displaceAmount;
      for( var j=0; j < curTrianglePointIndexes.length; j++ ) triangleDisplaceDir += _points[ curTrianglePointIndexes[j] ].displaceDir;
      
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
      _context.moveTo( point.curX, point.curY );
      for( var j=0; j < curTrianglePointIndexes.length; j++ ) {
        point = _points[ curTrianglePointIndexes[j] ];
        _context.lineTo( point.curX, point.curY );
      }
      _context.closePath();
      if(_drawLines) _context.stroke();
      _context.fill();
    }
  };
  
  // draws the index number for each point, which really just helped with figuring out which outer points to connect for the triangles
  var drawPointNumbers = function() {
    // draw point indexes so we can figure out subdivision
    _context.fillStyle = 'rgba(0,0,0,255)';
    for( var i=0; i < _numPoints; i++ ) {
      // draw text
      _context.textBaseline = "top";
      _context.fillText(''+i, _points[i].curX, _points[i].curY);
    }
  };
  
  init();
};