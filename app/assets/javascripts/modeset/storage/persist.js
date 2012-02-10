var Persist = {
    data: {},
    source: null,
    options: {
        expires: 1,
        domain: '',
        path: '',
        secure: false
    },

    init: function(options, data, source) {
        this.source = source || document.cookie;

        Persist.options = Object.extend(Persist.options, options || {});
        var payload = Persist.retrieve();
        if (payload) Persist.data = payload.evalJSON();
        else Persist.data = data || {};
        Persist.store();
    },

    getData: function(key) {
        return Persist.data[key];
    },

    setData: function(key, value) {
        Persist.data[key] = value;
        Persist.store();
    },

    removeData: function(key) {
        delete Persist.data[key];
        Persist.store();
    },

    retrieve: function() {
        var start = this.source.indexOf(Persist.options.name + "=");

        if (start == -1) {
            return null;
        }
        if (Persist.options.name != this.source.substr(start, Persist.options.name.length)) {
            return null;
        }

        var len = start + Persist.options.name.length + 1;
        var end = this.source.indexOf(';', len);

        if (end == -1) {
            end = this.source.length;
        }
        return unescape(this.source.substring(len, end));
    },

    store: function() {
        var expires = '';

        if (Persist.options.expires) {
            var today = new Date();
            expires = Persist.options.expires * 86400000;
            expires = ';expires=' + new Date(today.getTime() + expires);
        }

        this.source = Persist.options.name + '=' + escape(Object.toJSON(Persist.data)) + Persist.getOptions() + expires;
        document.cookie = this.source;
        
        var self = this;
        setTimeout( function(){
            if( tnf_app ) tnf_app.objCInterface.callbackToObjC( app_events.STORE_CART_DATA, self.source );
        }, 3000 );
    },

    erase: function() {
        this.source = Persist.options.name + '=' + Persist.getOptions() + ';expires=Thu, 01-Jan-1970 00:00:01 GMT';
        document.cookie = this.source;
        
        var self = this;
        setTimeout( function(){
            if( tnf_app ) tnf_app.objCInterface.callbackToObjC( app_events.STORE_CART_DATA, self.source );
        }, 3000 );
    },

    getOptions: function() {
        return (Persist.options.path ? ';path=' + Persist.options.path : '') + (Persist.options.domain ? ';domain=' + Persist.options.domain : '') + (Persist.options.secure ? ';secure' : '');
    }
};
