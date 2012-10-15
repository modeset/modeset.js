function ArrayUtil(){}

/**
 * Randomizes an array
 * @param {array} Array to randomize.
 * @return {boolean} Whether variable is null.
 */
ArrayUtil.randomize_array = function( array ) {
  array.sort(function() {return 0.5 - Math.random()}) //Array elements now scrambled
}

ArrayUtil.shuffle = function()
{
  var that = this.slice();
  for(var j, x, i = that.length; i; j = Math.floor(Math.random() * i), x = that[--i], that[i] = that[j], that[j] = x);
  return that;
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

ArrayUtil.empty = function(array) {
  array.splice( 0, array.length - 1 );
  return array;
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




/*
    public static function randomizeArray( arr:Array ):void
    {
      // shuffle array
      for( var i:int = 0; i < arr.length; i++ )
      {
        var tmp:* = arr[i];
        var randomNum:int = MathUtil.randRange(0, arr.length - 1);
        arr[i] = arr[randomNum];
        arr[randomNum] = tmp;
      }
    }

    /**
     * Returns an array of all the indexes of needle in haystack
     *
    public static function getIndexesOfArray( haystack:String, needle:String ) : Array
    {
      var indexs:Array = new Array();
      var startIndex:int = 0;
      while( startIndex != -1 )
      {
        startIndex = haystack.indexOf( needle, startIndex );
        if( startIndex != -1 )
        {
          indexs.push( startIndex );
          startIndex += 1;
        }
      }
      return indexs;
    }
    */