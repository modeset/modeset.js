class TouchScrollerDemo extends Demo

  constructor: (@el) ->
    @scroller = null
    @buttonCallback = null
    @gui = null
    @gui_paged = null
    @gui_free = null

    @config =
      mobileLocked: false
      isActive: true
      isVertical: true
      isAxisLocked: true
      orientation: TouchScroller.HORIZONTAL
      isPaged: false
      bounces: true
      addContent: @addContent
      resizeSmall: @resizeSmall
      resizeLarge: @resizeLarge
      prevPage: =>
        @scroller.prevPage()
      nextPage: =>
        @scroller.nextPage()
      scrollToTop: =>
        @scroller.scrollToTop()
      scrollToEnd: =>
        @scroller.scrollToEnd()
      scrollByOffset: =>
        @scroller.setOffsetPosition 100
      scrollToPercent: =>
        @scroller.scrollToPercent 0.5
      scrollOffset: 0
      dispose: =>
        @scroller.dispose()

    @prepContainers()
    @initDemo()
    @setUpControls()


  prepContainers: ->
    @status = @el.find(".demo_console .status")
    @scrollOuter = $("div.scroll_outer")
    @scrollOuter.css
      position: "relative"
      height: "400px"
      width: "400px"
      backgroundColor: "#ccc"

    $("div.scroll_inner").css
      position: "absolute"
      height: "800px"
      width: "800px"
      background: "#666 url(/images/mode-set-logo.png) repeat"

    $("div.scroll_inner button").css
      position: "absolute"
      height: "50px"
      width: "50px"
      left: "175px"
      top: "175px"
      background: "#222"

  initDemo: ->
    MobileUtil.addAndroidClasses();
    @scroller = new TouchScroller($(".scroll_outer")[0], $(".scroll_inner")[0], true, new CursorHand(), @config.isPaged, @config.orientation, @createScrollDelegate(), "div")
    @buttonCallback = new ButtonTouchCallback( $("div.scroll_inner button")[0], @buttonClicked, "active" );
    @toggleOrientation()

  buttonClicked: ->
    alert 'click!'

  createScrollDelegate: =>
    updatePosition: (positionX, positionY, isTouching) =>
      @config.scrollOffset = @scroller.getCurScrollPosition()  if @scroller
      @updateControlsStatus()

    touchEnd: =>

    handleDestination: =>
      @config.scrollOffset = @scroller.getCurScrollPosition()  if @scroller
      @updateControlsStatus()

    pageChanged: =>
      @updateControlsStatus()

  toggleOrientation: ->
    @config.orientation = (if (@config.orientation is TouchScroller.VERTICAL) then TouchScroller.HORIZONTAL else TouchScroller.VERTICAL)
    @scroller.setOrientation @config.orientation
    @updateControlsStatus()

  toggleAxisLock: ->
    @config.axisLockCheck = (if (@config.isAxisLocked is true) then false else true)
    if @config.isAxisLocked
      @scroller.setOrientation @config.orientation
    else
      @scroller.setOrientation null

  swapPaged: ->
    @scroller.setIsPaged @config.isPaged
    @updateControlsStatus()
    @updateGUIFolders()

  addContent: ->
    $(".scroll_inner").css
      width: $(".scroll_inner").width() + $(".scroll_outer").width()
      height: $(".scroll_inner").height() + $(".scroll_outer").height()

  swapBounces: ->
    @scroller.setBounces @config.bounces

  resizeSmall: =>
    @scrollOuter.css
      width: 250
      height: 250

  resizeLarge: =>
    @scrollOuter.css
      width: 400
      height: 400

  updateGUIFolders: ->
    if @config.isPaged is true
      @gui_free.close()
      @gui_paged.open()
    else
      @gui_free.open()
      @gui_paged.close()

  updateControlsStatus: ->
    return if !@scroller
    page = @scroller.getPage()
    page += 1  unless page is -1
    @status.html "Orientation = " + @config.orientation + "<br/>" + "isPaged = " + @config.isPaged + "<br/>" + "Page = " + page + "/" + @scroller.getNumPages() + "<br/>" + "Cur scroll position = " + @scroller.getCurScrollPosition() + "<br/>" + "Cur scroll percent = " + @scroller.getCurScrollPercent()

  setUpControls: ->
    super()

    activeCheck = @gui.add(@config, "isActive")
    activeCheck.onChange (value) =>
      if value
        @scroller.activate()
      else
        @scroller.deactivate()

    verticalCheck = @gui.add(@config, "isVertical")
    verticalCheck.onChange (value) =>
      @toggleOrientation()

    axisLockCheck = @gui.add(@config, "isAxisLocked")
    axisLockCheck.onChange (value) =>
      @toggleAxisLock()

    pagedCheck = @gui.add(@config, "isPaged")
    pagedCheck.onChange (value) =>
      @swapPaged()

    bouncesCheck = @gui.add(@config, "bounces")
    bouncesCheck.onChange (value) =>
      @swapBounces()

    @gui.add @config, "addContent"
    @gui.add @config, "resizeSmall"
    @gui.add @config, "resizeLarge"
    @gui.add @config, "dispose"
    @gui_paged = @gui.addFolder("Paged Controls")
    @gui_paged.add @config, "prevPage"
    @gui_paged.add @config, "nextPage"
    @gui_free = @gui.addFolder("Non-paged Controls")
    @gui_free.add @config, "scrollToTop"
    @gui_free.add @config, "scrollToEnd"
    @gui_free.add @config, "scrollByOffset"
    @gui_free.add @config, "scrollToPercent"
    scrollOffsetVal = @gui_free.add(@config, "scrollOffset", -400, 0)
    scrollOffsetVal.listen()
    scrollOffsetVal.onChange (value) =>
      @scroller.scrollToPosition value

    @updateGUIFolders()


Bindable.register('touch-scroller-demo', TouchScrollerDemo)
