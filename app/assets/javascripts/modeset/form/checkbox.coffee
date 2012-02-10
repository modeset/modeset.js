
# ## Toggles states of faux checkboxes
class Checkbox
  constructor: (el) ->
    @el = $(el)
    @initialize()

  initialize: () ->
    @el.click (e, data) => @toggle(e)

  toggle: (e) ->
    @el.toggleClass('checked')

# Register with bindable for instantiation
Bindable.register('checkbox', Checkbox)

