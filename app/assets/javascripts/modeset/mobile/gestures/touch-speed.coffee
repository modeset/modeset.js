class ParaNorman.TouchSpeedGesture

  constructor: (el, callback, rangeW = 40, rangeH = 40, multiplerX = 1, multiplerY = 1, @resetOnEnd = false) ->
    @touchTracker = new MouseAndTouchTracker( el, @updated, false, 'div' );
    @callback = callback
    @multipliers =
      x: multiplerX
      y: multiplerY

    @touchX = 0
    @touchXRange = rangeW
    @touchY = 0
    @touchYRange = rangeH
    @active = true

  updated: (state) =>
    switch state
      when MouseAndTouchTracker.state_move
        # add touchspeed to current location
        @touchX += @touchTracker.touchspeed.x
        @touchY += @touchTracker.touchspeed.y
        # keep in-bounds for specified range
        @touchX = @touchXRange if( @touchX > @touchXRange )
        @touchX = -@touchXRange if( @touchX < -@touchXRange )
        @touchY = @touchYRange if( @touchY > @touchYRange )
        @touchY = -@touchYRange if( @touchY < -@touchYRange )
      when MouseAndTouchTracker.state_end
        if @resetOnEnd
          @touchX = 0
          @touchY = 0


    @callback(@touchX * @multipliers.x, @touchY * @multipliers.y)

  isTouching: ->
    return @touchTracker.is_touching

  dispose: ->
    @touchTracker.dispose()
    @active = false