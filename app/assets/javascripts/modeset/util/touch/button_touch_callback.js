function ButtonTouchCallback( element, callback, highlights, highlightOpacity ) {
  // store/set parameters/state
  this.element = element;
  this.callback = callback;
  this.highlights_on_touch = highlights || true;
  this.highlight_opacity = highlightOpacity || 0.85;
  this.started_touching = false;
  this.CANCEL_THRESHOLD = 3;
  // create touch tracker
	this.touch_tracker = new MouseAndTouchTracker( this.element, this );
}

ButtonTouchCallback.prototype.touchUpdated = function ( touchState, touchEvent ) {
  // handle touch feedback with opacity
  if( touchState == MouseAndTouchTracker.state_start ) {
    if( this.highlights_on_touch ) {
      this.element.style.opacity = this.highlight_opacity;
    }
    this.started_touching = true;
  }
  // cancel click if mouse/touch moves past threshold
  if( touchState == MouseAndTouchTracker.state_move ) {
    if( Math.abs( this.touch_tracker.touchmoved.x ) + Math.abs( this.touch_tracker.touchmoved.y ) >= this.CANCEL_THRESHOLD ) {
      if( this.highlights_on_touch ) {
        this.element.style.opacity = 1;
      }
    }
  }
  if( touchState == MouseAndTouchTracker.state_end ) {
    if( this.highlights_on_touch ) {
      this.element.style.opacity = 1;
    }
    // call callback method if touch didn't move past threshold
    if( Math.abs( this.touch_tracker.touchmoved.x ) + Math.abs( this.touch_tracker.touchmoved.y ) < this.CANCEL_THRESHOLD && this.started_touching ) {
      this.callback( this.element, touchEvent );
    }
    this.started_touching = false;
  }
};

ButtonTouchCallback.prototype.deactivateHighlight = function() {
  this.highlights_on_touch = false;
};

ButtonTouchCallback.prototype.dispose = function() {
	if( this.touch_tracker ) {
	  this.touch_tracker.dispose();
	}
	delete this.touch_tracker;
	delete this.callback;
	delete this.element;
};


/*
// do something with this?
if(touchEvent) {
  var target = touchEvent.target;
  if (target.nodeType == 3) target = target.parentNode;
}
*/
