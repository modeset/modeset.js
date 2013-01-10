class GestureBowlingDemo extends Demo

  constructor: (@el) ->
    @gesture = new BowlingGesture(@bowlingRelease, @bowlingSwing)

    @startX = 140
    @startY = 280

    @prepContainers()
    @setUpControls()
    @setUpPhysics()
    @setUpTimer()
    @setUpSound()
    # $('.status').html 'yo bowling'

  prepContainers: ->
    @ball = $('.point')
    @status = $('.status')

    @ball.css
      width: "40px"
      height: '40px'
      background: "green"
      position: 'absolute'
      'border-radius': '20px'

    $('.pointholder').css
      position: 'relative'
      'margin-left': @startX
      'margin-top': @startY

    $('.demo_holder .container').css
      height: '300px'

  setUpControls: ->
    @config = 
      axisX: =>
        @setAxis Accelerometer.X_AXIS
      axisY: =>
        @setAxis Accelerometer.Y_AXIS
      axisZ: =>
        @setAxis Accelerometer.Z_AXIS

    super()

    @gui.add @config, "axisX"
    @gui.add @config, "axisY"
    @gui.add @config, "axisZ"

  setUpPhysics: ->
    @speedY = 0
    @speedX = 0

  setUpTimer: ->
    setInterval =>
      @runTimer()
    , 20

  setUpSound: ->
    @audioContext = null #new webkitAudioContext()
    @sound = new SoundPlayer('/sounds/8hit.mp3', @audioContext, @audioLoaded)
    @sound2 = new SoundPlayer('/sounds/porta-note.mp3', @audioContext, @audioLoaded)

    $(document).on('touchend mouseup', (e) =>
      @sound.playSound()
    )

  audioLoaded: (file) =>
    console.log('loaded '+file)

  bowlingSwing: (accelZ, tiltX) =>
    # if(accelZ > 10) 
    #   debug.log('RELEASE')
    # else if(accelZ < -30) 
    #   debug.log('BACKSWING')
    # debug.log('tiltX = '+Math.round(tiltX)+'   accelZ = '+Math.round(accelZ))
    # @ball.css('top',tiltX)

  bowlingRelease: (speed, rotationZ, underhand) =>
    debug.log('RELEASE = '+speed+'  '+rotationZ)
    @rotation = rotationZ / 10
    
    @x = 0
    @y = 0

    @speedY = -speed / 100
    @speedX = @rotation

    # $('.status').html 'RELEASE = '+speed+'  '+rotationZ+'  underhand = '+underhand

    if underhand
      @sound.playSound()
    else
      @sound2.playSound()

  runTimer: =>
    @x += @speedX
    @y += @speedY
    @ball.css('top',@y)
    @ball.css('left',@x)



Bindable.register('gesture-bowling-demo', GestureBowlingDemo)