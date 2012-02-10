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

  describe 'MathUtil.randRangeDecimel()', ->

    it 'Should return a random number between min and max', ->
      min = 2
      max = 5
      randFloat = MathUtil.randRangeDecimel(min,max)
      expect(randFloat).toBeLessThan(max + 1)
      expect(randFloat).toBeGreaterThan(min - 1)

  describe 'MathUtil.getPercentWithinRange()', ->

    it 'Should return a percentage, given a min, max and value for a numeric range', ->
      bottom = 100
      top = 500
      value = 300
      percent = MathUtil.getPercentWithinRange(bottom,top,value)
      expect(percent).toBe(0.5)

      

  describe 'MathUtil.getDistance()', ->

    it 'Should return a distance via pythagorean theorem, given two cartesian coordinates', ->
      dist = MathUtil.getDistance(10, 20, 50, 100)
      expect(dist).toBeCloseTo(89.4, 1)
