
# ## Static class for tapping into the Brightcove API
class BrightcoveWrapper
  @registry ?= {}
  @isPlaying = false

  # Listen for the callbacks from the Brightcove API to handle events broadcast from individual players
  @onTemplateLoaded: (experienceID) ->
    player = brightcove.api.getExperience(experienceID)
    modVP = player.getModule(brightcove.api.modules.APIModules.VIDEO_PLAYER)
    modExp = player.getModule(brightcove.api.modules.APIModules.EXPERIENCE)
    modExp.addEventListener(brightcove.api.events.ExperienceEvent.TEMPLATE_READY, ->
      modVP.addEventListener(brightcove.api.events.MediaEvent.PLAY, (e) -> BrightcoveWrapper.isPlaying = true)
      modVP.addEventListener(brightcove.api.events.MediaEvent.STOP, (e) -> BrightcoveWrapper.isPlaying = false)
    )
    BrightcoveWrapper.register(experienceID, player, modVP)

  # Map players to an internal registry for access
  @register: (key, player, modVP) ->
    BrightcoveWrapper.registry[key] = {player, modVP}
    return BrightcoveWrapper.registry

  # Stops all players in their tracks
  @stopAllPlayers: ->
    _.each BrightcoveWrapper.registry, (video) ->
      video.modVP.getIsPlaying((value) ->
        if value then video.modVP.pause()
      )

new BrightcoveWrapper()

