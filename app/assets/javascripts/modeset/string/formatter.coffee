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

@Formatter = Formatter