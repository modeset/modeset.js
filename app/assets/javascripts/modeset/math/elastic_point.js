var ElasticPoint = function( x, y, fric, accel ) {
  _fric = fric;
  _accel = accel;

  _curX = x;
  _curY = y;
  
  _targetX = x;
  _targetY = y;
  
  _speedX = 0;
  _speedY = 0;

  var x = function() {
    return _curX;
  };

  var y = function() {
    return _curY;
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
  
  var updatePosition = function() {
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
    setFriction: setFriction,
    setAccel: setAccel,
    updatePosition: updatePosition
  };
}
