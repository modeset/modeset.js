// A static class for converting between Decimal and DMS formats for a location
// ported from: http://andrew.hedges.name/experiments/convert_lat_long/
// Decimal Degrees = Degrees + minutes/60 + seconds/3600
// more info on formats here: http://www.maptools.com/UsingLatLon/Formats.html
// use: LocationFormatter.DMSToDecimal( 45, 35, 38, LocationFormatter.SOUTH );
// or:  LocationFormatter.decimalToDMS( -45.59389 );

function LocationFormatter(){
};

LocationFormatter.NORTH = 'N';
LocationFormatter.SOUTH = 'S';
LocationFormatter.EAST = 'E';
LocationFormatter.WEST = 'W';

LocationFormatter.roundToDecimal = function( inputNum, numPoints ) {
	var multiplier = Math.pow( 10, numPoints );
	return Math.round( inputNum * multiplier ) / multiplier;
};

LocationFormatter.decimalToDMS = function( location, hemisphere ){
	if( location < 0 ) location *= -1;	// strip dash '-'
	
	var degrees = Math.floor( location );										// strip decimal remainer for degrees
	var minutesFromRemainder = ( location - degrees ) * 60;  					// multiply the remainer by 60
	var minutes = Math.floor( minutesFromRemainder );							// get minutes from integer
	var secondsFromRemainder = ( minutesFromRemainder - minutes ) * 60; 		// multiply the remainer by 60
	var seconds = LocationFormatter.roundToDecimal( secondsFromRemainder, 2 );	// get minutes by rounding to integer

	return degrees + '&deg ' + minutes + "' " + seconds + '" ' + hemisphere;
};

LocationFormatter.decimalLatToDMS = function( location ){
	var hemisphere = ( location < 0 ) ? LocationFormatter.SOUTH : LocationFormatter.NORTH;	// south if negative
	return LocationFormatter.decimalToDMS( location, hemisphere );
};

LocationFormatter.decimalLongToDMS = function( location ){
	var hemisphere = ( location < 0 ) ? LocationFormatter.WEST : LocationFormatter.EAST;		// west if negative
	return LocationFormatter.decimalToDMS( location, hemisphere );
};

LocationFormatter.DMSToDecimal = function( degrees, minutes, seconds, hemisphere ){
	var ddVal = degrees + minutes / 60 + seconds / 3600;
	ddVal = ( hemisphere == LocationFormatter.SOUTH || hemisphere == LocationFormatter.WEST ) ? ddVal * -1 : ddVal;
	return LocationFormatter.roundToDecimal( ddVal, 5 );		
};
