function ColorUtil() {}

/**
 * Converts rgb color values to hex.
 *
 * @param	r		red
 * @param	g		green
 * @param	b		blue
 * @return	hex color number
 * @use		{@code var vHex = ColorUtil.rgbToHex( 255, 70, 55 );}
 */
ColorUtil.rgbToHex = function( r, g, b ) {
  return ( r << 16 | g << 8 | b );
};

/**
 * Converts a hex color number to an object with r, g, b properties.
 *
 * @param	hex		the hex color number.
 * @return 	an object with r, g, and b color numbers.
 * @use		{@code var vRgb = ColorUtil.hexToRGB( 0xffffff );}
 */
ColorUtil.hexToRGB = function( hex ) {
	// bitwise shift the hex numbers.
  var red = hex >> 16;
  var grnBlu = hex - ( red << 16 );
  var grn = grnBlu >> 8;
  var blu = grnBlu - ( grn << 8 );
  
  // return the new object
  return( { r:red, g:grn, b:blu } );
};

ColorUtil.randomColor = function() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
};