// polyfill for IE
// originally from: http://soledadpenades.com/2007/05/17/arrayindexof-in-internet-explorer/
if(!Array.indexOf){
  Array.prototype.indexOf = function(obj){
    for(var i=0; i<this.length; i++){
      if(this[i]==obj){
         return i;
      }
    }
    return -1;
  }
}