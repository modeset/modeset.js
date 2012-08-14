describe 'StringUtil', ->

  beforeEach ->

  afterEach ->

  # Manipulation --------------------------
  describe 'toClassName()', ->
    it 'Should turn a normal filename into a snake-cased string to match a traditional class name format', ->
      expect(StringUtil.toClassName('class_name')).toBe('ClassName')
  
  describe 'escapeHTML()', ->
    it 'Should escape a limited set of common html characters from a markup string', ->
      expect(StringUtil.escapeHTML('<div>"Hi"</div>')).toBe('&lt;div&gt;&quot;Hi&quot;&lt;/div&gt;')
  
  describe 'replaceAscii()', ->
    it 'Should convert any ascii characters to the non-ascii equivalent', ->
      expect(StringUtil.replaceAscii('&#039; &#035; &#034;')).toBe('\' # "')
      expect(StringUtil.replaceAscii('hello')).toBe('hello')
  
  describe 'stripTags()', ->
    it 'Should remove html tags from a string with markup', ->
      expect(StringUtil.stripTags('<div>Hello World</div>')).toBe('Hello World')

  describe 'capitalize()', ->
    it 'Should return a string with all words, or just the first word capitalized', ->
      expect(StringUtil.capitalize('these are some words.')).toBe('These are some words.')
      expect(StringUtil.capitalize('these are some words.', true )).toBe('These Are Some Words.')

  describe 'upperCase()', ->
    it 'Should return the input string uppercased', ->
      expect(StringUtil.upperCase( 'yes' )).toBe('YES')

  describe 'padLeft()', ->
    it 'Should return a string, prefixed with specified prefixed padding', ->
      expect(StringUtil.padLeft('10:10', '#', 7)).toBe('##10:10')
      expect(StringUtil.padLeft('10:10', '#', 3)).toBe('10:10')

  describe 'padRight()', ->
    it 'Should return a string, prefixed with specified suffixed padding', ->
      expect(StringUtil.padLeft('10:10', '#', 7)).toBe('##10:10')
      expect(StringUtil.padLeft('10:10', '#', 3)).toBe('10:10')

  describe 'trim()', ->
    it 'Should return a string with whitespace removed on either side', ->
      expect(StringUtil.trim('   Oh hai.   ')).toBe('Oh hai.')

  describe 'trimLeft()', ->
    it 'Should return a string with whitespace removed on the left side', ->
      expect(StringUtil.trimLeft('   Oh hai.   ')).toBe('Oh hai.   ')

  describe 'trimRight()', ->
    it 'Should return a string with whitespace removed on the right side', ->
      expect(StringUtil.trimRight('   Oh hai.   ')).toBe('   Oh hai.')

  describe 'truncate()', ->
    it 'Should return a truncated string with a ', ->
      expect(StringUtil.truncate('This is a long sentence, kind of.', 12, '->')).toBe('This is a->')

  describe 'removeExtraWhitespace()', ->
    it 'Should return a string without any whitespace on either end', ->
      expect(StringUtil.removeExtraWhitespace('   Oh  hai.   ')).toBe('Oh hai.')

  describe 'remove()', ->
    it 'Should return a string with all instances of a substring removed', ->
      expect(StringUtil.remove('1:2:3:4:5', ':', false)).toBe('12345')
      expect(StringUtil.remove('tTtTt', 'T', true)).toBe('ttt')

  describe 'reverse()', ->
    it 'Should return a string in reverse', ->
      expect(StringUtil.reverse('abcdefg')).toBe('gfedcba')

  describe 'reverseWords()', ->
    it 'Should return a string in reverse', ->
      expect(StringUtil.reverseWords('this is a string')).toBe('string a is this')

  describe 'swapCase()', ->
    it 'Should return a string with the opposite case of the input', ->
      expect(StringUtil.swapCase('Oh hey')).toBe('oH HEY')

  describe 'swapCharacterCase()', ->
    it 'Should return a character with the opposite case of the input character', ->
      expect(StringUtil.swapCharacterCase('O')).toBe('o')

  describe 'parameterize()', ->
    it 'Should return a string suited for use in a url', ->
      expect(StringUtil.parameterize('This could be a url')).toBe('this-could-be-a-url')

  describe 'underscore()', ->
    it 'Should return a string with spaces and dashes replaced with underscores', ->
      expect(StringUtil.underscore('This could be a url')).toBe('this_could_be_a_url')

  describe 'makeSafe()', ->
    it 'Should return a string with quotes replaced with underscores', ->
      expect(StringUtil.makeSafe('"This could be a url"')).toBe('_This could be a url_')

  # Substring retrieval -------------------------- 
  describe 'afterFirst()', ->
    it 'Should return the string contents after the first occurrence of the input string/char divider', ->
      expect(StringUtil.afterFirst('This is a sentence - broken by a hyphen.', ' - ')).toBe('broken by a hyphen.')
      expect(StringUtil.afterFirst('This is a sentence - broken by a hyphen.', '.')).toBe('')
      expect(StringUtil.afterFirst('This is a sentence - broken by a hyphen.', '^^^')).toBe('')

  describe 'afterLast()', ->
    it 'Should return the string contents after the last occurrence of the input string/char divider', ->
      expect(StringUtil.afterLast('This is a sentence - broken by a hyphen.', 'e')).toBe('n.')
      expect(StringUtil.afterLast('Sentence one. Sentence two', '.')).toBe(' Sentence two')
      expect(StringUtil.afterLast('Test Fail', 'Q')).toBe('')

  describe 'beforeFirst()', ->
    it 'Should return the string contents before the first occurrence of the input string/char divider', ->
      expect(StringUtil.beforeFirst('This is a sentence - broken by a hyphen.', 'a')).toBe('This is ')
      expect(StringUtil.beforeFirst('This is a sentence - broken by a hyphen.', '^^^')).toBe('')

  describe 'beforeLast()', ->
    it 'Should return the string contents before the last occurrence of the input string/char divider', ->
      expect(StringUtil.beforeLast('This is a sentence - broken by a hyphen.', 'a')).toBe('This is a sentence - broken by ')
      expect(StringUtil.beforeLast('This is a sentence - broken by a hyphen.', '^^^')).toBe('')

  describe 'between()', ->
    it 'Should return everything after the first occurance of start and before the first occurrence of end in str', ->
      expect(StringUtil.between('This is a sentence - broken by a hyphen.', 'This is', 'by')).toBe(' a sentence - broken ')
      expect(StringUtil.between('This is a sentence.', '^^^', '!!!')).toBe('This is a sentence.')

  # Analysis --------------------------
  describe 'beginsWith()', ->
    it 'Should determine whether the specified string begins with the specified prefix', ->
      expect(StringUtil.beginsWith('Supercalifragilistic', 'Super')).toBe(true)
      expect(StringUtil.beginsWith('Supercalifragilistic', 'frag')).toBe(false)

  describe 'endsWith()', ->
    it 'Should determine whether the specified string ends with the specified suffix', ->
      expect(StringUtil.endsWith('Cool story, bro', 'bro')).toBe(true)
      expect(StringUtil.endsWith('Cool story, bro', 'dawg')).toBe(false)

  describe 'hasText()', ->
    it 'Should determine whether the specified string contains any text', ->
      expect(StringUtil.hasText('')).toBe(false)
      expect(StringUtil.hasText('Cool story, bro')).toBe(true)

  describe 'isEmpty()', ->
    it 'Should determine whether the specified string contains any text', ->
      expect(StringUtil.isEmpty(null)).toBe(true)
      expect(StringUtil.isEmpty('')).toBe(true)
      expect(StringUtil.isEmpty('Cool story, bro')).toBe(false)

  describe 'isNumeric()', ->
    it 'Should determine whether the specified string is numeric', ->
      expect(StringUtil.isNumeric('9999.98')).toBe(true)
      expect(StringUtil.isNumeric('Cool story, bro')).toBe(false)

  describe 'contains()', ->
    it 'Should return a boolean indicating whether the specified string contains any instances of another string', ->
      expect(StringUtil.contains('these are some words.', 'words')).toBe(true)
      expect(StringUtil.contains('these are some words.', 'not')).toBe(false)

  describe 'countOf()', ->
    it 'Should return the number instances of a string within another string', ->
      expect(StringUtil.countOf(null, 'e', false)).toBe(0)
      expect(StringUtil.countOf('these are somE words.', 'e', false)).toBe(4)
      expect(StringUtil.countOf('These are some words.', 't', true)).toBe(0)

  describe 'wordCount()', ->
    it 'Should return the number of words in a string', ->
      expect(StringUtil.wordCount('Well hello there.')).toBe(3)

  describe 'editDistance()', ->
    it 'Should return the number of deletions, insertions, or substitutions required to transform the source string into the target string', ->
      expect(StringUtil.editDistance( 'these are some words.', 'These Are Some Words.' )).toBe(4)

  describe 'similarity()', ->
    it 'Should return the percentage of similiarity between two strings', ->
      expect(StringUtil.similarity( 'pfft', 'Pfft' )).toBe(75)

  describe 'minimum()', ->
    it 'Should return the minimum number out of the 3 input params', ->
      expect(StringUtil.minimum(5, 10, 15)).toBe(5)



