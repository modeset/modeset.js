class ModeSetLogoDemo

  constructor: (@el) ->
    @logo = null
    @container = $("div.container")
    @logo = new ModeSetLogo( @container[0], 200 )

  prepContainers: ->
    $("div.container").css
      position: "relative"
      height: "400px"
      width: "400px"
      backgroundColor: "#ff0"

  setUpControls: ->
    _gui = new dat.GUI(autoPlace: false)
    document.getElementsByClassName("controls_ui")[0].appendChild _gui.domElement
    $(".controls_ui .close-button").remove()


Bindable.register('mode-set-logo-demo', ModeSetLogoDemo)