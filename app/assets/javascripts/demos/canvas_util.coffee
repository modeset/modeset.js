class CanvasUtilDemo

  constructor: (@el) ->
    @ease = null
    @canvas = $("canvas")
    @context = @canvas[0].getContext("2d")
    @config =
      drawArc: @drawArc
      drawPoint: @drawPoint

    @prepContainers()
    @initEasing()

  drawArc: =>
    x = MathUtil.randRange(0,400)
    y = MathUtil.randRange(0,400)
    radius = MathUtil.randRange(10,40)
    angleStart = MathUtil.randRange(0,180)
    angleEnd = MathUtil.randRange(180,360)
    strokeW = MathUtil.randRange(1,5)
    fill = Random.bool()
    @context.fillStyle = if fill then CanvasUtil.hexToCanvasColor('#000000', 1) else CanvasUtil.hexToCanvasColor('#000000', 0)
    @context.strokeStyle = if fill then CanvasUtil.hexToCanvasColor('#000000', 0) else CanvasUtil.hexToCanvasColor('#000000', 1)
    @context.lineWidth = strokeW;

    CanvasUtil.drawArc( @context, x, y, radius, angleStart, angleEnd )

  drawPoint: =>
    x = MathUtil.randRange(0,400)
    y = MathUtil.randRange(0,400)
    radius = MathUtil.randRange(10,40)
    fill = Random.bool()
    @context.fillStyle = if fill then CanvasUtil.hexToCanvasColor('#000000', 1) else CanvasUtil.hexToCanvasColor('#000000', 0)
    @context.strokeStyle = if fill then CanvasUtil.hexToCanvasColor('#000000', 0) else CanvasUtil.hexToCanvasColor('#000000', 1)

    CanvasUtil.drawPoint( @context, x, y, radius )

  prepContainers: ->
    $("div.container").css
      position: "relative"
      height: "400px"
      width: "400px"
      backgroundColor: "#ff0"

  initEasing: ->
    @ease = new EasingFloat(0, 5)
    @setUpControls()
    @runTimer()

  setUpControls: ->
    _gui = new dat.GUI(autoPlace: false)
    document.getElementsByClassName("controls_ui")[0].appendChild _gui.domElement
    $(".controls_ui .close-button").remove()

    _gui.add @config, "drawArc"
    _gui.add @config, "drawPoint"

  runTimer: =>
    setTimeout =>
      @runTimer()
    , 33


Bindable.register('canvas-util-demo', CanvasUtilDemo)