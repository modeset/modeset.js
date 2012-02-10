// Allows for binding context to functions
// when using in event listeners and timeouts
// ! From video.js
// Modified by Grant Davis to maintain singular references to context-scoped methods so you can remove the listener later.
// usage:
// element.addEventListener( 'click', obj.handleEvent(this) );
Function.prototype.context = function(obj) {
  var method = this;
  if(this.hasContextMethod(this, obj)) {
    return this.getContextMethod(this, obj);
  }
  else {
    var temp = function() {
      return method.apply(obj, arguments);
    };
    temp.scope = obj;
    if (this.contextMethods === undefined) {
      this.contextMethods = [];
    }
    this.contextMethods.push( temp );
    return temp;
  }
};

Function.prototype.hasContextMethod = function(func, scope) {
  if(!func.contextMethods) return false;
  else {
    for( var i=0; i< func.contextMethods.length; i++) {
      if( func.contextMethods[i].scope === scope ) return true;
    }
  }
};

Function.prototype.getContextMethod = function(func, scope) {
  if(this.hasContextMethod(func, scope)){
    for( var i=0; i< func.contextMethods.length; i++) {
      if( func.contextMethods[i].scope === scope ) return func.contextMethods[i];
    }
  }
};