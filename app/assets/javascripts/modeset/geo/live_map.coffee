class LiveMap extends Spine.Module

  constructor: (holder) ->
    @holder = holder
    @reloadInterval = null
    @markers = []
    @infoWindows = []
    @initializeMap()

  initializeMap: ->
    @bounds = new google.maps.LatLngBounds()
    @mapCenter = new google.maps.LatLng(0, -60)
    @mapOptions =
      zoom: 1
      center: @mapCenter
      mapTypeId: google.maps.MapTypeId.ROADMAP
      disableDefaultUI: false
      zoomControl: true
      backgroundColor: '#1e2428'
    @map = new google.maps.Map(@holder, @mapOptions)

    if @reloadInterval == null
      @reloadInterval = setInterval (=> @loadDrivers()), 60 * 1000

    @loadDrivers()

  loadDrivers: =>
    Request.perform
      token_auth: true
      type:       'GET'
      url:        "/locations"
      success: (response) =>
        @showDrivers(response)
      error: (xhr, type) ->
        console.log 'An error occurred attempting to load driver locations'

  getNumMarkers: ->
    # returns the number of results with a non-null location
    markers = 0
    for driver in @driverData
      if driver.lat && driver.lng
        markers++
    return markers

  showDrivers: (results) =>
    @driverData = results
    numMarkers = @getNumMarkers()
    if numMarkers != @markers.length
      @rebuildMarkers()
    else
      @updateMarkers()

  rebuildMarkers: =>
    @clearMarkers()
    @bounds = new google.maps.LatLngBounds()
    for driver in @driverData
      targetMap = null
      if driver.lat && driver.lng
        targetMap = @map

      location = new google.maps.LatLng(driver.lat,driver.lng)

      # create marker
      markerOptions =
        map:targetMap
        position: location
        clickable:true
        title:"#{driver.first_name} #{driver.last_name}"
      marker = new google.maps.Marker(markerOptions)
      @markers.push(marker)

      @infoWindows.push(@createInfoWindowForMarker(driver,location,marker))

      # fit map to bounds of legit driver locations
      if targetMap
        @bounds.extend( location )
    @map.fitBounds(@bounds)

  updateMarkers: =>
    @bounds = new google.maps.LatLngBounds()
    i = 0
    while i < @markers.length
      marker = @markers[i]
      driver = @driverData[i]
      infoWindow = @infoWindows[i]
      i++

      oldLoc = marker.getPosition()
      newLoc = new google.maps.LatLng(driver.lat,driver.lng)
      if !oldLoc.equals(newLoc)
        marker.setPosition(newLoc)
        infoWindow.setPosition(newLoc)

      @bounds.extend(newLoc)
    @map.fitBounds(@bounds)

  clearMarkers: =>
    for marker in @markers
      marker.setMap(null)
    for infoWindow in @infoWindows
      infoWindow.close()
    @markers = []
    @infoWindows = []

  createInfoWindowForMarker: (driver,location,marker) =>
    lastSeen = moment(driver.updated_at).from(moment())
    infoWindowOptions =
      content: "#{driver.first_name} #{driver.last_name}<br/><br/>Last seen: #{lastSeen}"
      position: location
    infoWindow = new google.maps.InfoWindow(infoWindowOptions)

    google.maps.event.addListener marker, 'click', =>
      infoWindow.open @map, marker

    return infoWindow

@LiveMap = LiveMap
