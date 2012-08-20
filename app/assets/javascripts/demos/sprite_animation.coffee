class SpriteAnimationDemo

  constructor: (@el) ->
    @anim = null
    @anim_holder = $("div.image_holder")
    @anim_sprite = @anim_holder.find("img")
    @anim_w = 50
    @anim_h = 50

    @config =
      framerate: 1000/33

    @prepContainers()
    @initAnimation()

  prepContainers: ->
    @anim_holder.css
      position: "relative"
      overflow: "hidden"
      width: "50px"
      height: "50px"

    @anim_sprite.css
      position: "absolute"
      width: "400px"
      height: "50px"

  initAnimation: ->
    @anim = new SpriteAnimation( @anim_w, @anim_h, @anim_holder[0], @anim_sprite[0], 8, @config.framerate )
    @anim.start()
    @setUpControls()

  setUpControls: ->
    _gui = new dat.GUI(autoPlace: false)
    document.getElementsByClassName("controls_ui")[0].appendChild _gui.domElement
    $(".controls_ui .close-button").remove()

    fpsVal = _gui.add(@config, "framerate", 2, 60)
    fpsVal.listen()
    fpsVal.onChange (value) =>
      @anim.setFramerate 1000/value


Bindable.register('sprite-animation-demo', SpriteAnimationDemo)