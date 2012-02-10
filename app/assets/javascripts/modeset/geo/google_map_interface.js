var GoogleMapsInterface = function( mapHolder ){
	// google objects
	var _poly;
	var _map = null;
	var _bounds = null;
  // var mapStyle = [ { stylers: [ { invert_lightness: true } ] } ];
	var _polyOptions = {
		strokeColor: '#85e1ff',
		strokeOpacity: 1.0,
		strokeWeight: 3
	};
	// flag for divergent dependence on google maps having loaded
	var _hasMap = ( typeof google !== 'undefined' );
	// local objects used when google maps hasn't loaded
	var _localPoints = null;
	
	var METERS_TO_MILES = 0.000621371192;
	

	///////////////////////////////////////////////////////////////////////////////////////////////////
	var initialize = function( lat, long ) {
		if( _hasMap ) {
			_bounds = new google.maps.LatLngBounds();
			var mapCenter = new google.maps.LatLng( 0, -60 );
			var myOptions = {
				zoom: 1,
				center: mapCenter,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				disableDefaultUI: true,
				zoomControl: false,
				backgroundColor : '#1e2428'
        // styles: mapStyle
			}

			_map = new google.maps.Map( mapHolder, myOptions );
      // _poly = new google.maps.Polyline( _polyOptions );
      // _poly.setMap( _map );
      
		} else {
			_localPoints = [];
		}
	};
	
	var drawDirections = function( origin, destination, statsHolder ) {
	  console.log('google.maps.DirectionsRenderer = '+google.maps.DirectionsRenderer);
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    var directionsRequest = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING
    }
    directionsDisplay.setMap(_map);
    directionsService.route(directionsRequest, function(response, status) {
    	if (status == google.maps.DirectionsStatus.OK) {
    		// set directions on maps
    		directionsDisplay.setDirections(response);
    		// add distances
    		var totalDistance = 0;
        var totalDuration = 0;
        var legs = response.routes[0].legs;
        for(i in legs) {
            totalDistance += legs[i].distance.value;
            totalDuration += legs[i].duration.value;
        }
        statsHolder.innerHTML = '<span class="map_distance">' + Math.round( totalDistance * METERS_TO_MILES * 10 )/10 + ' miles </span><span class="map_time">' + Math.round( totalDuration / 60 ) + ' minutes</span>';
    	}
    });
	}
	
	var drawLocation = function( location ) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { 'address': location }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        _map.setCenter( results[0].geometry.location );
        var marker = new google.maps.Marker({
            map: _map,
            position: results[0].geometry.location,
            title: location,
            clickable: true
        });
        _map.setZoom( 14 );
      } else {
        console.log("Google Maps couldn't find your location: " + status);
      }
    });
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////
	var reset = function() {
		if( _hasMap ) {
			_poly.setMap( null );
			_poly = new google.maps.Polyline( _polyOptions );
			_poly.setMap( _map );
			_bounds = new google.maps.LatLngBounds();
			_map.setZoom( 1 );
		} else {
			_localPoints = [];
		}
	};
	
	///////////////////////////////////////////////////////////////////////////////////////////////////
	var setMapType = function( mapType ) {	
		if( _map == null ) return;	
		switch( mapType ) {
			case 0 :
				_map.setMapTypeId( google.maps.MapTypeId.ROADMAP );
				break;
			case 1 :
				_map.setMapTypeId( google.maps.MapTypeId.SATELLITE );
				break;
			case 2 : 
				_map.setMapTypeId( google.maps.MapTypeId.HYBRID );
				break;
		}
	};

	///////////////////////////////////////////////////////////////////////////////////////////////////
	var initWithStoredPoints = function( pointsArray ) {
		if( _hasMap ) {
			// draw points on map
			var path = _poly.getPath();

			for( var i=0; i < pointsArray.length; i++ ) {
				var latLng =  new google.maps.LatLng( parseFloat( pointsArray[i][0] ), parseFloat( pointsArray[i][1] ) );
			    path.push( latLng );
				_bounds.extend( latLng ); 
			}
		
			// set bounds
			_map.fitBounds( _bounds );
		} else {
			_localPoints = pointsArray;
		}
	};
	
	///////////////////////////////////////////////////////////////////////////////////////////////////
	var initWithEncodedPath = function( encodedPath ) {
		if( _hasMap ) {
			// draw points on map
			_poly.setPath( google.maps.geometry.encoding.decodePath( encodedPath ) );
		
			var path = _poly.getPath();
			path.forEach(function(e) {
				_bounds.extend(e);
			});
		
			// set bounds
			_map.fitBounds( _bounds );	
		}
	};
	
	///////////////////////////////////////////////////////////////////////////////////////////////////
	var getPathData = function(){
		if( _hasMap ) {
			return google.maps.geometry.encoding.encodePath( _poly.getPath() ).replace(/\\/g,'\\\\');
		} else {
			var polylineEncoder = new PolylineEncoder();
			var polyline = polylineEncoder.dpEncode( PolylineEncoder.pointsToLatLngs( _localPoints ) );
			return polyline.encodedPoints.replace(/\\/g,'\\\\');
		}
	};
	
	///////////////////////////////////////////////////////////////////////////////////////////////////
	var getMapCenter = function(){
		if( _hasMap ) {
			var center = _bounds.getCenter();	// google.maps.LatLng object 
			return [ center.lat(), center.lng() ];
		} else {
			return null;
		}
	};
	
	///////////////////////////////////////////////////////////////////////////////////////////////////
	var getNumMapPoints = function(){
		if( _hasMap ) {
			return _poly.getPath().getLength();
		} else {
			return _localPoints.length;
		}
	};
	
	///////////////////////////////////////////////////////////////////////////////////////////////////
	// draws to a new point on the map
	var addLocation = function( lat, long ) {
		if( _hasMap ) {
			// http://code.google.com/apis/maps/documentation/javascript/reference.html#Map
			var latLng =  new google.maps.LatLng( parseFloat( lat ), parseFloat( long ), true );

			// Because path is an MVCArray, we can simply append a new coordinate and it will automatically appear
			var path = _poly.getPath();
		    path.push( latLng );
	
			// add to bounds object and reset the bounds for the map
			if( !_bounds.contains( latLng ) ) {
				_bounds.extend( latLng ); 
				_map.fitBounds( _bounds );
			}
		} else {
			_localPoints.push( [ lat, long ] );
		}
	};
	
	initialize();
		
	///////////////////////////////////////////////////////////////////////////////////////////////////
	return {
		initialize : initialize,
		reset : reset,
		drawDirections : drawDirections,
		addLocation : addLocation,
		drawLocation : drawLocation,
		initWithStoredPoints : initWithStoredPoints,
		initWithEncodedPath : initWithEncodedPath,
		setMapType : setMapType,
		getPathData : getPathData,
		getMapCenter : getMapCenter,
		getNumMapPoints : getNumMapPoints
	};
};