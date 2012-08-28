class PinchRotateDemo extends Demo

  constructor: (@el) ->
    @css_helper = new CSSHelper()
    @prepContainers()
    @gesture = new PinchRotateCallback( @pinchholder[0], @donePinching, @onPinchRotate )

    @setUpControls()

  prepContainers: ->
    @pinchpoint = $('.pinchpoint')
    @pinchholder = $('.pinchholder')
    @status = $('.status')

    @pinchpoint.css
      left: 100
      top: 100
      width: "50px"
      height: '50px'
      background: "green"
      position: 'absolute'

    @pinchholder.css
      position: 'relative'

    @pinchholder.css
      width: '300px'
      height: '300px'
      border: '1px solid blue'

  onPinchRotate: (scale, rotate) =>
    @css_helper.update2DPosition( @pinchpoint[0], 0, 0, scale, rotate, false );
    @status.html 'scale:'+scale+' rotate:'+rotate

  donePinching: =>
    console.log 'done gesturing'

  setUpControls: ->
    @config =
      mobileLocked: false

    super()

Bindable.register('pinch-rotate-demo', PinchRotateDemo)