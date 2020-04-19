const cssVarDeepFormat = require('./css-variables-deep');

describe('format', () => {
  describe('css/var-deep', () => {

    const config = { prefix: 'kite' };
    const colorProp = { name: 'blue-20', value: '#00ff00' };
    const primaryProp = {
      name: 'primary',
      value: '00ff00',
      original: {
        value: '{color.base.blue-20.value}',
      }
    };
    const decisionProp = {
      name: 'icon',
      value: 'ki-icon',
      attributes: { 'data-type': 'string' }
    }
    const measurementProp = {
      name: 'width',
      value: '100px'
    }

    describe('addPrefix', () => {
      it('should add a prefix', () => {
        const prefixed = cssVarDeepFormat.fns.addPrefix('test', 'kite');
        expect(prefixed).toEqual('kite-test');
      });
      it('should not add a prefix when there is not one', () => {
        const notPrefixed = cssVarDeepFormat.fns.addPrefix('test');
        expect(notPrefixed).toEqual('test');
      });
    });

    describe('isAlias', () => {
      it('should detect an alias', () => {
        const alias = cssVarDeepFormat.fns.isAlias('{color.red.value}');
        expect(alias).toBe(true);
      });
      it('should not detect when not an alias', () => {
        const notAlias = cssVarDeepFormat.fns.isAlias('10px');
        expect(notAlias).toBe(false);
      });
    });

    describe('typeIsString', () => {
      it('should detect a string datatype', () => {
        const value = cssVarDeepFormat.fns.typeIsString({
          value: 'ki-icon',
          attributes: {'data-type': 'string'}
        });
        expect(value).toBe(true);
      });
      it('should be false when not a string data type', () => {
        const value = cssVarDeepFormat.fns.typeIsString({
          value: '10px',
          attributes: {'data-type': 'number'}
        });
        expect(value).toBe(false);
      });
      it('should be false when no attributes', () => {
        const value = cssVarDeepFormat.fns.typeIsString({value: '10px'});
        expect(value).toBe(false);
      });
    });

    describe('makePropCSSVar', () => {
      it('should make the prop name a css var', () => {
        const key = cssVarDeepFormat.fns.makePropCSSVar('name');
        expect(key).toEqual('--name');
      });
    });

    describe('setValue', () => {
      it('should set the value as a ref is an alias', () => {
        const prefix = 'kite';
        const value = cssVarDeepFormat.fns.setValue(primaryProp, prefix);
        expect(value).toEqual(`var(--kite-color-base-blue-20)`);
      });
    });

  });
});
