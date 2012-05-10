
# Debugging tool for printing the innerWidth of the browser.
# Useful when creating styles associated with media queries.
class Dimensionizer
  constructor: ->
    $('body').append '<div id="page_dimensions" style="position:fixed; top:0; background-color:rgba(255,255,255,0.9); padding:0.5em; font-weight:bold; color:#ff00ff; z-index:9999;"></div>'
    @dimensions = $('#page_dimensions')
    @initialize()

  initialize: ->
    @dimensions.html window.innerWidth + 'px'
    $(window).on 'resize', =>
      @dimensions.html window.innerWidth + 'px'

new Dimensionizer()

