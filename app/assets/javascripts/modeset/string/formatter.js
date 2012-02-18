var Formatter = Formatter || {};

Formatter.formatPhone = function(str) {
  return str.replace(/[() -]*(?:\d?)[() -.]*(\d{3})[() -.]*(\d{3})[() -.]*(\d{4})[() -]*/, '($1) $2-$3');
};

Formatter.formatSSN = function(str) {
  return str.replace(/(\d{3})[ -]*(\d{2})[ -]*(\d{4})/, '$1-$2-$3');
};

Formatter.formatCreditCard = function(str) {
  return str.replace(/(\d{4})[ -]*(\d{4})[ -]*(\d{4})[ -]*(\d{4})/, '$1 $2 $3 $4');
};

Formatter.formatNumber = function(str) {
  float = str.match(/\d+\.?\d+/);
  if (float && float.length > 0) {
    return float[0];
  } else {
    return str;
  }
};

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

Formatter.addCommasToNumber = function(str) {
  str += '';
  x = str.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
};

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
