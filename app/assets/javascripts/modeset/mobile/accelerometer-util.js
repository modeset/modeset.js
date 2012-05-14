// requires MobileUtil.js

var Accelerometer = Accelerometer || {};

Accelerometer.AVAILABLE = ( window.orientation !== undefined );

Accelerometer.watch = function() {
  window.addEventListener('devicemotion', Accelerometer.update, false);
};

Accelerometer.unwatch = function() {
  window.removeEventListener('devicemotion', Accelerometer.update);
};

Accelerometer.update = function( event ) {
  // device acceleration in 3d space - x/y based on cartesian coordinates
  if( MobileUtil.IS_PORTRAIT ) {
    Accelerometer.accelX = ( MobileUtil.ORIENTATION == MobileUtil.PORTRAIT ) ? event.acceleration.x : -event.acceleration.x;
    Accelerometer.accelY = ( MobileUtil.ORIENTATION == MobileUtil.PORTRAIT ) ? -event.acceleration.y : event.acceleration.y;
  } else {
    Accelerometer.accelX = ( MobileUtil.ORIENTATION == MobileUtil.LANDSCAPE_LEFT ) ? -event.acceleration.y : event.acceleration.y;
    Accelerometer.accelY = ( MobileUtil.ORIENTATION == MobileUtil.LANDSCAPE_LEFT ) ? -event.acceleration.x : event.acceleration.x;
  }
  Accelerometer.accelZ = event.acceleration.z;

  // current rotation direction on 3d axis. same for both orientations. requires gyroscope
  if( MobileUtil.IS_PORTRAIT ) {
    Accelerometer.rotX = ( MobileUtil.ORIENTATION == MobileUtil.PORTRAIT ) ? event.rotationRate.alpha : -event.rotationRate.alpha;
    Accelerometer.rotY = ( MobileUtil.ORIENTATION == MobileUtil.PORTRAIT ) ? event.rotationRate.beta : -event.rotationRate.beta;
    Accelerometer.rotZ = -event.rotationRate.gamma;
  } else {
    Accelerometer.rotX = ( MobileUtil.ORIENTATION == MobileUtil.LANDSCAPE_RIGHT ) ? event.rotationRate.beta : -event.rotationRate.beta;
    Accelerometer.rotY = ( MobileUtil.ORIENTATION == MobileUtil.LANDSCAPE_RIGHT ) ? -event.rotationRate.alpha : event.rotationRate.alpha;
    Accelerometer.rotZ = -event.rotationRate.gamma;
  }

  // tilt - horiz = 0 when flat on a table, vert = 0 when standing straight up
  if( MobileUtil.IS_PORTRAIT ) {
      Accelerometer.tiltZ = ( MobileUtil.ORIENTATION == MobileUtil.PORTRAIT ) ? event.accelerationIncludingGravity.x : -event.accelerationIncludingGravity.x;
      Accelerometer.tiltXHoriz = ( MobileUtil.ORIENTATION == MobileUtil.PORTRAIT ) ? event.accelerationIncludingGravity.y : -event.accelerationIncludingGravity.y;
      Accelerometer.tiltXVert = event.accelerationIncludingGravity.z;
  } else {
      Accelerometer.tiltXHoriz = ( MobileUtil.ORIENTATION == MobileUtil.LANDSCAPE_LEFT ) ? event.accelerationIncludingGravity.x : -event.accelerationIncludingGravity.x;
      Accelerometer.tiltZ = ( MobileUtil.ORIENTATION == MobileUtil.LANDSCAPE_RIGHT ) ? event.accelerationIncludingGravity.y : -event.accelerationIncludingGravity.y;
      Accelerometer.tiltXVert = event.accelerationIncludingGravity.z;
  }
};

