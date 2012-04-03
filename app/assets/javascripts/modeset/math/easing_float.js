function EasingFloat( value, easeFactor ) {
  this.val = value;
  this.targetVal = value;
  this.easeFactor = easeFactor;
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
  this.val -= ( ( this.val - this.targetVal ) / this.easeFactor );
};
