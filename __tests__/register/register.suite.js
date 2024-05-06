import StyleDictionary from 'style-dictionary';
import { expect } from 'chai';

export function registerSuite(opts) {
  /**
   * opts example: {
   *   config: { transform: () => {} },
   *   registerMethod: 'registerTransform',
   *   prop: 'transform',
   * }
   * This suite verifies a couple of rules with regards to registering something on class vs instance
   */
  const { config, registerMethod, prop, defaultPropVal = {} } = opts;
  const configFoo = { ...config, name: 'foo' };
  // same config but under a different name, needed for the third test
  const configBar = { ...config, name: 'bar' };

  describe('Register Test Suite', () => {
    const reset = () => {
      StyleDictionary.hooks[prop] = defaultPropVal;
    };
    beforeEach(() => {
      reset();
    });
    afterEach(() => {
      reset();
    });

    describe(`instance vs class registration: ${prop}`, () => {
      it(`should allow registering ${prop} on class, affecting all instances`, async () => {
        StyleDictionary[registerMethod](configFoo);

        const sd1 = new StyleDictionary();
        const sd2 = new StyleDictionary();
        const sd3 = await sd2.extend();
        expect(sd1.hooks[prop][configFoo.name]).to.not.be.undefined;
        expect(sd2.hooks[prop][configFoo.name]).to.not.be.undefined;
        expect(sd3.hooks[prop][configFoo.name]).to.not.be.undefined;
      });

      it(`should allow registering ${prop} on instance, affecting only that instance`, async () => {
        const sd1 = new StyleDictionary();
        const sd2 = new StyleDictionary();
        const sd3 = await sd2.extend();

        sd2[registerMethod](configFoo);
        expect(sd1.hooks[prop][configFoo.name]).to.be.undefined;
        expect(sd2.hooks[prop][configFoo.name]).to.not.be.undefined;
        expect(sd3.hooks[prop][configFoo.name]).to.be.undefined;
      });

      it(`should combine class and instance registrations for ${prop} on the instance`, async () => {
        StyleDictionary[registerMethod](configFoo);

        const sd1 = new StyleDictionary();
        const sd2 = new StyleDictionary();
        sd2[registerMethod](configBar);
        const sd3 = await sd2.extend();

        expect(sd1.hooks[prop][configFoo.name]).to.not.be.undefined;
        expect(sd2.hooks[prop][configFoo.name]).to.not.be.undefined;
        expect(sd3.hooks[prop][configFoo.name]).to.not.be.undefined;
        // should not be registered on sd1, because we registered only on sd2
        expect(sd1.hooks[prop][configBar.name]).to.be.undefined;
        expect(sd2.hooks[prop][configBar.name]).to.not.be.undefined;
        // should be registered because sd3 extends sd2
        expect(sd3.hooks[prop][configBar.name]).to.not.be.undefined;
      });
    });
  });
}
