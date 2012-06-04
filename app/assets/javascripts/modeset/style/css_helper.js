var CSSHelper = function() {

    var _curVendor = CSSHelper.getVendorPrefix( 'Transform' );
    var _transformsEnabled = ( _curVendor != null );

    var getCssTransformsEnabled = function() {
        return _transformsEnabled;
    };

    var getVendor = function() {
        return _curVendor;
    };

    var convertToNativePositioning = function( element ) {
        _transformsEnabled = false;
        clearWebkitPositioning( element );
    };

    var convertToWebkitPositioning = function( element ) {
        _transformsEnabled = true;
        clearNativePositioning( element );
    };

    var clearNativePositioning = function( element ) {
        element.style.left = '';
        element.style.top = '';
    };

    var clearWebkitPositioning = function( element ) {
        element.style[ _curVendor + 'Transform' ] = '';
    };

    var clearWebkitTransition = function( element ) {
        // stop any previous webkit animations
        element.style[ _curVendor + 'Transform' ] = '';
    };

    // update css based on webkit positioning, or standard top/left css
    var update2DPosition = function ( element, x, y, scale, rot, keepTransition ) {
        if( !element ) return;
        if( keepTransition != true ) keepTransition = false;

        // since we're manually setting position, generally we're doing this on a frame loop, and should disable css transitions if true
        if( keepTransition == false ) clearWebkitTransition( element );

        if( !_transformsEnabled ) {
            clearWebkitPositioning( element );
            element.style.left = CSSHelper.roundForCSS( x ) + 'px';
            element.style.top = CSSHelper.roundForCSS( y ) + 'px';
        } else {
            clearNativePositioning( element );
            element.style[ _curVendor + 'Transform' ] = buildPositionTranslateString( x, y ) + buildScaleTranslateString( scale ) + buildRotationTranslateString( rot );     // element[ _curVendor + 'Transform' ] &&
        }
    };

    var buildPositionTranslateString = function( x, y ) {
        return "translate3d( " + CSSHelper.roundForCSS( x ) + "px, " + CSSHelper.roundForCSS( y ) + "px, 0px )";
    };

    var buildScaleTranslateString = function( deg ) {
        return " scale( " + CSSHelper.roundForCSS( deg ) + " )";
    };

    var buildRotationTranslateString = function( deg ) {
        return " rotate( " + CSSHelper.roundForCSS( deg ) + "deg )";
    };

    return {
        update2DPosition : update2DPosition,
        getCssTransformsEnabled : getCssTransformsEnabled,
        getVendor: getVendor,
        convertToNativePositioning : convertToNativePositioning,
        convertToWebkitPositioning : convertToWebkitPositioning
    };
};

// this should really only be called once
CSSHelper.getVendorPrefix = function( styleSuffix ) {

    // see if the major browser vendor prefixes are detected for css transforms
    var checkVendor = function() {
        var vendors = ['ms', 'Moz', 'Webkit', 'O', 'Khtml'];
        var element = findElementWithStyle();
        for( var vendor in vendors ) {
            if( element.style[ vendors[vendor] + styleSuffix ] !== undefined ) {
                return vendors[vendor];
            }
        }
        return null;
    };

    // find & return a legit element with style
    var findElementWithStyle = function () {
        var bodyChildren = document.body.childNodes;
        for( var child in bodyChildren ) {
            if( typeof bodyChildren[child].style !== 'undefined' ) {
                return bodyChildren[child];
            }
        }
    }

    return checkVendor();
};

// round down to 2 decimel places for smaller css strings
CSSHelper.roundForCSS = function( number ) {
    var multiplier = Math.pow( 10, 2 );
    return Math.round( number * multiplier ) / multiplier;
};

// find the location of an element on the page, taking into consideration either native left/top or CSS transform positioning, and page scroll offset
CSSHelper.findPos = function(obj) {
    // get page scroll offset
    var scrollX = window.pageXOffset ? window.pageXOffset : document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft;
    var scrollY = window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;

    // get element location
    var curleft = curtop = 0;

    if (obj.offsetParent) {
        do {
            if( obj.offsetParent && typeof obj.offsetParent.style !== 'undefined' && typeof obj.offsetParent.style[ _curVendor + 'Transform' ] !== 'undefined' && obj.offsetParent.style[ _curVendor + 'Transform' ] ) {   // last conditional fixes chrome on windows
                var transformXYZArray = obj.offsetParent.style[ _curVendor + 'Transform' ].split('translate3d(')[1].split(')')[0].replace(/ +/g, '').replace(/px+/g, '').split(',');
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
