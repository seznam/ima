const { renderMeta } = require('../metaUtils');

describe('metaUtils', () => {
  describe('renderMeta', () => {
    it('should return empty string if the meta manager is not defined', () => {
      expect(renderMeta(undefined)).toBe('');
    });

    it('should generate meta tags while filtering out invalid values', () => {
      const meta = renderMeta({
        getTitle: jest.fn().mockReturnValue('Page title'),
        getMetaNamesIterator: jest.fn().mockReturnValue(
          new Map([
            ['description', { content: 'meta description' }],
            [
              'keywords',
              {
                content: 'ima core cli',
                'data-custom-attr': 'custom-attribute',
              },
            ],
          ]).entries()
        ),
        getMetaPropertiesIterator: jest.fn().mockReturnValue(
          new Map([
            ['og:description', { property: null }],
            [
              'og:keywords',
              {
                property: 'ima core cli',
                'data-custom-attr': 'custom-attribute',
                invalid: null,
              },
            ],
          ]).entries()
        ),
        getLinksIterator: jest
          .fn()
          .mockReturnValue(
            new Map([
              [
                'stylesheet',
                { href: '/media/examples/link-element-example.css' },
              ],
            ]).entries()
          ),
      });

      expect(meta).toMatchSnapshot();
      expect(meta.match(/data-ima-meta/g)).toHaveLength(5);
    });

    it('should return empty string for empty meta manager', () => {
      const meta = renderMeta({
        getTitle: jest.fn().mockReturnValue(''),
        getMetaNamesIterator: jest.fn().mockReturnValue(new Map([]).entries()),
        getMetaPropertiesIterator: jest
          .fn()
          .mockReturnValue(new Map([]).entries()),
        getLinksIterator: jest.fn().mockReturnValue(new Map([]).entries()),
      });

      expect(meta).toBe('<title></title>');
    });
  });
});
