
# requires:
# TouchScroller
# MouseAndTouchTracker
# CursorHand
# Scroller.css

class window.CarouselTouch extends CarouselBase

  initialize: ->
    super()

  buildControls: ->
    super()
    @setSliderWidth()
    @setPanelWidths()
    @buildScroller()
  
  buildScroller: ->
    scrollOptions = 
      isPaged: true, 
      defaultOrientation: TouchScroller.HORIZONTAL,
      scrollerDelegate: @createScrollDelegate(),
      disabledElements: "img",
      pagedEasingFactor: 4
    @scroller = new TouchScroller( @el[0], @slider[0], scrollOptions )

  createScrollDelegate: =>
    updatePosition: ( positionX, positionY, isTouching ) =>
      @pressed_and_didnt_move = false
    touchStart: =>
      @clearTimer()
      @pressed_and_didnt_move = true
      @autoplay_finished = true
    touchEnd: =>
      if @pressed_and_didnt_move
        @startTimer()
      @pressed_and_didnt_move = false
    handleDestination: =>
      @updateIndicators() if @indicators
      @clearTimer()
      @startTimer()
      @scrollerPageUpdated @scroller.getPage()
      @handleTransitionEnd()
    pageChanged: =>
      @index = @scroller.getPage()
      @updateIndicators() if @indicators
      @scrollerPageUpdated @scroller.getPage()
    closestIndexChanged: (closestIndex) =>
      @index = closestIndex
      @updateIndicators() if @indicators
      @scrollerPageUpdated closestIndex

  scrollerPageUpdated: (index) ->
    # do nothing - used in infinite scroller

  slide: =>
    super()
    @scroller.setPage(@index, false)



Bindable.register('carousel-touch', CarouselTouch)
