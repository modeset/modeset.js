class CircleTouch360Gesture

  constructor: (el, width, height, callback) ->
    @callback = callback
    @circleTouchTracker = new CircleTouchTracker( el, width, height, @touchUpdated )
    @circleDragAngleTotal = -1
    @circleDragLastAngle = 0
    @circleTouchOutOfBounds = false
    @active = true

  touchUpdated: (state) =>
    curAngle = @circleTouchTracker.curAngle()
    angleChange = @circleDragLastAngle - curAngle

    # handle touch states & add circular angle change
    switch state
      when MouseAndTouchTracker.state_start
        @startDragTracking curAngle
      when MouseAndTouchTracker.state_move
        if Math.abs(angleChange) > 180  # handle wrapping around from 360 <-> 0
          angleChange = 360 - Math.abs(angleChange)
        @circleDragAngleTotal += angleChange
      when MouseAndTouchTracker.state_end
        @circleDragAngleTotal = -1

    # reset when hitting the center out-of-bounds area
    if curAngle == null
      @circleTouchOutOfBounds = true
    else if @circleTouchOutOfBounds == true
      @circleTouchOutOfBounds = false
      @startDragTracking curAngle

    # keep track of last angle
    @circleDragLastAngle = curAngle

    # show/hide if we've gone far enough
    if @circleDragAngleTotal > 360
      @callback(true)
      @circleDragAngleTotal = -1
    else if @circleDragAngleTotal < -360
      @callback(false)
      @circleDragAngleTotal = -1

  startDragTracking: (curAngle) ->
    @circleDragLastAngle = curAngle
    @circleDragAngleTotal = 0

  setSize: (w, h) ->
    @circleTouchTracker.setSize(w, h)

  isTouching: ->
    return @circleTouchTracker.is_touching()

  dispose: ->
    @circleTouchTracker.dispose()
    @active = false

@CircleTouch360Gesture = CircleTouch360Gesture