package de.nd.audi.f09.modules.buzz.util 
{
	/**
	 * @author justin
	 */
	public class MathUtil 
	{
		
		public static function randRange( min:Number, max:Number ):int
		{		
			return Math.round( Math.random() * ( max - min ) ) + min;
		}
		
		public static function easeTo( current:Number, target:Number, easeFactor:Number = 10 ):Number
		{		
			return current -= ( ( current - target ) / easeFactor );
		}
		
		public static function degreesToRadians( d:Number ):Number 
		{
			return d * ( Math.PI / 180 );
		}
		
		/**
		 *	Returns a percentage of a value in between 2 other numbers.
		 *	@param	bottomRange		low end of the range.
		 *	@param 	topRange		top end of the range.
		 *	@param 	valueInRange	value to find a range percentage of.
		 *	@return	The percentage of valueInRange in the range.
		 * 	@use		{@code var vPercent:Number = MathUtil.getPercentWithinRange( 50, 150, 100 );  // displays 50 }
		 */
	    public static function getPercentWithinRange( bottomRange:Number, topRange:Number, valueInRange:Number ):Number
		{
			// normalize values to work off zero
			if( bottomRange < 0 )
			{
				var addToAll:Number = Math.abs( bottomRange );
				bottomRange += addToAll;
				topRange += addToAll;
				valueInRange += addToAll;
			}
			else if( bottomRange > 0 )
			{
				var subFromAll:Number = Math.abs( bottomRange );
				bottomRange -= subFromAll;
				topRange -= subFromAll;
				valueInRange -= subFromAll;
			}
			// simple calc to get percentage 
			return 100 * ( valueInRange / ( topRange - bottomRange ) );
		}
		
		/**
		 *	Linear interpolate between two values.  
		 *	@param		lower	first value (-1.0, 43.6)
		 *	@param		upper	second value (-100.0, 3.1415)
  		 *	@param		n	point between values (0.0, 1.0)
		 * 	@return 		number (12.3, 44.555)
		 * 	@use			{@code var value:Number = MathUtil.interp( 10, 20, .5 );  //returns 15}
		 */
		public static function interp( lower:Number, upper:Number, n:Number ):Number 
		{
			return ((upper-lower)*n)+lower;
		}

		/**   
		 *	Re-maps a number from one range to another. 
		 *	@param		value  The incoming value to be converted
		 *	@param		lower1 Lower bound of the value's current range
		 *	@param		upper1 Upper bound of the value's current range
		 *	@param		lower2 Lower bound of the value's target range
		 *	@param		upper2 Upper bound of the value's target range
		 * 	@return 		number (12.3, 44.555)
		 * 	@use			{@code var value:Number = MathUtil.remap( 10, 0, 20, 1, 2 );  //returns 1.5}
		 */
		public static function remap( value:Number, lower1:Number, upper1:Number, lower2:Number, upper2:Number ):Number 
		{
			return interp(lower2,upper2, getPercentWithinRange(lower1,upper1,value)/100.);
		}
	}
}
