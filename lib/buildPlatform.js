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

const transformConfig = require('./transform/config');
const buildFiles = require('./buildFiles');
const performActions = require('./performActions');
const Logger = require('./utils/logger');
const PlatformLogger = require('./utils/logger/platform');
const createDictionary = require('./utils/createDictionary');

/**
 * Takes a platform and performs all transforms to
 * the properties object (non-mutative) then
 * builds all the files and performs any actions. This is useful if you only want to
 * build the artifacts of one platform to speed up the build process.
 *
 * This method is also used internally in [buildAllPlatforms](#buildAllPlatforms) to
 * build each platform defined in the config.
 *
 * @static
 * @memberof module:style-dictionary
 * @param {String} platform - Name of the platform you want to build.
 * @returns {module:style-dictionary}
 * @example
 * ```js
 * StyleDictionary.buildPlatform('web');
 * ```
 * ```bash
 * $ style-dictionary build --platform web
 * ```
 */
function buildPlatform(platform) {
  if (!this.options || !(platform in (this.options.platforms || {}))) {
    throw new Error(`Platform "${platform}" does not exist`);
  }

  // Set up the logger for the platform
  Logger.platform = new PlatformLogger({
    name: platform,
    transforms: Object.keys(this.transform),
    transformGroups: Object.keys(this.transformGroup),
    formats: Object.keys(this.format),
    actions: Object.keys(this.action)
  });

  // We don't want to mutate the original object
  const platformConfig = transformConfig(this.options.platforms[platform], this, platform);

  const properties = this.exportPlatform(platform, platformConfig);

  // This is the dictionary object we pass to the file
  // building and action methods.
  const dictionary = createDictionary({properties});

  buildFiles(dictionary, platformConfig);
  performActions(dictionary, platformConfig);

  const hasErrored = Logger.emitPlatform();
  if (hasErrored)
    throw new Error(`Errors were found when building platform: ${platform}`)

  // For chaining
  return this;
}


module.exports = buildPlatform;
