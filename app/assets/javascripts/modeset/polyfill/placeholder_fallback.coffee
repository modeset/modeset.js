# ## HTML5 placeholder feature fallback
class PlaceholderFallback

  constructor: (el) ->
    @el = $(el)
    @initialize()
  
  # HTML5 <input> placeholder feature detection
  browserHasPlaceholder: =>
    "placeholder" of document.createElement("input")
  
  # Reads the placeholder attribute and uses it in a javascript fallback
  initialize: =>
    if @browserHasPlaceholder() == false
      placeholderText = @el.attr 'placeholder' 
      @el.removeAttr 'placeholder'
      @el.val(placeholderText)
      @el.focus (event) ->
        if this.value == placeholderText
          this.value = ''
      @el.blur (event) ->
        if this.value == ''
          this.value = placeholderText
    else
      @el = null
  
# Register with bindable for instantiation
Bindable.register('placeholder_fallback', PlaceholderFallback)