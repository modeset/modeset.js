class SoftKeyboard

  @hide: ->
    document.activeElement.blur()
    $('input').blur()

@SoftKeyboard = SoftKeyboard

