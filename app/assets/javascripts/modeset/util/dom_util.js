function DOMUtil(){}

DOMUtil.getWidth = function( elem ) {
  if( elem ) return elem.offsetWidth;
  else return -1;
};

DOMUtil.getHeight = function( elem ) {
  if( elem ) return elem.offsetHeight;
  else return -1;
};

DOMUtil.getWindowSize = function() {
  var myWidth = 0, myHeight = 0;

  if (typeof(window.innerWidth) == 'number') {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  return {width:myWidth, height:myHeight};
};

DOMUtil.show = function( elem ) {
  if( elem ) elem.style.display = 'block';
};

DOMUtil.hide = function( elem ) {
  if( elem ) elem.style.display = 'none';
};

DOMUtil.removeElement = function( elem ) {
  if( elem ) {
    if( elem.parentNode ) {
      elem.parentNode.removeChild( elem );
    }
  }
};

DOMUtil.getStyle = function(el,styleProp) {
	if (el.currentStyle) {
		var y = el.currentStyle[styleProp];
	} else if (window.getComputedStyle) {
		var y = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
	}
	return y;
};

DOMUtil.createElement = function( type, params, parent ) {
  var type = type || params.tag, 
    prop, 
    el = document.createElement(type);

  for (prop in params) {
    if( typeof params[prop] !== 'function' ) {
        switch( prop ){
          case 'text':
            el.appendChild( document.createTextNode( params[prop] ) );
            break;
          case 'className':
			el.className = params[prop];
            break;
          default:
            el.setAttribute( prop, params[prop] );
        }
    }
  }
  if( parent ) parent.appendChild( el );
  return el;
};

DOMUtil.getRE = function( regex ) {
  return new RegExp( '\\b' + regex + '\\b', 'g' );
};


DOMUtil.hasClass = function(inElement, inClassName) {
  var regExp = new RegExp('(?:^|\\s+)' + inClassName + '(?:\\s+|$)');
  return regExp.test(inElement.className);
};

DOMUtil.addClass = function(elem, className) {
  if (!DOMUtil.hasClass(elem, className))
    elem.className = [elem.className, className].join(' ');
};

DOMUtil.removeClass = function(elem, className) {
  if (DOMUtil.hasClass(elem, className)) {
    var regExp = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)', 'g');
    var curClasses = elem.className;
    elem.className = curClasses.replace(regExp, ' ');
  }
};
    function toggleClassName(inElement, inClassName)
    {
        if (hasClassName(inElement, inClassName))
            removeClassName(inElement, inClassName);
        else
            addClassName(inElement, inClassName);
    }

DOMUtil.replaceElement = function( oldElem, newElem ) {
  oldElem.parentNode.replaceChild( newElem, oldElem );
};

DOMUtil.killEvent = function(e) {
  if( typeof e !== 'undefined' && e != null ) {
    if( typeof e.preventDefault !== 'undefined' ) e.preventDefault();
    if( typeof e.stop !== 'undefined' ) e.stop();

    e.returnValue = false;
    e.stopPropagation();
  }
};

DOMUtil.recurseDisableElements = function ( elem ) {
  if( elem ) {
    // disable clicking/dragging
    try {
      elem.onmousedown = function(e){return false;};  // TODO: remove this if touch events, so we can click inside??
      elem.onselectstart = function(e){return false;};
    } catch(err) {}

    // loop through children and do the same
    if( elem.childNodes.length > 0 ) {
      for( var i=0; i < elem.childNodes.length; i++ ) {
        DOMUtil.recurseDisableElements( elem.childNodes[i] );
      }
    }
  }
};

// prevent clicking/dragging on children from interfering with container's dragging
DOMUtil.recurseDisableElements = function ( elem, disabledElements ) {
	if( elem ) {
		// disable clicking/dragging on selected element types
		if( elem.tagName && disabledElements.indexOf( elem.tagName.toLowerCase() ) != -1 ) {  //  console.log('disabling: = '+elem.tagName.toLowerCase());
			try {
				elem.onmousedown = function(e){ return false; };  // TODO: remove this if touch events, so we can click inside??
				elem.onselectstart = function(){ return false; };
			} catch(err) {}
		}
		// loop through children and do the same
		if( elem.childNodes.length > 0 ){
			for( var i=0; i < elem.childNodes.length; i++ ) {
				DOMUtil.recurseDisableElements( elem.childNodes[i], disabledElements );
			}
		}
	}
};


//This is a third party function written by Martin Honnen
//In comp.lang.javascript
//http://groups-beta.google.com/group/comp.lang.javascript/browse_thread/thread/2b389e61c7b951f2/99b5f1bee9922c39?lnk=gst&q=(doc+%3D+node.ownerDocu ment)+%26%26+(win+%3D+doc.defaultView)&rnum=1&hl=e n#99b5f1bee9922c39
DOMUtil.selectNode =  function ( node ) {
  var selection, range, doc, win;
  if ((doc = node.ownerDocument) && (win = doc.defaultView) && typeof win.getSelection != 'undefined' && typeof doc.createRange != 'undefined' && (selection = window.getSelection()) && typeof selection.removeAllRanges != 'undefined') {
    range = doc.createRange();
    range.selectNode(node);
    selection.removeAllRanges();
    selection.addRange(range);
  } else if (document.body && typeof document.body.createTextRange != 'undefined' && (range = document.body.createTextRange())) {
    range.moveToElementText(node);
    range.select();
  }
};

