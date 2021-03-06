// requires MobileUtil for orientation constants and orientation change events
var Accelerometer = Accelerometer || {};

Accelerometer.AVAILABLE = false;
Accelerometer.ACTIVE = false;
Accelerometer.HAS_ACCEL = false;
Accelerometer.HAS_GYRO = false;
Accelerometer.HAS_TILT = false;
Accelerometer.X_AXIS = 1;
Accelerometer.Y_AXIS = 2;
Accelerometer.Z_AXIS = 3;
Accelerometer.callback = [];

Accelerometer.watch = function( callback ) {
  MobileUtil.trackOrientation();
  if( typeof callback !== 'undefined' ) Accelerometer.callback.push( callback );
  if( Accelerometer.ACTIVE == false ) {
    Accelerometer.ACTIVE = true;
    window.addEventListener('devicemotion', Accelerometer.update, false);
  }
};

Accelerometer.unwatch = function( callback ) {
  var callbackIndex = Accelerometer.callback.indexOf( callback );
  if( callbackIndex != -1) Accelerometer.callback.splice( callbackIndex, 1 );
  if( Accelerometer.callback.length === 0 ) {
    Accelerometer.ACTIVE = false;
    window.removeEventListener('devicemotion', Accelerometer.update);
  }
};

Accelerometer.update = function( event ) {
  if( !event ) return;

  // set available states
  Accelerometer.AVAILABLE = true;
  if( event.acceleration != undefined && event.acceleration.x != undefined ) Accelerometer.HAS_ACCEL = true;
  if( event.rotationRate != undefined && event.rotationRate.beta != undefined ) Accelerometer.HAS_GYRO = true;
  if( event.accelerationIncludingGravity != undefined && event.accelerationIncludingGravity.x != undefined ) Accelerometer.HAS_TILT = true;

  // device acceleration in 3d space - x/y based on cartesian coordinates
  if( Accelerometer.HAS_ACCEL ) {
    if( MobileUtil.isPortrait ) {
      Accelerometer.accelX = ( MobileUtil.orientation == MobileUtil.PORTRAIT ) ? event.acceleration.x : -event.acceleration.x;
      Accelerometer.accelY = ( MobileUtil.orientation == MobileUtil.PORTRAIT ) ? -event.acceleration.y : event.acceleration.y;
    } else {
      Accelerometer.accelX = ( MobileUtil.orientation == MobileUtil.LANDSCAPE_LEFT ) ? -event.acceleration.y : event.acceleration.y;
      Accelerometer.accelY = ( MobileUtil.orientation == MobileUtil.LANDSCAPE_LEFT ) ? -event.acceleration.x : event.acceleration.x;
    }
    Accelerometer.accelZ = event.acceleration.z;
  }

  // current rotation direction on 3d axis. same for both orientations. requires gyroscope
  if( Accelerometer.HAS_GYRO ) {
    if( MobileUtil.isPortrait ) {
      Accelerometer.rotX = ( MobileUtil.orientation == MobileUtil.PORTRAIT ) ? event.rotationRate.alpha : -event.rotationRate.alpha;
      Accelerometer.rotY = ( MobileUtil.orientation == MobileUtil.PORTRAIT ) ? event.rotationRate.beta : -event.rotationRate.beta;
      Accelerometer.rotZ = -event.rotationRate.gamma;
    } else {
      Accelerometer.rotX = ( MobileUtil.orientation == MobileUtil.LANDSCAPE_RIGHT ) ? event.rotationRate.beta : -event.rotationRate.beta;
      Accelerometer.rotY = ( MobileUtil.orientation == MobileUtil.LANDSCAPE_RIGHT ) ? -event.rotationRate.alpha : event.rotationRate.alpha;
      Accelerometer.rotZ = -event.rotationRate.gamma;
    }
  }

  // tilt - horiz = 0 when flat on a table, vert = 0 when standing straight up
  if( Accelerometer.HAS_TILT ) {
    if( MobileUtil.isPortrait ) {
        Accelerometer.tiltZ = ( MobileUtil.orientation == MobileUtil.PORTRAIT ) ? event.accelerationIncludingGravity.x : -event.accelerationIncludingGravity.x;
        Accelerometer.tiltXHoriz = ( MobileUtil.orientation == MobileUtil.PORTRAIT ) ? event.accelerationIncludingGravity.y : -event.accelerationIncludingGravity.y;
        Accelerometer.tiltXVert = event.accelerationIncludingGravity.z;
    } else {
        Accelerometer.tiltXHoriz = ( MobileUtil.orientation == MobileUtil.LANDSCAPE_LEFT ) ? event.accelerationIncludingGravity.x : -event.accelerationIncludingGravity.x;
        Accelerometer.tiltZ = ( MobileUtil.orientation == MobileUtil.LANDSCAPE_RIGHT ) ? event.accelerationIncludingGravity.y : -event.accelerationIncludingGravity.y;
        Accelerometer.tiltXVert = event.accelerationIncludingGravity.z;
    }
  }

  for( var i=0; i < Accelerometer.callback.length; i++ ) {
    Accelerometer.callback[i]();
  }
};

