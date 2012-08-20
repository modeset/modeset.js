class window.Demo
  
  setUpControls: ->
    @gui = new dat.GUI(autoPlace: false)
    document.getElementsByClassName("controls_ui")[0].appendChild @gui.domElement
    $(".controls_ui .close-button").remove()
