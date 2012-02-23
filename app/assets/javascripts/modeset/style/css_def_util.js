// originally from: http://www.hunlock.com/blogs/Totally_Pwn_CSS_with_Javascript
var CSSDefUtil = CSSDefUtil || {};

// use:
// var global = getCSSRule('.global');
// global.style.textDecoration='underline overline';

// Return requested style obejct
CSSDefUtil.getCSSRule = function(ruleName, deleteFlag) {
  ruleName = ruleName.toLowerCase();
  if (document.styleSheets) {
    for (var i = 0; i < document.styleSheets.length; i++) {
      var styleSheet = document.styleSheets[i];
      var ii = 0;
      var cssRule = false;
      // loop through each rule in stylesheet
      do {
        if (styleSheet) {
          if (styleSheet.cssRules) {
            cssRule = styleSheet.cssRules[ii];  // Mozilla Style
          } else if (styleSheet.rules != null) {
            cssRule = styleSheet.rules[ii]; // IE style.
          }
          // If we found a rule, see if it's the one we're looking for
          if (cssRule != null && typeof cssRule !== 'undefined') {
            if (typeof cssRule.selectorText !== 'undefined') {
              if (cssRule.selectorText.toLowerCase() == ruleName) {
                if (deleteFlag == 'delete') {
                  if (styleSheet.cssRules) {
                    // Delete rule, Moz Style
                    styleSheet.deleteRule(ii);
                  } else if(styleSheet.removeRule) {
                    // Delete rule IE style.
                    styleSheet.removeRule(ii);
                  }
                  // return true, class deleted.
                  return true;
                } else {
                  // return the style object.
                  return cssRule;
                }
              }
            }
          }
        }
        ii++;
      }
      while (cssRule)
    }
  }
  return false;
};

// Delete a CSS rule
CSSDefUtil.killCSSRule = function(ruleName) {
  return getCSSRule(ruleName, 'delete');
};

// Create a new css rule
CSSDefUtil.addCSSRule = function(ruleName) {
  if (document.styleSheets) {
    if (!getCSSRule(ruleName)) {
      if (document.styleSheets[0].addRule) {
        document.styleSheets[0].addRule(ruleName, null, 0); // add IE style
      } else {
        document.styleSheets[0].insertRule(ruleName + ' { }', 0); // add Moz style.
      }
    }
  }
  // return rule we just created.
  return getCSSRule(ruleName);
};

// lists css definitions for debugging purposes
CSSDefUtil.listCSSRules = function() {
  var listStr = '';
  if (document.styleSheets) {
    for (var i = 0; i < document.styleSheets.length; i++) {
      var styleSheet = document.styleSheets[i];
      listStr += '################# '+styleSheet.href;
      var ii = 0;
      var cssRule = null;
      // loop through each rule in stylesheet
      do {
        if (styleSheet) {
          if (styleSheet.cssRules != null) {
            cssRule = styleSheet.cssRules[ii];  // Mozilla Style
          } else if (styleSheet.rules != null) {
            cssRule = styleSheet.rules[ii]; // IE style.
          }
          // If we found a rule, see if it's the one we're looking for
          if (cssRule != null && typeof cssRule !== 'undefined') {
            if (typeof cssRule.selectorText !== 'undefined') {
              listStr += cssRule.selectorText + '\n';
            }
          }
        }
        ii++;
      }
      while (cssRule)
    }
  }
  return listStr;
};
