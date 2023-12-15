import transform from './common/transforms.js';
import transformGroup from './common/transformGroups.js';
import format from './common/formats.js';
import action from './common/actions.js';
import filter from './common/filters.js';

/**
 * @typedef {import('../types/File.d.ts').FileHeader} FileHeader
 * @typedef {import('../types/Parser.d.ts').Parser} Parser
 * @typedef {import('../types/Preprocessor.d.ts').Preprocessor} Preprocessor
 * @typedef {import('../types/Preprocessor.d.ts').preprocessor} preprocessor
 * @typedef {import('../types/Transform.d.ts').Transform} Transform
 * @typedef {import('../types/Filter.d.ts').Filter} Filter
 * @typedef {import('../types/Filter.d.ts').Matcher} Matcher
 * @typedef {import('../types/Format.d.ts').Format} Format
 * @typedef {import('../types/Format.d.ts').Formatter} Formatter
 * @typedef {import('../types/Action.d.ts').Action} Action
 */

export class Register {
  /**
   * Below is a ton of boilerplate. Explanation:
   *
   * You can register things on the StyleDictionary class level e.g. StyleDictionary.registerFormat()
   * You can also register these things on StyleDictionary instance (through config) or on StyleDictionary instance's platform property.
   *
   * Therefore, we have to make use of static props vs instance props and use getters and setters to merge these together.
   */
  static transform = transform;
  static transformGroup = transformGroup;
  static format = format;
  static action = action;
  static filter = filter;
  /** @type {Record<string, FileHeader>} */
  static fileHeader = {};
  /** @type {Parser[]} */
  static parsers = []; // we need to initialise the array, since we don't have built-in parsers
  /** @type {Record<string, preprocessor>} */
  static preprocessors = {};

  /**
   * @param {Transform} cfg
   */
  static registerTransform(cfg) {
    // this = class
    this.__registerTransform(cfg, this);
  }

  /**
   * @param {Transform} cfg
   */
  registerTransform(cfg) {
    // this = instance
    /** @type {typeof Register} */ (this.constructor).__registerTransform(cfg, this);
  }

  /**
   * @param {Transform} transform
   * @param {typeof Register | Register} target
   */
  static __registerTransform(transform, target) {
    const transformTypes = ['name', 'value', 'attribute'];
    const { type, name, matcher, transitive, transformer } = transform;
    if (typeof type !== 'string') throw new Error('type must be a string');
    if (transformTypes.indexOf(type) < 0)
      throw new Error(type + ' type is not one of: ' + transformTypes.join(', '));
    if (typeof name !== 'string') throw new Error('name must be a string');
    if (matcher && typeof matcher !== 'function') throw new Error('matcher must be a function');
    if (typeof transformer !== 'function') throw new Error('transformer must be a function');

    // make sure to trigger the setter
    target.transform = {
      ...target.transform,
      [name]: {
        type,
        matcher,
        transitive: !!transitive,
        transformer,
      },
    };
    return this;
  }

  get transform() {
    const ctor = /** @type {typeof Register} */ (this.constructor);
    return { ...ctor.transform, ...this._transform };
  }

  /** @param {Record<string, Omit<Transform, 'name'>>} v */
  set transform(v) {
    this._transform = v;
  }

  /**
   * @param {{ name: string; transforms: string[]; }} cfg
   */
  static registerTransformGroup(cfg) {
    // this = class
    this.__registerTransformGroup(cfg, this);
  }

  /**
   * @param {{ name: string; transforms: string[]; }} cfg
   */
  registerTransformGroup(cfg) {
    // this = instance
    /** @type {typeof Register} */ (this.constructor).__registerTransformGroup(cfg, this);
  }

  /**
   * @param {{ name: string; transforms: string[]; }} transformGroup
   * @param {typeof Register | Register} target
   */
  static __registerTransformGroup(transformGroup, target) {
    const { name, transforms } = transformGroup;
    if (typeof name !== 'string') throw new Error('transform name must be a string');
    if (!Array.isArray(transforms))
      throw new Error('transforms must be an array of registered value transforms');

    transforms.forEach((t) => {
      if (!(t in target.transform))
        throw new Error('transforms must be an array of registered value transforms');
    });
    // make sure to trigger the setter
    target.transformGroup = {
      ...target.transformGroup,
      [name]: transforms,
    };
    return target;
  }

  get transformGroup() {
    const ctor = /** @type {typeof Register} */ (this.constructor);
    return { ...ctor.transformGroup, ...this._transformGroup };
  }

  /** @param {Record<string, string[]>} v */
  set transformGroup(v) {
    this._transformGroup = v;
  }

  /**
   * @param {Format} cfg
   */
  static registerFormat(cfg) {
    // this = class
    this.__registerFormat(cfg, this);
  }

  /**
   * @param {Format} cfg
   */
  registerFormat(cfg) {
    // this = instance
    /** @type {typeof Register} */ (this.constructor).__registerFormat(cfg, this);
  }

  /**
   * @param  {Format} format
   * @param {typeof Register | Register} target
   */
  static __registerFormat(format, target) {
    const { name, formatter } = format;
    if (typeof name !== 'string')
      throw new Error("Can't register format; format.name must be a string");
    if (typeof formatter !== 'function')
      throw new Error("Can't register format; format.formatter must be a function");
    // make sure to trigger the setter
    target.format = {
      ...target.format,
      [name]: formatter,
    };
    return target;
  }

  get format() {
    const ctor = /** @type {typeof Register} */ (this.constructor);
    return { ...ctor.format, ...this._format };
  }

  /** @param {Record<string, Formatter>} v */
  set format(v) {
    this._format = v;
  }

  /**
   * @param {Action} cfg
   */
  static registerAction(cfg) {
    // this = class
    this.__registerAction(cfg, this);
  }

  /**
   * @param {Action} cfg
   */
  registerAction(cfg) {
    // this = instance
    /** @type {typeof Register} */ (this.constructor).__registerAction(cfg, this);
  }

  /**
   * @param {Action} action
   * @param {typeof Register | Register} target
   */
  static __registerAction(action, target) {
    const { name, do: _do, undo } = action;
    if (typeof name !== 'string') throw new Error('name must be a string');
    if (typeof _do !== 'function') throw new Error('do must be a function');
    // make sure to trigger the setter
    target.action = {
      ...target.action,
      [name]: {
        do: _do,
        undo,
      },
    };
    return target;
  }

  get action() {
    const ctor = /** @type {typeof Register} */ (this.constructor);
    return { ...ctor.action, ...this._action };
  }

  /** @param {Record<string, Omit<Action,'name'>>} v */
  set action(v) {
    this._action = v;
  }

  /**
   * @param {Filter} cfg
   */
  static registerFilter(cfg) {
    // this = class
    this.__registerFilter(cfg, this);
  }

  /**
   * @param {Filter} cfg
   */
  registerFilter(cfg) {
    // this = instance
    /** @type {typeof Register} */ (this.constructor).__registerFilter(cfg, this);
  }

  /**
   * @param {Filter} filter
   * @param {typeof Register | Register} target
   */
  static __registerFilter(filter, target) {
    const { name, matcher } = filter;
    if (typeof name !== 'string')
      throw new Error("Can't register filter; filter.name must be a string");
    if (typeof matcher !== 'function')
      throw new Error("Can't register filter; filter.matcher must be a function");
    // make sure to trigger the setter
    target.filter = {
      ...target.filter,
      [name]: matcher,
    };
    return target;
  }

  get filter() {
    const ctor = /** @type {typeof Register} */ (this.constructor);
    return { ...ctor.filter, ...this._filter };
  }

  /** @param {Record<string, Matcher>} v */
  set filter(v) {
    this._filter = v;
  }

  /**
   * @param {Parser} cfg
   */
  static registerParser(cfg) {
    // this = class
    this.__registerParser(cfg, this);
  }

  /**
   * @param {Parser} cfg
   */
  registerParser(cfg) {
    // this = instance
    /** @type {typeof Register} */ (this.constructor).__registerParser(cfg, this);
  }

  /**
   * @param {import('../types/Parser.d.ts').Parser} parser
   * @param {typeof Register | Register} target
   */
  static __registerParser(parser, target) {
    const { pattern, parse } = parser;
    if (!(pattern instanceof RegExp))
      throw new Error(`Can't register parser; parser.pattern must be a regular expression`);
    if (typeof parse !== 'function')
      throw new Error("Can't register parser; parser.parse must be a function");
    // make sure to trigger the setter
    target.parsers = [...target.parsers, parser];
    return target;
  }

  get parsers() {
    const ctor = /** @type {typeof Register} */ (this.constructor);
    return [...ctor.parsers, ...(this._parsers ?? [])];
  }

  /** @param {Parser[]} v */
  set parsers(v) {
    this._parsers = v;
  }

  /**
   * @param {Preprocessor} cfg
   */
  static registerPreprocessor(cfg) {
    // this = class
    this.__registerPreprocessor(cfg, this);
  }

  /**
   * @param {Preprocessor} cfg
   */
  registerPreprocessor(cfg) {
    // this = instance
    /** @type {typeof Register} */ (this.constructor).__registerPreprocessor(cfg, this);
  }

  /**
   * @param {Preprocessor} cfg
   * @param {typeof Register | Register} target
   */
  static __registerPreprocessor(cfg, target) {
    const { name, preprocessor } = cfg;
    const errorPrefix = 'Cannot register preprocessor;';
    if (typeof name !== 'string')
      throw new Error(`${errorPrefix} Preprocessor.name must be a string`);
    if (!(preprocessor instanceof Function)) {
      throw new Error(`${errorPrefix} Preprocessor.preprocessor must be a function`);
    }
    // make sure to trigger the setter
    target.preprocessors = {
      ...target.preprocessors,
      [name]: preprocessor,
    };
    return target;
  }

  get preprocessors() {
    const ctor = /** @type {typeof Register} */ (this.constructor);
    return { ...ctor.preprocessors, ...this._preprocessors };
  }

  /** @param {Record<string, preprocessor>} v */
  set preprocessors(v) {
    this._preprocessors = v;
  }

  /**
   * @param {{name: string; fileHeader: FileHeader;}} cfg
   */
  static registerFileHeader(cfg) {
    // this = class
    this.__registerFileHeader(cfg, this);
  }

  /**
   * @param {{name: string; fileHeader: FileHeader;}} cfg
   */
  registerFileHeader(cfg) {
    // this = instance
    /** @type {typeof Register} */ (this.constructor).__registerFileHeader(cfg, this);
  }

  /**
   * @param {{name: string; fileHeader: FileHeader;}} cfg
   * @param {typeof Register | Register} target
   */
  static __registerFileHeader(cfg, target) {
    const { name, fileHeader } = cfg;
    if (typeof name !== 'string')
      throw new Error("Can't register file header; options.name must be a string");
    if (typeof fileHeader !== 'function')
      throw new Error("Can't register file header; options.fileHeader must be a function");

    // make sure to trigger the setter
    target.fileHeader = {
      ...target.fileHeader,
      [name]: fileHeader,
    };
    return target;
  }

  get fileHeader() {
    const ctor = /** @type {typeof Register} */ (this.constructor);
    return { ...ctor.fileHeader, ...this._fileHeader };
  }

  /** @param {Record<string, FileHeader>} v */
  set fileHeader(v) {
    this._fileHeader = v;
  }

  constructor() {
    this.transform = {};
    this.transformGroup = {};
    this.format = {};
    this.action = {};
    this.filter = {};
    this.fileHeader = {};
    this.parsers = []; // we need to initialise the array, since we don't have built-in parsers
    this.preprocessors = {};
  }
}
