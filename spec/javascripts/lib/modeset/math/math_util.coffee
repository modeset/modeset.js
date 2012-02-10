describe 'MathUtil', ->

  num = null

  beforeEach ->

  afterEach ->

  describe 'MathUtil.randRange()', ->

    it 'Should return a random integer between min and max', ->
      min = 2
      max = 5
      randInt = MathUtil.randRange(min,max)
      expect(randInt).toBeLessThan(max + 1)
      expect(randInt).toBeGreaterThan(min - 1)
