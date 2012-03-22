//check for canvas support
var hasCanvas = function() {
    if(!document.createElement('canvas').getContext) {
        MB_usingCanvas = false;
    }
};

// original from Robin W. Spencer (http://scaledinnovation.com)
function hexToCanvasColor(hexColor,opacity){
    // Convert #AA77CC to rbga() format for Firefox
    opacity=opacity || "1.0";
    hexColor=hexColor.replace("#","");
    var r=parseInt(hexColor.substring(0,2),16);
    var g=parseInt(hexColor.substring(2,4),16);
    var b=parseInt(hexColor.substring(4,6),16);
    return "rgba("+r+","+g+","+b+","+opacity+")";
}

// original from Robin W. Spencer (http://scaledinnovation.com)
function drawPoint(ctx,x,y,r,color){
    ctx.save();  
    ctx.beginPath();
    ctx.lineWidth=1;
    ctx.fillStyle=hexToCanvasColor(color,1);
    ctx.arc(x,y,r,0.0,2*Math.PI,false);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
}