package de.nd.audi.f09.modules.buzz.util 
{
	/**
	 * @author justin
	 */
	public class ArrayUtil 
	{
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
		 */
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
	}
}
