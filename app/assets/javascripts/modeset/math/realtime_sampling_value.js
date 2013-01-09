function RealtimeSamplingValue( numSamples ) {
  this.numSamples = numSamples;
  this.initBuffer();
  this.resetBuffer();
};

RealtimeSamplingValue.prototype.initBuffer = function() {
  this.sampleIndex = 0;
  this.buffer = [];
  for( var i=0; i < this.numSamples; i++) {
    this.buffer.push(0);
  }
};

RealtimeSamplingValue.prototype.resetBuffer = function() {
  for( var i=0; i < this.numSamples; i++) {
    this.buffer[i] = 0;
  }
};

RealtimeSamplingValue.prototype.updateWithValue = function( value ) {
  // iterate through the sample array every update to create a running 60-frame history
  this.sampleIndex++;
  if(this.sampleIndex == this.numSamples) this.sampleIndex = 0;
  this.buffer[this.sampleIndex] = value;

  // add them up
  this.sumSamples();
};

RealtimeSamplingValue.prototype.sumSamples = function( value ) {
  this.sum = 0;
  for( var i=0; i < this.numSamples; i++) {
    this.sum += this.buffer[i];
  }
};

RealtimeSamplingValue.prototype.value = function() {
  return this.sum;
};
