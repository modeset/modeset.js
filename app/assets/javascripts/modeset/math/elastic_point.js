// usage: var point = new ElasticPoint( _box_base_x, _box_base_y, 0.75, 0.4 );

function ElasticPoint( x, y, fric, accel ) {
  var self = this;
  
  this.fric = fric;
  this.accel = accel;
  this.curX = x;
  this.curY = y;
  this.targetX = x;
  this.targetY = y;
  this.xspeed = 0;
  this.yspeed = 0;

  this.setTarget = function( x, y ) {
    self.targetX = x;
    self.targetY = y;
  };
  
  this.setFriction = function( fric ) {
    self.fric = fric;
  };
  
  this.setAccel = function( accel ) {
    self.accel = accel;
  };
  
  this.updatePosition = function() {
    // elastically move based on current target poisition vs current position
    self.xspeed = ((self.targetX-self.curX)*self.accel+self.xspeed)*self.fric;
    self.yspeed = ((self.targetY-self.curY)*self.accel+self.yspeed)*self.fric;
    self.curX += self.xspeed;
    self.curY += self.yspeed;
  };
}
