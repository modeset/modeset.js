class window.Demo
  
  setUpControls: ->
    @gui = new dat.GUI(autoPlace: false)
    document.getElementsByClassName("controls_ui")[0].appendChild @gui.domElement
    $(".controls_ui .close-button").remove()

    # add mobileLocked toggle is property exists
    if @config?.mobileLocked != undefined
      mobileLocked = @gui.add(@config, "mobileLocked")
      mobileLocked.onChange (value) =>
        @swapMobileLocked()
      @swapMobileLocked()

  swapMobileLocked: =>
    if @config?.mobileLocked is true
      MobileUtil.lockTouchScreen(true)
    else
      MobileUtil.lockTouchScreen(false)
