describe 'PathUtil', ->

  beforeEach ->
    window.location.href = window.location.href.split('#')[0] + '#'
    window.location.href += "?foo=111&bar=test"

  afterEach ->

  describe 'getUrlVars()', ->
    it 'Should convert url query params into a hash', ->
      expect(PathUtil.getUrlVars().length).toBe(2)
  
  describe 'getUrlVar()', ->
    it 'Should convert url query params into a hash', ->
      expect(PathUtil.getUrlVar('bar')).toBe('test')
