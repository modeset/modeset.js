
# ## Binds DOM elements to classes for instantiation
class window.Bindable
  constructor: ->
    @bindables = $('[data-bindable]')

  # Find all `data-bindable` elements store and instantiate their respective classes
  constructAll: ->
    _.each @bindables, (el) ->
      key = $(el).data('bindable')
      item = Bindable.registry[key]
      item.refs.push(new item.class(el))

  # Look up a bindable objects from the registry
  @getClass: (key) ->
    Bindable.registry[key].class

  # Look up a bindable elements from the registry
  @getRefs: (key) ->
    Bindable.registry[key].refs

  # Map bindables to an internal registry
  @register: (key, klass) ->
    @registry ?= {}
    @registry[key] = 'class': klass, 'refs': []
    return null

