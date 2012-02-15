class Formatter
  
  @formatValue: (string, format) ->
    switch format
      when 'phone'        then string.replace /[() -]*(?:\d?)[() -]*(\d{3})[() -]*(\d{3})[() -]*(\d{4})[() -]*/, '($1) $2-$3'
      when 'ssn'          then string.replace /(\d{3})[ -]*(\d{2})[ -]*(\d{4})/, '$1-$2-$3'
      when 'credit_card'  then string.replace /(\d{4})[ -]*(\d{4})[ -]*(\d{4})[ -]*(\d{4})/, '$1 $2 $3 $4'
      when 'number'
        float = string.match(/\d+\.?\d+/)
        if float && float.length > 0 
          return float[0]
        else 
          return string
      else string
    
  @formatDollarsCents: (value) ->
    numParts = (value+'').split('.')
    if numParts.length == 1
      numParts.push '00'
    else
      while numParts[1].length < 2
        numParts[1] += '0'
      numParts[1] = numParts[1].substr(0,2)
    numParts.join '.'

  @roundToDecimal: (num,numPoints=2) ->
    Math.round( num * Math.pow(10,numPoints) ) / Math.pow(10,numPoints)
    
  @timeFormattedNicely: (rawDate)=>
    date = moment(rawDate)
    date.format("ddd").toUpperCase() + ', ' + date.format("MMM Do YYYY, h:mm a")

      // formats a number with commas
  var addCommas = function(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }

  /**
 *  Removes html tags from a string with markup.
 *  @param  str The string to strip.
 *  @return A string without html tags.
 *  @use    {@code var escapedStr = StringUtil.stripTags( '<div>Hello World</div>' );}
 */
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

  // formats a number of seconds to a nice string
  var formatDuration = function( seconds ) {
    var h = Math.floor(seconds / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 3600 % 60);
    var hStr = (h < 10 ? "0" : "") + h;
    var mStr = (m < 10 ? "0" : "") + m;
    var sStr = (s < 10 ? "0" : "") + s;
    return hStr + ':' + mStr + ':' +sStr;
  }

@Formatter = Formatter