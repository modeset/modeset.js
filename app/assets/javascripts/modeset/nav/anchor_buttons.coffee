
# ## Anchor Buttons
class AnchorButtons

  constructor: (el) ->
    @el = $(el)
    @initialize()

  # If an href links to an anchor, replace the functionality with a scroll animation. Scroll speed depends on scroll distance.
  initialize: =>
    @el.find('a').bind 'click', (e) =>
      href = e.target.href
      if href && href.indexOf '#' != -1
        anchor = href.split('#')[1]
        anchorElement = $('a[name="'+anchor+'"]')
        if anchorElement
          e.preventDefault()
          scrollCurrent = $('html,body').offset().top * -1
          scrollDestination = anchorElement.offset().top
          scrollDistance = scrollDestination - scrollCurrent
          $('html, body').animate {scrollTop:scrollDestination}, 1000 + scrollDistance/4
    
# Register with bindable for instantiation
Bindable.register('anchor-buttons', AnchorButtons)
