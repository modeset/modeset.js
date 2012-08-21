describe 'MathUtil', ->

  beforeEach ->

  afterEach ->

  describe 'randRange()', ->
    it 'Should return a random integer between min and max', ->
      min = 2
      max = 5
      randInt = MathUtil.randRange(min,max)
      expect(randInt).toBeLessThan(max + 1)
      expect(randInt).toBeGreaterThan(min - 1)

  describe 'randRangeDecimel()', ->
    it 'Should return a random number between min and max', ->
      min = 2
      max = 5
      randFloat = MathUtil.randRangeDecimel(min,max)
      expect(randFloat).toBeLessThan(max + 1)
      expect(randFloat).toBeGreaterThan(min - 1)

  describe 'getPercentWithinRange()', ->
    it 'Should return a percentage, given a min, max and value for a numeric range', ->
      expect(MathUtil.getPercentWithinRange(100,500,300)).toBe(0.5)
      expect(MathUtil.getPercentWithinRange(-100,100,0)).toBe(0.5)

  describe 'roundToDecimal()', ->
    it 'Should return a number rounded to a specific number of decimal points', ->
      expect(MathUtil.roundToDecimal(10.333333,1)).toBe(10.3)
      expect(MathUtil.roundToDecimal(5,3)).toBe(5)
      expect(MathUtil.roundToDecimal(1.789,2)).toBe(1.79)

  describe 'easeTo()', ->
    it 'Should return a number that eases towards a target from a starting value', ->
      expect(MathUtil.easeTo(10,5,2)).toBe(7.5)

  describe 'degreesToRadians()', ->
    it 'Should return a value in radians from a value in degrees', ->
      expect(MathUtil.degreesToRadians(90)).toBe(Math.PI/2)
      expect(MathUtil.degreesToRadians(180)).toBe(Math.PI)

  describe 'radiansToDegrees()', ->
    it 'Should return a value in degrees from a value in radians', ->
      expect(MathUtil.radiansToDegrees(Math.PI/2)).toBe(90)
      expect(MathUtil.radiansToDegrees(Math.PI)).toBe(180)

  describe 'percentToDegrees()', ->
    it 'Should return a value in degrees from a percentage', ->
      expect(MathUtil.percentToDegrees(0.5)).toBe(180)
      expect(MathUtil.percentToDegrees(0.75)).toBe(270)
      expect(MathUtil.percentToDegrees(1)).toBe(360)

  describe 'degreesToPercent()', ->
    it 'Should return a value in percentage from degrees', ->
      expect(MathUtil.degreesToPercent(180)).toBe(0.5)
      expect(MathUtil.degreesToPercent(270)).toBe(0.75)
      expect(MathUtil.degreesToPercent(360)).toBe(1)

  describe 'sums()', ->
    it 'Should return the sum of an array of numbers', ->
      expect(MathUtil.sums([1,2,3,4,5,6,7,8,9])).toBe(45)

  describe 'average()', ->
    it 'Should return the average of an array of numbers', ->
      expect(MathUtil.average([1,2,3,4,5,6,7,8,9])).toBe(5)

  describe 'interp()', ->
    it 'Should return a value in between two numbers based on a pecentage between them', ->
      expect(MathUtil.interp(10,20,0.5)).toBe(15)

  describe 'remap()', ->
    it 'Should return the average of an array of numbers', ->
      expect(MathUtil.remap(50,0,100,200,300)).toBe(250)

  describe 'getDistance()', ->
    it 'Should return a distance via pythagorean theorem, given two cartesian coordinates', ->
      dist = MathUtil.getDistance(10, 20, 50, 100)
      expect(dist).toBeCloseTo(89.4, 1)

  describe 'constrainAngle()', ->
    it 'Should return a number between 0-360', ->
      expect(MathUtil.constrainAngle(0)).toBe(0)
      expect(MathUtil.constrainAngle(540)).toBe(180)
      expect(MathUtil.constrainAngle(720)).toBe(360)

  describe 'getAngleToTarget()', ->
    it 'Should return the angle from one cartesian coordinate to another', ->
      expect(MathUtil.getAngleToTarget(0, 0, 5, 5)).toBe(135)
      expect(MathUtil.getAngleToTarget(0, 0, 5, 0)).toBe(90)

  describe 'getRotationDirectionToTarget()', ->
    it 'Should return the direction of the shortest rotation to reach a destination angle', ->
      expect(MathUtil.getRotationDirectionToTarget(90,180)).toBe(1)
      expect(MathUtil.getRotationDirectionToTarget(90,0)).toBe(-1)
      expect(MathUtil.getRotationDirectionToTarget(270,5)).toBe(1)
      expect(MathUtil.getRotationDirectionToTarget(10,300)).toBe(-1)



