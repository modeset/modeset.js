class ParaNorman.TiltGesture

  constructor: (@callback, @rangeW = 40, @rangeH = 40) ->
    Accelerometer.watch(@updated)
    @x = 0
    @y = 0
    @tiltZLimit = 5 # halfway to landscape = almost 45 degrees
    @tiltZMultiplier = @rangeW / @tiltZLimit
    @tiltXFlat = 0
    @tiltXVert = -10
    @active = true

  updated: =>
    if Accelerometer.AVAILABLE && Accelerometer.HAS_ACCEL
      unless isNaN(Accelerometer.tiltZ)
        @x = Accelerometer.tiltZ
        @x *= @tiltZMultiplier
        @x = @rangeW if @x > @rangeW
        @x = -@rangeW if @x < -@rangeW
      unless isNaN(Accelerometer.tiltXHoriz)
        tiltX = Accelerometer.tiltXHoriz
        percentTilt = MathUtil.getPercentWithinRange( @tiltXFlat, @tiltXVert, tiltX )
        @y = -@rangeH + percentTilt * @rangeH * 2
        @y = @rangeH if @y > @rangeH
        @y = -@rangeH if @y < -@rangeH

      @callback(@x, @y)

  dispose: ->
    Accelerometer.unwatch(@updated)
    @active = false