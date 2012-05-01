function EasingFloat( value, easeFactor, completeRange ) {
  this.val = value;
  this.targetVal = value;
  this.easeFactor = easeFactor;
  this.completeRange = completeRange || 0.01;
};

EasingFloat.prototype.setTarget = function( value ) {
  this.targetVal = value;
};

EasingFloat.prototype.setValue = function( value ) {
  this.val = value;
};

EasingFloat.prototype.setEaseFactor = function( value ) {
  this.easeFactor = value;
};

EasingFloat.prototype.value = function() {
  return this.val;
};

EasingFloat.prototype.target = function() {
  return this.targetVal;
};

EasingFloat.prototype.update = function() {
  if( this.val == this.targetVal) return;
  this.val -= ( ( this.val - this.targetVal ) / this.easeFactor );
  if( Math.abs( this.val - this.targetVal ) < this.completeRange ) {
    this.val = this.targetVal;
  }
};
