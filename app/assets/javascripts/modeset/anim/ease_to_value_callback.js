function EaseToValueCallback( value, easeFactor, callback, finishRange ) {
  this.easingFloat = new EasingFloat( value, easeFactor );
  this.callback = callback;
  this.finishRange = finishRange || 0.1;
  this.timeout = null;
};

EaseToValueCallback.prototype.setTarget = function( value ) {
  this.easingFloat.setTarget( value );
  this.easeToTarget();
};

EaseToValueCallback.prototype.easeToTarget = function(){
  if( this.timeout != null ) clearTimeout( this.timeout );
  // ease the EasingFloat towards its target
  this.easingFloat.update();
  // call the callback and pass in the current value
  this.callback( this.easingFloat.value() );
  // keep easing if we're not close enough
  if( Math.abs( this.easingFloat.value() - this.easingFloat.target() ) > this.finishRange ) {
    var self = this;
    this.timeout = setTimeout(function(){
      self.easeToTarget();
    },16);
  } else {
    this.easingFloat.setValue( this.easingFloat.target() );
    this.timeout = null;
    // call the callback one last time with the final value
    this.callback( this.easingFloat.value() );
  }
};
