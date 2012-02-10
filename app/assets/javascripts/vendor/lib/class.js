/* From object.js (reset to local variable so that the prototype methods added to Object don't collide with other libraries) ------------------------------ */
var object = {
  getType: function(o) {
    switch(o) {
      case null: return 'Null';
      case (void 0): return 'Undefined';
    }
    var type = typeof o;
    switch(type) {
      case 'boolean': return 'Boolean';
      case 'number':  return 'Number';
      case 'string':  return 'String';
    }
    return 'Object';
  },

  keys: function(object) {
    if (this.getType(object) !== 'Object') { alert('type error'); }
    var results = [];
    for (var property in object) {
      if (object.hasOwnProperty(property)) {
        results.push(property);
      }
    }
    return results;
  },

  isFunction: function(object) {
    return Object.prototype.toString.call(object) === '[object Function]';
  },

  isUndefined: function(object) {
    return typeof object === "undefined";
  },

  extend: function(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
  }
};

/* From array.js ------------------------------ */
function $A(iterable) {
  if (!iterable) return [];
  // Safari <2.0.4 crashes when accessing property of a node list with property accessor.
  // It nevertheless works fine with `in` operator, which is why we use it here
  if ('toArray' in Object(iterable)) return iterable.toArray();
  var length = iterable.length || 0, results = new Array(length);
  while (length--) results[length] = iterable[length];
  return results;
};

/* From function.js ------------------------------ */
Function.prototype.argumentNames = function() {
  var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
    .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
    .replace(/\s+/g, '').split(',');
  return names.length == 1 && !names[0] ? [] : names;
};

// patched with inline helpers from function.js
Function.prototype.bind = function(context) {
  if (arguments.length < 2 && object.isUndefined(arguments[0])) return this;
  var __method = this,
    args = Array.prototype.slice.call(arguments, 1);
  function update(array, args) {
    var arrayLength = array.length, length = args.length;
    while (length--) array[arrayLength + length] = args[length];
    return array;
  }
  function merge(array, args) {
    array = Array.prototype.slice.call(array, 0);
    return update(array, args);
  }
  return function() {
    var a = merge(args, arguments);
    return __method.apply(context, a);
  }
};

// patched with inline helper from function.js
Function.prototype.wrap = function(wrapper) {
  function update(array, args) {
    var arrayLength = array.length, length = args.length;
    while (length--) array[arrayLength + length] = args[length];
    return array;
  }
  var __method = this;
  return function() {
    var a = update([__method.bind(this)], arguments);
    return wrapper.apply(this, a);
  }
};

/* From class.js ------------------------------ */
/* Based on Alex Arnell's inheritance implementation. */
/* Refer to Prototype's web site for a [tutorial on classes and inheritance (http://prototypejs.org/learn/class-inheritance). */
var Class = (function() {

  // Some versions of JScript fail to enumerate over properties, names of which
  // correspond to non-enumerable properties in the prototype chain
  var IS_DONTENUM_BUGGY = (function(){
    for (var p in { toString: 1 }) {
      // check actual property name, so that it works with augmented Object.prototype
      if (p === 'toString') return false;
    }
    return true;
  })();

  function extend( destination, source ) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
  }

  function subclass() {}
  function create() {
    var parent = null, properties = $A(arguments);
    if (object.isFunction(properties[0]))
      parent = properties.shift();

    function klass() {
      this.initialize.apply(this, arguments);
    }

    extend(klass, Class.Methods);
    klass.superclass = parent;
    klass.subclasses = [];

    if (parent) {
      subclass.prototype = parent.prototype;
      klass.prototype = new subclass;
      parent.subclasses.push(klass);
    }

    for (var i = 0, length = properties.length; i < length; i++)
      klass.addMethods(properties[i]);

    if (!klass.prototype.initialize)
      klass.prototype.initialize = Prototype.emptyFunction;

    klass.prototype.constructor = klass;
    return klass;
  }

  function addMethods(source) {
    var ancestor   = this.superclass && this.superclass.prototype,
        properties = object.keys(source);

    // IE6 doesn't enumerate `toString` and `valueOf` (among other built-in `Object.prototype`) properties,
    // Force copy if they're not Object.prototype ones.
    // Do not copy other Object.prototype.* for performance reasons
    if (IS_DONTENUM_BUGGY) {
      if (source.toString != Object.prototype.toString)
        properties.push("toString");
      if (source.valueOf != Object.prototype.valueOf)
        properties.push("valueOf");
    }

    for (var i = 0, length = properties.length; i < length; i++) {
      var property = properties[i],
          value = source[property];
      if (ancestor && object.isFunction(value) &&
          value.argumentNames()[0] == "$super") {
        var method = value;
        value = (function(m) {
          return function() { return ancestor[m].apply(this, arguments); };
        })(property).wrap(method);

        value.valueOf = method.valueOf.bind(method);
        value.toString = method.toString.bind(method);
      }
      this.prototype[property] = value;
    }

    return this;
  }

  return {
    create: create,
    extend: extend,
    Methods: {
      addMethods: addMethods
    }
  };
})();