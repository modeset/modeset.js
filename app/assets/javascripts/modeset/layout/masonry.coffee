
# ## Render the layout using the [masonry plugin](http://masonry.desandro.com/)
class Masonry
  constructor: (el) ->
    @el = $(el)
    @initialize()

  # Instantiate the `masonry` plugin and start aligning containers
  initialize: ->
    @el.masonry
      itemSelector: ".mason"
      isFitWidth: true
      columnWidth: 8


# Register with bindable for instantiation
Bindable.register('masonry', Masonry)

