# ## Handles the 2-layers of slideshows on the residences page
class LocationMap

  constructor: (el) ->
    @el = $(el)
    @initialize()
  
  # Inits multiple components
  initialize: =>
    # load maps API
    MapsLoader.load(@buildGoogleMap,false)

  # Inits the Google map
  buildGoogleMap: =>
    # grab map properties from data attributes
    lat = @el.data('lat') or 0
    lng = @el.data('lng') or 0
    zoom = @el.data('zoom') or 3
    
    # create map objects/settings
    mapCenter = new google.maps.LatLng( lat, lng )
    mapStyle = [ { stylers: [ { saturation: -81 } ] } ]
    mapOptions = 
      zoom: zoom,
      center: mapCenter,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false,
      zoomControl: true,
      backgroundColor : '#fff',
      styles: mapStyle
    # init the map
    @map = new google.maps.Map( @el[0], mapOptions )
    
    # create the custom marker
    marker = new google.maps.MarkerImage('/images/map_pin.png', new google.maps.Size(50, 43), new google.maps.Point(0, 0), new google.maps.Point(15, 35))
    # place the marker
    markerOptions = 
      position: mapCenter,
      map: @map,
      icon: marker
    marker = new google.maps.Marker(markerOptions);

# Register with bindable for instantiation
Bindable.register('location_map', LocationMap)