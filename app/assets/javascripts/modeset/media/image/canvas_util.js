var CanvasUtil = CanvasUtil || {};

CanvasUtil.clearColor = 'rgba(0,0,0,0)';

CanvasUtil.dataImgPrefix = 'data:image/png;base64,';

/**
 *  Lets a developer know if the canvas element is supported.
 *  @return A boolean indicating canvas support.
 *  @use    {@code CanvasUtil.hasCanvas();}
 */
CanvasUtil.hasCanvas = function() {
  return (!document.createElement('canvas').getContext) ? false : true;
};

/**
 *  Converts a hex color value to canvas-friendly rgba. Original code from Robin W. Spencer (http://scaledinnovation.com).
 *  @return An rgba color string.
 *  @use    {@code CanvasUtil.hexToCanvasColor('#00ff00', 0.5);}
 */
CanvasUtil.hexToCanvasColor = function( hexColor, opacity ) {
  opacity = ( opacity != null ) ? opacity : "1.0";
  hexColor = hexColor.replace( "#", "" );
  var r = parseInt( hexColor.substring( 0, 2 ), 16 );
  var g = parseInt( hexColor.substring( 2, 4 ), 16 );
  var b = parseInt( hexColor.substring( 4, 6 ), 16 );
  return "rgba("+r+","+g+","+b+","+opacity+")";
};

/**
 *  Converts r, g, b, a values to canvas-friendly rgba string.
 *  @return An rgba color string.
 *  @use    {@code CanvasUtil.rgbToCanvasColor(0, 0, 0, 0.5);}
 */
CanvasUtil.rgbToCanvasColor = function( r, g, b, opacity ) {
  return "rgba("+r+","+g+","+b+","+opacity+")";
};

/**
 *  Converts r, g, b, to a brightness between 0-1.
 *  @return A brightness percentage.
 *  @use    {@code CanvasUtil.rgbToBrightness(0, 255, 0);}
 */
CanvasUtil.rgbToBrightness = function( r, g, b ) {
  return (r + g + b) / 768; // 768 is r,g,b: 256*3
};

/**
 *  Returns the percent difference between 2 colors.
 *  @return A difference percentage.
 *  @use    {@code CanvasUtil.rgbDifference(0, 0, 0, 255, 255, 255);}
 */
CanvasUtil.rgbDifference = function( r1, g1, b1, r2, g2, b2 ) {
  return Math.abs((r1 + g1 + b1) - (r2 + g2 + b2)) / 765;
};

/**
 *  Draws a filled circle. Original code from Robin W. Spencer (http://scaledinnovation.com).
 *  @use    {@code CanvasUtil.drawCircle( context, 50, 50, 40 );}
 */
CanvasUtil.drawCircle = function( ctx, x, y, radius, extraSetup ) {
  ctx.save();
  if( extraSetup ) extraSetup( ctx );
  ctx.beginPath();
  ctx.arc( x, y, radius, 0.0, 2 * Math.PI, false );
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  ctx.restore();
};

/**
 *  Draws an arc - a portion of a circle.
 *  @use    {@code CanvasUtil.drawArc(context, 50, 50, 40, 90, 180);}
 */
CanvasUtil.drawArc = function( ctx, x, y, radius, startAngle, endAngle ) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo( x, y );
  ctx.arc( x, y, radius, (Math.PI / 180) * (startAngle - 90), (Math.PI / 180) * (endAngle - 90), false );
  ctx.lineTo( x, y );
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  ctx.restore();
};


CanvasUtil.getPixelColorFromContext = function( context, x, y ) {
  var pixelData = context.getImageData( x, y, 1, 1 ).data;
  return [pixelData[0], pixelData[1], pixelData[2]];
};

// useful for grabbing an image and caching it as a pixel source
CanvasUtil.loadImageToContext = function( imagePath, callback ) {
    var image = new Image();
    image.onload = function() {
        var canvasSource = document.createElement("canvas");
        canvasSource.width = image.width;
        canvasSource.height = image.height;
        var context = canvasSource.getContext("2d");
        context.drawImage( image, 0, 0 );
        callback( context, image );
    };
    image.src = imagePath;
};

CanvasUtil.copyPixels = function( source, destination, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH ) {
    sourceX = sourceX || 0;
    sourceY = sourceY || 0;
    sourceW = sourceW || source.canvas.width;
    sourceH = sourceH || source.canvas.height;
    destX = destX || 0;
    destY = destY || 0;
    destW = destW || source.canvas.width;
    destH = destH || source.canvas.height;
    destination.putImageData( source.getImageData( sourceX, sourceY, sourceW, sourceH ), destX, destY, destX, destY, destW, destH );
};

// canvas saving
CanvasUtil.saveCanvas = function( ctx ){
  // set canvasImg image src to dataURL
  // so it can be saved as an image
  var saveDiv = document.createElement('img');
  saveDiv.id = 'save';
  document.body.appendChild(saveDiv);
  document.getElementById("save").src = ctx.canvas.toDataURL();
};
