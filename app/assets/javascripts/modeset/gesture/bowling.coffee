class BowlingGesture

  constructor: (@callbackRelease, @callbackSwing) ->
    Accelerometer.watch(@updated)
    @numSamples = 5
    @accelZBuffer = new RealtimeSamplingValue(@numSamples)
    @tiltXBuffer = new RealtimeSamplingValue(@numSamples)
    @lastTiltX = 0
    @tiltXDelta = 0
    @tiltXMult = 10

    @hasDrawnBack = true
    @drawnBackTimeout = null
    @throwTotal = 0

  updated: =>
    if Accelerometer.AVAILABLE && Accelerometer.HAS_ACCEL
      # update tilt speed buffers with new values
      @active = true
      @tiltXDelta = @lastTiltX - Accelerometer.tiltXHoriz

      @accelZBuffer.updateWithValue(Accelerometer.accelZ)
      @tiltXBuffer.updateWithValue(@tiltXDelta * @tiltXMult)

      @callbackSwing(@accelZBuffer.value(), @tiltXBuffer.value())

      @lastTiltX = Accelerometer.tiltXHoriz

      # check for backswing, then forward swing over the course of several frames
      if @tiltXBuffer.value() > 100
        if @hasDrawnBack == true
          @throwTotal += @tiltXBuffer.value()
          if @throwTotal > 800
            debug.log 'FORWARD'
            @hasDrawnBack = false
            @callbackRelease(@tiltXBuffer.value(), Accelerometer.tiltZ)  # speed and rotation
      else if @tiltXBuffer.value() < -100
        debug.log 'BACK'
        # set back, but clear it out after a timer
        @hasDrawnBack = true
        window.clearTimeout(@drawnBackTimeout)
        @drawnBackTimeout = setTimeout =>
          @hasDrawnBack = false
        , 1500
      else
        @throwTotal = 0


  dispose: ->
    Accelerometer.unwatch(@updated)
    @active = false

@BowlingGesture = BowlingGesture