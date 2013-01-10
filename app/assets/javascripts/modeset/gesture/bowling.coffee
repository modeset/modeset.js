class BowlingGesture

  constructor: (@callbackRelease, @callbackSwing) ->
    Accelerometer.watch(@updated)
    @numSamples = 5
    @accelZBuffer = new RealtimeSamplingValue(@numSamples)
    @tiltXBuffer = new RealtimeSamplingValue(@numSamples)
    @lastTiltX = 0
    @tiltXDelta = 0
    @TILT_X_MULT = 10

    @hasDrawnBack = false
    @hasThrown = false
    @drawnBackTimeout = null
    @thrownTimeout = null
    @throwTotal = 0

  updated: =>
    if Accelerometer.AVAILABLE && Accelerometer.HAS_ACCEL
      # update tilt speed buffers with new values
      @active = true
      @tiltXDelta = @lastTiltX - Accelerometer.tiltXHoriz
      @lastTiltX = Accelerometer.tiltXHoriz

      @accelZBuffer.updateWithValue(Accelerometer.accelZ)
      @tiltXBuffer.updateWithValue(@tiltXDelta * @TILT_X_MULT)

      @callbackSwing?(@accelZBuffer.value(), @tiltXBuffer.value())

      # check for backswing, then forward swing over the course of several frames
      if @hasDrawnBack != false
        if Math.abs(@tiltXBuffer.value()) > 100
          @throwTotal += Math.abs(@tiltXBuffer.value())
          if @throwTotal > 800
            underhand = if(@hasDrawnBack == -1) then true else false
            @callbackRelease(@throwTotal, Accelerometer.tiltZ, underhand)  # speed and rotation  (was @tiltXBuffer.value())
            @hasDrawnBack = false

            @hasThrown = true
            @thrownTimeout = setTimeout =>
              @hasThrown = false
              @throwTotal = 0
              console.log('hasThrown reset!')
            , 1500

      else if @hasThrown == false
        # $('.status').html '@tiltXBuffer.value() = '+@tiltXBuffer.value()
        $('.status').html 'Accelerometer.tiltXHoriz = '+Accelerometer.tiltXHoriz
        if @tiltXBuffer.value() < -100 || @tiltXBuffer.value() > 50
          # set back, but clear it out after a timer
          @throwTotal = 0
          @hasDrawnBack = if(@tiltXBuffer.value() > 0) then 1 else -1
          console.log('BACK: '+@tiltXBuffer.value()+' '+@hasDrawnBack)
          window.clearTimeout(@drawnBackTimeout)
          @drawnBackTimeout = setTimeout =>
            @hasDrawnBack = false
          , 1500

  resetThrow: ->
    

  dispose: ->
    Accelerometer.unwatch(@updated)
    @active = false

@BowlingGesture = BowlingGesture