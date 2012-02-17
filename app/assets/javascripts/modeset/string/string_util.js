var StringUtil = StringUtil || {};

/* **************************************************************** */
/*  String manipulation methods                                     */
/* **************************************************************** */

/**
 *  Converts an underscored or dashed lowercase string to a traditional snake-cased class name format.
 *  @param  str The string to convert.
 *  @return A traditional class name formatted string.
 *  @use    {@code var klass = StringUtil.toClassName( 'class_name' );}
 */
StringUtil.toClassName = function(str) {
  var words = [];
  var arr = str.replace(/[_|\-]/gi, ' ').replace(/\s+/gi, ' ').split(' ');
  for (var i = 0; i < arr.length; i++) words.push(arr[i][0].toUpperCase() + arr[i].substr(1));
  return words.join('');
};

/**
 *  Escapes a limited set of common html characters: &amp;, &lt;, &gt;, &quot;.
 *  @param  str The string to escape.
 *  @return An html-escaped string.
 *  @use    {@code var escapedStr = StringUtil.escapeHTML( '<div>Hello & World</div>' );}
 */
StringUtil.escapeHTML = function(str) {
  return str.replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/igm,'&quot;');
};

/**
 *  Removes html tags from a string with markup.
 *  @param  str The string to strip.
 *  @return A string without html tags.
 *  @use    {@code var escapedStr = StringUtil.stripTags( '<div>Hello World</div>' );}
 */
StringUtil.stripTags = function(str) {
  if (str == null) { return ''; }
  return str.replace(/<\/?[^>]+>/igm,'');
};   

/**
 *  Capitalizes the first word in a string or all words.
 *  @param  str The input string.
 *  @param  all Optional boolean value indicating if we should capitalize all words or only the first.
 *  @return A formatted string.
 *  @use    {@code var capsStr = StringUtil.capitalize( 'these are some words.', true );}
 */
StringUtil.capitalize = function(str, all) {
  var str = StringUtil.trimLeft(str);
  if (all === true) {
    return str.replace(/^.|\s+(.)/g, StringUtil.upperCase);
  } else {
    return str.replace(/(^\w)/, StringUtil.upperCase); 
  }
};

/**
 *  Utility method to return an uppercase version of a string - used in StringUtil.capitalize()'s String.replace() call.
 *  @param  str The input string.
 *  @return The input string, capitalized.
 *  @use    {@code var uppercaseStr = StringUtil.upperCase( 'yes' );}
 */
StringUtil.upperCase = function(str) {
  return str.toUpperCase();
};

/**
 *  Pads str with specified character to a specified length from the left.
 *  @param  str     The source string.
 *  @param  char    Character to pad with.
 *  @param  length  Length to pad to.
 *  @return Padded string.
 *  @use    {@code var padded = StringUtil.padLeft( '10:10', '#', 7 );}
 */
StringUtil.padLeft = function(str, padChar, length) {
  var s = str;
  while (s.length < length) { s = padChar + s; }
  return s;
};

/**
 *  Pads str with specified character to a specified length from the right.
 *  @param  str     The source string.
 *  @param  char    Character to pad with.
 *  @param  length  Length to pad to.
 *  @return Padded string.
 *  @use    {@code var padded = StringUtil.padRight( '10:10', '#', 7 );}
 */
StringUtil.padRight = function(str, padChar, length) {
  var s = str;
  while (s.length < length) { s += padChar; }
  return s;
};

/**
 *  Removes whitespace from the front and the end of the input string.
 *  @param  str The source string.
 *  @return Trimmed string.
 *  @use    {@code var trimmed = StringUtil.trim( '   Oh hai.   ' );}
 */
StringUtil.trim = function(str) {
  if (str == null) { return ''; }
  return str.replace(/^\s+|\s+$/g, '');
};

/**
 *  Removes whitespace from the front of the specified string.
 *  @param  str The source string.
 *  @return Left-trimmed string.
 *  @use    {@code var trimmed = StringUtil.trimLeft( '   Oh hai.   ' );}
 */
StringUtil.trimLeft = function(str) {
  if (str == null) { return ''; }
  return str.replace(/^\s+/, '');
};

/**
 *  Removes whitespace from the end of the specified string.
 *  @param  str The source string.
 *  @return Right-trimmed string.
 *  @use    {@code var trimmed = StringUtil.trimRight( '   Oh hai.   ' );}
 */
StringUtil.trimRight = function(str) {
  if (str == null) { return ''; }
  return str.replace(/\s+$/, '');
};

/**
 *  Returns a string truncated to a specified length with optional suffix.
 *  @param  str     The source string.
 *  @param  len     The length the string should be shortend to, including the suffix.
 *  @param  suffix  The string to append to the end of the truncated string.
 *  @return Truncated string.
 *  @use    {@code var trimmed = StringUtil.truncate( 'This is a long sentence, kind of.' );}
 */
StringUtil.truncate = function(str, len, suffix) {
  len = len || -1;
  suffix = suffix || "&hellip;";
  if (str == null) { return ''; }
  if (len == -1) { len = str.length; }
  len -= suffix.length;
  var trunc = str;
  if (trunc.length > len) {
    trunc = trunc.substr(0, len);
    if (/[^\s]/.test(str.charAt(len))) {
      trunc = StringUtil.trimRight(trunc.replace(/\w+$|\s+$/, ''));
    }
    trunc += suffix;
  }
  return trunc;
};

/**
 *  Removes extraneous whitespace (extra spaces, tabs, line breaks, etc) from the specified string.
 *  @param  str The source string.
 *  @return String with whitespace removed.
 *  @use    {@code var cleaned = StringUtil.removeExtraWhitespace( '   Oh hai.   ' );}
 */
StringUtil.removeExtraWhitespace = function(str) {
  if (str == null) { return ''; }
  var str = StringUtil.trim(str);
  return str.replace(/\s+/g, ' ');
};

/**
 *  Removes all instances of the remove string in the input string.
 *  @param  str   The source string.
 *  @param  char  The string that will be removed from the input string.
 *  @param  caseSensitive A boolean flag to indicate whether the search is case sensitive.
 *  @return Edited string.
 *  @use    {@code var edited = StringUtil.remove( '1:2:3:4:5', ':', false );}
 */
StringUtil.remove = function(str, remove, caseSensitive) {
  if (str == null) { return ''; }
  var flags = (!caseSensitive) ? 'ig' : 'g';
  return str.replace(new RegExp(remove, flags), '');
};

/**
 *  Returns the specified string in reverse character order.
 *  @param  str The source string.
 *  @return A reversed string.
 *  @use    {@code var reversed = StringUtil.reverse( 'abcdefg' );}
 */
StringUtil.reverse = function(str) {
  if (str == null) { return ''; }
  return str.split('').reverse().join('');
};

/**
 *  Returns the specified string in reverse word order.
 *  @param  str The source string.
 *  @return A reversed-word string.
 *  @use    {@code var reversed = StringUtil.reverseWords( 'this is a string' );}
 */
StringUtil.reverseWords = function(str) {
  if (str == null) { return ''; }
  return str.split(/\s+/).reverse().join(' ');
};

/**
 *  Swaps the casing of a string.
 *  @param  str The source string.
 *  @return A string with swapped case
 *  @use    {@code var swappedCaseStr = StringUtil.swapCase( 'Oh hey' );}
 */
StringUtil.swapCase = function(str) {
  if (str == null) { return ''; }
  return str.replace(/(\w)/g, StringUtil.swapCharacterCase);
};

/**
 *  Swaps the casing of a single character.
 *  @param  str The source character.
 *  @return A string with swapped case
 *  @use    {@code var swappedCaseChar = StringUtil.swapCharacterCase( 'O' );}
 */
StringUtil.swapCharacterCase = function(char) {
  var lowChar = char.toLowerCase();
  var upChar = char.toUpperCase();
  switch (char) {
    case lowChar:
      return upChar;
    case upChar:
      return lowChar;
    default:
      return char;
  }
};

/**
 *  Replaces periods and spaces with dashes and underscores, respectively.
 *  @param  str The source string.
 *  @return A parameterized string.
 *  @use    {@code var paramString = StringUtil.parameterize( 'This could be a url' );}
 */
StringUtil.parameterize = function(str) {
  return str.toLowerCase().replace(/ /g, '-').replace(/\./g, '_');
};

/**
 *  Replaces dashes and spaces with underscores.
 *  @param  str The source string.
 *  @return An underscored string.
 *  @use    {@code var paramString = StringUtil.parameterize( 'This could be a url' );}
 */
StringUtil.underscore = function(str) {
  return str.toLowerCase().replace(/ /g, '_').replace(/-/g, '_');
};

/**
 *  Replaces quotes with underscores.
 *  @param  str The source string.
 *  @return An underscored string.
 *  @use    {@code var paramString = StringUtil.makeSafe( '"This could be a url"' );}
 */
StringUtil.makeSafe = function(str) {
  return str.replace(/"/g, '_').replace(/'/g, '_');
};

/* **************************************************************** */
/*  Substring retrieval methods                                     */
/* **************************************************************** */

/**
 *  Returns everything after the first occurrence of the provided character in the string.
 *  @param  str   The input string.
 *  @param  char  The character or sub-string.
 *  @return A substring of the first - everything after the first instance of the specified character.
 *  @use    {@code var afterStr = StringUtil.afterFirst( 'This is a sentence - broken by a hyphen.', ' - ');}
 */
StringUtil.afterFirst = function(str, char) {
  if (str == null) { return ''; }
  var idx = str.indexOf(char);
  if (idx == -1) { return ''; }
  idx += char.length;
  return str.substr(idx);
};

/**
 *  Returns everything after the last occurence of the provided character in str.
 *  @param  str   The input string.
 *  @param  char  The character or sub-string to split on.
 *  @return A substring of the input - everything after the last instance of the specified character.
 *  @use    {@code var afterStr = StringUtil.afterLast( 'This is a sentence - broken by a hyphen.', 'e');}
 */
StringUtil.afterLast = function(str, char) {
  if (str == null) { return ''; }
  var idx = str.lastIndexOf(char);
  if (idx == -1) { return ''; }
  idx += char.length;
  return str.substr(idx);
};

/**
 *  Returns everything before the first occurrence of the provided character in the string.
 *  @param  str   The input string.
 *  @param  char  The character or sub-string to split on.
 *  @return A substring of the input - everything before the first instance of the specified character.
 *  @use    {@code var beforeStr = StringUtil.beforeFirst( 'This is a sentence - broken by a hyphen.', 'a' );}
 */
StringUtil.beforeFirst = function(str, char) {
  if (str == null) { return ''; }
  var idx = str.indexOf(char);
  if (idx == -1) { return ''; }
  return str.substr(0, idx);
};

/**
 *  Returns everything before the last occurrence of the provided character in the string.
 *  @param  str   The input string.
 *  @param  char  The character or sub-string to split on.
 *  @return A substring of the input - everything before the last instance of the specified character.
 *  @use    {@code var beforeStr = StringUtil.beforeLast( 'This is a sentence - broken by a hyphen.', 'a' );}
 */
StringUtil.beforeLast = function(str, char) {
  if (str == null) { return ''; }
  var idx = str.lastIndexOf(char);
  if (idx == -1) { return ''; }
  return str.substr(0, idx);
};

/**
 *  Returns everything after the first occurance of start and before the first occurrence of end in str.
 *  @param  str   The input string.
 *  @param  start The character or sub-string to use as the start index.
 *  @param  end   The character or sub-string to use as the end index.
 *  @return A substring of the input - everything before the last instance of the specified character.
 *  @use    {@code var betweenStr = StringUtil.between( 'This is a sentence - broken by a hyphen.', 'This is', 'by' );}
 */
StringUtil.between = function(str, start, end) {
  if (str == null) { return str; }
  var startIdx = str.indexOf(start);
  if (startIdx != -1) {
    startIdx += start.length;
    var endIdx = str.indexOf(end, startIdx);
    if (endIdx != -1) { 
      str = str.substr(startIdx, endIdx-startIdx); 
    }
  }
  return str;
};

/* **************************************************************** */
/*  String analysis methods                                         */
/* **************************************************************** */

/**
 *  Determines whether the specified string begins with the specified prefix.
 *  @param  str   The string that the prefix will be checked against.
 *  @param  char  The prefix that will be tested against the string.
 *  @return A boolean.
 *  @use    {@code var afterStr = StringUtil.beginsWith('Supercalifragilistic', 'Super');}
 */
StringUtil.beginsWith = function(str, begin) {
  if (str == null) { return false; }
  return new RegExp("^"+begin).test(str);
};

/**
 *  Determines whether the specified string ends with the specified prefix.
 *  @param  str   The string that the suffix will be checked against.
 *  @param  char  The suffix that will be tested against the string.
 *  @return A boolean.
 *  @use    {@code var doesEndWithBro = StringUtil.endsWith('Cool story, bro', 'bro');}
 */
StringUtil.endsWith = function(str, end) {
  return new RegExp(end+"$").test(str);
};

/**
 *  Determines whether the specified string contains text.
 *  @param  str The string to check.
 *  @return A boolean.
 *  @use    {@code var hasText = StringUtil.hasText('this is text');}
 */
StringUtil.hasText = function(str) {
  var str = StringUtil.removeExtraWhitespace(str);
  return !!str.length;
};

/**
 *  Determines whether the specified string is an empty string.
 *  @param  str The string to check.
 *  @return A boolean.
 *  @use    {@code var isEmpty = StringUtil.isEmpty('this is text');}
 */
 StringUtil.isEmpty = function(str) {
  if (str == null || typeof str === 'undefined') { return true; }
  return !str.length;
};

/**
 *  Determines whether the specified string is numeric.
 *  @param  str The string to check.
 *  @return A boolean.
 *  @use    {@code var isNumeric = StringUtil.isNumeric('757');}
 */
StringUtil.isNumeric = function(str) {
 if (str == null) { return false; }
 var regx = /^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?$/;
 return regx.test(str);
};

/**
 *  Determines whether the specified string contains any instances of char.
 *  @param  str   The input string.
 *  @param  char  The character or sub-string we are looking for.
 *  @return Boolean contains flag.
 *  @use    {@code var doesContain = StringUtil.contains( 'these are some words.', 'words' );}
 */
StringUtil.contains = function(haystack, needle) {
  if (haystack == null) { return false; }
  return haystack.indexOf(needle) != -1;
};

/**
 *  Determines the number of times a charactor or sub-string appears within the string.
 *  @param  str   The input string.
 *  @param  char  The character or sub-string to count.
 *  @param  caseSensitive A boolean flag to indicate whether the search is case sensitive.
 *  @return Number of instances.
 *  @use    {@code var charCount = StringUtil.countOf( 'these are some words.', 'words', false );}
 */
StringUtil.countOf = function(haystack, needle, caseSensitive) {
  if (haystack == null || needle == null) { return 0; }
  var flags = (!caseSensitive) ? 'ig' : 'g';
  var regx = new RegExp(needle, flags);
  var result = haystack.match(regx);
  if(result) {
    return result.length;
  } else {
    return 0;
  }
};

/**
 *  Returns the number of words in a string.
 *  @param  str The source string.
 *  @return Number of words
 *  @use    {@code var wordCount = StringUtil.wordCount( 'this is a string' );}
 */
StringUtil.wordCount = function(str) {
  if (str == null) { return 0; }
  return str.match(/\b\w+\b/g).length;
};

/**
 *  Levenshtein distance (editDistance) is a measure of the similarity between two strings. The distance is the number of deletions, insertions, or substitutions required to transform source into target.
 *  @param  str   The source string.
 *  @param  char  The target string.
 *  @return Number of edits.
 *  @use    {@code var distance = StringUtil.editDistance( 'these are some words.', 'These Are Some Words.' );}
 */
StringUtil.editDistance = function(source, target) {
  var i;
  var j;

  if (source == null) { source = ''; }
  if (target == null) { target = ''; }

  if (source == target) { return 0; }

  var d = new Array();
  var cost;
  var n = source.length;
  var m = target.length;

  if (n == 0) { return m; }
  if (m == 0) { return n; }

  for (i=0; i<=n; i++) { d[i] = new Array(); }
  for (i=0; i<=n; i++) { d[i][0] = i; }
  for (j=0; j<=m; j++) { d[0][j] = j; }

  for (i=1; i<=n; i++) {

    var s_i = source.charAt(i-1);
    for (j=1; j<=m; j++) {

      var t_j = target.charAt(j-1);

      if (s_i == t_j) { cost = 0; }
      else { cost = 1; }

      d[i][j] = StringUtil.minimum(d[i-1][j]+1, d[i][j-1]+1, d[i-1][j-1]+cost);
    }
  }
  return d[n][m];
};

/**
 *  Determines the percentage of similiarity, based on StringUtil.editDistance().
 *  @param  source  The source string.
 *  @param  target  The target string.
 *  @return Percentage of similarity between the source and target strings.
 *  @use    {@code var similarity = StringUtil.similarity( 'this is a string', 'This is a String' );}
 */
StringUtil.similarity = function(source, target) {
  var ed = StringUtil.editDistance(source, target);
  var maxLen = Math.max(source.length, target.length);
  if (maxLen == 0) { return 100; }
  else { return (1 - ed/maxLen) * 100; }
};


/* **************************************************************** */
/*  Helper methods used by some of the above methods.   */
/* **************************************************************** */

/**
 *  Returns the minimum number out of 3
 *  @param  a  A number to compare.
 *  @param  b  A number to compare.
 *  @param  c  A number to compare.
 *  @return The minimum number of the 3 inputs
 *  @use    {@code var min = StringUtil.minimum(5, 10, 15);}
 */
StringUtil.minimum = function(a, b, c) {
  return Math.min(a, Math.min(b, Math.min(c,a)));
};




/* **************************************************************** */
/*  Are the following methods even useful? Untested for now         */
/* **************************************************************** */
/**
 *  Utility method that intelligently breaks up your string, allowing you to create blocks of readable text. This method returns you the closest possible match to the delim paramater, while keeping the text length within the len paramter. If a match can't be found in your specified length an  '...' is added to that block, and the blocking continues untill all the text is broken apart.
 *  @param  str   The string to break up.
 *  @param  len   Maximum length of each block of text.
 *  @param  delim Delimter to end text blocks on.
 *  @return An array of text chunks.
 *  @use    {@code var betweenStr = StringUtil.between( 'This is a sentence - broken by a hyphen.' );}
 */
StringUtil.block = function(str, len, delim) {
  delim = delim || '.';
  var arr = new Array();
  if (str == null || !StringUtil.contains(str, delim)) { return arr; }
  var chrIndex = 0;
  var strLen = str.length;
  while (chrIndex <  strLen) {
    var subString = str.substr(chrIndex, len);
    if (!StringUtil.contains(subString, delim)){
      arr.push(StringUtil.truncate(subString, subString.length));
      chrIndex += subString.length;
    }
    subString = subString.replace(new RegExp("[^"+delim+"]+$"), '');
    arr.push(subString);
    chrIndex += subString.length;
  }
  return arr;
};

StringUtil.quote = function(str) {
  var regx = new RegExp(/[\\"\r\n]/g);
  return '"'+ str.replace(regx, StringUtil._quote) +'"';
};

StringUtil._quote = function(str) {
  switch (str) {
    case "\\":
      return "\\\\";
    case "\r":
      return "\\r";
    case "\n":
      return "\\n";
    case '"':
      return '\\"';
    default:
      return '';
  }
};

StringUtil.escapePattern = function(pattern) {
  return pattern.replace(/(\]|\[|\{|\}|\(|\)|\*|\+|\?|\.|\\)/g, '\\$1');
};
