var WordSmasher = function(){
  // Class properties
  // ------------------------------------------------------------------------
  var _vowels = ['a','e','i','o','u'];

  // Combine 2 words on a random vowel. showCombo if you want to show the combined words
  // ------------------------------------------------------------------------
  var combineWords = function( word1, word2, showCombo ) {
    var word1Vowels = getVowelPositions( word1 );
    var word2Vowels = getVowelPositions( word2 );

    // if first word has more than one vowel, and the first letter is a vowel, get rid of it. same for the end of the 2nd word. this ensures a more substantial piece of the word remains.
    if( word1Vowels.length > 1 && word1Vowels[ 0 ] == 0 ) word1Vowels.shift();
    if( word2Vowels.length > 1 && word2Vowels[ word2Vowels.length - 1 ] == word2.length - 1 ) word2Vowels.pop();

    // pick a random vowel to split on
    word1vowelStop = word1Vowels[ Math.round(Math.random() * ( word1Vowels.length - 1 ) ) ];
    word2vowelStop = word2Vowels[ Math.round(Math.random() * ( word2Vowels.length - 1 ) ) ];

    // replace the split vowel with an underlined version
    var outputWord1 = replaceLetterWithSpan( word1, word1vowelStop );
    var outputWord2 = replaceLetterWithSpan( word2, word2vowelStop );

    // randomly decide to use the first word's vowel rather than the 2nd
    if( ( word1vowelStop != 0 && word2vowelStop != word2.length - 1 ) ) {
      if( Math.random() > 0.5 ) {
        word1vowelStop++;
        word2vowelStop++;
      }
    }
    
    var result = '';
    if( showCombo ) result += '<span class="wordsmash_combo">' + outputWord1 + ' + ' + outputWord2 + ' = </span>';
    result += '<span class="wordsmash_result">' + word1.substr(0,word1vowelStop) + word2.substr(word2vowelStop) + '</span>';
    return result.toLowerCase();
  };

  // Returns an aray of vowel indexes in a word
  // ------------------------------------------------------------------------
  var getVowelPositions = function( word ) {
    var positions = [];
    var i = 0;
    for( var charPos in word ) {
      if( charIsVowel( word[charPos] ) ) positions.push( i );
      i++;
    }
    return positions;
  };

  // Returns an aray of vowel indexes in a word
  // ------------------------------------------------------------------------
  var charIsVowel = function( char ) {
    return ( _vowels.indexOf( char ) != -1 );
  };

  // Returns an aray of vowel indexes in a word
  // ------------------------------------------------------------------------
  var replaceLetterWithSpan = function( word, index ) {
    return word.substr( 0, index ) + '<span class="wordsmash_vowel">' + word.charAt( index ) + '</span>' + word.substr( index + 1 );
  };
  
  // Return the public api
  // ------------------------------------------------------------------------
  return {
    combineWords: combineWords,
    getVowelPositions: getVowelPositions,
    charIsVowel: charIsVowel
  };
};
