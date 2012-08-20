class FpsTimeFactorDemo

  constructor: (@el) ->
    @TARGET_FPS = 30
    @FPS_MS = 1000 / @TARGET_FPS
    @timeFactor = null
    @config =
      msPerFrame: @FPS_MS
      throttling: false
    @animObj = null
    @animX = 0

    @prepContainers()
    @initDemo()
    @setUpControls()

  prepContainers: ->
    $("div.anim_container").css
      position: "relative"
      overflow: "hidden"
      height: "400px"
      width: "400px"
      backgroundColor: "#ccc"

    @animObj = $("div.anim_obj")
    @animObj.css
      position: "absolute"
      height: "40px"
      width: "40px"
      left: @animX
      backgroundColor: "#333"

  initDemo: ->
    @timeFactor = new FpsTimeFactor(@TARGET_FPS)
    @runTimer()

  setUpControls: ->
    _gui = new dat.GUI(autoPlace: false)
    document.getElementsByClassName("controls_ui")[0].appendChild _gui.domElement
    $(".controls_ui .close-button").remove()

    fpsVal = _gui.add(@config, "msPerFrame", 10, 100)
    fpsVal.listen()
    fpsVal.onChange (value) =>
      @timeFactor.setFps value

    _gui.add(@config, 'throttling');

  runTimer: =>
    # update status
    @timeFactor.update()
    output = "Target FPS: " + Math.round(1000 / @config.msPerFrame) + "<br/>"
    output += "Actual FPS: " + @timeFactor.getActualFps() + "<br/>"
    output += "Time Factor: " + MathUtil.roundToDecimal(@timeFactor.getTimeFactor(), 1)
    $(".demo_console .status").html output

    # animate
    @animX += 3 * @timeFactor.getTimeFactor()
    @animX = -40 if @animX > 400
    @animObj.css(left: @animX)

    if @config.throttling
      i = 0
      while i < 1000000
        throttle = Math.sin(i * 0.9)
        i++

    # run timer
    if window.requestAnimationFrame
      window.requestAnimationFrame @runTimer
    else
      setTimeout =>
        @runTimer()
      , @FPS_MS


Bindable.register('fps-time-factor-demo', FpsTimeFactorDemo)