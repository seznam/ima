import MetaManagerImpl from '../MetaManagerImpl';

let metaManager;

describe('ima.core.meta.MetaManager', () => {
  beforeEach(() => {
    metaManager = new MetaManagerImpl();
  });

  it('should directly save the value of name, property, and link by default', () => {
    metaManager.setMetaName('alpha', 'one');
    metaManager.setMetaProperty('beta:property', 'two');
    metaManager.setLink('gamma', 'three');

    expect(metaManager.getMetaName('alpha')).toBe({ content: 'one' });
    expect(metaManager.getMetaProperty('beta:property')).toBe({
      content: 'two',
    });
    expect(metaManager.getLink('gamma')).toBe({ href: 'three' });
  });

  it('should save name, property, and link as object when otherAttrs is supplied', () => {
    metaManager.setMetaName('alpha', 'one', {
      alphaAttr: 'alpha_attr_value',
    });
    metaManager.setMetaProperty('beta:property', 'two', {
      betaAttr: 'beta_attr_value',
    });
    metaManager.setLink('gamma', 'three', {
      gammaAttr: 'gamma_attr_value',
    });

    expect(metaManager.getMetaName('alpha')).toEqual({
      content: 'one',
      alphaAttr: 'alpha_attr_value',
    });

    expect(metaManager.getMetaProperty('beta:property')).toEqual({
      content: 'two',
      betaAttr: 'beta_attr_value',
    });

    expect(metaManager.getLink('gamma')).toEqual({
      href: 'three',
      gammaAttr: 'gamma_attr_value',
    });
  });
});
