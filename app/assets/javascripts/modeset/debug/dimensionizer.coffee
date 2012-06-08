
#~
# Debugging tool for printing the innerWidth of the browser.
# Dimensionizer provides it's own styles when it's instantiated.
# Useful when creating styles associated with media queries.
#
# To use this class, simply require it from `application.js`
#
# Warnings:
# - **Warning!** Make sure this is turned off for production!
#
# Examples:
#    //=require debuggers/dimensionizer

class Dimensionizer
  constructor: ->
    div = """
          <div id="page_dimensions" style="
            position:fixed;
            top:5px;
            left:5px;
            background-color:rgba(0,0,0,0.7);
            border-radius:0.5em;
            font-weight:bold;
            color:#fff;
            cursor:default;
            padding:0.5em;
            z-index:9999;
          ">
      </div>
      """
    $('body').append div
    @dimensions = $('#page_dimensions')
    @initialize()

  initialize: ->
    @dimensions.html window.innerWidth + 'px'
    $(window).on 'resize', =>
      @dimensions.html window.innerWidth + 'px'
    @dimensions.on 'click', =>
      @dimensions.fadeOut('fast')

new Dimensionizer()

