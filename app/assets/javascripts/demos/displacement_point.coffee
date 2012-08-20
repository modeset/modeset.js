
class DisplacementPointDemo

  constructor: (@el) ->
    @touch_tracker = null
    @touch_delegate = null
    @box = null
    @box_div = $("div.displacement")
    @box_layer = $("div.container")
    @box_base_x = 150
    @box_base_y = 150

    @config =
      friction: 0.5
      accel: 0.5

    @prepContainers()
    @initDisplacement()

  prepContainers: ->
    $("div.container").css
      position: "relative"
      height: "400px"
      width: "400px"
      backgroundColor: "#ff0"

    $("div.displacement").css
      position: "absolute"
      height: "100px"
      width: "100px"
      backgroundColor: "#f0f"

  initDisplacement: ->
    @touch_tracker = new MouseAndTouchTracker(@box_layer[0], null, false, "div")
    @box = new DisplacementPoint(@box_base_x, @box_base_y, 0.75, 0.4, 100)
    @setUpControls()
    @runTimer()

  setUpControls: ->
    _gui = new dat.GUI(autoPlace: false)
    document.getElementsByClassName("controls_ui")[0].appendChild _gui.domElement
    $(".controls_ui .close-button").remove()

    frictionVal = _gui.add(@config, "friction", 0.1, 0.9)
    frictionVal.listen()
    frictionVal.onChange (value) =>
      @box.setFriction value

    accelVal = _gui.add(@config, "accel", 0.1, 0.9)
    accelVal.listen()
    accelVal.onChange (value) =>
      @box.setAccel value

  runTimer: ->
    @box.update @touch_tracker.touchcurrent.x - 50, @touch_tracker.touchcurrent.y - 50
    @box_div.css
      top: @box.y() + "px"
      left: @box.x() + "px"

    setTimeout (=>
      @runTimer()
    ), 33


Bindable.register('displacement-point-demo', DisplacementPointDemo)