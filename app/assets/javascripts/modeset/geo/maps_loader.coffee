class MapsLoader extends Spine.Module

  @include Spine.Log

  constructor: ->
    @hasLoaded = false

  load: (successCallback, isMobileDevice) ->
    @log 'Loading Google Maps'
    @isMobileDevice = isMobileDevice
    @successCallback = successCallback
    unless @hasLoaded
      @loadGoogle()
    else
      @mapsLoaded()

  loadGoogle: =>
    # reference google loader callback to local method - clean up after callback
    window.loadMaps = @loadMaps
    apiKey = 'ABQIAAAATUAnbOqgelOcQ-lH1j3obBQTGuh3H5eZrmwYEoDvMtzsEQJpgBTB5Lv3f5LUSTIjbzBsn3pExx9PQg'
    script = document.createElement('script')
    script.src = "https://www.google.com/jsapi?key=#{apiKey}&callback=loadMaps"
    script.type = 'text/javascript'
    document.getElementsByTagName('head')[0].appendChild(script)

  loadMaps: =>
    otherParams = if @isMobileDevice then 'sensor=true' else 'sensor=false'
    google.load('maps', '3', {other_params: otherParams, 'callback' : @mapsLoaded});

  mapsLoaded: =>
    @log 'Google Maps loaded!'
    @hasLoaded = true
    window.loadMaps = null
    if @successCallback
      @successCallback.call(@)
      @successCallback = null

@MapsLoader = new MapsLoader()
