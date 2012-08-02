# usage: $(el).on(TransitionCallback.transition.end, @onDone) if TransitionCallback.hasTransition
class window.TransitionCallback

  @transition = (=>
    transitionEnd = (->
      el = document.createElement("tranny")
      transEndEventNames =
        WebkitTransition: "webkitTransitionEnd"
        MozTransition: "transitionend"
        OTransition: "oTransitionEnd"
        msTransition: "MSTransitionEnd"
        transition: "transitionend"
      name = undefined
      for name of transEndEventNames
        return transEndEventNames[name]  if el.style[name] isnt `undefined`
    )()
    @hasTransition = true if transitionEnd
    return {end: transitionEnd} if transitionEnd
  )()
