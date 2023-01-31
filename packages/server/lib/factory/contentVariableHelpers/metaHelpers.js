function _getMetaTags(iterator, tagName) {
  const metaTags = [];

  for (const [key, value] of iterator) {
    const tagParts = [`<${tagName}`, 'data-ima-meta'];
    const attributes = {
      [tagName === 'link' ? 'rel' : 'name']: key,
      ...value,
    };

    for (let [attrName, attrValue] of Object.entries(attributes)) {
      // Skip empty values
      if (attrName === undefined || attrValue === null) {
        continue;
      }

      tagParts.push(`${attrName}="${attrValue}"`);
    }

    tagParts.push('/>');
    metaTags.push(tagParts.join(' '));
  }

  return metaTags;
}

function _renderMetaTags({ response }) {
  const { metaManager } = response?.page || {};

  if (!metaManager) {
    return '';
  }

  return [
    ..._getMetaTags(metaManager.getLinksIterator(), 'link'),
    ..._getMetaTags(metaManager.getMetaNamesIterator(), 'meta'),
    ..._getMetaTags(metaManager.getMetaPropertiesIterator(), 'meta'),
  ].join('');
}

module.exports = {
  _getMetaTags,
  _renderMetaTags,
};
