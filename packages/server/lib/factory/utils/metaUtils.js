/**
 * Sanitizes and validates attribute value
 *
 * @param value Attribute value to sanitize
 * @returns string|null Sanitized valid value or null
 */
function _sanitizeValue(value) {
  return value === undefined || value === null ? null : value;
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
      const sanitizedAttrValue = _sanitizeValue(attrValue);

      // Skip empty values
      if (sanitizedAttrValue === null) {
        continue;
      }

      tagParts.push(`${attrName}="${sanitizedAttrValue}"`);
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
    `<title>${metaManager.getTitle()}</title>`,
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
};
