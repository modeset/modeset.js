function ObjCInterface( enabled ) {
    this.is_connection_enabled = enabled;
    this.protocol_base = 'app:callback';
    return this;
}

ObjCInterface.prototype.callbackToObjC = function(  ) {
    // add arguments - first is function name, the rest are parameters
	var callback = this.protocol_base;
	for( var i=0; i < arguments.length; i++ )
		callback = callback + '+' + arguments[i];
	
	if( this.is_connection_enabled == true ) {
	    setTimeout(function() { 
    		document.location = callback;
		}, 20);
	} else {
	    if( debug ) debug.log( 'not running in device - cannot call back to obj-c :: ' + callback );
	}
};
