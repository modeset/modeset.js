class GetImageSizeDemo extends Demo

  constructor: (@el) ->
    imageInDom = $("div.demo_holder").find("img")[0]
    ImageUtil.getImageSizeWithCallback(imageInDom.src, (w, h) ->
      $(".status").html "Image: " + imageInDom.src + "<br/>Size: " + w + "," + h
    )

Bindable.register('get-image-size-demo', GetImageSizeDemo)