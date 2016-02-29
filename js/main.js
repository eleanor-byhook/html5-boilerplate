'use strict'

var canvas = document.getElementById('canvas');


//can check for support by doing..
if(canvas.getContext) {
  var context = canvas.getContext('2d'); //specifies that we want a 2d context for rendering
} else {
  //stuff for when the canvas isn't supported
}




