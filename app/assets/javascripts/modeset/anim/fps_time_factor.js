/**
 *  Keeps track of the actual FPS vs. the target FPS, provigin a time factor to use when animating properties by time, to avoid slow performance when framerate drops.
 *  @param  targetFps The target FPS that the program should be running at.
 */
var FpsTimeFactor = function( targetFps ){
  this.target_fps = 1000 / targetFps;
  this.time_factor = 1;
  this.actual_fps = 0;
  this.cur_time = this.getMilliseconds();
  this.last_time = this.getMilliseconds();
};

FpsTimeFactor.prototype.setFps = function( targetFps ){
  this.target_fps = 1000 / targetFps;
};

FpsTimeFactor.prototype.getActualFps = function( targetFps ){
  return Math.round( this.actual_fps );
};

FpsTimeFactor.prototype.getTimeFactor = function(){
  return this.time_factor;
};

FpsTimeFactor.prototype.getMilliseconds = function(){
  return (new Date()).getTime();
};

FpsTimeFactor.prototype.update = function(){
  this.cur_time = this.getMilliseconds();
  this.actual_fps = 1000 / ( this.cur_time - this.last_time );
  this.time_factor = this.actual_fps / this.target_fps;
  this.last_time = this.getMilliseconds();
};