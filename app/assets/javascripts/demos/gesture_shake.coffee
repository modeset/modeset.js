class GestureShakeDemo extends Demo

  constructor: (@el) ->
    @css_helper = new CSSHelper()
    @gesture = new ShakeGesture(@onShaking, 15, 15, 1)

    @prepContainers()
    @setUpControls()

  prepContainers: ->
    @shakepoint = $('.shakepoint')
    @status = $('.status')

    @shakepoint.css
      width: "50px"
      height: '50px'
      background: "green"
      position: 'absolute'

    $('.shakeholder').css
      position: 'relative'
      'margin-left': 75
      'margin-top': 75

    $('.demo_holder .container').css
      height: '200px'

  onShaking: (x, y, z) =>
    @css_helper.update2DPosition( @shakepoint[0], x, y, 1+z/10, 0, false );

    @status.html 'x:'+Math.round(x)+' y:'+Math.round(y)+' z:'+Math.round(z)

  setUpControls: ->
    @config = 
      axisX: =>
        @setAxis Accelerometer.X_AXIS
      axisY: =>
        @setAxis Accelerometer.Y_AXIS
      axisZ: =>
        @setAxis Accelerometer.Z_AXIS

    super()

Bindable.register('gesture-shake-demo', GestureShakeDemo)