class GestureSpin360Demo extends Demo

  constructor: (@el) ->
    @gesture = new Spin360Gesture @spinDetected, Accelerometer.Y_AXIS

    @prepContainers()
    @setUpControls()

  prepContainers: ->
    @clockwise = @el.find('.clockwise')
    @counterclockwise = @el.find('.counter-clockwise')

    @clockwise.css
      padding: "50px"
      background: "green"
      color: 'white'
      display: 'inline'
      opacity: '0'

    @counterclockwise.css
      padding: "50px"
      background: "blue"
      color: 'white'
      display: 'inline'
      opacity: '0'

    $('.demo_holder .container').css
      height: '200px'
      'padding-top': '50px'

  spinDetected: (clockwise) =>
    if clockwise == true || clockwise == false
      if clockwise
        @clockwise.css
          opacity: 1
        @clockwise.animate
          opacity: 0
          , 2000
      else
        @counterclockwise.css
          opacity: 1
        @counterclockwise.animate
          opacity: 0
          , 2000
    else
      $('.status').html 'rot: '+clockwise

  setUpControls: ->
    @config = 
      axisX: =>
        @setAxis Accelerometer.X_AXIS
      axisY: =>
        @setAxis Accelerometer.Y_AXIS
      axisZ: =>
        @setAxis Accelerometer.Z_AXIS

    super()

    @gui.add @config, "axisX"
    @gui.add @config, "axisY"
    @gui.add @config, "axisZ"

  setAxis: (axisConstant) =>
    @gesture.dispose()
    @gesture = new Spin360Gesture @spinDetected, axisConstant


Bindable.register('gesture-spin360-demo', GestureSpin360Demo)