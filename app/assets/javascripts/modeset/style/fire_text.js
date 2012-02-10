function fireText()
{
    var FireColorStop = function( xPos, yPos, blur, color )
    {
        this.x = xPos;
        this.y = yPos;
        this.blur = blur;
        this.color = color;
        this.oscSpeed = Math.random() * Math.abs( yPos ) / 75;
        this.oscIncrement = 0;
        this.xOffset = 0;
        this.yOffset = 0;
        this.blurOffset = 0;
    };

    FireColorStop.prototype.oscillate = function() 
    {
        this.oscIncrement += this.oscSpeed;
        this.xOffset = Math.sin(this.oscIncrement) * this.blur / 3;
        this.yOffset = Math.sin(this.oscIncrement) * 1;
        this.blurOsc = this.blur + 10 + Math.sin(this.oscIncrement) * 3;
    };

    FireColorStop.prototype.getCSS = function() 
    {
        return ( this.x + this.xOffset ) + 'px ' + ( this.y + this.yOffset ) + 'px ' + this.blurOsc + 'px ' + this.color; 
    };
    
    // create objects for each color stop for independent animation
    var fireColors = [  new FireColorStop(0,  0,  4,  '#FFFFFF'),
                        new FireColorStop(0, -5,  4,  '#FFFF33'),
                        new FireColorStop(2, -10, 6,  '#FFDD33'),
                        new FireColorStop(-2,-15, 11, '#FF8800'),
                        new FireColorStop(2, -25, 18, '#FF2200')
                        ];

    var fps = 1000/30;
    var text = document.getElementById('fireText');
    
    // oscillate color stops and rebuild fire css
    setInterval( function(){ 
        var shadowCSS = '';
        for( var i = 0; i < fireColors.length; i++ )
        {
            fireColors[i].oscillate();
        
            shadowCSS += fireColors[i].getCSS();
            if( i < fireColors.length - 1 )
                shadowCSS += ', ';
        }
        text.style.textShadow = shadowCSS;
    }, fps );
}
