function IDevice(){}

IDevice.PORTRAIT = 'portrait';
IDevice.LANDSCAPE = 'landscape';

IDevice.preventMobileSafariBounce = function() {
    // prevents mobile safari from bouncing
    document.ontouchmove = function(event) {
    	event.preventDefault();
    };
};

IDevice.addOrientationListener = function( callback ) {
    if (window.orientation !== undefined) {
    	//this.is_running_on_device = true;
    	window.onorientationchange = function (event) {
    		if (Math.abs(window.orientation) % 180 === 90) {
    			window.scrollTo(0,1);
    			// console.log('is landscape');
    		} else {
    			// console.log('is portrait');
    		}
    	};
    	// make sure to respond right away
    	window.onorientationchange(null);
    }
};