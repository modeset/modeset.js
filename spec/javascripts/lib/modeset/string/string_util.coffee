describe 'StringUtil', ->

  beforeEach ->

  afterEach ->

  describe 'toClassName()', ->
    it 'Should turn a normal filename into a snake-cased string to match a traditional class name format', ->
      expect(StringUtil.toClassName('class_name')).toBe('ClassName')
