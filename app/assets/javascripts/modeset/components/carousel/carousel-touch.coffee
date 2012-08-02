
class window.CarouselTouch extends CarouselBase

  initialize: ->
    super()
    @setSliderWidth()
    @setPanelWidths()

  buildControls: ->
    super()
    @buildScroller()
  
  buildScroller: ->
    disable_elements = 'img'
    @scroller = new TouchScroller( @el[0], @slider[0], true, new CursorHand(), true, TouchScroller.HORIZONTAL, @createScrollDelegate(), disable_elements )

  createScrollDelegate: ->
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
      # @shiftPages @scroller.getPage()
    pageChanged: =>
      @updateIndicators() if @indicators
      @index = @scroller.getPage()
    #   @shiftPages @scroller.getPage()
    closestIndexChanged: (closestIndex) =>
      @updateIndicators() if @indicators
    #   @shiftPages closestIndex

  # Public Functions

  slide: ->
    super()
    @scroller.setPage(@index)



Bindable.register('carousel-touch', CarouselTouch)
