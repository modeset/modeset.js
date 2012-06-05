
# ## Binds DOM elements to classes for instantiation
class window.Bindable
  constructor: (context=$('body'), @dataKey='bindable')->
    @bindables = $("[data-#{@dataKey}]", context)
    @instanceKey = "#{@dataKey}-instance"

  bindAll: ->
    @bind(el) for el in @bindables

  getRefs: ->
    bindable.data(@instanceKey) for bindable in @bindables

  release: ->
    for bindable in @bindables
      if instance = bindable.data(@instanceKey)
        instance.release() if typeof instance?.release is 'function'
        bindable.data(@instanceKey, null)

  @getClass: (key) ->
    @registry[key].class

  @register: (key, klass) ->
    @registry ?= {}
    @registry[key] = { class: klass }
    return null

  bind: (el, dataKey=@dataKey) ->
    el = $(el)
    key = el.data(dataKey)
    if _class = @constructor.getClass(key)
      el.data( @instanceKey, new _class(el) )
    else
      console?.error "Bindable for key: #{key} not found in Bindable.registry"