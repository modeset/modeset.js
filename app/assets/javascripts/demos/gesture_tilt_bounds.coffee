class GestureTiltBoundsDemo extends Demo

  constructor: (@el) ->
    @css_helper = new CSSHelper()
    @gesture = new TiltGesture(@onTilting, 50, 50)

    @prepContainers()
    @setUpControls()

  prepContainers: ->
    @tiltpoint = $('.tiltpoint')
    @status = $('.status')

    @tiltpoint.css
      width: "50px"
      height: '50px'
      background: "green"
      position: 'absolute'

    $('.tiltholder').css
      position: 'relative'
      'margin-left': 75
      'margin-top': 75

    $('.demo_holder .container').css
      height: '200px'

  onTilting: (x, y) =>
    @css_helper.update2DPosition( @tiltpoint[0], x, y, 1, 0, false );
    @status.html 'x:'+Math.round(x)+' y:'+Math.round(y)


Bindable.register('gesture-tilt-bounds-demo', GestureTiltBoundsDemo)