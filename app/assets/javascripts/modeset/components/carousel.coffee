
class Carousel
  constructor:(el) ->
    @el = $(el)
    @index = 0
    @num_panels = 0
    @num_cycles = 0
    @cycle_slide = 0
    @options()
    @initialize()

  # Carousel Setup

  options: ->
    # Set any options coming from html data attributes
    @autoplay = (@el.data('autoplay') + "" == "true")
    @num_cycles = parseFloat(@el.data('cycles')) || 99
    @duration = @el.data('duration') || 5
    @duration *= 1000
    console.log '@num_cycles',@num_cycles

  initialize: ->
    @slider = $(@el.find('.carousel-inner'))
    @panels = $(@el.find('.carousel-panel'))
    @figures = $(@el.find('.carousel-figure'))

    # @controls = $(@el.find('.carousel-controls'))
    @num_panels = @panels.length
    @num_cycles *= @num_panels

    @setSliderWidth()
    @setPanelWidths()

    @buildControls() unless @num_panels <= 1

    @startTimer() if @autoplay == true

    # @buildStatus() unless ......
    # @addListeners()

  buildControls: ->
    @buildScroller()
    @buildPaddles()
    @buildIndicators()
  
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
    #   @shiftPages @scroller.getPage()
    closestIndexChanged: (closestIndex) =>
      @updateIndicators() if @indicators
    #   @shiftPages closestIndex

  buildScroller: ->
    disable_elements = 'img'
    @scroller = new TouchScroller( @el[0], @slider[0], true, new CursorHand(), true, TouchScroller.HORIZONTAL, @createScrollDelegate(), disable_elements )

  buildPaddles: ->
    @el.find('.paddle-next').on("click", @next)
    @el.find('.paddle-prev').on("click", @prev)

  buildIndicators: ->
    indication = @el.find('.indication')
    indicators_html = ''
    # add <li> buttons
    if indication
      for i in [1..@num_panels]
        indicators_html += "<li><a href='#slide_#{i}'>#{i}</a></li>"
      indication.append(indicators_html)
      # add clicks
      @indicators = indication.find('li')
      indication.find('a').on 'click', (e) =>
        e.preventDefault()
        @scroller.setPage($(e.target).parent().index())
      @updateIndicators()

  updateIndicators: ->
    indicator_index = @scroller.getPage() % @num_panels
    for indicator, i in @indicators
      if i == indicator_index
        $(indicator).addClass 'active'
      else
        $(indicator).removeClass 'active'

  startTimer: ->
    # stop auto-play after 2 full cycles
    if @cycle_slide >= @num_cycles
      @autoplay_finished = true
    if @autoplay_finished == true || @autoplay == false
      return
    # set next slide timer
    @timer = setTimeout =>
      @cycle_slide++
      @scroller.nextPage(true)
    , @duration

  clearTimer: ->
    clearTimeout @timer


  # Public Functions
  
  next: (e) =>
    e?.preventDefault()
    @clearTimer()
    @scroller.nextPage(true)

  prev: =>
    e?.preventDefault()
    @clearTimer()
    @scroller.prevPage(true)

  resize: =>

  redraw: ->

  swap: ->

  slide: ->

  dispose: ->


  # Internal Functions

  setSliderWidth: ->
    @slider.width((100 * @num_panels) + '%')

  setPanelWidths: ->
    @panels.width((100 / @num_panels) + '%')


Bindable.register('carousel', Carousel)
