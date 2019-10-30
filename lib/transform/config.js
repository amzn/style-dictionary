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

var _     = require('lodash'),
    GroupMessages = require('../utils/groupMessages');

var TEMPLATE_DEPRECATION_WARNINGS = GroupMessages.GROUP.TemplateDeprecationWarnings;
var MISSING_TRANSFORM_ERRORS = GroupMessages.GROUP.MissingRegisterTransformErrors;

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
      let err = `
Unknown transformGroup "${to_ret.transformGroup}" found in platform "${platformName}":
"${to_ret.transformGroup}" does not match the name of a registered transformGroup.
`;
      throw new Error(err);
    }
  }

  // Transforms are an array of strings that map to functions on
  // the StyleDictionary module. We need to map the strings to
  // the actual functions.
  to_ret.transforms = transforms.map(function(name) {
    if(!dictionary.transform[name]) {
      GroupMessages.add(
        MISSING_TRANSFORM_ERRORS,
        `"${name}"`
      );
    }
    return dictionary.transform[name];
  });

  let missingTransformCount = GroupMessages.count(MISSING_TRANSFORM_ERRORS);
  if(missingTransformCount > 0) {
    var transform_warnings = GroupMessages.flush(MISSING_TRANSFORM_ERRORS).join(', ');
    let err;

    if(missingTransformCount==1) {
      err = `
Unknown transform ${transform_warnings} found in platform "${platformName}":
${transform_warnings} does not match the name of a registered transform.
`;
    }
    else {
        err = `
Unknown transforms ${transform_warnings} found in platform "${platformName}":
None of ${transform_warnings} match the name of a registered transform.
`;
    }

    throw new Error(err);
  }

  to_ret.files = (config.files || []).map(function(file) {
    const ext = {};
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
        GroupMessages.add(
          TEMPLATE_DEPRECATION_WARNINGS,
          `${file.destination} (template: ${file.template})`
        );
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
    return _.extend({}, file, ext);
  });

  to_ret.actions = (config.actions || []).map(function(action) {
    if (typeof dictionary.action[action].undo !== 'function') {
      console.warn(action + " action does not have a clean function!");
    }
    return dictionary.action[action];
  });

  return to_ret;
}

module.exports = transformConfig;
