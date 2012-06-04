var CanvasUtil = CanvasUtil || {};

/**
 *  Calculates a random number within a minimum and maximum range.
 *  @return A boolean indicating canvas support.
 *  @use    {@code CanvasUtil.hasCanvas();}
 */
CanvasUtil.hasCanvas = function() {
  return (!document.createElement('canvas').getContext) ? false : true;
};

// // original from Robin W. Spencer (http://scaledinnovation.com)
// function hexToCanvasColor(hexColor,opacity){
//     // Convert #AA77CC to rbga() format for Firefox
//     opacity=opacity || "1.0";
//     hexColor=hexColor.replace("#","");
//     var r=parseInt(hexColor.substring(0,2),16);
//     var g=parseInt(hexColor.substring(2,4),16);
//     var b=parseInt(hexColor.substring(4,6),16);
//     return "rgba("+r+","+g+","+b+","+opacity+")";
// }

// // original from Robin W. Spencer (http://scaledinnovation.com)
// function drawPoint(ctx,x,y,r,color){
//     ctx.save();
//     ctx.beginPath();
//     ctx.lineWidth=1;
//     ctx.fillStyle=hexToCanvasColor(color,1);
//     ctx.arc(x,y,r,0.0,2*Math.PI,false);
//     ctx.closePath();
//     ctx.stroke();
//     ctx.fill();
//     ctx.restore();
// }

// function drawArc(startAngle,endAngle) {
//   var drawingArc = true;  // set boolean value to show we&rsquo;re drawing
//   // Define our path using the API
//   ctx.beginPath();
//   ctx.arc(15,15,10, (Math.PI/180)*(startAngle-90),(Math.PI/180)*(endAngle-90), false);
//   ctx.stroke();   // draw on the canvas
//   drawingArc = false;
// }

//     drawArc = (ctx,radius,startAngle,endAngle) ->
//       ctx.beginPath()
//       ctx.arc( 0, 0, radius, (Math.PI/180)*(startAngle-90),(Math.PI/180)*(endAngle-90), false)
//       ctx.stroke()

