class Spin360Gesture

  constructor: (@callback, @axis) ->
    Accelerometer.watch(@updated)
    @numSamples = 60
    @threshold = 6000
    @sampleIndex = 0
    @rotationHistory = []
    for i in [0..@numSamples-1]
      @rotationHistory.push(0)

  updated: =>
    if Accelerometer.AVAILABLE && Accelerometer.HAS_GYRO
      @active = true
      # iterate through the sample array every update to create a running 60-frame history
      @sampleIndex++
      @sampleIndex = 0 if @sampleIndex == @numSamples
      @rotationHistory[@sampleIndex] = Accelerometer.rotX if @axis == Accelerometer.X_AXIS
      @rotationHistory[@sampleIndex] = Accelerometer.rotY if @axis == Accelerometer.Y_AXIS
      @rotationHistory[@sampleIndex] = Accelerometer.rotZ if @axis == Accelerometer.Z_AXIS

      # add them up
      sum = @sumSamples()
      if sum > @threshold
        @callback(false)
        @resetSamples()
      else if sum < -@threshold
        @callback(true)
        @resetSamples()
      else 
        @callback(@sumSamples())

  sumSamples: ->
    sum = 0
    for i in [0..@numSamples-1]
      sum += @rotationHistory[i]
    return sum

  resetSamples: ->
    for i in [0..@numSamples-1]
      @rotationHistory[i] = 0

  dispose: ->
    Accelerometer.unwatch(@updated)
    @active = false

@Spin360Gesture = Spin360Gesture