/* 2D Vector
*/
var Vector;

Vector = (function() {
  /* Adds two vectors and returns the product.
  */
  Vector.add = function(v1, v2) {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  };

  /* Subtracts v2 from v1 and returns the product.
  */

  Vector.sub = function(v1, v2) {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  };

  /* Projects one vector (v1) onto another (v2)
  */

  Vector.project = function(v1, v2) {
    return v1.clone().scale((v1.dot(v2)) / v1.magSq());
  };

  /* Creates a new Vector instance.
  */

  function Vector(x, y) {
    this.x = x != null ? x : 0.0;
    this.y = y != null ? y : 0.0;
  }

  /* Sets the components of this vector.
  */

  Vector.prototype.set = function(x, y) {
    this.x = x;
    this.y = y;
    return this;
  };

  /* Add a vector to this one.
  */

  Vector.prototype.add = function(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  };

  /* Subtracts a vector from this one.
  */

  Vector.prototype.sub = function(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  };

  /* Scales this vector by a value.
  */

  Vector.prototype.scale = function(f) {
    this.x *= f;
    this.y *= f;
    return this;
  };

  /* Computes the dot product between vectors.
  */

  Vector.prototype.dot = function(v) {
    return this.x * v.x + this.y * v.y;
  };

  /* Computes the cross product between vectors.
  */

  Vector.prototype.cross = function(v) {
    return (this.x * v.y) - (this.y * v.x);
  };

  /* Computes the magnitude (length).
  */

  Vector.prototype.mag = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  /* Computes the squared magnitude (length).
  */

  Vector.prototype.magSq = function() {
    return this.x * this.x + this.y * this.y;
  };

  /* Computes the distance to another vector.
  */

  Vector.prototype.dist = function(v) {
    var dx, dy;
    dx = v.x - this.x;
    dy = v.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  /* Computes the squared distance to another vector.
  */

  Vector.prototype.distSq = function(v) {
    var dx, dy;
    dx = v.x - this.x;
    dy = v.y - this.y;
    return dx * dx + dy * dy;
  };

  /* Normalises the vector, making it a unit vector (of length 1).
  */

  Vector.prototype.norm = function() {
    var m;
    m = Math.sqrt(this.x * this.x + this.y * this.y);
    this.x /= m;
    this.y /= m;
    return this;
  };

  /* Limits the vector length to a given amount.
  */

  Vector.prototype.limit = function(l) {
    var m, mSq;
    mSq = this.x * this.x + this.y * this.y;
    if (mSq > l * l) {
      m = Math.sqrt(mSq);
      this.x /= m;
      this.y /= m;
      this.x *= l;
      this.y *= l;
      return this;
    }
  };

  /* Copies components from another vector.
  */

  Vector.prototype.copy = function(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  };

  /* Clones this vector to a new itentical one.
  */

  Vector.prototype.clone = function() {
    return new Vector(this.x, this.y);
  };

  /* Resets the vector to zero.
  */

  Vector.prototype.clear = function() {
    this.x = 0.0;
    this.y = 0.0;
    return this;
  };

  return Vector;

})();
