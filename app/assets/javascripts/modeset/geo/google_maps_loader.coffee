class MapsLoader

  constructor: ->

  load: (successCallback,isMobileDevice) ->
    @isMobileDevice = isMobileDevice
    @successCallback = successCallback
    if @hasLoaded != true
      @loadGoogle()
    else
      @mapsLoaded()

  loadGoogle: =>
    # reference google loader callback to local method - clean up after callback
    window.loadMaps = @loadMaps 
    script = document.createElement("script")
    script.src = "https://www.google.com/jsapi?callback=loadMaps"
    script.type = "text/javascript"
    document.getElementsByTagName("head")[0].appendChild(script)

  loadMaps: =>
    otherParams = if @isMobileDevice then "sensor=true" else "sensor=false"
    google.load("maps", "3", {other_params: otherParams, "callback" : @mapsLoaded});

  mapsLoaded: =>
    @hasLoaded = true
    window.loadMaps = null
    if @successCallback
      @successCallback()
    @successCallback = null

@MapsLoader = new MapsLoader()
