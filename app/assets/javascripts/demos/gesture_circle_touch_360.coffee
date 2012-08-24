class CircleTouch360GestureDemo extends Demo

  constructor: (@el) ->
    @css_helper = new CSSHelper()

    @prepContainers()
    @setUpControls()

    @gesture = new CircleTouch360Gesture(@circleControl[0], 400, 400, @onCircleComplete, @circleControl[0])

  prepContainers: ->
    @circleControl = $('.circle-control')
    @status = $('.status')

    @circleControl.css
      width: "400px"
      height: '400px'
      background: "green"

  onCircleComplete: (isClockwise) =>
    alert 'Clockwise: '+isClockwise

  setUpControls: ->
    @config =
      mobileLocked: false

    super()

Bindable.register('gesture-circle-touch-360-demo', CircleTouch360GestureDemo)