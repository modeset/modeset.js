function ArrayUtil(){}

/**
 * Randomizes an array
 * @param {array} Array to randomize.
 * @return {boolean} Whether variable is null.
 */
ArrayUtil.randomize_array = function( array ) {
  array.sort(function() {return 0.5 - Math.random()}) //Array elements now scrambled
}

/**
 * Find an object in an array, or returns -1 if not found
 * @param {array} Array to search.
 * @param {*} Object to search for.
 * @return {Number} Index position of the object.
 */
ArrayUtil.indexOf = function(array, obj) {
  var len = array.length;

  var from = Number(arguments[2]) || 0;
  from = (from < 0) ? Math.ceil(from) : Math.floor(from);
  if (from < 0) from += len;

  for (; from < len; from++) {
    if (from in this && this[from] === obj) return from;
  }
  return -1;
};