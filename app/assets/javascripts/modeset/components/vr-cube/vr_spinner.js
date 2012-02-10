function Spinner(d, h, c, f, a, b, i, e) {
    this.elementX = d;
    this.rotorX = h;
    this.elementY = d;
    this.rotorY = f;
    this.container = a;
    this.startX = 0;
    this.startY = 0;
    this.startRotationX = 0;
    this.startRotationY = 0;
    this.staticRotationX = 0;
    this.staticRotationY = -Math.PI/2;
    this.trackingPoints = [];
    this.tracking = false;
    this._containerWidth = this.container.clientWidth;
    this._containerHeight = this.container.clientHeight;
    this._cubeWidth = i;
    this._cubeHeight = e;
    this._correctingScaleX = this._containerWidth / this._cubeWidth;
    this._correctingScaleY = this._containerHeight / this._cubeHeight;
    var g = this;
    this.mousedownHandler = function(j) {
        g.mouseDown(j)
    };
    this.mousemoveHandler = function(j) {
        g.mouseMove(j)
    };
    this.mouseupHandler = function(j) {
        g.mouseUp(j)
    };
    this.mouseoutHandler = function(j) {
        g.mouseOut(j)
    };
    this.touchstartHandler = function(j) {
        g.touchStart(j)
    };
    this.touchmoveHandler = function(j) {
        g.touchMove(j)
    };
    this.touchendHandler = function(j) {
        g.touchEnd(j)
    };
    this.webkitAnimationStartHandler = function(j) {
        g.animationStarted(j)
    };
    this.webkitAnimationEndStartHandler = function(j) {
        g.animationEnded(j)
    };
    this.container.addEventListener("mousedown", this.mousedownHandler, false);
    this.container.addEventListener("mousemove", this.mousemoveHandler, false);
    document.addEventListener("mouseup", this.mouseupHandler, false);
    this.container.addEventListener("mouseout", this.mouseoutHandler, false);
    this.container.addEventListener("touchstart", this.touchstartHandler, false);
    this.container.addEventListener("touchmove", this.touchmoveHandler, false);
    this.container.addEventListener("touchend", this.touchendHandler, false);
    this.container.addEventListener("webkitAnimationStart", this.webkitAnimationStartHandler, false);
    this.container.addEventListener("webkitAnimationEnd", this.webkitAnimationEndStartHandler, false);
    // set initial rotation 
    this.setRotation(this.staticRotationX, this.staticRotationY);
}

Spinner.prototype.recycle = function() {
    delete this.elementX;
    delete this.rotorX;
    delete this.elementY;
    delete this.rotorY;
    this.container.removeEventListener("mousedown", this.mousedownHandler, false);
    this.container.removeEventListener("mousemove", this.mousemoveHandler, false);
    this.container.removeEventListener("mouseup", this.mouseupHandler, false);
    this.container.removeEventListener("mouseout", this.mouseoutHandler, false);
    this.container.removeEventListener("touchstart", this.touchstartHandler, false);
    this.container.removeEventListener("touchmove", this.touchmoveHandler, false);
    this.container.removeEventListener("touchend", this.touchendHandler, false);
    this.container.removeEventListener("webkitAnimationStart", this.webkitAnimationStartHandler, false);
    this.container.removeEventListener("webkitAnimationEnd", this.webkitAnimationEndStartHandler, false);
    delete this.container;
};
Spinner.prototype.startAnimating = function() {
    return false;
    if (this.trackingPoints.length < 3) {
        return false
    }
    var c = this.trackingPoints[2].date - this.trackingPoints[1].date;
    var f = (this.trackingPoints[1].date - this.trackingPoints[0].date);
    var d;
    if (this.horizontal) {
        d = this.trackingPoints[1].xPos - this.trackingPoints[0].xPos;
    } else {
        d = this.trackingPoints[1].yPos - this.trackingPoints[0].yPos;
    }
    if (Math.abs(d) < 0.5 || c > 35) {
        return false
    }
    var b = Math.atan(d / kRingRadius);
    var e;
    if (this.horizontal) {
        e = (b < 0) ? "left": "right";
    } else {
        e = (b < 0) ? "up": "down";
    }
    var a = e + "-spin";
    this.element.style.webkitAnimationName = a;
    return true;
};
Spinner.prototype.mouseDown = function(a) {
    this.interactionStart(a.clientX, a.clientY);
    a.preventDefault();
};
Spinner.prototype.mouseMove = function(a) {
    this.interactionMove(a.clientX, a.clientY);
    a.preventDefault();
};
Spinner.prototype.mouseUp = function(a) {
    this.interactionEnd(a.clientX, a.clientY);
    a.preventDefault();
};
Spinner.prototype.mouseOut = function(a) {};
Spinner.prototype.touchStart = function(a) {
    this.interactionStart(a.touches[0].clientX, a.touches[0].clientY);
};
Spinner.prototype.touchMove = function(a) {
    this.interactionMove(a.touches[0].clientX, a.touches[0].clientY);
    a.preventDefault();
};
Spinner.prototype.touchEnd = function(a) {
    this.interactionEnd(0, 0);
};
Spinner.prototype.interactionStart = function(a, g) {
    this.startX = a;
    this.startY = g;
    this.tracking = true;
    this.trackingPoints = [];
    this.elementX.style.webkitAnimationName = "none";
    this.elementY.style.webkitAnimationName = "none";
    var e = window.getComputedStyle(this.elementX).webkitTransform;
    var c = new WebKitCSSMatrix(e);
    var d = Math.atan2(c.m13, c.m11);
    if (c.m11 < 0) {
        d += Math.PI;
    }
    this.staticRotationX -= d;
    var f = window.getComputedStyle(this.elementY).webkitTransform;
    var c = new WebKitCSSMatrix(f);
    var b = Math.atan2(c.m23, c.m22);
    if (c.m22 < 0) {
        b += Math.PI;
    }
    this.staticRotationY += b;
    this.startRotationX = this.staticRotationX;
    this.startRotationY = this.staticRotationY;
    this.setRotation(this.staticRotationX, this.staticRotationY);
    c = null;
};
Spinner.prototype.interactionMove = function(b, h) {
    var c = ( b - this.startX ) * -1;   // inverse controls
    var a = ( h - this.startY ) * -1;
    if (this.tracking) {
        this.storeEventLocation(b, h);
        var e = Math.atan(c / kRingRadius);
        var d = Math.atan( - a / kRingRadius);
        var g = d * Math.cos(this.staticRotationX);
        var f = e * Math.cos(this.staticRotationX);
        this.staticRotationX = this.startRotationX + g;
        this.staticRotationY = this.startRotationY + f;
        this.setRotation(this.staticRotationX, this.staticRotationY);
    }
};
Spinner.prototype.interactionEnd = function(a, b) {
    if (this.tracking) {
        if (!this.startAnimating()) {
            this.setRotation(this.staticRotationX, this.staticRotationY);
        }
        this.tracking = false;
    }
};
Spinner.prototype.storeEventLocation = function(a, c) {
    var b = {
        xPos: a,
        yPos: c,
        date: new Date()
    };
    this.trackingPoints.push(b);
    if (this.trackingPoints.length > 3) {
        this.trackingPoints.shift();
    }
};
Spinner.prototype.animationStarted = function(a) {};
Spinner.prototype.animationEnded = function(a) {
    if (a.animationName == "none") {
        return;
    }
    this.element.style.webkitAnimationName = "none";
    this.setRotation(this.staticRotationX, this.staticRotationY);
    window.console.log("animation end: setting rotation to " + this.staticRotationX + " " + this.staticRotationY);
};
Spinner.prototype.setRotation = function(b, a) {
    this.rotorX.style.webkitTransform = "rotateX(" + b + "rad)";
    this.rotorY.style.webkitTransform = "rotateY(" + a + "rad)";
};
