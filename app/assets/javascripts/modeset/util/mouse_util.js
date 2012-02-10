function MouseUtil() {}

MouseUtil.getRelativeXFromEvent = function( $event, $relativeElement ){
    var curleft = $relativeElement.offsetLeft;
    while($relativeElement = $relativeElement.offsetParent) {
      curleft += $relativeElement.offsetLeft;
    }
    return $event.clientX - curleft;
}