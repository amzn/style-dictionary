import transformBuiltins from './common/transforms';
import transformGroupBuiltins from './common/transformGroups';
import formatBuiltins from './common/formats';
import actionBuiltins from './common/actions';
import filterBuiltins from './common/filters';
import type { Hooks } from './types/Config';
import { deepmerge } from './utils/deepmerge';
import type { Transform, Action, FileHeader, Filter, Format, Parser, Preprocessor } from './types';

function getBuiltinHooks(): Required<Hooks> {
  return {
    parsers: {},
    preprocessors: {},
    transformGroups: {
      ...transformGroupBuiltins,
    },
    transforms: {
      ...transformBuiltins,
    },
    formats: {
      ...formatBuiltins,
    },
    fileHeaders: {},
    filters: {
      ...filterBuiltins,
    },
    actions: {
      ...actionBuiltins,
    },
  };
}

export class Register {
  /**
   * Below is a ton of boilerplate. Explanation:
   *
   * You can register things on the StyleDictionary class level e.g. StyleDictionary.registerFormat()
   * You can also register these things on StyleDictionary instance (through config) or on StyleDictionary instance's platform property.
   *
   * Therefore, we have to make use of static props vs instance props and use getters and setters to merge these together.
   */
  static hooks: Required<Hooks> = getBuiltinHooks();

  /** @type {Required<Hooks>} */
  get hooks(): Required<Hooks> {
    return deepmerge((this.constructor as any).hooks, this._hooks ?? {});
  }

  /**
   * @param {Required<Hooks>} v
   */
  set hooks(v: Required<Hooks>) {
    this._hooks = v;
  }

  private _hooks?: Required<Hooks>;

  /**
   * @param {typeof Register | Register} target
   * @param {keyof Hooks} hook
   * @param {string} name
   */
  static deleteExistingHook(target: typeof Register | Register, hook: keyof Hooks, name: string) {
    // if it's already registered, delete it so the new one overrides
    if (target.hooks[hook][name]) {
      delete target.hooks[hook][name];
    }
  }

  /**
   * @param {Transform} cfg
   */
  static registerTransform(cfg: Transform) {
    // this = class
    this.__registerTransform(cfg, this);
  }

  /**
   * @param {Transform} cfg
   */
  registerTransform(cfg: Transform) {
    (this.constructor as any).__registerTransform(cfg, this);
  }

  /**
   * @param {Transform} transform
   * @param {typeof Register | Register} target
   */
  static __registerTransform(transform: Transform, target: typeof Register | Register) {
    const transformTypes = ['name', 'value', 'attribute'];
    const { type, name, filter, transitive, transform: transformFn } = transform;
    if (typeof type !== 'string') throw new Error('type must be a string');
    if (transformTypes.indexOf(type) < 0)
      throw new Error(type + ' type is not one of: ' + transformTypes.join(', '));
    if (typeof name !== 'string') throw new Error('name must be a string');
    if (filter && typeof filter !== 'function') throw new Error('filter must be a function');
    if (typeof transformFn !== 'function') throw new Error('transform must be a function');
    this.deleteExistingHook(target, 'transforms', name);

    // make sure to trigger the setter
    target.hooks = deepmerge(target.hooks, {
      transforms: {
        [name]: {
          type,
          filter,
          transitive: !!transitive,
          transform: transformFn,
        },
      },
    });
    return this;
  }

  /**
   * @param {{ name: string; transforms: string[]; }} cfg
   */
  static registerTransformGroup(cfg: { name: string; transforms: string[] }) {
    // this = class
    this.__registerTransformGroup(cfg, this);
  }

  /**
   * @param {{ name: string; transforms: string[]; }} cfg
   */
  registerTransformGroup(cfg: { name: string; transforms: string[] }) {
    (this.constructor as any).__registerTransformGroup(cfg, this);
  }

  /**
   * @param {{ name: string; transforms: string[]; }} transformGroup
   * @param {typeof Register | Register} target
   */
  static __registerTransformGroup(
    transformGroup: { name: string; transforms: string[] },
    target: typeof Register | Register,
  ) {
    const { name, transforms } = transformGroup;
    if (typeof name !== 'string') throw new Error('transform name must be a string');
    if (!Array.isArray(transforms))
      throw new Error('transforms must be an array of registered value transforms');

    transforms.forEach((t) => {
      if (!target.hooks.transforms || !(t in target.hooks.transforms))
        throw new Error('transforms must be an array of registered value transforms');
    });
    this.deleteExistingHook(target, 'transformGroups', name);

    // make sure to trigger the setter
    target.hooks = deepmerge(target.hooks, {
      transformGroups: {
        [name]: transforms,
      },
    });
    return target;
  }

  /**
   * @param {Format} cfg
   */
  static registerFormat(cfg: Format) {
    // this = class
    this.__registerFormat(cfg, this);
  }

  /**
   * @param {Format} cfg
   */
  registerFormat(cfg: Format) {
    (this.constructor as any).__registerFormat(cfg, this);
  }

  /**
   * @param  {Format} format
   * @param {typeof Register | Register} target
   */
  static __registerFormat(format: Format, target: typeof Register | Register) {
    const { name, format: formatFn } = format;
    if (typeof name !== 'string')
      throw new Error("Can't register format; format.name must be a string");
    if (typeof formatFn !== 'function')
      throw new Error("Can't register format; format.format must be a function");
    this.deleteExistingHook(target, 'formats', name);

    // make sure to trigger the setter
    target.hooks = deepmerge(target.hooks, {
      formats: {
        [name]: formatFn,
      },
    });
    return target;
  }

  /**
   * @param {Action} cfg
   */
  static registerAction(cfg: Action) {
    // this = class
    this.__registerAction(cfg, this);
  }

  /**
   * @param {Action} cfg
   */
  registerAction(cfg: Action) {
    (this.constructor as any).__registerAction(cfg, this);
  }

  /**
   * @param {Action} action
   * @param {typeof Register | Register} target
   */
  static __registerAction(action: Action, target: typeof Register | Register) {
    const { name, do: _do, undo } = action;
    if (typeof name !== 'string') throw new Error('name must be a string');
    if (typeof _do !== 'function') throw new Error('do must be a function');
    this.deleteExistingHook(target, 'actions', name);

    // make sure to trigger the setter
    target.hooks = deepmerge(target.hooks, {
      actions: {
        [name]: {
          do: _do,
          undo,
        },
      },
    });
    return target;
  }

  /**
   * @param {Filter} cfg
   */
  static registerFilter(cfg: Filter) {
    // this = class
    this.__registerFilter(cfg, this);
  }

  /**
   * @param {Filter} cfg
   */
  registerFilter(cfg: Filter) {
    // this = instance
    (this.constructor as any).__registerFilter(cfg, this);
  }

  /**
   * @param {Filter} filter
   * @param {typeof Register | Register} target
   */
  static __registerFilter(filter: Filter, target: typeof Register | Register) {
    const { name, filter: filterFn } = filter;
    if (typeof name !== 'string')
      throw new Error("Can't register filter; filter.name must be a string");
    if (typeof filterFn !== 'function')
      throw new Error("Can't register filter; filter.filter must be a function");
    this.deleteExistingHook(target, 'filters', name);

    // make sure to trigger the setter
    target.hooks = deepmerge(target.hooks, {
      filters: {
        [name]: filterFn,
      },
    });
    return target;
  }

  /**
   * @param {Parser} cfg
   */
  static registerParser(cfg: Parser) {
    // this = class
    this.__registerParser(cfg, this);
  }

  /**
   * @param {Parser} cfg
   */
  registerParser(cfg: Parser) {
    // this = instance
    (this.constructor as any).__registerParser(cfg, this);
  }

  /**
   * @param {import('../types/Parser.d.ts').Parser} parser
   * @param {typeof Register | Register} target
   */
  static __registerParser(parser: Parser, target: typeof Register | Register) {
    const { name, pattern, parser: parserFn } = parser;
    if (typeof name !== 'string')
      throw new Error("Can't register parser; parser.name must be a string");
    if (!(pattern instanceof RegExp))
      throw new Error(`Can't register parser; parser.pattern must be a regular expression`);
    if (typeof parserFn !== 'function')
      throw new Error("Can't register parser; parser.parser must be a function");
    this.deleteExistingHook(target, 'parsers', name);

    // make sure to trigger the setter
    target.hooks = deepmerge(target.hooks, {
      parsers: {
        [name]: {
          pattern,
          parser: parserFn,
        },
      },
    });
    return target;
  }

  /**
   * @param {Preprocessor} cfg
   */
  static registerPreprocessor(cfg: Preprocessor) {
    // this = class
    this.__registerPreprocessor(cfg, this);
  }

  /**
   * @param {Preprocessor} cfg
   */
  registerPreprocessor(cfg: Preprocessor) {
    // this = instance
    (this.constructor as any).__registerPreprocessor(cfg, this);
  }

  /**
   * @param {Preprocessor} cfg
   * @param {typeof Register | Register} target
   */
  static __registerPreprocessor(cfg: Preprocessor, target: typeof Register | Register) {
    const { name, preprocessor } = cfg;
    const errorPrefix = 'Cannot register preprocessor;';
    if (typeof name !== 'string')
      throw new Error(`${errorPrefix} Preprocessor.name must be a string`);
    if (!(preprocessor instanceof Function)) {
      throw new Error(`${errorPrefix} Preprocessor.preprocessor must be a function`);
    }
    this.deleteExistingHook(target, 'preprocessors', name);

    // make sure to trigger the setter
    target.hooks = deepmerge(target.hooks, {
      preprocessors: {
        [name]: preprocessor,
      },
    });
    return target;
  }

  /**
   * @param {{name: string; fileHeader: FileHeader;}} cfg
   */
  static registerFileHeader(cfg: { name: string; fileHeader: FileHeader }) {
    // this = class
    this.__registerFileHeader(cfg, this);
  }

  /**
   * @param {{name: string; fileHeader: FileHeader;}} cfg
   */
  registerFileHeader(cfg: { name: string; fileHeader: FileHeader }) {
    // this = instance
    (this.constructor as any).__registerFileHeader(cfg, this);
  }

  /**
   * @param {{name: string; fileHeader: FileHeader;}} cfg
   * @param {typeof Register | Register} target
   */
  static __registerFileHeader(
    cfg: { name: string; fileHeader: FileHeader },
    target: typeof Register | Register,
  ) {
    const { name, fileHeader } = cfg;
    if (typeof name !== 'string')
      throw new Error("Can't register file header; options.name must be a string");
    if (typeof fileHeader !== 'function')
      throw new Error("Can't register file header; options.fileHeader must be a function");
    this.deleteExistingHook(target, 'fileHeaders', name);

    // make sure to trigger the setter
    target.hooks = deepmerge(target.hooks, {
      fileHeaders: {
        [name]: fileHeader,
      },
    });
    return target;
  }

  constructor() {
    this.hooks = getBuiltinHooks();
  }
}
