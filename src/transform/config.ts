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

import isPlainObject from 'is-plain-obj';
import deepExtend from '../utils/deepExtend';
import GroupMessages from '../utils/groupMessages';
import { deepmerge } from '../utils/deepmerge';
import chalk from 'chalk';
import type { PlatformConfig, TransformedFile } from '../types';
import type { StyleDictionary } from '../StyleDictionary';
import type { TransformedPlatformConfig } from '../types/Config';

const MISSING_TRANSFORM_ERRORS = GroupMessages.GROUP.MissingRegisterTransformErrors;

/**
 * Takes a platform platformConfig object and returns a new one
 * that has filters, transforms, formats, and actions
 * mapped properly.
 * @private
 * @param {PlatformConfig} platformConfig
 * @param {StyleDictionary} dictionary
 * @param {string} platformName (only used for error messaging)
 * @returns {PlatformConfig}
 */
export default function transformConfig(
  platformConfig: PlatformConfig,
  dictionary: StyleDictionary,
  platformName: string,
): TransformedPlatformConfig {
  const to_ret = { ...platformConfig }; // structuredClone not suitable due to config being able to contain Function() etc.
  to_ret.log = deepmerge(dictionary.log ?? {}, platformConfig.log ?? {});

  // The platform can both a transformGroup or an array
  // of transforms. If given a transformGroup that doesn't exist,
  // it will throw an error to make the user aware that the transformGroup doesn't
  // exist. A valid case is if the user defines neither, no transforms will be
  // applied.

  let transforms: string[] = [];
  if (to_ret.transformGroup) {
    if (dictionary.hooks.transformGroups?.[to_ret.transformGroup]) {
      transforms = dictionary.hooks.transformGroups[to_ret.transformGroup];
    } else {
      let err = `
Unknown transformGroup "${to_ret.transformGroup}" found in platform "${platformName}":
"${to_ret.transformGroup}" does not match the name of a registered transformGroup.
`;
      throw new Error(err);
    }
  }

  if (to_ret.transforms) {
    // typecast because at this point, transforms are still strings without functions
    transforms = transforms.concat(to_ret.transforms as string[]);
  }

  // Transforms are an array of strings that map to functions on
  // the StyleDictionary module. We need to map the strings to
  // the actual functions.
  const _transforms = transforms.map(function (name) {
    if (!dictionary.hooks.transforms?.[name]) {
      GroupMessages.add(MISSING_TRANSFORM_ERRORS, `"${name}"`);
    }
    return dictionary.hooks.transforms[name];
  });

  let missingTransformCount = GroupMessages.count(MISSING_TRANSFORM_ERRORS);
  if (missingTransformCount > 0) {
    const transform_warnings = GroupMessages.flush(MISSING_TRANSFORM_ERRORS).join(', ');
    let err;

    if (missingTransformCount == 1) {
      err = `
Unknown transform ${transform_warnings} found in platform "${platformName}":
${transform_warnings} does not match the name of a registered transform.
`;
    } else {
      err = `
Unknown transforms ${transform_warnings} found in platform "${platformName}":
None of ${transform_warnings} match the name of a registered transform.
`;
    }

    throw new Error(err);
  }

  // Apply registered fileHeaders onto the platform options
  if (to_ret.options?.fileHeader) {
    const fileHeader = to_ret.options.fileHeader;
    if (typeof fileHeader === 'string') {
      if (dictionary.hooks.fileHeaders?.[fileHeader]) {
        to_ret.options.fileHeader = dictionary.hooks.fileHeaders[fileHeader];
      } else {
        throw new Error(`Can't find fileHeader: ${fileHeader}`);
      }
    } else if (typeof fileHeader !== 'function') {
      throw new Error(`fileHeader must be a string or a function`);
    } else {
      to_ret.options.fileHeader = fileHeader;
    }
  }

  let files: TransformedFile[] = [];
  if (to_ret.files) {
    files = to_ret.files.map(function (file) {
      const ext: TransformedFile = { options: {} };
      if (file.options && file.options.fileHeader && ext.options) {
        const fileHeader = file.options.fileHeader;
        if (typeof fileHeader === 'string') {
          if (dictionary.hooks.fileHeaders?.[fileHeader]) {
            ext.options.fileHeader = dictionary.hooks.fileHeaders[fileHeader];
          } else {
            throw new Error(`Can't find fileHeader: ${fileHeader}`);
          }
        } else if (typeof fileHeader !== 'function') {
          throw new Error(`fileHeader must be a string or a function`);
        } else {
          ext.options.fileHeader = fileHeader;
        }
      }

      if (file.filter) {
        if (typeof file.filter === 'string') {
          if (dictionary.hooks.filters?.[file.filter]) {
            ext.filter = dictionary.hooks.filters[file.filter];
          } else {
            throw new Error("Can't find filter: " + file.filter);
          }
        } else if (typeof file.filter === 'object') {
          /**
           * Recursively go over the object keys of filter object and
           * return a filter Function that filters tokens
           * by the specified object keys.
           * @param {any} inputObj
           * @param {any} testObj
           * @returns {boolean}
           */
          const matchFn = function (inputObj: any, testObj: any): boolean {
            if (isPlainObject(testObj)) {
              return Object.keys(testObj).every((key) => matchFn(inputObj[key], testObj[key]));
            } else {
              return inputObj == testObj;
            }
          };

          /**
           * @param {{[key: string]: unknown}} matchObj
           */
          const matches = function (matchObj: Record<string, unknown>) {
            let cloneObj = { ...matchObj }; // shallow clone, structuredClone not suitable because obj can contain "Function()"
            let matchesFn = (inputObj: Record<string, unknown>) => matchFn(inputObj, cloneObj);
            return matchesFn;
          };
          ext.filter = matches(file.filter);
        } else if (typeof file.filter === 'function') {
          ext.filter = file.filter;
        } else {
          throw new Error('Filter format not valid: ' + typeof file.filter);
        }
      }

      if (file.format) {
        /**
         * We know at this point it should be a string
         * Only later will it be transformed to contain the format function
         */
        const format = file.format as string;
        if (dictionary.hooks.formats[format]) {
          ext.format = dictionary.hooks.formats[format];
        } else {
          throw new Error("Can't find format: " + format);
        }
      } else {
        throw new Error('Please supply a format for file: ' + JSON.stringify(file));
      }

      // destination is a required prop so we have to prefill it here, or it breaks return type
      //
      const extended = deepExtend<TransformedFile>([{ destination: '' }, file, ext]);

      return extended;
    });
  }

  const actions = to_ret.actions || [];
  const _actions = actions.map(function (action) {
    if (typeof dictionary.hooks.actions?.[action as string].undo !== 'function') {
      const message = `${action} action does not have a clean function!`;
      if (to_ret.log?.warnings === 'error') {
        throw new Error(message);
      } else if (to_ret.log?.verbosity !== 'silent') {
        // eslint-disable-next-line no-console
        console.log(chalk.rgb(255, 140, 0).bold(message));
      }
    }
    // TODO: we assume it exists, but perhaps we should check and throw error if action cannot be found
    return dictionary.hooks.actions?.[action as string];
  });

  return {
    ...to_ret,
    transforms: _transforms,
    actions: _actions,
    files,
  };
}
