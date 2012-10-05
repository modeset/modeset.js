class ImageCropRawDemo extends Demo

  constructor: (@el) ->
    @crop = null
    @crop_div = $("div.crop")
    @crop_img = $("div.crop img")

    @config =
      containerW: 200
      containerH: 200
      cropType: ImageUtil.CROP

    @imageOrigW = 1
    @imageOrigH = 1

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
    # get original image size for cropping maths
    ImageUtil.getImageSizeWithCallback "/images/demo/haters.jpg", (w,h) =>
      @imageOrigW = w
      @imageOrigH = h
      @setUpControls()
      @runCrop()

  runCrop: ->
    ImageUtil.cropImage( @crop_div[0], @config.containerW, @config.containerH, @crop_img[0], @imageOrigW, @imageOrigH, @config.cropType )

  setUpControls: ->
    super()

    containerW = @gui.add(@config, "containerW", 50, 400)
    containerW.listen()
    containerW.onChange (value) =>
      @crop_div.css
        width: value
      @runCrop()

    containerH = @gui.add(@config, "containerH", 50, 400)
    containerH.listen()
    containerH.onChange (value) =>
      @crop_div.css
        height: value
      @runCrop()

    cropType = @gui.add(@config, 'cropType', { CROP: ImageUtil.CROP, CROP_TOP: ImageUtil.CROP_TOP, CROP_BOTTOM: ImageUtil.CROP_BOTTOM, LETTERBOX: ImageUtil.LETTERBOX } );
    cropType.listen()
    cropType.onChange (value) =>
      @runCrop()


Bindable.register('image-crop-raw-demo', ImageCropRawDemo)