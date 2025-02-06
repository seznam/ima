// https://github.com/preactjs/preact-render-to-string/blob/main/src/util.js#L9
const ENCODED_ENTITIES = /["&<]/;

/** @param {string} value */
function encodeHTMLEntities(value) {
  // Skip all work for value with no entities needing encoding:

  if (typeof value !== 'string') {
    return '';
  }

  if (value.length === 0 || ENCODED_ENTITIES.test(value) === false) {
    return value;
  }

  let last = 0,
    i = 0,
    out = '',
    ch = '';

  // Seek forward in value until the next entity char:
  for (; i < value.length; i++) {
    switch (value.charCodeAt(i)) {
      case 34:
        ch = '&quot;';
        break;
      case 38:
        ch = '&amp;';
        break;
      case 60:
        ch = '&lt;';
        break;
      default:
        continue;
    }
    // Append skipped/buffered characters and the encoded entity:
    if (i !== last) {
      out += value.slice(last, i);
    }
    out += ch;
    // Start the next seek/buffer after the entity's offset:
    last = i + 1;
  }
  if (i !== last) {
    out += value.slice(last, i);
  }
  return out;
}

/**
 * Sanitizes and validates attribute value
 *
 * @param value Attribute value to sanitize
 * @returns string|null Sanitized valid value or null
 */
function sanitizeValue(value) {
  return value === undefined || value === null
    ? null
    : encodeHTMLEntities(value);
}

/**
 * Helper function to generate meta tags.
 *
 * @param iterator MetaManager meta collection iterator.
 * @param tagName Name of the meta tag to render to string.
 * @returns string[] Array of rendered meta tags.
 */
function _getMetaTags(iterator, tagName, keyName) {
  const metaTags = [];

  for (const [key, value] of iterator) {
    const tagParts = [`<${tagName}`, 'data-ima-meta'];
    const attributes = {
      [keyName]: key,
      ...value,
    };

    for (let [attrName, attrValue] of Object.entries(attributes)) {
      const sanitizedAttrValue = sanitizeValue(attrValue);
      const sannitizedAttrName = sanitizeValue(attrName);

      // Skip empty values
      if (sanitizedAttrValue === null || sannitizedAttrName === null) {
        continue;
      }

      tagParts.push(`${sannitizedAttrName}="${sanitizedAttrValue}"`);
    }

    tagParts.push('/>');
    metaTags.push(tagParts.join(' '));
  }

  return metaTags;
}

/**
 * Render meta tags from app metaManager into string
 * which can be inserted to web content using conten variables.\
 *
 * @param metaManager IMA.js $MetaManager instance.
 * @returns string Meta tags rendered to HTML string.
 */
function renderMeta(metaManager) {
  if (!metaManager) {
    return '';
  }

  return [
    `<title>${encodeHTMLEntities(metaManager.getTitle())}</title>`,
    ..._getMetaTags(metaManager.getLinksIterator(), 'link', 'rel'),
    ..._getMetaTags(metaManager.getMetaNamesIterator(), 'meta', 'name'),
    ..._getMetaTags(
      metaManager.getMetaPropertiesIterator(),
      'meta',
      'property'
    ),
  ]
    .filter(Boolean)
    .join('');
}

module.exports = {
  _getMetaTags,
  renderMeta,
  sanitizeValue,
  encodeHTMLEntities,
};
