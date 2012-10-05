class ImageCropDemo extends Demo

  constructor: (@el) ->
    @crop = null
    @crop_div = $("div.crop")

    @config =
      containerW: 200
      containerH: 200
      cropType: ImageCrop.CROP

    @prepContainers()
    @initCrop()

  prepContainers: ->
    $("div.crop").css
      position: "relative"
      overflow: "hidden"
      height: "400px"
      width: "400px"
      backgroundColor: "#333"
    $("div.crop img").css
      position: "absolute"


  initCrop: ->
    ImageUtil.getImageSizeWithCallback "/images/demo/haters.jpg", (w,h) =>
      @crop = new ImageCrop( @crop_div[0], @config.containerW, @config.containerH, w, h, @config.cropType )
      @setUpControls()

  setUpControls: ->
    super()

    containerW = @gui.add(@config, "containerW", 50, 400)
    containerW.listen()
    containerW.onChange (value) =>
      @crop_div.css
        width: value
      @crop.updateContainerSize @config.containerW, @config.containerH

    containerH = @gui.add(@config, "containerH", 50, 400)
    containerH.listen()
    containerH.onChange (value) =>
      @crop_div.css
        height: value
      @crop.updateContainerSize @config.containerW, @config.containerH

    cropType = @gui.add(@config, 'cropType', { CROP: ImageCrop.CROP, CROP_TOP: ImageCrop.CROP_TOP, CROP_BOTTOM: ImageCrop.CROP_BOTTOM, LETTERBOX: ImageCrop.LETTERBOX } );
    cropType.listen()
    cropType.onChange (value) =>
      @crop.setScaleType value


Bindable.register('image-crop-demo', ImageCropDemo)