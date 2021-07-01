const CLASSNAME_CHARS = (
  'abcdefghijklmnopqrstuvwxyz' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  '-'
).split('');
const EXTENDED_CLASSNAME_CHARS = (
  CLASSNAME_CHARS.join('') + '0123456789'
).split('');

function numberToCssClass(number) {
  if (number < CLASSNAME_CHARS.length) {
    return CLASSNAME_CHARS[number];
  }

  // we have to "shift" the number to adjust for the gap between base53 and
  // base64 encoding
  number += EXTENDED_CLASSNAME_CHARS.length - CLASSNAME_CHARS.length;

  let className = '';
  while (number >= CLASSNAME_CHARS.length) {
    className =
      EXTENDED_CLASSNAME_CHARS[number % EXTENDED_CLASSNAME_CHARS.length] +
      className;
    number = Math.floor(number / EXTENDED_CLASSNAME_CHARS.length);
  }

  if (number) {
    className = CLASSNAME_CHARS[number - 1] + className;
  } else {
    className = '_' + className;
  }

  return className;
}

module.exports = { numberToCssClass };
