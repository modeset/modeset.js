var Formatter = Formatter || {};

/**
 *  Returns a standardized phone number string.
 *  @param  str An unformatted phone number.
 *  @return A standardized phone number string.
 *  @use    {@code var phone = Formatter.formatPhone('3035558888');}
 */
Formatter.formatPhone = function(str) {
  return (str + '').replace(/[() -]*(?:\d?)[() -.]*(\d{3})[() -.]*(\d{3})[() -.]*(\d{4})[() -]*/, '($1) $2-$3');
};

/**
 *  Returns a standardized social security number string.
 *  @param  str An unformatted social security number.
 *  @return A standardized social security number string.
 *  @use    {@code var ssn = Formatter.formatSSN('333002222');}
 */
Formatter.formatSSN = function(str) {
  return (str + '').replace(/(\d{3})[ -]*(\d{2})[ -]*(\d{4})/, '$1-$2-$3');
};

/**
 *  Returns a standardized credit card number string.
 *  @param  str An unformatted credit card number.
 *  @return A standardized credit card number string.
 *  @use    {@code var cc = Formatter.formatCreditCard('1111-2222-3333-4444');}
 */
Formatter.formatCreditCard = function(str) {
  return (str + '').replace(/(\d{4})[ -]*(\d{4})[ -]*(\d{4})[ -]*(\d{4})/, '$1 $2 $3 $4');
};

/**
 *  Returns a number, removing non-numeric characters.
 *  @param  str A number, without too much extra non-numeric junk in there.
 *  @return A number (in string format), stripped of non-numeric characters.
 *  @use    {@code var number = Formatter.formatNumber('$303.33');}
 */
Formatter.formatNumber = function(str) {
  float = str.match(/\d+\.?\d+/);
  if (float && float.length > 0) {
    return float[0];
  } else {
    return str;
  }
};

/**
 *  Returns a number with the traditional US currency format.
 *  @param  str A numberic monetary value.
 *  @return A number (in string format), with traditional US currency formatting.
 *  @use    {@code var moneyVal = Formatter.formatDollarsCents('303.333333');}
 */
Formatter.formatDollarsCents = function(str) {
  var numParts;
  numParts = (str + '').split('.');
  if (numParts.length === 1) {
    numParts.push('00');
  } else {
    while (numParts[1].length < 2) {
      numParts[1] += '0';
    }
    numParts[1] = numParts[1].substr(0, 2);
  }
  return numParts.join('.');
};

/**
 *  Returns a string, formatted with commas in between every 3 numbers.
 *  @param  str A number.
 *  @return A formatted number (in string format).
 *  @use    {@code var formattedNumber = Formatter.addCommasToNumber('3000000');}
 */
Formatter.addCommasToNumber = function(str) {
  x = (str + '').split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
};

/**
 *  Returns a time as a string.
 *  @param  milliSeconds  A number of milliseconds.
 *  @return A formatted time.
 *  @use    {@code var time = Formatter.timeFromMilliseconds('3000000');}
 */
Formatter.timeFromMilliseconds = function(milliSeconds) {
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
 *  Returns a time as a string, with or without hours.
 *  @param  seconds   A number of seconds.
 *  @param  showHours Boolean flag for showing hours or not.
 *  @return A formatted time.
 *  @use    {@code var time = Formatter.timeFromMilliseconds('3000000');}
 */
Formatter.timeFromSeconds = function(seconds, showHours) {
  var h = Math.floor(seconds / 3600);
  var m = Math.floor(seconds % 3600 / 60);
  var s = Math.floor(seconds % 3600 % 60);
  var hStr = (h < 10 ? "0" : "") + h;
  var mStr = (m < 10 ? "0" : "") + m;
  var sStr = (s < 10 ? "0" : "") + s;
  if(showHours == true) {
    return hStr + ':' + mStr + ':' +sStr;
  } else {
    return mStr + ':' +sStr;
  }
};
