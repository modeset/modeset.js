function InteriorView (baseImgDir, layer_path, imgPath ) {
    // class vars
    this.is_idevice = false;
    this.is_android = false;
    this.container = false;
    this.selection_path = false;
    this.base_img_path = false;
    this.base_img_dir = false;

    this.base_img_dir = baseImgDir;
    this.base_img_path = layer_path + 'interior_vr/';
    this.selection_path = imgPath;
    this.image_path = this.base_img_dir + this.base_img_path + this.selection_path + '/';

    this.init();
};

InteriorView.prototype.init = function ()
{
    // initialize
    this.container = document.getElementById("interior_view_container");
    if( navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i) ) this.is_idevice = true;
    
    if( this.is_idevice == true ) {
        this.initJavascript();
    } else {
        this.initFlash();
    }

    this.initOverlay();

};

InteriorView.prototype.initOverlay = function ()
{
    // show the controls helper
    $('#flash_vr_overlay').show();
    // kill the overlay div upon click
    $('#flash_vr_overlay').click(function() {
      $(this).hide();
    });
};

InteriorView.prototype.initJavascript = function ()
{
    // insert html
    this.container.innerHTML = '<div id="interior_vr"><div id="vr-main"><div id="vr-clipper"><div id="vr-container"><div id="vr-position"><div id="rotor-x"><div id="rotateX"><div id="rotor-y"><div id="rotateY"><div id="cube"></div></div></div></div></div></div></div></div></div></div>';

    var basePath = this.image_path;

    // init apple's vr code
    this.VirtualTour = {
        init: function() {
            window.kRingRadius = 450;
            this.setup();
        },
        didShow: function() {
            this.init()
        },
        willHide: function() {
            recycleObjectValueForKey(this, "_gSpinner");
            this._gSpinner = null;
        },
        // F, R, B, L, U, D
        _imageSrcs: ["face_f.jpg", "face_r.jpg", "face_b.jpg", "face_l.jpg", "face_u.jpg", "face_d.jpg"],
        setup: function() {
            var a = document.getElementById("vr-container");
            var b = document.getElementById("cube");
            var g = this._imageSrcs;
            var h = 704;
            var c = 704;
            var j = document.createDocumentFragment();
            for (var e = 0, f = g.length, d; (imageURL = g[e]); e++) {
                d = new Image();
                d.src = basePath + imageURL;
                d.id = "face" + (e + 1);
                d.className = "face";
                d.width = h;
                d.height = c;
                j.appendChild(d);
            }
            b.appendChild(j);
            this._gSpinner = new Spinner(document.getElementById("rotateX"), document.getElementById("rotor-x"), document.getElementById("rotateY"), document.getElementById("rotor-y"), a, h, c);
            a = null;
            j = null;
        }
    };
    
    this.VirtualTour.init();
};

InteriorView.prototype.initFlash = function ()
{

    // insert html
    this.container.innerHTML = '<div id="interior_swf"></div>';

    // embed swf
    swfobject.embedSWF( "/swfs/krpano.swf", "interior_swf", "704", "323", "9.0.0", null, {xml: this.image_path + 'vr_config.xml'}, {allowScriptAccess:"always", wmode: "transparent"}, {} );
};

var interiorView;

function loadAudiVR(){
  interiorView = new InteriorView( 'audi' );
}

function loadConcertVR(){
    interiorView = new InteriorView( 'concert' );
}
