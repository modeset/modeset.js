/**
 *  An object that moves a point towards a target, with elastic properties.
 *  @param  x       Starting x coordinate.
 *  @param  y       Starting y coordinate.
 *  @param  fric    Friction value [0-1] - lower numbers mean more friction.
 *  @param  accel   Acceleration value [0-1] - lower numbers mean more slower acceleration.
 *  @return The DisplacementPoint public interface.
 *  @use    {@code var _point = new ElasticPoint( 100, 100, 0.75, 0.4 ); }
 */
var DisplacementPoint = function( x, y, fric, accel, range ) {
  // displacement properties
  var _range = range;
  var _fric = fric;
  var _accel = accel;

  // base location
  var _baseX = x;
  var _baseY = y;
  
  // current location
  var _curX = _baseX;
  var _curY = _baseY;
  var _targetX = x;
  var _targetY = y;
  var _speedX = 0;
  var _speedY = 0;

  var _displaceAmount = 0;
  
  var x = function() {
    return _curX;
  };

  var y = function() {
    return _curY;
  };

  var setFriction = function( fric ) {
    _fric = fric;
  };
  
  var setAccel = function( accel ) {
    _accel = accel;
  };

  var update = function( repelX, repelY ) {
    // calculate displacement based on mouse distance from point base
    var xdiff = _baseX - repelX;
    var ydiff = _baseY - repelY;
    var d = Math.sqrt( xdiff * xdiff + ydiff * ydiff );
    if ( d < _range ) {
      _targetX = _baseX - ( xdiff - _range * ( xdiff / d ) );
      _targetY = _baseY - ( ydiff - _range * ( ydiff / d ) );
    } else {
      _targetX = _baseX;
      _targetY = _baseY;
    }
    // elastically move based on current target poisition vs current position
    _speedX = ( ( _targetX - _curX ) * _accel + _speedX ) * _fric;
    _speedY = ( ( _targetY - _curY ) * _accel + _speedY ) * _fric;
    _curX += _speedX;
    _curY += _speedY;
    
    _displaceAmount = Math.abs( _curX - _baseX ) + Math.abs( _curY - _baseY );
    _displaceDir = ( _curX - _baseX ) + ( _curY - _baseY );
  };

  return {
    x: x,
    y: y,
    setFriction: setFriction,
    setAccel: setAccel,
    update: update
  };
};