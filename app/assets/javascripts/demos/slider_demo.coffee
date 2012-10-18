class SliderDemo extends Demo

  constructor: (@el) ->
    @val = 0
    @val2 = 0
    @prepContainers()
    @initDemo()
    @setUpControls()

  prepContainers: ->
    @sliderEl = $(".slider-control")
    @sliderEl.css
      position: "relative"
      overflow: "hidden"
      height: "50px"
      width: "400px"
      "margin-bottom": "20px"
      backgroundColor: "#ccc"

    @sliderProgress = $(".slider-progress")
    @sliderProgress.css
      position: "absolute"
      overflow: "hidden"
      height: "10px"
      width: "0"
      "margin-top": "20px"
      backgroundColor: "#ff00ff"

    @sliderHandle = $(".slider-handle")
    @sliderHandle.css
      position: "absolute"
      overflow: "hidden"
      height: "50px"
      width: "10px"
      backgroundColor: "#00ffff"

  initDemo: ->
    @slider = new Slider( @sliderEl[0], @sliderHandle[0], @sliderProgress[0], @valueUpdated )
    @slider2 = new Slider( @sliderEl[1], @sliderHandle[1], @sliderProgress[1], @valueUpdated2 )

  valueUpdated: (value) =>
    @val = value
    $(".status").html("value 1: "+@val+"<br/>value 2: "+@val2)

  valueUpdated2: (value) =>
    @val2 = value
    $(".status").html("value 1: "+@val+"<br/>value 2: "+@val2)

  setSmall: =>
    @sliderEl.css
      width: '200px'
    @slider.recalculateDimensions()
    @slider2.recalculateDimensions()

  setLarge: =>
    @sliderEl.css
      width: '400px'
    @slider.recalculateDimensions()
    @slider2.recalculateDimensions()

  setUpControls: ->
    @config =
      mobileLocked: false
      setSmall: @setSmall
      setLarge: @setLarge

    super()

    @gui.add @config, "setSmall"
    @gui.add @config, "setLarge"

Bindable.register('slider-demo', SliderDemo)