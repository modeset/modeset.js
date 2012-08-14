/**
 *  An object that moves a point towards a target, with elastic properties.
 *  @param  x       Starting x coordinate.
 *  @param  y       Starting y coordinate.
 *  @param  fric    Friction value [0-1] - lower numbers mean more friction.
 *  @param  accel   Acceleration value [0-1] - lower numbers mean more slower acceleration.
 *  @return The ElasticPoint public interface.
 *  @use    {@code var _point = new ElasticPoint( 100, 100, 0.75, 0.4 ); }
 */
var ElasticPoint = function( x, y, fric, accel ) {
  var _fric = fric,
      _accel = accel,

      _curX = x,
      _curY = y,

      _targetX = x,
      _targetY = y,

      _speedX = 0,
      _speedY = 0;

  var x = function() {
    return _curX;
  };

  var y = function() {
    return _curY;
  };

  var setCurrent = function( x, y ) {
    _curX = x;
    _curY = y;
  };

  var setTarget = function( x, y ) {
    _targetX = x;
    _targetY = y;
  };

  var setFriction = function( fric ) {
    _fric = fric;
  };

  var setAccel = function( accel ) {
    _accel = accel;
  };

  var update = function() {
    // update elastic point based on current target position vs current position
    _speedX = ( ( _targetX - _curX ) * _accel + _speedX ) * _fric;
    _speedY = ( ( _targetY - _curY ) * _accel + _speedY ) * _fric;
    _curX += _speedX;
    _curY += _speedY;
  };

  return {
    x: x,
    y: y,
    setTarget: setTarget,
    setCurrent: setCurrent,
    setFriction: setFriction,
    setAccel: setAccel,
    update: update
  };
}
