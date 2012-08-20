class ModeSetLogoDemo extends Demo

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
    super()


Bindable.register('mode-set-logo-demo', ModeSetLogoDemo)