class SignatureDemo extends Demo

  constructor: (@el) ->
    @prepContainers()
    @initSignature()

  prepContainers: ->
    @signatureEl = $('canvas.signature')
    @savedImgHolder = $('.status')

    @signatureEl.attr('width', 400)
    @signatureEl.attr('height', 300)

  initSignature: ->
    @sig = new SignatureCanvas(@signatureEl[0], false)
    @setUpControls()

  saveImg: =>
    newImg = document.createElement('img')
    newImg.src = @sig.getImageData()
    @savedImgHolder.empty()
    @savedImgHolder.append newImg

  clearImg: =>
    @sig.clearCanvas()

  setUpControls: ->
    @config =
      mobileLocked: false
      saveImg: @saveImg
      clearImg: @clearImg

    super()

    @gui.add @config, "saveImg"
    @gui.add @config, "clearImg"

Bindable.register('signature-demo', SignatureDemo)