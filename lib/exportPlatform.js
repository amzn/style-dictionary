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

const resolveObject = require('./utils/resolveObject'),
    getName = require('./utils/references/getName'),
    transformObject = require('./transform/object'),
    transformConfig = require('./transform/config'),
    Logger = require('./utils/logger');

/**
 * Exports a properties object with applied
 * platform transforms.
 *
 * This is useful if you want to use a style
 * dictionary in JS build tools like webpack.
 *
 * @static
 * @memberof module:style-dictionary
 * @param {String} platform - The platform to be exported.
 * Must be defined on the style dictionary.
 * @returns {Object}
 */
function exportPlatform(platform, platformConfig) {
  if (!platform || !this.options.platforms[platform]) {
    throw new Error('Please supply a valid platform');
  }

  // We don't want to mutate the original object
  platformConfig = platformConfig || transformConfig(this.options.platforms[platform], this);

  let exportableResult = this.properties;

  // list keeping paths of props with applied value transformations
  const transformedPropRefs = [];
  // list keeping paths of props that had references in it, and therefore
  // could not (yet) have transformed
  const deferredPropValueTransforms = [];

  const transformationContext = {
    transformedPropRefs,
    deferredPropValueTransforms
  };

  let deferredPropCount = 0;
  let finished;

  while(typeof finished === "undefined") {
    // We keep up transforming and resolving until all props are resolved
    // and every defined transformation was executed. Remember: transformations
    // can only be executed, if the value to be transformed, has no references
    // in it. So resolving may lead to enable further transformations, and sub
    // sequent resolving may enable even more transformations - and so on.
    // So we keep this loop running until sub sequent transformations are ineffective.
    //
    // Take the following example:
    //
    // color.brand = {
    //   value: "{color.base.green}"
    // }
    //
    // color.background.button.primary.base = {
    //   value: "{color.brand.value}",
    //   color: {
    //     desaturate: 0.5
    //   }
    // }
    //
    // color.background.button.primary.hover = {
    //   value: "{color.background.button.primary.base}",
    //   color: {
    //     darken: 0.2
    //   }
    // }
    //
    // As you can see 'color.background.button.primary.hover' is a variation
    // of 'color.background.button.primary.base' which is a variation of
    // 'color.base.green'. These transitive references are solved by running
    // this loop until all properties are transformed and resolved.

    // We need to transform the object before we resolve the
    // variable names because if a value contains concatenated
    // values like "1px solid {color.border.base}" we want to
    // transform the original value (color.border.base) before
    // replacing that value in the string.
    const transformed = transformObject(exportableResult, platformConfig, transformationContext);

    // referenced values, that have not (yet) been transformed should be excluded from resolving
    const ignorePathsToResolve = deferredPropValueTransforms.map(p => getName([p, 'value']));
    exportableResult = resolveObject(transformed, {ignorePaths: ignorePathsToResolve});

    const newDeferredPropCount = deferredPropValueTransforms.length;

    // nothing left to transform -> ready
    if (newDeferredPropCount === 0) {
      finished = true;
    // or deferred count doesn't go down, that means there
    // is a circular reference -> ready (but errored)
    } else if (deferredPropCount === newDeferredPropCount) {
      // if we didn't resolve any deferred references then we have a circular reference
      // the resolveObject method will find the circular references
      // we do this in case there are multiple circular references
      resolveObject(transformed);
      finished = true;
    } else {
      // neither of these things, keep going.
      deferredPropCount = newDeferredPropCount;
    }
  }

  // we want to quit early if there are errors here,
  // but not emit all messages just yet?
  if (Logger.platform.status === `error`) {
    Logger.emitPlatform();
    throw new Error(`Errors were found when building platform: ${platform}`);
  }

  return exportableResult;
}


module.exports = exportPlatform;
