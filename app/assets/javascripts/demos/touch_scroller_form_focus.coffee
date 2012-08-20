class TouchScrollerFormFocusDemo

  constructor: (@el) ->
    @scroller = null
    @scrollerFormFocus = null
    @gui = null
    @config = 
      dispose: @dispose

    @prepContainers()
    @initDemo()
    @setUpControls()

  prepContainers: ->
    $("div.scroll_outer").css
      position: "relative"
      height: "400px"
      width: "400px"
      backgroundColor: "#ccc"

    $("div.scroll_inner").css
      position: "absolute"
      height: "800px"
      width: "400px"
      background: "#666 url(/images/mode-set-logo.png) repeat"

    $("input.form_focus").css
      margin: "100px auto"
      width: "200px"
      background: "#ddd"

  initDemo: ->
    @scroller = new TouchScroller($(".scroll_outer")[0], $(".scroll_inner")[0], true, new CursorHand(), false, TouchScroller.VERTICAL, {}, "")
    @scrollerFormFocus = new TouchScrollerFormFocus(@scroller, $(".scroll_outer")[0])
    @scrollerFormFocus.init()
    @scroller.setScrollerDelegate @scrollerFormFocus

  dispose: ->
    @scroller.dispose()
    @scrollerFormFocus.dispose()

  setUpControls: ->
    _gui = new dat.GUI(autoPlace: false)
    document.getElementsByClassName("controls_ui")[0].appendChild _gui.domElement
    $(".controls_ui .close-button").remove()
    _gui.add @config, "dispose"


Bindable.register('touch-scroller-form-focus-demo', TouchScrollerFormFocusDemo)
