import MetaManagerImpl from '../MetaManagerImpl';

let metaManager;

describe('ima.core.meta.MetaManager', () => {
  beforeEach(() => {
    metaManager = new MetaManagerImpl();
  });

  it('should directly save the value of name, property, and link by default', () => {
    metaManager.setMetaName('alpha', { value: 'one' });
    metaManager.setMetaProperty('beta:property', { value: 'two' });
    metaManager.setLink('gamma', { value: 'three' });

    expect(metaManager.getMetaName('alpha')).toBe({ value: 'one' });
    expect(metaManager.getMetaProperty('beta:property')).toBe({ value: 'two' });
    expect(metaManager.getLink('gamma')).toBe({ value: 'three' });
  });

  it('should save name, property, and link as object when other_attrs is supplied', () => {
    metaManager.setMetaName('alpha', {
      value: 'one',
      alphaAttr: 'alpha_attr_value',
    });
    metaManager.setMetaProperty('beta:property', {
      value: 'two',
      betaAttr: 'beta_attr_value',
    });
    metaManager.setLink('gamma', {
      value: 'three',
      gammaAttr: 'gamma_attr_value',
    });

    expect(metaManager.getMetaName('alpha')).toEqual({
      value: 'one',
      alphaAttr: 'alpha_attr_value',
    });

    expect(metaManager.getMetaProperty('beta:property')).toEqual({
      value: 'two',
      betaAttr: 'beta_attr_value',
    });

    expect(metaManager.getLink('gamma')).toEqual({
      value: 'three',
      gammaAttr: 'gamma_attr_value',
    });
  });
});
