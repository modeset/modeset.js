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


function eliminateDuplicates(arr) {
  var i,
      len=arr.length,
      out=[],
      obj={};

  for (i=0;i<len;i++) {
    obj[arr[i]]=0;
  }
  for (i in obj) {
    out.push(i);
  }
  return out;
}


// better remove eliminateDuplicates
function eliminateDuplicates(arr) {
  arr.sort();
  var i = arr.length - 1;
  while (i > 0) {
    if (arr[i] === arr[i - 1]) arr.splice(i, 1);
    i--;
  }
}

var intersectArrays = function(a, b, isDestructive, isPreSorted) {
  if (isDestructive == null) isDestructive = true;
  if (isPreSorted == null) isPreSorted = false;
  // use a copy
  if (!isDestructive) {
    a = a.slice();
    b = b.slice();
  }
  if (!isPreSorted) {
    a.sort();
    b.sort();
  }
  var result = [];
  while (a.length > 0 && b.length > 0) {
    if (a[0] < b[0]) {
      a.shift();
    } else if (a[0] > b[0]) {
      b.shift();
    } else {
      result.push(a.shift());
      b.shift();
    }
  }
  return result;
};