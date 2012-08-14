window.onerror = (msg, url, linenumber) ->
  console.log 'Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber
  return true
