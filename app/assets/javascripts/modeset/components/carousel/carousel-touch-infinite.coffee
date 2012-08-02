
class CarouselTouchInfinite extends CarouselTouch

  initialize: ->
    super()
    @pagesDeep = 0
    @pagesPushed = 0

  scrollerPageUpdated: (curPageIndex) ->
    # provides endless scrolling, but not < page index of zero
    # if page has changed and we're past the 2nd page
    if curPageIndex != @pagesDeep
      pageUp = curPageIndex > @pagesDeep
      @pagesDeep = curPageIndex

      pages = @slider.children()
      if pageUp && curPageIndex >= 2
        @pagesPushed = curPageIndex - 1
        @slider.append pages[0]
        @slider.css 'padding-left', @pagesPushed * @el.width()
      else if !pageUp && curPageIndex > 0
        @pagesPushed = curPageIndex - 1
        $(pages[pages.length-1]).insertBefore($(pages[0]))
        @slider.css 'padding-left', @pagesPushed * @el.width()

  constrainIndex: ->
    @index = 0 if @index < 0

Bindable.register('carousel-touch-infinite', CarouselTouchInfinite)
