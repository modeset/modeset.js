function ElasticPoint( x, y, fric, accel ){
	var self = this;
	
	// current location
	this.curX = x;
	this.curY = y;
	this.targetX = x;
	this.targetY = y;
	this.xspeed = 0;
	this.yspeed = 0;
	
	this.updatePosition = function() {
		// elastically move based on current target poisition vs current position
		self.xspeed = ((self.targetX-self.curX)*accel+self.xspeed)*fric;
		self.yspeed = ((self.targetY-self.curY)*accel+self.yspeed)*fric;
		self.curX += self.xspeed;
		self.curY += self.yspeed;
	};
}
// var point = new ElasticPoint( _box_base_x, _box_base_y, 0.75, 0.4 );
