import StyleDictionary from 'style-dictionary';
import { expect } from 'chai';
import transformBuiltins from '../../lib/common/transforms.js';

describe('Register overwrites', () => {
  const reset = () => {
    StyleDictionary.hooks.transforms['color/hex'] = transformBuiltins['color/hex'];
  };
  beforeEach(() => {
    reset();
  });
  afterEach(() => {
    reset();
  });

  it(`should allow overwriting built-in hooks on class, affecting any instance created AFTER doing so`, async () => {
    const sd1 = new StyleDictionary();

    const builtInHookName = 'color/hex';
    const builtInHook = StyleDictionary.hooks.transforms[builtInHookName];
    StyleDictionary.registerTransform({
      ...builtInHook,
      name: builtInHookName,
      type: 'name',
    });

    const sd2 = new StyleDictionary();
    const sd3 = await sd2.extend();

    // Only run the expects in Browser env which tests each file in a separate browser tab
    // Unfortunately, Mocha Node runs this in parallel with other test files and these tests
    // fail purely due to multiple test files writing stuff to the Register class
    // TODO: In the future we may be able to run mocha test files in parallel processes
    if (typeof window !== 'undefined') {
      expect(sd1.hooks.transforms[builtInHookName].type).to.equal('value');
      expect(sd2.hooks.transforms[builtInHookName].type).to.equal('name');
      expect(sd3.hooks.transforms[builtInHookName].type).to.equal('name');
    }
  });

  it(`should allow overwriting built-in hooks on instance, affecting only that instance or its direct extensions`, async () => {
    const sd1 = new StyleDictionary();

    const builtInHookName = 'color/hex';
    const builtInHook = StyleDictionary.hooks.transforms[builtInHookName];
    sd1.registerTransform({
      ...builtInHook,
      name: builtInHookName,
      type: 'name',
    });

    const sd2 = new StyleDictionary();
    const sd3 = await sd2.extend();

    expect(sd1.hooks.transforms[builtInHookName].type).to.equal('name');
    expect(sd2.hooks.transforms[builtInHookName].type).to.equal('value');
    expect(sd3.hooks.transforms[builtInHookName].type).to.equal('value');
  });
});
