
# ## Add browser specific callbacks for CSS transitions
support.transition = (->
  thisBody = document.body or document.documentElement
  thisStyle = thisBody.style
  support = thisStyle.transition isnt `undefined` or thisStyle.WebkitTransition isnt `undefined` or thisStyle.MozTransition isnt `undefined` or thisStyle.MsTransition isnt `undefined` or thisStyle.OTransition isnt `undefined`
  support and end: (->
    transitionEnd = "TransitionEnd"
    if $.browser.webkit
      transitionEnd = "webkitTransitionEnd"
    else if $.browser.mozilla
      transitionEnd = "transitionend"
    else transitionEnd = "oTransitionEnd"  if $.browser.opera
    transitionEnd
  )()
)()

