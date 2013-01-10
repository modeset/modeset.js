class SoundSequenceDemo extends Demo

  constructor: (@el) ->
    @setUpSound()

  setUpTimer: ->
    @beat = 0
    setInterval =>
      @runTimer()
    , 100

  setUpSound: ->
    @soundsLoaded = 0
    @audioContext = new webkitAudioContext()
    @sound = new SoundPlayer('/sounds/hihat2.mp3', @audioContext, @audioLoaded)
    @sound2 = new SoundPlayer('/sounds/porta-note.mp3', @audioContext, @audioLoaded)
    @soundKick = new SoundPlayer('/sounds/kick.mp3', @audioContext, @audioLoaded)
    @soundSnare = new SoundPlayer('/sounds/snare.mp3', @audioContext, @audioLoaded)
    @soundCrunch = new SoundPlayer('/sounds/crunch-kick-verb.mp3', @audioContext, @audioLoaded)
    @soundFail = new SoundPlayer('/sounds/fail-low.mp3', @audioContext, @audioLoaded)



    $(document).on('touchend mouseup', (e) =>
      @sound.playSound()
    )

  audioLoaded: (file) =>
    console.log('loaded '+file)
    @soundsLoaded++

    if @soundsLoaded == 6
      @setUpTimer()

  runTimer: =>
    @beat++
    if @beat % 1 == 0
      if Math.random() > 0.25
        @sound.playSound()
    if @beat % 8 == 0 || @beat % 4 == 0
      if Math.random() > 0.25
        @soundKick.playSound()
    if @beat % 16 == 0
      @soundSnare.playSound()
    if @beat % 32 == 0
      @sound2.playSound()
    # console.log 'running'


Bindable.register('sound-sequence-demo', SoundSequenceDemo)