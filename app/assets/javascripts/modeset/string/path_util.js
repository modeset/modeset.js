var PathUtil = PathUtil || {};

/**
 *  Converts the URL's query params into a hash, accessible with PathUtil.getUrlVar()
 *  @return An array/hash of the query params.
 *  @use    {@code var paramsHash = PathUtil.getUrlVars();}
 */
PathUtil.getUrlVars = function() {
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1] ? hash[1].split('#')[0] : null;
  }
  return vars;
};

/**
 *  Returns a query param value by passing in a key.
 *  @param  name  A key to search the PathUtil.getUrlVars() query params object with.
 *  @return The string value of the query param key.
 *  @use    {@code var paramVal = PathUtil.getUrlVar('bar');}
 */
PathUtil.getUrlVar = function(name) {
  return PathUtil.getUrlVars()[name];
};
