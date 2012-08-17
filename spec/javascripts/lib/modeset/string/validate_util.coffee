describe 'ValidateUtil', ->

  beforeEach ->

  afterEach ->

  describe 'isValidEmail()', ->
    it 'Should return true if a valid email', ->
      expect(ValidateUtil.isValidEmail('test@example.com')).toBe(true)
      expect(ValidateUtil.isValidEmail('test+test@example.com')).toBe(true)
      expect(ValidateUtil.isValidEmail('_@.com')).toBe(false)
      expect(ValidateUtil.isValidEmail('1_2_3@4-5-6.ru')).toBe(true)
      expect(ValidateUtil.isValidEmail('1@two.net')).toBe(true)
      expect(ValidateUtil.isValidEmail('jo.jo@mon.key.net')).toBe(true)
    
  describe 'isValidUSZip()', ->
    it 'Should return true if a valid US zip code', ->
      expect(ValidateUtil.isValidUSZip('03858')).toBe(true)
      expect(ValidateUtil.isValidUSZip('22313-1450')).toBe(true)
      expect(ValidateUtil.isValidUSZip('038589')).toBe(false)
      expect(ValidateUtil.isValidUSZip('038A')).toBe(false)
      expect(ValidateUtil.isValidUSZip('038-9')).toBe(false)
  
  describe 'isValidCanadaPostal()', ->
    it 'Should return true if a valid Canada postal code', ->
      expect(ValidateUtil.isValidCanadaPostal('K8N 5W6')).toBe(true)
      expect(ValidateUtil.isValidCanadaPostal('K8N5W6')).toBe(true)
      expect(ValidateUtil.isValidCanadaPostal('K0H 9Z0')).toBe(true)
      expect(ValidateUtil.isValidCanadaPostal('K0H9Z0')).toBe(true)
      expect(ValidateUtil.isValidCanadaPostal('A1B 2C3')).toBe(true)
      expect(ValidateUtil.isValidCanadaPostal('A1B2C3')).toBe(true)
      expect(ValidateUtil.isValidCanadaPostal('K1AO1')).toBe(false)
      expect(ValidateUtil.isValidCanadaPostal('K1-AO1')).toBe(false)
      expect(ValidateUtil.isValidCanadaPostal('K1__O1')).toBe(false)
  
  describe 'isEmpty()', ->
    it 'Should return true if string is empty or null', ->
      expect(ValidateUtil.isEmpty('XXXXXXX')).toBe(false)
      expect(ValidateUtil.isEmpty('')).toBe(true)
      expect(ValidateUtil.isEmpty(null)).toBe(true)
  
  describe 'isValidPhoneNumber()', ->
    it 'Should turn most any phone number string into a standardized phone number string', ->
      expect(ValidateUtil.isValidPhoneNumber('720-303-9999')).toBe(true)
      expect(ValidateUtil.isValidPhoneNumber('(720) 303-9999')).toBe(true)
      expect(ValidateUtil.isValidPhoneNumber('(720) 3033999')).toBe(true)
      expect(ValidateUtil.isValidPhoneNumber('7203039999')).toBe(true)
      expect(ValidateUtil.isValidPhoneNumber('720303-9999')).toBe(true)
      expect(ValidateUtil.isValidPhoneNumber('720-303-9999 x234')).toBe(true)
      expect(ValidateUtil.isValidPhoneNumber('720-303-9999 ext. 234')).toBe(true)
      expect(ValidateUtil.isValidPhoneNumber('720-3033-9999')).toBe(false)
  
  # describe 'isValidAreaCode()', ->
  #   it 'Should turn most any phone number string into a standardized phone number string', ->
  #     expect(ValidateUtil.isValidAreaCode('XXXXXXX')).toBe(true)
  
