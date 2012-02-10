// time-based calculations
var vCurTime:Number = getTimer();
_timeFactor = ( vCurTime - _lastTime ) / _fps;
_lastTime = getTimer();
