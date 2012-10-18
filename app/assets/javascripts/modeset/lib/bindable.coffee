#~
# Light weight Dependency Injection for client side components.
#
# Looks for all DOM elements with the `data-bindable` attribute,
# stores references within a registry and instantiates their
# respective classes.
#
# Examples:
#    Bindable.register 'carousel', namespace.Carousel

class window.Bindable
  constructor: (context=$('body'), @dataKey='bindable')->
    @bindables = $("[data-#{@dataKey}]", context)
    @instanceKey = "#{@dataKey}-instance"


  bindAll: ->
    @bind(el) for el in @bindables
    @


  getRefs: ->
    $(bindable).data(@instanceKey) for bindable in @bindables


  release: ->
    for bindable in @bindables
      bindable = $(bindable)
      if instance = bindable.data(@instanceKey)
        instance.release() if typeof instance?.release is 'function'
        bindable.data(@instanceKey, null)

    delete @bindables
    @bindables = []


  bind: (el, dataKey=@dataKey) ->
    el = $(el)
    key = el.data(dataKey)
    if _class = @constructor.getClass(key)
      el.data( @instanceKey, new _class(el) ) unless el.data(@instanceKey)
    else
      console?.error "Bindable for key: #{key} not found in Bindable.registry for instance", el


  @getClass: (key) ->
    @registry[key]?.class


  @register: (key, klass) ->
    @registry ?= {}
    @registry[key] = { class: klass }
    return null


