function Debug(){
  this.init();
}

Debug.prototype.init = function () {
  // create html
  var htmlStr = '';
  htmlStr += '<a id="debug_button" href="javascript:debug.collapse();">collapse</a>';
  htmlStr += '<div id="debug_content">';
  htmlStr += '  <div id="debug_stats"></div>';
  htmlStr += '  <div style="color:black;">';
  htmlStr += '    <strong>';
  htmlStr += '      <span class="underline">DEBUG</span>';
  htmlStr += '    </strong>';
  htmlStr += '  </div>';
  htmlStr += '  <div id="debug_realtime"></div>';
  htmlStr += '  <div style="color:black;">';
  htmlStr += '    <strong>';
  htmlStr += '      <span class="underline">LOG</span>';
  htmlStr += '    </strong>';
  htmlStr += '  </div>';
  htmlStr += '  <div id="debug_log" style="font-size:10px;color:#111111;white-space:nowrap;overflow:auto;"></div>';
  htmlStr += '</div>';
  
  // set outer container styles
  var debugDiv = this.debugDiv = document.createElement( 'div' );
  debugDiv.id = "debug";
  debugDiv.style.display = 'block';
  debugDiv.style.zIndex = '9999';
  debugDiv.style.position = 'absolute';
  debugDiv.style.top = '0px';
  debugDiv.style.right = '0px';
  debugDiv.style.width = '300px';
  debugDiv.style.height = '270px';
  debugDiv.style.border = '1px dotted red';
  debugDiv.style.padding = '8px';
  debugDiv.style.backgroundColor = '#eeeeee';
  debugDiv.style.fontSize = '12px';
  debugDiv.style.color = '#ff0000';
  debugDiv.innerHTML = htmlStr;
  document.body.appendChild( debugDiv );
  
  // set up logging vars
  this.element = document.getElementById( "debug_log" );
  this.realtime_element = document.getElementById("debug_realtime") ;
  this.stats_holder = document.getElementById("debug_stats") ;
	this.log_lines = 12;
	this.realtime_properties = [];
	this.timer_fps = 1000/30;
	this.active = true;
	
	// set up collapsibility
	this.content = document.getElementById( "debug_content" );
	this.collapse_btn = document.getElementById( "debug_button" );
  this.collapse_btn.style.display = 'block';
  this.collapse_btn.style.width = '100%';
  this.collapse_btn.style.textAlign = 'right';
  this.collapse_btn.style.padding = '3px';
  this.collapse_btn.style.margin = '0 0 3px 0';
  this.collapse_btn.style.backgroundColor = '#f00';
  this.collapse_btn.style.color = '#fff';
  this.collapsed = false;
	
	// add mr. doob's stats
	this.stats = new Stats();
  this.stats_holder.appendChild(this.stats.domElement); 
  
  // check cookie for collapsed persistence
  if( typeof Cookie !== 'undefined' ) {
    if( Cookie.readCookie('debugShowing') == 'false' )  {
      this.collapse();
    }
  }
	
	// start updating
	if (this.element) { 
	  this.runTimer();
  }
};

Debug.prototype.collapse = function () {
  this.collapsed = !this.collapsed;
  if( this.collapsed ) {
    this.content.style.display = 'none';
    this.debugDiv.style.width = '50px';
    this.debugDiv.style.height = '20px';
    this.collapse_btn.innerHTML = 'expand';
    if( typeof Cookie !== 'undefined' ) Cookie.createCookie('debugShowing','false',10);
  } else {
    this.content.style.display = 'block';
    this.debugDiv.style.width = '300px';
    this.debugDiv.style.height = '270px';
    this.collapse_btn.innerHTML = 'collapse';
    if( typeof Cookie !== 'undefined' ) Cookie.createCookie('debugShowing','true',10);
  }
  
};

Debug.prototype.log = function ( newDebugString ) {
  if (this.element) {
    // get time
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    if(minutes < 10) minutes = "0" + minutes;

    // log it
    var logStr = "<div>[" + hours + ":" + minutes + "] " + newDebugString + "</div>";
    this.element.innerHTML += logStr;

    // if we're over the limit for logging, remove first element
    if( this.element.childNodes.length > this.log_lines ){
      this.element.removeChild( this.element.childNodes[0] );
    }
    
    // send to console if it exists
    window.console && console.log( newDebugString );
  }
};

Debug.prototype.runTimer = function () {
  // keep stats animating
  this.stats.update();

	this.realtime_element.innerHTML = "";
	var obj;
	for( var i=0; i < this.realtime_properties.length; i++ )
	{
		obj = this.realtime_properties[i];
		this.realtime_element.innerHTML += obj.friendlyName + " = " + obj.object[ obj.propertyStr ] + "<br/>";
	}
	
	// keep timer running
	var self = this;
	if( this.active ) setTimeout( function() { self.runTimer(); }, this.timer_fps );
};

Debug.prototype.addRealtimeProperty = function ( object, propertyStr, friendlyName ) {
  if (this.element) {
    this.realtime_properties.push( { object:object, propertyStr:propertyStr, friendlyName:friendlyName } );
  }    
};

Debug.prototype.updateFPS = function( e ) {
  this.timer_fps = e.memo.fps;
};


Debug.prototype.removeElement = function( elem ) {
  if( elem ) {
    if( elem.parentNode ) {
      elem.parentNode.removeChild( elem );
    }
  }
};

Debug.prototype.dispose = function ()
{
  this.removeElement( document.getElementById("debug") );
  this.active = false;
  this.element = null;
};
