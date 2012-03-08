var CSSHelper = function() {
    
    var _webkit_css_enabled = false;
    
    var checkForWebkitCSS = function() {
        if( navigator.userAgent.match(/iPhone/i) ) _webkit_css_enabled = true;
        else if( navigator.userAgent.match(/iPod/i) ) _webkit_css_enabled = true;
        else if( navigator.userAgent.match(/iPad/i) ) _webkit_css_enabled = true;
        else if( navigator.userAgent.match(/Chrome/i) ) _webkit_css_enabled = true;
        else if( navigator.userAgent.match(/Safari/i) ) _webkit_css_enabled = true;
        // _webkit_css_enabled = false;
    };
    
    var convertToNativePositioning = function( element ) {
        _webkit_css_enabled = false;
        element.style.webkitTransform = '';
    };
    
    var convertToWebkitPositioning = function( element ) {
        _webkit_css_enabled = true;
        element.style.left = '';
        element.style.top = '';
    };
    
    // update css based on webkit positioning, or standard top/left css
    var update2DPosition = function ( element, x, y ) {
        if( !element ) return;

        x = roundForCSS( x );
        y = roundForCSS( y );

        if( !_webkit_css_enabled ) {
            element.style.left = x + 'px';
            element.style.top = y + 'px';
            // clear webkit transform
            element.style.webkitTransition = '';
        } else {
            // stop any previous webkit animations
            element.style.webkitTransition = '';
            element.style.webkitTransform = '';
            // set new position transform
            var new_transform = "translate3d(" + x + "px, " + y + "px, 0px)";
            if( element.style.webkitTransform != new_transform ) {
                element.style.webkitTransform = new_transform; // only apply style if not already in position
            }
            // clear native positioning
            element.style.left = '0';
            element.style.top = '0';
        }
    };

    var roundForCSS = function( number ) {
        var multiplier = Math.pow( 10, 2 );
        return Math.round( number * multiplier ) / multiplier;
    };

    
    var findPos = function(obj) {
        // get page scroll offset
        var scrollX = window.pageXOffset ? window.pageXOffset : document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft;
        var scrollY = window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;

        // get element location
        var curleft = curtop = 0;

        if (obj.offsetParent) {
            do {
                if( obj.offsetParent && typeof obj.offsetParent.style !== 'undefined' && typeof obj.offsetParent.style.webkitTransform !== 'undefined' && obj.offsetParent.style.webkitTransform ) {   // last conditional fixes chrome on windows
                    var transformXYZArray = obj.offsetParent.style.webkitTransform.split('translate3d(')[1].split(')')[0].replace(/ +/g, '').replace(/px+/g, '').split(',');
                    curleft += parseInt( transformXYZArray[0] );
                    curtop += parseInt( transformXYZArray[1] );
                } 
                curleft += obj.offsetLeft;
                curtop += obj.offsetTop;
            } while (obj = obj.offsetParent);
        }
        // return position from cumulative offset
        return [ curleft - scrollX, curtop - scrollY ];
    };
    
    var getWebKitCSSEnabled = function() {
        return _webkit_css_enabled;
    };
    
    checkForWebkitCSS();
    
    return {
        update2DPosition : update2DPosition,
        findPos : findPos,
        getWebKitCSSEnabled : getWebKitCSSEnabled,
        convertToNativePositioning : convertToNativePositioning,
        convertToWebkitPositioning : convertToWebkitPositioning
    };
};