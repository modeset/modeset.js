var SignatureCanvas = function( canvasElem, debugging ) {
  var QUAD_PUSH_MULTIPLIER = 1.1;
  var TWO_PI = Math.PI * 2;
  var BOX = 10;
  var BOX_HALF = BOX/2;
  var _debug = debugging || false;

  //  set up canvas
  var _canvas = canvasElem;
  var _context = _canvas.getContext("2d");
  var _canvas_width = _canvas.width;
  var _canvas_height = _canvas.height;

  // set drawing props
  var COLOR_BG = 'rgb(255,255,255)';
  var COLOR_CORNERS = "#cccccc";
  var COLOR_CLEAR = "rgba(0,0,0,0)";
  var COLOR_SIG_LINE = 'rgb(0,0,0)';
  var COLOR_DEBUG = 'rgb(255,0,0)';
  var COLOR_DEBUG_2 = 'rgb(0,255,0)';
  var COLOR_DEBUG_3 = 'rgb(0,0,255)';
  var COLOR_DEBUG_4 = 'rgba(0,0,255,0.4)';
  _context.strokeStyle = "rgb(0,0,0)";
  _context.lineWidth = 1.5;
  _context.lineCap = 'round';

  // translate drawing to match rotated view
  _context.translate(_canvas_width, 0);
  _context.rotate(Math.PI / 2);

  // non-rotated bounds of the canvas element within the <article>
  var X_LEFT = 64;
  var X_RIGHT = 236;
  var Y_TOP = 20;
  var Y_BOTTOM = 440;

  var _touching = false;
  var _touchIsInside = false;
  var _lastX = null;
  var _lastY = null;

  var _lastPositions = [];
  var _pointsTracked = 0;

  var createTouchCallback = function() {
    var moved = 0;
		return function( state, touchEvent ) {
		    switch( state ) {
		      case MouseAndTouchTracker.state_start :
		        // start drawing if in canvas bounds
		        if( isTouchInCanvas() ) {
              // _context.beginPath();
  		        _touching = true;
  		        _touchIsInside = true;

            }
		        break;
		      case MouseAndTouchTracker.state_move :
		        // for desktop debugging, every x points captured
            // moved++;
            // if(moved > 10) {
            //   moved = 0;

	          if( _touching && isTouchInCanvas() ) {
	            // store last positions captured
              var curX = _touch_tracker.touchcurrent.x - X_LEFT - 50;
              var curY = _touch_tracker.touchcurrent.y - Y_TOP + 132;

              //               if( _lastPositions.length > 0 && curX != _lastPositions[0].x && curY != _lastPositions[0].y ) {
              //                 _lastPositions.push( { x: curX, y: curY } );
              // } else
	            if( _lastPositions.length == 2 && curX != _lastPositions[1].x && curY != _lastPositions[1].y ) {
  	            _lastPositions.push( { x: curX, y: curY } );
	            } else if( _lastPositions.length == 1 && curX != _lastPositions[0].x && curY != _lastPositions[0].y) {
                _lastPositions.push( { x: curX, y: curY } );
              } else if( _lastPositions.length == 0 ) {
                _lastPositions.push( { x: curX, y: curY } );
              }
              // console.log('_lastPositions.length = '+_lastPositions.length);

  		        _touchIsInside = true;
              if( _lastX ) {
                // old code to draw straight lines between points
                // _context.beginPath();
                // _context.moveTo( _lastX, _lastY );
                // _context.lineTo( curX, curY );
                // _context.stroke();
                // _context.closePath();
              }
              if( _touchIsInside ) {
                _lastX = curX;
                _lastY = curY;
              }

              _pointsTracked++;
              if( _lastPositions.length == 3 ) {
                // find centroid of circle
                var centroidArray = getTriangleCentroid( _lastPositions[0].x, _lastPositions[0].y, _lastPositions[1].x, _lastPositions[1].y, _lastPositions[2].x, _lastPositions[2].y );

                if( _debug ) {
                  // show anchor points
                  _context.fillStyle = COLOR_DEBUG;
                  _context.fillRect( _lastPositions[0].x - BOX_HALF, _lastPositions[0].y - BOX_HALF, BOX, BOX );
                  _context.fillRect( _lastPositions[1].x - BOX_HALF, _lastPositions[1].y - BOX_HALF, BOX, BOX );
                  _context.fillRect( _lastPositions[2].x - BOX_HALF, _lastPositions[2].y - BOX_HALF, BOX, BOX );

                  // show centroid
                  _context.fillStyle = COLOR_DEBUG_2;
                  _context.fillRect( centroidArray[0] - BOX_HALF, centroidArray[1] - BOX_HALF, BOX, BOX );

                  // draw straight lines
                  _context.beginPath();
                  _context.moveTo( _lastPositions[0].x, _lastPositions[0].y );
                  _context.lineTo( _lastPositions[1].x, _lastPositions[1].y );
                  _context.lineTo( _lastPositions[2].x, _lastPositions[2].y );
                  _context.strokeStyle = COLOR_DEBUG_4;
                  _context.stroke();
                  _context.closePath();
                }

                // get angle from centroid to mid/anchor point
                var angle = getAngleToTarget( centroidArray[0], centroidArray[1], _lastPositions[1].x, _lastPositions[1].y );

                // push out the control point
                var distFromCenteroidToHandle = Math.abs( getDist( centroidArray[0], centroidArray[1], _lastPositions[1].x, _lastPositions[1].y ) );
                var pushSpeed = distFromCenteroidToHandle * QUAD_PUSH_MULTIPLIER;
                var moveX = pushSpeed * Math.sin( angle );
                var moveY = -pushSpeed * Math.cos( angle );
                _lastPositions[1].x += moveX;
                _lastPositions[1].y += moveY;

                if( _debug ) {
                  // draw new point
                  _context.fillStyle = COLOR_DEBUG_3;
                  _context.fillRect( _lastPositions[1].x - BOX_HALF, _lastPositions[1].y - BOX_HALF, BOX, BOX );

                  // show centroid to pushed control point
                  _context.beginPath();
                  _context.strokeStyle = COLOR_DEBUG_2;
                  _context.moveTo( centroidArray[0], centroidArray[1] );
                  _context.lineTo( _lastPositions[1].x, _lastPositions[1].y );
                  _context.stroke();
                  _context.closePath();
                }

                // insane hack to prevent canvas from stopping drawing the signature line
                _context.fillStyle = COLOR_CLEAR;
                _context.fillRect( centroidArray[0] - BOX_HALF, centroidArray[1] - BOX_HALF, BOX, BOX );


                // draw quad curve
                _context.beginPath();
                _context.strokeStyle = COLOR_SIG_LINE;
                _context.moveTo( _lastPositions[0].x, _lastPositions[0].y );
                if( Math.abs( getDist( _lastPositions[0].x, _lastPositions[0].y,  _lastPositions[2].x, _lastPositions[2].y ) ) < 10 ) {
                  _context.lineTo( _lastPositions[2].x, _lastPositions[2].y );
                } else {
                  _context.quadraticCurveTo( _lastPositions[1].x, _lastPositions[1].y,  _lastPositions[2].x, _lastPositions[2].y);
                }
                _context.stroke();
                _context.closePath();

                // remove last points to draw next 3-point curve
                while( _lastPositions.length > 1 ) _lastPositions.shift();
              }

	          } else {
	            _touchIsInside = false;
              _lastX = null;
              _lastY = null;
	          }

            // }  // for desktop debugging
		        break;
		      case MouseAndTouchTracker.state_end :
            // draw remaining points at touch end if there weren't enough to make a quad curve
		        if( _lastPositions.length == 2) {
              _context.beginPath();
              _context.moveTo( _lastPositions[0].x, _lastPositions[0].y );
              _context.lineTo( _lastPositions[1].x, _lastPositions[1].y );
              _context.strokeStyle = COLOR_SIG_LINE;
              _context.stroke();
              _context.closePath();
		        }

		        _lastPositions.splice(0);
            _touching = false;
            _lastX = null;
            _lastY = null;
		        break;
		      case MouseAndTouchTracker.state_enter :
		        break;
		      case MouseAndTouchTracker.state_leave :
		        break;
		    }
		};
	};

	var getTriangleCentroid = function( x1, y1, x2, y2, x3, y3 ){
	  var centerX = ( x1 + x2 + x3 ) / 3;
    var centerY = ( y1 + y2 + y3 ) / 3;
    return [ centerX, centerY ];
	};

	var getDist = function(x1,y1,x2,y2) {
  	return Math.sqrt( Math.pow(x1-x2,2) + Math.pow(y1-y2,2) );
  };

	var getAngleToTarget = function(x1,y1,x2,y2) {
  	return constrainRadians( -Math.atan2( x1 - x2, y1 - y2 ) ); //  * 180 / Math.PI
  };

  // keep an angle between 0-360
  var constrainAngle = function( angle ) {
  	if( angle < 0 ) return angle + 360;
  	if( angle > 360 ) return angle - 360;
  	return angle;
  };
  var constrainRadians = function( radians ) {
  	if( radians < 0 ) return radians + TWO_PI;
  	if( radians > TWO_PI ) return radians - TWO_PI;
  	return radians;
  };

	var isTouchInCanvas = function() {
	  return true;
	  return ( _touch_tracker.touchcurrent.x > X_LEFT && _touch_tracker.touchcurrent.y > Y_TOP && _touch_tracker.touchcurrent.x < X_RIGHT && _touch_tracker.touchcurrent.y < Y_BOTTOM );
	};

	var getImageData = function() {
	  // remove corner lines before saving data
    var cornerLine = 10;
    _context.clearRect(0, 0, cornerLine, 1);
    _context.clearRect(0, 0, 1, cornerLine);
    _context.clearRect(_canvas_height - cornerLine, 0, cornerLine, 1);
    _context.clearRect(_canvas_height - 1, 0, 1, cornerLine);
    _context.clearRect(0, _canvas_width - cornerLine, 1, cornerLine);
    _context.clearRect(0, _canvas_width - 1, cornerLine, 1 );
    _context.clearRect(_canvas_height - cornerLine, _canvas_width - 1, cornerLine, 1);
    _context.clearRect(_canvas_height - 1, _canvas_width - cornerLine, 1, cornerLine);

	  return _canvas.toDataURL();
	};

	var clearCanvas = function() {
	  // fill with white
	  _context.fillStyle = COLOR_BG;
    // _context.fillRect(0, 0, _canvas_height, _canvas_width);
    _context.clearRect( 0, 0, _canvas_height, _canvas_width );

	  // add corner lines
    _context.fillStyle = COLOR_CORNERS;
    var cornerLine = 10;
    _context.fillRect(0, 0, cornerLine, 1);
    _context.fillRect(0, 0, 1, cornerLine);
    _context.fillRect(_canvas_height - cornerLine, 0, cornerLine, 1);
    _context.fillRect(_canvas_height - 1, 0, 1, cornerLine);
    _context.fillRect(0, _canvas_width - cornerLine, 1, cornerLine);
    _context.fillRect(0, _canvas_width - 1, cornerLine, 1 );
    _context.fillRect(_canvas_height - cornerLine, _canvas_width - 1, cornerLine, 1);
    _context.fillRect(_canvas_height - 1, _canvas_width - cornerLine, 1, cornerLine);
	};

// original from Robin W. Spencer (http://scaledinnovation.com)
// http://scaledinnovation.com/analytics/splines/aboutSplines.html
function getControlPoints(x0,y0,x1,y1,x2,y2,t){
    //  x0,y0,x1,y1 are the coordinates of the end (knot) pts of this segment
    //  x2,y2 is the next knot -- not connected here but needed to calculate p2
    //  p1 is the control point calculated here, from x1 back toward x0.
    //  p2 is the next control point, calculated here and returned to become the
    //  next segment's p1.
    //  t is the 'tension' which controls how far the control points spread.

    //  Scaling factors: distances from this knot to the previous and following knots.
    var d01=Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2));
    var d12=Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));

    var fa=t*d01/(d01+d12);
    var fb=t-fa;

    var p1x=x1+fa*(x0-x2);
    var p1y=y1+fa*(y0-y2);

    var p2x=x1-fb*(x0-x2);
    var p2y=y1-fb*(y0-y2);

    return [p1x,p1y,p2x,p2y]
}

	var dispose = function() {
    _touch_tracker.dispose();
    _context = null;
    _canvas = null;
	};

	// set up touch tracker w/local delegate
	var _touch_tracker = new MouseAndTouchTracker( canvasElem, createTouchCallback(), false, 'img' );
	addTouchCallbacks();
	clearCanvas();

	// return public api
  return {
    getImageData : getImageData,
    clearCanvas : clearCanvas,
    dispose : dispose
  }
};
