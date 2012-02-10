
# ## Slideshow
class Slideshow

  constructor: (el) ->
    @el = $(el)
    @sliderEl = null
    @slides = null
    @numSlides = 0
    @index = 0
    @dimensions = null
    @autoplay = (if @el.data('autoplay') then true else false)
    @elementsPerSlide = (if @el.data('elements-per-slide') then parseInt(@el.data('elements-per-slide')) else 1)
    @isPlaying = @autoplay
    @cssTransitions = Modernizr.csstransitions
    @slideTimer = null
    @slideTimeout = 5000
    @restartTimer = null
    @restartTimeout = 15000
    
    @initialize()

  # If an href links to an anchor, replace the functionality with a scroll animation
  initialize: =>
    @getDimensions()
    @getSlides()
    @initPaddles()
    @initGeometry()
    @startTimer()
  
  # Grab dimensions of the slideshow container
  getDimensions: =>
    @dimensions = 
      w : @el.width()
      h : @el.height()
  
  # Grab references to slide elements 
  getSlides: =>
    @sliderEl = @el.find 'ul'
    @slides = @sliderEl.find 'li'
    @numSlides = Math.ceil( @slides.length / @elementsPerSlide )
  
  # Activate previous/next buttons
  initPaddles: =>
    @el.find('a.paddle.next').bind 'click', @nextClick
    @el.find('a.paddle.prev').bind 'click', @prevClick
  
  # Resize containers to properly init the slideshow 
  initGeometry: =>
    @sliderEl.width @numSlides * @dimensions.w
    
  # Start the timer 
  startTimer: =>
    if @autoplay
      @slideTimer = setInterval @next, @slideTimeout
  
  # Start the timer 
  killTimer: =>
    clearInterval @slideTimer if @slideTimer
    clearTimeout @restartTimer if @restartTimer
    @restartTimer = setTimeout @startTimer, @restartTimeout
  
  # Keep index within bounds 
  constrainIndex: =>
    @index = 0 if @index >= @numSlides
    @index = @numSlides - 1 if @index < 0
    
  # Slide to current index 
  showCurSlide: =>
    @constrainIndex()
    pos = @dimensions.w * -@index
    # Use CSS transitions when possible
    if @cssTransitions
      @sliderEl.css(left: pos)
    else
      @sliderEl.animate(left: pos, 500)
  
  # Increment slideshow index 
  next: =>
    @index++
    @showCurSlide()

  # Decrement slideshow index 
  prev: =>
    @index--
    @showCurSlide()

  # Increment slideshow and kill timer 
  nextClick: (e) =>
    e.preventDefault()
    @killTimer()
    @next()

  # Decrement slideshow and kill timer
  prevClick: (e) =>
    e.preventDefault()
    @killTimer()
    @prev()


# Register with bindable for instantiation
Bindable.register('slideshow', Slideshow)
