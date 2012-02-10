PlatformHelper = function ()
{
    this.webkit_css_enabled = false;
    this.animations_enabled = false;
    this.is_android = false;
    this.is_android21 = false;
    this.is_android22 = false;
    this.is_idevice = false;
    this.is_touchscreen = false;
    this.is_msie = false;
    this.is_msie6 = false;
    this.is_msie8 = false;
    this.is_firefox = false;
    this.base_img_dir = false;
    return this;
};

PlatformHelper.prototype.init = function ( baseImgDir )
{
    this.base_img_dir = baseImgDir;
    
    //debug.log(navigator.userAgent);
    // check for webkit positioning capability
    if( navigator.userAgent.match(/iPhone/i) ) this.webkit_css_enabled = true;
    else if( navigator.userAgent.match(/iPod/i) ) this.webkit_css_enabled = true;
    else if( navigator.userAgent.match(/iPad/i) ) this.webkit_css_enabled = true;
    else if( navigator.userAgent.match(/Chrome/i) ) this.webkit_css_enabled = true;
    else if( navigator.userAgent.match(/Safari/i) ) this.webkit_css_enabled = true;
    
    this.platformCheck();
    // special cases for touchscreens
    if( this.is_android == true || this.is_idevice == true ) this.is_touchscreen = true;
    
    // decide who sees animations
    if( this.is_msie == true ) this.animations_enabled = false;
    else this.animations_enabled = true;
};

PlatformHelper.prototype.platformCheck = function() {
  // check for certain platforms
  if( navigator.userAgent.match(/Android/i) ) this.is_android = true;
  if( navigator.userAgent.match(/Android 2.1/i) ) this.is_android21 = true;
  if( navigator.userAgent.match(/Android 2.2/i) ) this.is_android22 = true;
  if( navigator.userAgent.match(/MSIE/i) ) this.is_msie = true;
  if( navigator.userAgent.match(/MSIE 6/i) ) this.is_msie6 = true;
  if( navigator.userAgent.match(/MSIE 8/i) ) this.is_msie8 = true;
  if( navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i) ) this.is_idevice = true;
  if( navigator.userAgent.match(/Firefox/i) ) this.is_firefox = true;
};
PlatformHelper.prototype.updatePosition = function ( element, xPos, yPos, rotation )
{
    if( !this.webkit_css_enabled || this.is_android22 )
    {
        element.style.left = xPos + 'px';
        element.style.top = yPos + 'px';
        element.style.MozTransform = 'rotate(' + rotation + 'deg)';
        element.style.webkitTransform = 'rotate(' + rotation + 'deg)';
    }
    else
    {
        var new_transform = "translate3d(" + xPos + "px, " + yPos + "px, 0px) rotate(" + rotation + "deg)";
    	if( element.style.webkitTransform != new_transform )    // only apply style if not already in position
    	    element.style.webkitTransform = new_transform;
    }
};
PlatformHelper.prototype.deviceScopedContainer = function( element ) {
  if (this.is_idevice) {
    element.className = element.className + " browser_idevice";
  }
};
