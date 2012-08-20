class EasingFloatDemo

  constructor: (@el) ->
    @ease = null
    @box_div = $("div.easing")
    @box_layer = $("div.container")
    @box_base_x = 150
    @box_base_y = 0

    @config =
      easeFactor: 5

    @prepContainers()
    @initEasing()

  prepContainers: ->
    $("div.container").css
      position: "relative"
      height: "400px"
      width: "400px"
      backgroundColor: "#ff0"

    $("div.easing").css
      position: "absolute"
      height: "10px"
      width: "100px"
      backgroundColor: "#f0f"

  initEasing: ->
    @ease = new EasingFloat(0, 5)
    @setUpControls()
    @runTimer()
    @runSetTargetInterval()

  setUpControls: ->
    _gui = new dat.GUI(autoPlace: false)
    document.getElementsByClassName("controls_ui")[0].appendChild _gui.domElement
    $(".controls_ui .close-button").remove()

    easeFactorVal = _gui.add(@config, "easeFactor", 2, 20)
    easeFactorVal.listen()
    easeFactorVal.onChange (value) =>
      @ease.setEaseFactor value

    @box_div.css
      top: @ease.value()

  runSetTargetInterval: ->
    setInterval (=>
      if @ease.value() < 150
        @ease.setTarget 300
      else
        @ease.setTarget 0
    ), 1000

  runTimer: ->
    @ease.update()
    @box_div.css
      top: @ease.value()

    setTimeout =>
      @runTimer()
    , 33

Bindable.register('easing-float-demo', EasingFloatDemo)