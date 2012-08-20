class ModeSetLogoDemo extends Demo

  constructor: (@el) ->
    @container = @el.find("div.container")
    @logo = new ModeSetLogo( @container[0], 400 )

  prepContainers: ->
    $("div.container").css
      position: "relative"
      height: "400px"
      width: "400px"
      backgroundColor: "#ff0"

  setUpControls: ->
    super()


Bindable.register('mode-set-logo-demo', ModeSetLogoDemo)