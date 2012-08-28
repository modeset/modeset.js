var Clipboard = Clipboard || {};

Clipboard.copyLink = function( data ) {
    if ( window.clipboardData && window.clipboardData.setData ) {
        window.clipboardData.setData( 'Text', data );
    } else {
        // Unsupported browser
    }
};
