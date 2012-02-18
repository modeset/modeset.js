describe 'Formatter', ->

  beforeEach ->

  afterEach ->

  describe 'formatPhone()', ->
    it 'Should turn most any phone number string into a standardized phone number string', ->
      expect(Formatter.formatPhone(3035558888)).toBe('(303) 555-8888')
      expect(Formatter.formatPhone('(303)-555-8888')).toBe('(303) 555-8888')
      expect(Formatter.formatPhone('303.555.8888')).toBe('(303) 555-8888')
  
  describe 'formatSSN()', ->
    it 'Should turn a 9-digit number into a SSN-formatted string', ->
      expect(Formatter.formatSSN('333002222')).toBe('333-00-2222')
  
  describe 'formatCreditCard()', ->
    it 'Should turn a 16-digit number into a nice credit card formatted string', ->
      expect(Formatter.formatCreditCard('1111222233334444')).toBe('1111 2222 3333 4444')
      expect(Formatter.formatCreditCard('1111-2222-3333-4444')).toBe('1111 2222 3333 4444')
  
  describe 'formatNumber()', ->
    it 'Should return a number from a string that may contain non-numeric characters', ->
      expect(Formatter.formatNumber('303.333f')).toBe('303.333')
      expect(Formatter.formatNumber('$303.33')).toBe('303.33')
  
  describe 'formatDollarsCents()', ->
    it 'Should return a string formatted like a US currency value', ->
      expect(Formatter.formatDollarsCents('555.5555')).toBe('555.55')
      expect(Formatter.formatDollarsCents('555')).toBe('555.00')
  
  describe 'addCommasToNumber()', ->
    it 'Should return a number as a string, formatted with commas in between every 3 digits, like we do in \'merica', ->
      expect(Formatter.addCommasToNumber('3000000.00')).toBe('3,000,000.00')
      expect(Formatter.addCommasToNumber('1000')).toBe('1,000')
      expect(Formatter.addCommasToNumber('30')).toBe('30')
  
  describe 'timeFromMilliseconds()', ->
    it 'Should return a nicely formatted time from milliseconds input', ->
      expect(Formatter.timeFromMilliseconds('1000')).toBe('00:01')
      expect(Formatter.timeFromMilliseconds('302030')).toBe('05:02')
  
  describe 'timeFromSeconds()', ->
    it 'Should return a nicely formatted time from seconds input, with hours', ->
      expect(Formatter.timeFromSeconds('1', true)).toBe('00:00:01')
      expect(Formatter.timeFromSeconds('302')).toBe('05:02')
  
