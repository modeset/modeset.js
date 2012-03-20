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

// original from Robin W. Spencer (http://scaledinnovation.com)
ColorUtil.HSVtoRGB = function(h,s,v,opacity){
  // inputs h=hue=0-360, s=saturation=0-1, v=value=0-1
  // algorithm from Wikipedia on HSV conversion
    var hi=Math.floor(h/60)%6;
    var f=h/60-Math.floor(h/60);
    var p=v*(1-s);
    var q=v*(1-f*s);
    var t=v*(1-(1-f)*s);
    var r=v;  // case hi==0 below
    var g=t;
    var b=p;
    switch(hi){
        case 1:r=q;g=v;b=p;break;
        case 2:r=p;g=v;b=t;break;
        case 3:r=p;g=q;b=v;break;
        case 4:r=t;g=p;b=v;break;
        case 5:r=v;g=p;b=q;break;
    }
    //  At this point r,g,b are in 0...1 range.  Now convert into rgba or #FFFFFF notation
    if(opacity){
        return "rgba("+Math.round(255*r)+","+Math.round(255*g)+","+Math.round(255*b)+","+opacity+")";
    }else{
       return "#"+ColorUtil.toHex(r*255)+ColorUtil.toHex(g*255)+ColorUtil.toHex(b*255);
    }
};

// original from Robin W. Spencer (http://scaledinnovation.com)
ColorUtil.hex = new Array("0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F");

// original from Robin W. Spencer (http://scaledinnovation.com)
ColorUtil.toHex=function(decimalValue,places){
    if(places == undefined || isNaN(places))  places = 2;
    var next = 0;
    var hexidecimal = "";
    decimalValue=Math.floor(decimalValue);
    while(decimalValue > 0){
        next = decimalValue % 16;
        decimalValue = Math.floor((decimalValue - next)/16);
        hexidecimal = ColorUtil.hex[next] + hexidecimal;
    }
    while (hexidecimal.length<places){
        hexidecimal = "0"+hexidecimal;
    }
    return hexidecimal;
};




