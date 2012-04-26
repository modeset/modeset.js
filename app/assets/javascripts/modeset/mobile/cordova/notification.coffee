class Notification

  @alert: (message, callback, title='Alert', buttonName='OK')->
    if navigator.notification and navigator.notification.alert
      navigator.notification.alert message, callback, title, buttonName
    else
      window.alert message

  @confirm: (message, callback, title='Confirm', buttonLabels='OK,Cancel')->
    if navigator.notification and navigator.notification.confirm
      navigator.notification.confirm message, callback, title, buttonLabels
    else
      confirmation = window.confirm message
      if confirmation and callback
        callback.call @, 1
      else if callback
        callback.call @, 2

  @beep: (times)->
    if navigator.notification and navigator.notification.beep
      navigator.notification.beep times
    else
      console.log 'Beep is not available.'

  @vibrate: (milliseconds)->
    if navigator.notification and navigator.notification.vibrate
      navigator.notification.vibrate milliseconds
    else
      console.log 'Vibrate is not available.'

@Notification = Notification

