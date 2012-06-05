
// Creates an old school iPod wheel control, returning your mouse/touch's radians/degrees as you move
// requires: touch_tracker.js

var CircleTouchTracker = function ( element, width, height, callback, disabledElements, radiusInnerFactor ) {
  // constants
  var TWO_PI = 2 * Math.PI,
      HALF_PI = Math.PI / 2;

  // initial props
  var _element = element,
      _width = width,
      _height = height,
      _callback = callback,
      _touch_tracker = null;

  // calculated on touchmove
  var _centerX,
      _centerY,
      _radiusOuter,
      _radiusInnerFactor = radiusInnerFactor || 0.1,
      _radiusInner;

  // the goods
  var _curAngle = 0,
      _curRadians = 0,
      _lastAngle = -1,
      _lastRadians = -1;

  // fire up the touch tracker and set the initial size
  var init = function() {
    _touch_tracker = new MouseAndTouchTracker( _element, touchUpdated, true, disabledElements );
    setSize( width, height );
  };

  // calculate position in any touch state
  var touchUpdated = function( state, touchEvent ) {

    // get distance from center point
    var xPos = _touch_tracker.touchcurrent.x - _centerX;
    var yPos = _touch_tracker.touchcurrent.y - _centerY;
    var mouseRadius = getDistance( xPos, yPos );

    // make sure the mouse/touch is in the iPod control zone
    var inBounds = ( mouseRadius > _radiusInner && mouseRadius < _radiusOuter );
    if( inBounds == true ) {
      // calculate current radians/angle from touch location
      _curRadians = Math.atan2(-xPos, -yPos) + HALF_PI; // get current
      if( _curRadians < 0 ) _curRadians += TWO_PI;      // normalize below 0
      _curRadians = _curRadians % TWO_PI;               // normalize above TWO_PI
      _curAngle = _curRadians * 180/Math.PI;            // convert radians to angle
      // reset angle change tracking if re-entering bounds
      if( _lastAngle == -1 ) {
        _lastAngle = _curAngle;
        _lastRadians = _curRadians;
      }
    } else {
      _curRadians = null;
      _curAngle = null;
      _lastAngle = -1;
      _lastRadians = -1;
    }

    // keep track of angle change amount between mouse/touch move events
    _angleChange = 0;
    _radianChange = 0;
    if( _lastAngle != -1 && _lastAngle != null ) {
      _angleChange = _lastAngle - _curAngle;
      _radianChange = _lastRadians - _curRadians;
    }
    _lastAngle = _curAngle;
    _lastRadians = _curRadians;

    // handle wrapping around from 360 <-> 0
    if( _angleChange > 180 ) {
      _angleChange = _angleChange - 360;
      _radianChange = TWO_PI - _radianChange;
    } else if( _angleChange < -180 ) {
      _angleChange = 360 + _angleChange;
      _radianChange = _radianChange + TWO_PI;
    }

    // keep track of drag distance
    switch (state) {
      case MouseAndTouchTracker.state_start:
        _lastAngle = _curAngle;
        _lastRadians = _curRadians;
        break;
      case MouseAndTouchTracker.state_move:
        break;
      case MouseAndTouchTracker.state_end:
        _lastAngle = -1;
        _lastRadians = -1;
        break;
    }

    // pass through touch state so we can perform further actions
    _callback && _callback( state );
  };

  // pythagorean theorem
  var getDistance = function ( a, b ) {
    return Math.abs( Math.sqrt( a*a + b*b ) );
  };

  // Public interface & initialization -----------------------

  var curAngle = function() {
    return _curAngle;
  };

  var curRadians = function() {
    return _curRadians;
  };

  var angleChange = function() {
    return _angleChange;
  };

  var radianChange = function() {
    return _radianChange;
  };

  var setAngle = function( value ) {
    _curAngle = value;
  };

  var setRadians = function( value ) {
    _curRadians = value;
  };

  var setSize = function( width, height ) {
    _width = width;
    _height = height;
    _centerX = _width / 2;
    _centerY = _height / 2;
    _radiusOuter = _centerX;
    _radiusInner = _centerX * _radiusInnerFactor;
  };

  init();

  return {
    touchTracker: _touch_tracker,
    curAngle: curAngle,
    curRadians: curRadians,
    angleChange: angleChange,
    radianChange: radianChange,
    setAngle: setAngle,
    setRadians: setRadians,
    setSize: setSize
  };
};
