class SliderDemo extends Demo

  constructor: (@el) ->
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
      backgroundColor: "#ccc"

    @sliderProgress = $(".slider-progress")
    @sliderProgress.css
      position: "absolute"
      overflow: "hidden"
      height: "10px"
      "margin-top": "20px"
      width: "0"
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

  valueUpdated: (value) =>
    $(".status").html(value)

  setSmall: =>
    @sliderEl.css
      width: '200px'
    @slider.recalculateDimensions()

  setLarge: =>
    @sliderEl.css
      width: '400px'
    @slider.recalculateDimensions()

  setUpControls: ->
    @config =
      mobileLocked: false
      setSmall: @setSmall
      setLarge: @setLarge

    super()

    @gui.add @config, "setSmall"
    @gui.add @config, "setLarge"

Bindable.register('slider-demo', SliderDemo)