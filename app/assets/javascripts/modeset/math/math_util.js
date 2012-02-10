function MathUtil() {}

/**
 *  Calculates a random number within a minimum and maximum range.
 *  @param  min   the value for the bottom range.
 *  @param  max   the value for the upper range.
 *  @return     the random number within the range.
 *  @use      {@code var vRandRange = MathUtil.randRange( 0, 999999 );}
 */
MathUtil.randRange = function( min, max ) {   
  return Math.round( Math.random() * ( max - min ) ) + min;
};

/**
 *  Calculates a random number within a minimum and maximum range.
 *  @param  min   the value for the bottom range.
 *  @param  max   the value for the upper range.
 *  @return     the random number within the range.
 *  @use      {@code var vRandRange = MathUtil.randRange( 0, 999999 );}
 */
MathUtil.randRangeDecimel = function ( min, max ) {   
  return Math.random() * ( max - min ) + min;
};

/**
 *  Returns   a percentage of a value in between 2 other numbers.
 *  @param    bottomRange   low end of the range.
 *  @param    topRange    top end of the range.
 *  @param    valueInRange  value to find a range percentage of.
 *  @return   The percentage [0-1] of valueInRange in the range.
 *  @use    {@code var vPercent = MathUtil.getPercentWithinRange( 50, 150, 100 );  // displays 50 }
 */
MathUtil.getPercentWithinRange = function( bottomRange, topRange, valueInRange ) {
  // normalize values to work off zero
  if( bottomRange < 0 ) {
    var addToAll = Math.abs( bottomRange );
    bottomRange += addToAll;
    topRange += addToAll;
    valueInRange += addToAll;
  } else if( bottomRange > 0 ) {
    var subFromAll = Math.abs( bottomRange );
    bottomRange -= subFromAll;
    topRange -= subFromAll;
    valueInRange -= subFromAll;
  }
  // return percentage or normalized values 
  return ( valueInRange / ( topRange - bottomRange ) );
};

/**
 *  Ease a number towards a target.
 *  @param    current number (0)
 *  @param    target number (100)
 *  @param    easeFactor number (2)
 *  @return   number 50
 *  @use      {@code var vRadians = MathUtil.easeTo( 0, 100, 2 );}
 */
MathUtil.easeTo = function( current, target, easeFactor ) {  
  return current -= ( ( current - target ) / easeFactor );
};

/**
 *  Convert a number from Degrees to Radians.
 *  @param    d degrees (45°, 90°)
 *  @return     radians (3.14..., 1.57...)
 *  @use      {@code var vRadians = MathUtil.degreesToRadians( 180 );}
 */
MathUtil.degreesToRadians = function( d ) {
  return d * ( Math.PI / 180 );
};

/**
 *  Convert a number from Radians to Degrees.
 *  @param    r radians (3.14..., 1.57...)
 *  @return     degrees (45°, 90°)
 *  @use      {@code var vDegrees = MathUtil.radiansToDegrees( 3.14 );}
 */
MathUtil.radiansToDegrees = function( r ) {
  return r * ( 180 / Math.PI );
};

/**
 *  Convert a number from a Percentage to Degrees (based on 360°).
 *  @param  n   percentage (1, .5)
 *  @return degrees (360°, 180°)
 *  @use      {@code var vDegreesPercent = MathUtil.percentToDegrees( 50 );}
 */
MathUtil.percentToDegrees = function( n ) {
  return ( ( Math.abs( n / 100 ) ) * 360 ) * 100;   
};

/**
 *  Convert a number from Degrees to a Percentage (based on 360°).
 *  @param  n degrees (360°, 180°)
 *  @return   percentage (1, .5)
 *  @use    {@code var vPercentDegrees = MathUtil.degreesToPercent( 180 );}
 */
MathUtil.degreesToPercent = function( n ) {
  return ( Math.abs( n / 360 ) );   
};

/**
 *  Rips through an indexed array of numbers adding the total of all values.
 *  @param  nums  an indexed array of numbers.
 *  @return     the sum of all numbers.
 *  @use      {@code var vSums = MathUtil.sums( [ 12, 20, 7 ] );}
 */
MathUtil.sums = function( nums ) {
  // declare locals.
  var sum = 0;
  var numL = nums.length;
  
  // loop: convert and add.
  for( var i = 0; i < numL; i++ ) {
    sum += nums[ i ];
  }
  return sum;
}

/**
 *  Report the average of an indexed array of numbers.
 *  @param  nums  an indexed array of numbers.
 *  @return     the average of all numbers.
 *  @use      {@code var vAverage = MathUtil.average( [ 12, 20, 7 ] );}
 */
MathUtil.average = function( nums ) {
  return sums( nums ) / nums.length;
}

/**
 *  Linear interpolate between two values.  
 *  @param    lower first value (-1.0, 43.6)
 *  @param    upper second value (-100.0, 3.1415)
 *  @param    n point between values (0.0, 1.0)
 *  @return     number (12.3, 44.555)
 *  @use      {@code var value = MathUtil.interp( 10, 20, .5 );  //returns 15}
 */
MathUtil.interp = function( lower, upper, n ) {
  return ((upper-lower)*n)+lower;
}

/**   
 *  Re-maps a number from one range to another. 
 *  @param    value  The incoming value to be converted
 *  @param    lower1 Lower bound of the value's current range
 *  @param    upper1 Upper bound of the value's current range
 *  @param    lower2 Lower bound of the value's target range
 *  @param    upper2 Upper bound of the value's target range
 *  @return     number (12.3, 44.555)
 *  @use      {@code var value = MathUtil.remap( 10, 0, 20, 1, 2 );  //returns 1.5}
 */
MathUtil.remap = function( value, lower1, upper1, lower2, upper2 ) 
{
  return MathUtil.interp(lower2,upper2, MathUtil.getPercentWithinRange(lower1,upper1,value)/100.);
}

/**
 *  Get distance between 2 points with the pythagorean theorem.
 *  @param    x1  first point's x position
 *  @param    y1  first point's y position
 *  @param    x2  second point's x position
 *  @param    y2  second point's y position
 *  @return   The distance between point 1 and 2
 *  @use      {@code var distance = MathUtil.getDistance( 7, 5, 3, 2 );}
 */
MathUtil.getDistance = function ( x1, y1, x2, y2 ) {
  a = x1 - x2;
  b = y1 - y2;
  return Math.abs( Math.sqrt(a*a + b*b) );
};

