class ShakeGesture

  constructor: (callback, multiplerX = 1, multiplerY = 1, multiplerZ = 1) ->
    Accelerometer.watch(@updated)
    @callback = callback
    @multipliers =
      x: multiplerX
      y: multiplerY
      z: multiplerZ
    @active = true

  updated: =>
    if Accelerometer.AVAILABLE && Accelerometer.HAS_ACCEL
      @callback(Accelerometer.accelX * @multipliers.x, Accelerometer.accelY * @multipliers.y, Accelerometer.accelZ * @multipliers.z)

  dispose: ->
    Accelerometer.unwatch(@updated)
    @active = false

@ShakeGesture = ShakeGesture