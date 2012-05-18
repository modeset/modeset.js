
#~
# Used with "sherpa" styleguides for augmenting behavior for navigation
# and component definitions. Include this file only in the styleguide page.

class Sherpa
  constructor: ->
    @initialize()

  initialize: ->
    @domLookup()
    @addListeners()
    @activateMain()

  domLookup: ->
    @anchor_list= $('.sherpa-anchor-nav li')
    @anchor_link = $('.sherpa-anchor-nav a')
    @wrapper_links = $('.sherpa-wrapper [href=#]')

  addListeners: ->
    @anchor_link.on 'click', @activateAnchors
    @wrapper_links.on 'click', @disableGuideAnchors

  # Add the activate class to the main nav item based on the id of the body
  activateMain: ->
    active = $('body').attr('id')
    main_nav = $('.sherpa-dox-nav li a')
    for item in main_nav
      link = $(item)
      text = link.html().toLowerCase()
      if text is active then link.parent('li').addClass('active')

  # Set the active state on anchors after click
  activateAnchors:(e) =>
    @anchor_list.removeClass('active')
    $(e.target).parent('li').addClass('active')

  # Disable `href="#"` within the guide
  disableGuideAnchors:(e) =>
    e.preventDefault()

# Get this party started
new Sherpa()

