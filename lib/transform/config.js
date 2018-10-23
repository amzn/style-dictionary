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

const _ = require('lodash');

/**
 * Takes a platform config object and returns a new one
 * that has transforms, formats, templates, and actions
 * mapped properly.
 * @private
 * @param {Object} config
 * @param {Object} dictionary
 * @returns {Object}
 */
function transformConfig(config, dictionary) {
  const toRet = _.clone(config);

  // The platform can define either a transformGroup or an array
  // of transforms. If given a transformGroup that doesn't exist,
  // it will throw an error so the user is aware the transformGroup doesn't
  // exist. A valid case is if the user defines neither, no transforms will be
  // applied.
  let transforms = [];
  if (toRet.transforms) {
    /* eslint-disable prefer-destructuring */
    transforms = toRet.transforms;
  } else if (toRet.transformGroup) {
    transforms = dictionary.transformGroup[toRet.transformGroup];
    if (!transforms) {
      throw new Error(`transformGroup ${toRet.transformGroup} doesn't exist`);
    }
  }

  // Transforms are an array of strings that map to functions on
  // the StyleDictionary module. We need to map the strings to
  // the actual functions.
  toRet.transforms = _.map(transforms, name => dictionary.transform[name]);

  toRet.files = _.map(config.files, file => {
    if (file.template) {
      if (dictionary.template[file.template]) {
        return _.extend({}, file, {
          template: dictionary.template[file.template],
        });
      }
      throw new Error(`Can't find template: ${file.template}`);
    } else if (file.format) {
      if (dictionary.format[file.format]) {
        return _.extend({}, file, { format: dictionary.format[file.format] });
      }
      throw new Error(`Can't find format: ${file.format}`);
    } else {
      throw new Error(`Please supply a format or template for file: ${JSON.stringify(file)}`);
    }
  });

  toRet.actions = _.map(config.actions, action => {
    if (typeof dictionary.action[action].undo !== 'function') {
      console.warn(`${action} action does not have a clean function!`);
    }
    return dictionary.action[action];
  });

  return toRet;
}

module.exports = transformConfig;
