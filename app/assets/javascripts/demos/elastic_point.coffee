class ElasticPointDemo

  constructor: (@el) ->
    @touch_tracker = null
    @cursor = null
    @box = null
    @box_div = $("div.elastic")
    @box_layer = $("div.container")
    @box_base_x = 150
    @box_base_y = 150

    @config =
      friction: 0.5
      accel: 0.5

    @prepContainers()
    @initElastic()

  prepContainers: ->
    $("div.container").css
      position: "relative"
      height: "400px"
      width: "400px"
      backgroundColor: "#ff0"

    $("div.elastic").css
      position: "absolute"
      height: "100px"
      width: "100px"
      backgroundColor: "#f0f"

  initElastic: ->
    @touch_tracker = new MouseAndTouchTracker(@box_layer[0], @touchUpdated, false, "div")
    @cursor = new CursorHand()
    @box = new ElasticPoint(@box_base_x, @box_base_y, 0.75, 0.4)
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
    @box.update()
    @box_div.css
      top: @box.y() + "px"
      left: @box.x() + "px"

    setTimeout =>
      @runTimer()
    , 33

  touchUpdated: (state, touchEvent) =>
    switch state
      when MouseAndTouchTracker.state_move
        @box.setTarget @touch_tracker.touchcurrent.x - 50, @touch_tracker.touchcurrent.y - 50
      when MouseAndTouchTracker.state_start
        @cursor.setGrabHand()
      when MouseAndTouchTracker.state_end
        @box.setTarget @box_base_x, @box_base_y
        if @touch_tracker.touch_is_inside
          @cursor.setHand()
        else
          @cursor.setDefault()
      when MouseAndTouchTracker.state_enter
        if @touch_tracker.is_touching
          @cursor.setGrabHand()
        else
          @cursor.setHand()
      when MouseAndTouchTracker.state_leave
        if @touch_tracker.is_touching
          @cursor.setGrabHand()
        else
          @cursor.setDefault()


Bindable.register('elastic-point-demo', ElasticPointDemo)