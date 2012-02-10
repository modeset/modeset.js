class LocationTracker extends Spine.Module

  @include Spine.Log

  constructor: ->
    @oneMinute = 60 * 1000
    @serverInterval = @oneMinute # * 5
    @gpsInterval = @oneMinute

    @curLat = null
    @curLng = null
    @lastSyncedLat = null
    @lastSyncedLng = null
    @isSyncingInterval = null

    @watchID = null
    
  startTracking: =>
    if !@watchID and navigator.geolocation.start
      @log 'Starting location tracking'
      navigator.geolocation.start()
      options =
        maximumAge: @gpsInterval
        timeout: @gpsInterval
        enableHighAccuracy: true
      @watchID = navigator.geolocation.watchPosition(@onSuccess, @onError, options)
    
  onSuccess: (position) =>
    @debugPosition(position)
    # store current loc
    @curLat = position.coords.latitude
    @curLng = position.coords.longitude    
    # fire up interval when we get our first location
    unless @isSyncingInterval
      @isSyncingInterval = setInterval @storeLocation, @serverInterval
    
  onError: (error) =>
    @log "Location error: code= #{error.code}, message= #{error.message}"
  
  storeLocation: =>
    postData = {"lat":@curLat,"lng":@curLng}
    Request.perform
      token_auth: true
      type:       'PUT'
      url:        '/account/location'
      data:       JSON.stringify(location: postData)
      success:    (json) =>
        @log 'Location update successful', json
      error:      (xhr, type) =>
        @log 'Location update failed', xhr, type
  
  stopTracking: =>
    if @watchID
      @log 'Stopping location tracking'
      navigator.geolocation.clearWatch(@watchID)
      navigator.geolocation.stop()
      @watchID = null
      clearInterval(@isSyncingInterval)
      @isSyncingInterval = null
 
  isTracking: =>
    return (@watchID != null)
    
  debugPosition: (position) ->
    @log 'Latitude: '+position.coords.latitude
    @log 'Longitude: '+position.coords.longitude
    @log 'Altitude: '+position.coords.altitude
    @log 'Accuracy: '+position.coords.accuracy
    @log 'Altitude Accuracy: '+position.coords.altitudeAccuracy
    @log 'Heading: '+position.coords.heading
    @log 'Speed: '+position.coords.speed
    @log 'Timestamp: '+new Date(position.timestamp)
  
  sendTestData: =>
    @curLat = 39.754762
    @curLng = -104.994171
    @storeLocation()

@LocationTracker = new LocationTracker()


