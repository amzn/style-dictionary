/*
 * Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

// Minimum TypeScript Version: 3.0

declare namespace StyleDictionary {
  interface Property {
    value: string;
    comment?: string;
    [key: string]: any;
  }

  interface Properties {
    [key: string]: Properties | Property;
  }

  interface Options {
    showFileHeader: boolean;
  }

  interface File {
    destination?: string;
    format?: string;
    filter?: string | Partial<Prop> | ((property: Prop) => boolean);
    options?: Options;
  }

  interface Platform {
    transformGroup?: string;
    transforms?: string[];
    prefix?: string;
    buildPath?: string;
    files?: File[];
    actions?: string[];
  }

  interface Config {
    parsers?: Parser[];
    transform?: Transforms;
    include?: string[];
    source: string[];
    platforms: { [platform: string]: Platform };
  }

  interface Attributes {
    category: string;
    type: string;
    item?: string;
    subitem?: string;
    state?: string;
  }

  interface Prop {
    /** A default name of the property that is set to the key of the property. */
    name: string;
    value: string;
    /** The object path of the property.
     *
     * `color: { background: { primary: { value: "#fff" } } }` will have a path of `['color', 'background', 'primary']`.
     */
    path: string[];
    /**
     * A pristine copy of the original property object.
     *
     * This is to make sure transforms and formats always have the unmodified version of the original property.
     */
    original: Property;
    /**
     * The file path of the file the token is defined in.
     *
     * This file path is derived from the source or include file path arrays defined in the configuration.
     */
    filePath: string;
    /**
     * If the token is from a file defined in the source array as opposed to include in the [configuration](https://amzn.github.io/style-dictionary/#/config).
     */
    isSource: boolean;
    attributes: Attributes;
    [key: string]: any;
  }

  interface NameTransform {
    type: "name";
    matcher?: (prop: Prop) => boolean;
    transformer: (prop: Prop, options?: Platform) => string;
  }

  interface ValueTransform {
    type: "value";
    transitive?: boolean;
    matcher?: (prop: Prop) => boolean;
    transformer: (prop: Prop, options?: Platform) => string;
  }

  interface AttributeTransform {
    type: "attribute";
    matcher?: (prop: Prop) => boolean;
    transformer: (prop: Prop, options?: Platform) => { [key: string]: any };
  }

  type Transform = NameTransform | ValueTransform | AttributeTransform;

  interface Transforms {
    [name: string]: Transform;
  }

  interface TransformGroup {
    name: string;
    transforms: string[];
  }

  interface TransformGroups {
    [name: string]: string[];
  }

  type Formatter = (this: File, dictionary: Core, config: Platform) => string;

  interface Format {
    name: string;
    formatter: Formatter;
  }

  interface Formats {
    [name: string]: Formatter;
  }

  interface Action {
    do(dictionary: Core, config: Platform): void;
    undo?(dictionary: Core, config: Platform): void;
  }

  interface Actions {
    [name: string]: Action;
  }

  type Matcher = (prop: Prop) => boolean;

  interface Filter {
    name: string;
    matcher: Matcher;
  }

  interface Filters {
    [name: string]: Matcher;
  }

  interface ParserOptions {
    contents: string;
    filePath: string;
  }

  interface Parser {
    pattern: RegExp;
    parse: (props: ParserOptions) => Properties;
  }

  type Named<T> = T & {
    name: string;
  };

  interface Core {
    VERSION: string;
    properties: Properties;
    allProperties: Prop[];
    options: Config;

    transform: Transforms;
    transformGroup: TransformGroups;
    format: Formats;
    action: Actions;
    filter: Filters;

    registerTransform(this: Core, options: Named<Transform>): this;
    registerTransformGroup(this: Core, options: TransformGroup): this;
    registerFormat(this: Core, format: Format): this;
    registerTemplate(this: Core, template: Named<{ template: string }>): this;
    registerAction(this: Core, action: Named<Action>): this;
    registerFilter(this: Core, filter: Filter): this;
    registerParser(this: Core, parser: Parser): this;

    exportPlatform(this: Core, platform: string): Properties;
    buildPlatform(this: Core, platform: string): this;
    buildAllPlatforms(this: Core): this;

    cleanPlatform(this: Core, platform: string): this;
    cleanAllPlatforms(this: Core): this;

    extend(this: Core, options: string | Config): this;
  }
}

declare var StyleDictionary: StyleDictionary.Core;
export = StyleDictionary;
export as namespace StyleDictionary;
