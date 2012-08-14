describe 'TouchScroller', ->

  beforeEach ->

  afterEach ->

  describe 'formatPhone()', ->
    it 'Should turn most any phone number string into a standardized phone number string', ->
      expect(Formatter.formatPhone(3035558888)).toBe('(303) 555-8888')
      expect(Formatter.formatPhone('(303)-555-8888')).toBe('(303) 555-8888')
      expect(Formatter.formatPhone('303.555.8888')).toBe('(303) 555-8888')
