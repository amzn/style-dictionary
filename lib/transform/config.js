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

var _     = require('../utils/es6_'),
    deepExtend = require('../utils/deepExtend'),
    Logger = require('../utils/logger');

/**
 * Takes a platform config object and returns a new one
 * that has filters, transforms, formats, and actions
 * mapped properly.
 * @private
 * @param {Object} config
 * @param {Object} dictionary
 * @param {Object} platformName (only used for error messaging)
 * @returns {Object}
 */
function transformConfig(config, dictionary, platformName) {
  var to_ret = _.clone(config);

  // The platform can define either a transformGroup or an array
  // of transforms. If given a transformGroup that doesn't exist,
  // it will throw an error to make the user aware that the transformGroup doesn't
  // exist. A valid case is if the user defines neither, no transforms will be
  // applied.
  var transforms = [];
  if (to_ret.transforms) {
    transforms = to_ret.transforms;
  } else if (to_ret.transformGroup) {
    if (dictionary.transformGroup[to_ret.transformGroup]) {
      transforms = dictionary.transformGroup[to_ret.transformGroup];
    } else {
      // this should just throw at this point
      Logger.platform.addMissingTransformGroup(to_ret.transformGroup);
    }
  }

  // Transforms are an array of strings that map to functions on
  // the StyleDictionary module. We need to map the strings to
  // the actual functions.
  to_ret.transforms = transforms.map(function(name) {
    if (!dictionary.transform[name]) {
      // this should just throw too
      Logger.platform.addMissingTransform(name);
    }
    return dictionary.transform[name];
  });

  // Apply registered fileHeaders onto the platform options
  if (config.options && config.options.fileHeader) {
    const fileHeader = config.options.fileHeader;
    if (typeof fileHeader === 'string') {
      if (dictionary.fileHeader[fileHeader]) {
        to_ret.options.fileHeader = dictionary.fileHeader[fileHeader];
      } else {
        throw new Error(`Can't find fileHeader: ${fileHeader}`);
      }
    } else if (typeof fileHeader !== 'function') {
      throw new Error(`fileHeader must be a string or a function`)
    } else {
      to_ret.options.fileHeader = fileHeader;
    }
  }

  to_ret.files = (config.files || []).map(function(file) {
    const ext = { options: {} };
    if (file.options && file.options.fileHeader) {
      const fileHeader = file.options.fileHeader;
      if (typeof fileHeader === 'string') {
        if (dictionary.fileHeader[fileHeader]) {
          ext.options.fileHeader = dictionary.fileHeader[fileHeader];
        } else {
          throw new Error(`Can't find fileHeader: ${fileHeader}`);
        }
      } else if (typeof fileHeader !== 'function') {
        throw new Error(`fileHeader must be a string or a function`)
      } else {
        ext.options.fileHeader = fileHeader;
      }
    }

    if (file.filter) {
      if(typeof file.filter === 'string') {
        if (dictionary.filter[file.filter]) {
          ext.filter = dictionary.filter[file.filter];
        } else {
          throw new Error('Can\'t find filter: ' + file.filter);
        }
      } else if (typeof file.filter === 'object') {
        ext.filter =  _.matches(file.filter);
      } else if (typeof file.filter === 'function') {
        ext.filter = file.filter;
      } else {
        throw new Error('Filter format not valid: ' + typeof file.filter);
      }
    }

    if (file.template) {
      if (dictionary.format[file.template]) {
        Logger.platform.addTemplateDeprecation(file.template);
        ext.format = dictionary.format[file.template];
      } else {
        throw new Error('Can\'t find template: ' + file.template);
      }
    } else if (file.format) {
      if (dictionary.format[file.format]) {
        ext.format = dictionary.format[file.format];
      } else {
        throw new Error('Can\'t find format: ' + file.format);
      }
    } else {
      throw new Error('Please supply a format for file: ' + JSON.stringify(file));
    }
    return deepExtend([{}, file, ext]);
  });

  to_ret.actions = (config.actions || []).map(function(name) {
    let action = dictionary.action[name];
    if (!action) {
      Logger.platform.addMissingAction(name);
    } else {
      if (typeof action.undo !== 'function') {
        Logger.platform.addMissingAction(`${name} does not have a 'undo' function`)
      }

      if (typeof action.do !== 'function') {
        Logger.platform.addMissingAction(`${name} does not have a 'do' function`)
      }
    }

    return dictionary.action[name];
  });

  return to_ret;
}

module.exports = transformConfig;
