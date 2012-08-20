class Spin360Gesture

  constructor: (callback) ->
    Accelerometer.watch(@updated)
    @callback = callback
    @numSamples = 60
    @sampleIndex = 0
    @rotationHistory = []
    for i in [0..@numSamples-1]
      @rotationHistory.push(0)
    @active = true

  updated: =>
    if Accelerometer.AVAILABLE && Accelerometer.HAS_GYRO
      # iterate through the sample array every update to create a running 60-frame history
      @sampleIndex++
      @sampleIndex = 0 if @sampleIndex == @numSamples
      @rotationHistory[@sampleIndex] = Accelerometer.rotY

      # add them up
      sum = @sumSamples()
      if sum > 6000
        @callback(false)
        @resetSamples()
      if sum < -6000
        @callback(true)
        @resetSamples()

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