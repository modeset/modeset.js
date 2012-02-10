function StringUtil(){}

StringUtil.toClassName = function(str) {
  var words = [];
  var arr = str.replace(/[_|\-]/gi, ' ').replace(/\s+/gi, ' ').split(' ');
  for (var i = 0; i < arr.length; i++) words.push(arr[i][0].toUpperCase() + arr[i].substr(1));
  return words.join('');
};

StringUtil.escapeHTML = function(str) {
  return str.replace(/&/g,'&amp;').replace(/>/g,'&gt;').replace(/</g,'&lt;').replace(/"/igm,'&quot;');
};

StringUtil.stripTags = function(str) {
  return str.replace(/<\/?[^>]+>/igm,'');
};

StringUtil.convertTime = function( milliSeconds ) {
   var secs = Math.floor(milliSeconds/1000);
   var mins = Math.floor(secs/60);
   secs %= 60;
   
   var secsStr = secs + '';
   var minsStr = mins + '';
   
   if ( secs < 10 ) secsStr = "0"+secs; 
   if ( mins < 10)  minsStr = "0"+mins;
   
   // don't return if NaN
   if( minsStr == 'NaN' || secsStr == 'NaN' ) {
     return( '' );
   } else {
     return( minsStr + ":" + secsStr );
   }
};
   
   
   

/**
*	Returns everything after the first occurrence of the provided character in the string.
*
*	@param p_string The string.
*
*	@param p_begin The character or sub-string.
*
*	@returns String
*
*	@tiptext
*/
StringUtil.afterFirst = function(p_string, p_char) {
	if (p_string == null) { return ''; }
	var idx = p_string.indexOf(p_char);
	if (idx == -1) { return ''; }
	idx += p_char.length;
	return p_string.substr(idx);
};

/**
*	Returns everything after the last occurence of the provided character in p_string.
*
*	@param p_string The string.
*
*	@param p_char The character or sub-string.
*
*	@returns String
*
*	@tiptext
*/
StringUtil.afterLast = function(p_string, p_char) {
	if (p_string == null) { return ''; }
	var idx = p_string.lastIndexOf(p_char);
	if (idx == -1) { return ''; }
	idx += p_char.length;
	return p_string.substr(idx);
};

/**
*	Determines whether the specified string begins with the specified prefix.
*
*	@param p_string The string that the prefix will be checked against.
*
*	@param p_begin The prefix that will be tested against the string.
*
*	@returns Boolean
*
*	@tiptext
*/
StringUtil.beginsWith = function(p_string, p_begin) {
	if (p_string == null) { return false; }
	return new RegExp("^"+p_begin).test(p_string);
};

/**
*	Returns everything before the first occurrence of the provided character in the string.
*
*	@param p_string The string.
*
*	@param p_begin The character or sub-string.
*
*	@returns String
*
*	@tiptext
*/
StringUtil.beforeFirst = function(p_string, p_char) {
	if (p_string == null) { return ''; }
	var idx = p_string.indexOf(p_char);
 	if (idx == -1) { return ''; }
 	return p_string.substr(0, idx);
};

/**
*	Returns everything before the last occurrence of the provided character in the string.
*
*	@param p_string The string.
*
*	@param p_begin The character or sub-string.
*
*	@returns String
*
*	@tiptext
*/
StringUtil.beforeLast = function(p_string, p_char) {
	if (p_string == null) { return ''; }
	var idx = p_string.lastIndexOf(p_char);
 	if (idx == -1) { return ''; }
 	return p_string.substr(0, idx);
};

/**
*	Returns everything after the first occurance of p_start and before
*	the first occurrence of p_end in p_string.
*
*	@param p_string The string.
*
*	@param p_start The character or sub-string to use as the start index.
*
*	@param p_end The character or sub-string to use as the end index.
*
*	@returns String
*
*	@tiptext
*/
StringUtil.between = function(p_string, p_start, p_end) {
	var str = '';
	if (p_string == null) { return str; }
	var startIdx = p_string.indexOf(p_start);
	if (startIdx != -1) {
		startIdx += p_start.length; // RM: should we support multiple chars? (or ++startIdx);
		var endIdx = p_string.indexOf(p_end, startIdx);
		if (endIdx != -1) { str = p_string.substr(startIdx, endIdx-startIdx); }
	}
	return str;
};

/**
*	Description, Utility method that intelligently breaks up your string,
*	allowing you to create blocks of readable text.
*	This method returns you the closest possible match to the p_delim paramater,
*	while keeping the text length within the p_len paramter.
*	If a match can't be found in your specified length an  '...' is added to that block,
*	and the blocking continues untill all the text is broken apart.
*
*	@param p_string The string to break up.
*
*	@param p_len Maximum length of each block of text.
*
*	@param p_delim delimter to end text blocks on
*
*	@returns Array
*
*	@tiptext
*/
StringUtil.block = function(p_string, p_len, p_delim) {
  p_delim = p_delim || '.';
	var arr = new Array();
	if (p_string == null || !contains(p_string, p_delim)) { return arr; }
	var chrIndex = 0;
	var strLen = p_string.length;
	while (chrIndex <  strLen) {
		var subString = p_string.substr(chrIndex, p_len);
		if (!contains(subString, p_delim)){
			arr.push(truncate(subString, subString.length));
			chrIndex += subString.length;
		}
		subString = subString.replace(new RegExp("[^"+p_delim+"]+$"), '');
		arr.push(subString);
		chrIndex += subString.length;
	}
	return arr;
};

/**
*	Capitallizes the first word in a string or all words..
*
*	@param p_string The string.
*
*	@param p_all (optional) Boolean value indicating if we should
*	capitalize all words or only the first.
*
*	@returns String
*
*	@tiptext
*/
StringUtil.capitalize = function(p_string, p_all) {
	var str = StringUtil.trimLeft(p_string);
	if (p_all === true) { return str.replace(/^.|\s+(.)/, StringUtil._upperCase);}
	else { return str.replace(/(^\w)/, StringUtil._upperCase); }
};

/**
*	Determines whether the specified string contains any instances of p_char.
*
*	@param p_string The string.
*
*	@param p_char The character or sub-string we are looking for.
*
*	@returns Boolean
*
*	@tiptext
*/
StringUtil.contains = function(p_string, p_char) {
	if (p_string == null) { return false; }
	return p_string.indexOf(p_char) != -1;
};

/**
*	Determines the number of times a charactor or sub-string appears within the string.
*
*	@param p_string The string.
*
*	@param p_char The character or sub-string to count.
*
*	@param p_caseSensitive A boolean flag to indicate if the search is case sensitive.
*
*	@returns uint
*
*	@tiptext
*/
StringUtil.countOf = function(p_string, p_char, p_caseSensitive) {
	if (p_string == null) { return 0; }
	var char = StringUtil.escapePattern(p_char);
	var flags = (!p_caseSensitive) ? 'ig' : 'g';
	return p_string.match(new RegExp(char, flags)).length;
};

/**
*	Levenshtein distance (editDistance) is a measure of the similarity between two strings,
*	The distance is the number of deletions, insertions, or substitutions required to
*	transform p_source into p_target.
*
*	@param p_source The source string.
*
*	@param p_target The target string.
*
*	@returns uint
*
*	@tiptext
*/
StringUtil.editDistance = function(p_source, p_target) {
	var i;
	var j;

	if (p_source == null) { p_source = ''; }
	if (p_target == null) { p_target = ''; }

	if (p_source == p_target) { return 0; }

	var d = new Array();
	var cost;
	var n = p_source.length;
	var m = p_target.length;

	if (n == 0) { return m; }
	if (m == 0) { return n; }

	for (i=0; i<=n; i++) { d[i] = new Array(); }
	for (i=0; i<=n; i++) { d[i][0] = i; }
	for (j=0; j<=m; j++) { d[0][j] = j; }

	for (i=1; i<=n; i++) {

		var s_i = p_source.charAt(i-1);
		for (j=1; j<=m; j++) {

			var t_j = p_target.charAt(j-1);

			if (s_i == t_j) { cost = 0; }
			else { cost = 1; }

			d[i][j] = StringUtil._minimum(d[i-1][j]+1, d[i][j-1]+1, d[i-1][j-1]+cost);
		}
	}
	return d[n][m];
};

/**
*	Determines whether the specified string ends with the specified suffix.
*
*	@param p_string The string that the suffic will be checked against.
*
*	@param p_end The suffix that will be tested against the string.
*
*	@returns Boolean
*
*	@tiptext
*/
StringUtil.endsWith = function(p_string, p_end) {
	return new RegExp(p_end+"$").test(p_string);
};

/**
*	Determines whether the specified string contains text.
*
*	@param p_string The string to check.
*
*	@returns Boolean
*
*	@tiptext
*/
StringUtil.hasText = function(p_string) {
	var str = removeExtraWhitespace(p_string);
	return !!str.length;
};

/**
*	Determines whether the specified string contains any characters.
*
*	@param p_string The string to check
*
*	@returns Boolean
*
*	@tiptext
*/
StringUtil.isEmpty = function(p_string) {
	if (p_string == null || typeof p_string === 'undefined') { return true; }
	return !p_string.length;
};

/**
*	Determines whether the specified string is numeric.
*
*	@param p_string The string.
*
*	@returns Boolean
*
*	@tiptext
*/
StringUtil.isNumeric = function(p_string) {
	if (p_string == null) { return false; }
	var regx:RegExp = /^[-+]?\d*\.?\d+(?:[eE][-+]?\d+)?$/;
	return regx.test(p_string);
};

/**
* Pads p_string with specified character to a specified length from the left.
*
*	@param p_string String to pad
*
*	@param p_padChar Character for pad.
*
*	@param p_length Length to pad to.
*
*	@returns String
*
*	@tiptext
*/
StringUtil.padLeft = function(p_string, p_padChar, p_length) {
	var s = p_string;
	while (s.length < p_length) { s = p_padChar + s; }
	return s;
};

/**
* Pads p_string with specified character to a specified length from the right.
*
*	@param p_string String to pad
*
*	@param p_padChar Character for pad.
*
*	@param p_length Length to pad to.
*
*	@returns String
*
*	@tiptext
*/
StringUtil.padRight = function(p_string, p_padChar, p_length) {
	var s = p_string;
	while (s.length < p_length) { s += p_padChar; }
	return s;
};

/**
*	Removes all instances of the remove string in the input string.
*
*	@param p_string The string that will be checked for instances of remove
*	string
*
*	@param p_remove The string that will be removed from the input string.
*
*	@param p_caseSensitive An optional boolean indicating if the replace is case sensitive. Default is true.
*
*	@returns String
*
*	@tiptext
*/
StringUtil.remove = function(p_string, p_remove, p_caseSensitive) {
	if (p_string == null) { return ''; }
	var rem = StringUtil.escapePattern(p_remove);
	var flags = (!p_caseSensitive) ? 'ig' : 'g';
	return p_string.replace(new RegExp(rem, flags), '');
};

/**
*	Removes extraneous whitespace (extra spaces, tabs, line breaks, etc) from the
*	specified string.
*
*	@param p_string The String whose extraneous whitespace will be removed.
*
*	@returns String
*
*	@tiptext
*/
StringUtil.removeExtraWhitespace = function(p_string) {
	if (p_string == null) { return ''; }
	var str = StringUtil.trim(p_string);
	return str.replace(/\s+/g, ' ');
};

/**
*	Returns the specified string in reverse character order.
*
*	@param p_string The String that will be reversed.
*
*	@returns String
*
*	@tiptext
*/
StringUtil.reverse = function(p_string) {
	if (p_string == null) { return ''; }
	return p_string.split('').reverse().join('');
};

/**
*	Returns the specified string in reverse word order.
*
*	@param p_string The String that will be reversed.
*
*	@returns String
*
*	@tiptext
*/
StringUtil.reverseWords = function(p_string) {
	if (p_string == null) { return ''; }
	return p_string.split(/\s+/).reverse().join('');
};

/**
*	Determines the percentage of similiarity, based on editDistance
*
*	@param p_source The source string.
*
*	@param p_target The target string.
*
*	@returns Number
*
*	@tiptext
*/
StringUtil.similarity = function(p_source, p_target) {
	var ed = editDistance(p_source, p_target);
	var maxLen = Math.max(p_source.length, p_target.length);
	if (maxLen == 0) { return 100; }
	else { return (1 - ed/maxLen) * 100; }
};

/**
* Escapes all of the characters in a string to create a friendly "quotable" sting
*
* @param p_string The string that will be checked for instances of remove
* string
*
* @returns String
*
* @tiptext
*/
StringUtil.quote = function(p_string) {
  var regx = new RegExp(/[\\"\r\n]/g);
  return '"'+ p_string.replace(regx, StringUtil._quote) +'"';
};

/**
*	Remove's all < and > based tags from a string
*
*	@param p_string The source string.
*
*	@returns String
*
*	@tiptext
*/
StringUtil.stripTags = function(p_string) {
	if (p_string == null) { return ''; }
	return p_string.replace(/<\/?[^>]+>/igm, '');
};


/**
*	Removes whitespace from the front and the end of the specified
*	string.
*
*	@param p_string The String whose beginning and ending whitespace will
*	will be removed.
*
*	@returns String
*
*	@tiptext
*/
StringUtil.trim = function(p_string) {
	if (p_string == null) { return ''; }
	return p_string.replace(/^\s+|\s+$/g, '');
};

/**
* Swaps the casing of a string.
*
* @param p_string The source string.
*
* @returns String
*
* @tiptext
*/
StringUtil.swapCase = function(p_string:String):String {
  if (p_string == null) { return ''; }
  return p_string.replace(/(\w)/, StringUtil._swapCase);
};

/**
*	Removes whitespace from the front (left-side) of the specified string.
*
*	@param p_string The String whose beginning whitespace will be removed.
*
*	@returns String
*
*	@tiptext
*/
StringUtil.trimLeft = function(p_string) {
	if (p_string == null) { return ''; }
	return p_string.replace(/^\s+/, '');
};

/**
*	Removes whitespace from the end (right-side) of the specified string.
*
*	@param p_string The String whose ending whitespace will be removed.
*
*	@returns String	.
*
*	@tiptext
*/
StringUtil.trimRight = function(p_string) {
	if (p_string == null) { return ''; }
	return p_string.replace(/\s+$/, '');
};

/**
*	Determins the number of words in a string.
*
*	@param p_string The string.
*
*	@returns uint
*
*	@tiptext
*/
StringUtil.wordCount = function(p_string) {
	if (p_string == null) { return 0; }
	return p_string.match(/\b\w+\b/g).length;
};

/**
*	Returns a string truncated to a specified length with optional suffix
*
*	@param p_string The string.
*
*	@param p_len The length the string should be shortend to
*
*	@param p_suffix The string to append to the end of the truncated string.
*
*	@returns String
*
*	@tiptext
*/
StringUtil.truncate = function(p_string, p_len = -1, p_suffix) {
  p_suffix = p_suffix || "...";
	if (p_string == null) { return ''; }
	if (p_len == -1) { p_len = p_string.length; }
	p_len -= p_suffix.length;
	var trunc = p_string;
	if (trunc.length > p_len) {
		trunc = trunc.substr(0, p_len);
		if (/[^\s]/.test(p_string.charAt(p_len))) {
			trunc = StringUtil.trimRight(trunc.replace(/\w+$|\s+$/, ''));
		}
		trunc += p_suffix;
	}

	return trunc;
};

/* **************************************************************** */
/*	These are helper methods used by some of the above methods.		*/
/* **************************************************************** */
StringUtil.escapePattern = function(p_pattern) {
	return p_pattern.replace(/(\]|\[|\{|\}|\(|\)|\*|\+|\?|\.|\\)/g, '\\$1');
};

StringUtil._minimum = function(a, b, c) {
	return Math.min(a, Math.min(b, Math.min(c,a)));
};

StringUtil._quote = function(p_string) {
	switch (p_string) {
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

StringUtil._upperCase = function(p_char) {
	return p_char.toUpperCase();
};

StringUtil._swapCase = function(p_char) {
	var lowChar = p_char.toLowerCase();
	var upChar = p_char.toUpperCase();
	switch (p_char) {
		case lowChar:
			return upChar;
		case upChar:
			return lowChar;
		default:
			return p_char;
	}
};