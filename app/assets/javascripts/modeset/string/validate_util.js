var ValidateUtil = ValidateUtil || {};

/**
* Utils for front-end form validation.
* @author Justin Gitlin, Ryan Boyajian
* @version 0.1
*/

/**
 * Checks to see if a string is a valid email. ( Original RegExp by Senocular [http://www.senocular.com/] )
 * modified to include the "+" in the local-part by RB.
 */
ValidateUtil.isValidEmail = function( email ) {
    var emailExpression = new RegExp(/^[+\w.-]+@\w[\w.-]+\.[\w.-]*[a-z][a-z]$/i);
    return emailExpression.test(email);
};

/**
 * Checks to see if a string is a proper formatted US zip code.
 * 12345 and 12345-1234 will return true.
 */
ValidateUtil.isValidUSZip = function( zip ) {
  var zipExpression = new RegExp(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
  return zipExpression.test( zip );
};

/**
 * Checks to see if a string is a proper formatted Canadian postal code.
 * A1B2C3 or A1B 2C3 will return true.
 */
ValidateUtil.isValidCanadaPostal = function( postal ) {
  var postalExpression = new RegExp(/^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]\s?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/);
  return postalExpression.test( postal );
};

/**
 * Checks to see if the string is a valid phone number.
 * 7777777, 777 7777, or 777-7777 will return true.
 */
ValidateUtil.isValidPhoneNumber = function( number ) {
  var numberExpression = new RegExp(/^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/);
  return numberExpression.test( number );
};

/**
 * Makes sure the string is a valid area code.
 * 123 will return true.
 */
// ValidateUtil.isValidAreaCode = function( areaCode ) {
//  var areaExpression = new RegExp(/^\d{3}$/);
//  return areaExpression.test( areaCode );
// };

/**
 * Checks to see if a form element is filled out
 */
ValidateUtil.isEmpty = function( txt ) {
  if( txt == '' || txt == null ) {
    return true;
  } else {
    return false;
  }
};
