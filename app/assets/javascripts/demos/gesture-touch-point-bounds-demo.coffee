class TouchPointBoundsDemo extends Demo

  constructor: (@el) ->
    @prepContainers()

    @css_helper = new CSSHelper()
    @gesture = new TouchPointBoundsGesture(@touchHolder[0], @onMoving, 50, 50, 1, 1, false)

    @setUpControls()

  prepContainers: ->
    @touchPoint = $('.touchpoint')
    @touchHolder = $('.touchholder')
    @status = $('.status')

    @touchPoint.css
      width: "50px"
      height: '50px'
      margin: '50px'
      background: "green"
      position: 'absolute'

    @touchHolder.css
      width: 150
      height: 150
      position: 'relative'
      border: '1px solid black'

    $('.demo_holder .container').css
      height: '200px'

  onMoving: (x, y) =>
    @css_helper.update2DPosition( @touchPoint[0], x, y, 1, 0, false );
    @status.html 'x:'+Math.round(x)+' y:'+Math.round(y)

  setUpControls: ->
    @config =
      mobileLocked: false

    super()

Bindable.register('gesture-touch-toss-bounds-demo', TouchPointBoundsDemo)