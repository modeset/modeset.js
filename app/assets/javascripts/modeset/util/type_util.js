function TypeUtil(){}

/**
 * From Google Closure Library
 * 
 * Returns true if the specified value is not |undefined|.
 * WARNING: Do not use this to test if an object has a property. Use the in
 * operator instead.  Additionally, this function assumes that the global
 * undefined variable has not been redefined.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is defined.
 */
TypeUtil.isDef = function(val) {
  return val !== undefined;
};


/**
 * From Google Closure Library
 * 
 * Returns true if the specified value is |null|
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is null.
 */
TypeUtil.isNull = function(val) {
  return val === null;
};


/**
 * From Google Closure Library
 * 
 * Returns true if the specified value is defined and not null
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is defined and not null.
 */
TypeUtil.isDefAndNotNull = function(val) {
  // Note that undefined == null.
  return val != null;
};


/**
 * From Google Closure Library
 * 
 * Returns true if the specified value is an array
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
TypeUtil.isArray = function(val) {
  return TypeUtil.typeOf(val) == 'array';
};


/**
 * From Google Closure Library
 * 
 * Returns true if the object looks like an array. To qualify as array like
 * the value needs to be either a NodeList or an object with a Number length
 * property.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
TypeUtil.isArrayLike = function(val) {
  var type = TypeUtil.typeOf(val);
  return type == 'array' || type == 'object' && typeof val.length == 'number';
};


/**
 * From Google Closure Library
 * 
 * Returns true if the object looks like a Date. To qualify as Date-like
 * the value needs to be an object and have a getFullYear() function.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a like a Date.
 */
TypeUtil.isDateLike = function(val) {
  return TypeUtil.isObject(val) && typeof val.getFullYear == 'function';
};


/**
 * From Google Closure Library
 * 
 * Returns true if the specified value is a string
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a string.
 */
TypeUtil.isString = function(val) {
  return typeof val == 'string';
};


/**
 * From Google Closure Library
 * 
 * Returns true if the specified value is a boolean
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is boolean.
 */
TypeUtil.isBoolean = function(val) {
  return typeof val == 'boolean';
};


/**
 * From Google Closure Library
 * 
 * Returns true if the specified value is a number
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a number.
 */
TypeUtil.isNumber = function(val) {
  return typeof val == 'number';
};


/**
 * From Google Closure Library
 * 
 * Returns true if the specified value is a function
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is a function.
 */
TypeUtil.isFunction = function(val) {
  return TypeUtil.typeOf(val) == 'function';
};


/**
 * From Google Closure Library
 * 
 * Returns true if the specified value is an object.  This includes arrays
 * and functions.
 * @param {*} val Variable to test.
 * @return {boolean} Whether variable is an object.
 */
TypeUtil.isObject = function(val) {
  var type = TypeUtil.typeOf(val);
  return type == 'object' || type == 'array' || type == 'function';
};
