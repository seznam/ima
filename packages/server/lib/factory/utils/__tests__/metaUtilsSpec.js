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
            ['og:description', { content: null }],
            [
              'og:keywords',
              {
                content: 'ima core cli',
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

    it('should generate meta tags while prevent XSS', () => {
      const meta = renderMeta({
        getTitle: jest.fn().mockReturnValue('<script>alert(1)</script>'),
        getMetaNamesIterator: jest.fn().mockReturnValue(
          new Map([
            ['description', { content: '"><script>alert(1)</script>' }],
            [
              'keywords',
              {
                content: '"><script>alert(1)</script>',
                'data-custom-attr': 'custom-attribute',
              },
            ],
            [
              '"><script>alert(1)</script>',
              {
                content: '"><script>alert(1)</script>',
                'data-custom-attr': 'custom-attribute',
              },
            ],
          ]).entries()
        ),
        getMetaPropertiesIterator: jest.fn().mockReturnValue(
          new Map([
            ['og:description', { content: null }],
            [
              'og:keywords',
              {
                content: '"><script>alert(1)</script>',
                'data-custom-attr': 'custom-attribute',
                invalid: null,
              },
            ],
          ]).entries()
        ),
        getLinksIterator: jest.fn().mockReturnValue(
          new Map([
            [
              'stylesheet',
              { href: '/media/examples/link-element-example.css' },
            ],
            ['stylesheet', { href: '"><script>alert(1)</script>' }],
          ]).entries()
        ),
      });

      expect(meta).toMatchSnapshot();
      expect(meta.match(/data-ima-meta/g)).toHaveLength(6);
    });
  });
});
