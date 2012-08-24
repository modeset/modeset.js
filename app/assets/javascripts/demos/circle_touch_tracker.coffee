class CircleTouchTrackerDemo extends Demo

  constructor: (@el) ->
    @circle_touch_tracker = null
    @radius = 200
    @inner_rad_factor = 0.2
    @css_helper = null
    @cursor = null
    @dial_div = $("div.dial")
    @dial_div_control = $("div.dial_control")
    @container = $("div.container")
    @canvas = $("canvas#dial_debug")
    @console = $(".status")
    @drag_distance = 0
    @dial_control_rot = 0

    @prepContainers()
    @setUpControls()
    @init()

  prepContainers: ->
    @container.css
      position: "relative"
      height: "400px"
      width: "400px"
      backgroundColor: "#ff0"

    @dial_div.css
      position: "absolute"
      height: "2px"
      width: @radius
      backgroundColor: "#f0f"

    $('.dial_inner@radius').css
      backgroundColor: "#ff0"
      width: @radius * @inner_rad_factor
      height: "2px"

    @dial_div_control.css
      position: "absolute"
      height: "2px"
      width: @radius
      backgroundColor: "#00f"

    @canvas.css
      position: "absolute"

  init: ->
    @css_helper = new CSSHelper()
    @circle_touch_tracker = new CircleTouchTracker( @container[0], @container.width(), @container.height(), @touchUpdated, 'div img', @inner_rad_factor )
    @circle_touch_tracker.drawDebug( @canvas[0].getContext("2d"), '#0000ff', '#ffffff' )
    @cursor = new CursorHand()

    @css_helper.update2DPosition @dial_div[0], 200, 200, 1, 0, false
    @css_helper.update2DPosition @dial_div_control[0], 200, 200, 1, 0, false
    @dial_div[0].style[ @css_helper.getVendor() + "TransformOrigin" ] = "0 50%"
    @dial_div_control[0].style[ @css_helper.getVendor() + "TransformOrigin" ] = "0 50%"

  touchUpdated: (state, touchEvent) =>
    # get angle change
    curAngle = @circle_touch_tracker.curAngle()

    # rotate div
    if curAngle != null
      @css_helper.update2DPosition @dial_div[0], 200, 200, 1, -curAngle, false
    else
      @drag_distance = 0

    # set cursor state
    if @circle_touch_tracker.touchTracker.is_touching == true
      # handle touch states & add circular angle change
      switch state
        when MouseAndTouchTracker.state_start
          @cursor.setGrabHand()
          @drag_distance = 0
        when MouseAndTouchTracker.state_move
          @drag_distance += @circle_touch_tracker.angleChange()
          @dial_control_rot += @circle_touch_tracker.angleChange()
        when MouseAndTouchTracker.state_end
          @drag_distance = 0
          if curAngle == null
            @cursor.setDefault()
          else
            @cursor.setHand()
    else
      # show hand cursor when inside active area
      if curAngle == null
        @cursor.setDefault()
      else
        @cursor.setHand()

    # move dial
    @css_helper.update2DPosition @dial_div_control[0], 200, 200, 1, @dial_control_rot, false

    # demo info
    @console.html "Current angle: "+curAngle+"<br/>Drag angle total: "+@drag_distance

  setUpControls: ->
    @config =
      mobileLocked: false

    super()


Bindable.register('circle-touch-tracker-demo', CircleTouchTrackerDemo)