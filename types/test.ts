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

import StyleDictionary = require("style-dictionary");

// $ExpectType Core
StyleDictionary.buildAllPlatforms();
// $ExpectType Core
StyleDictionary.buildPlatform("web");
// $ExpectType Core
StyleDictionary.cleanAllPlatforms();
// $ExpectType Core
StyleDictionary.cleanPlatform("web");
// $ExpectType Properties
StyleDictionary.exportPlatform("web");
// $ExpectType Core
StyleDictionary.extend("config.json");
// $ExpectType Core
StyleDictionary.extend({
  source: ["properties/**/*.json"],
  platforms: {
    scss: {
      transformGroup: "scss",
      buildPath: "build/",
      files: [
        {
          destination: "variables.scss",
          format: "scss/variables"
        }
      ]
    }
  }
});
// $ExpectType Core
StyleDictionary.registerAction({
  name: "copy_assets",
  do: function(dictionary, config) {
    console.log(
      "Copying assets directory",
      "assets",
      config.buildPath + "assets"
    );
  },
  undo: function(dictionary, config) {
    console.log("Cleaning assets directory", config.buildPath + "assets");
  }
});
// $ExpectType Core
StyleDictionary.registerFilter({
  name: "isColor",
  matcher: function(prop) {
    return prop.attributes.category === "color";
  }
});
// $ExpectType Core
StyleDictionary.registerFormat({
  name: "json",
  formatter: function(dictionary, config) {
    return JSON.stringify(dictionary.properties, null, 2);
  }
});
// $ExpectType Core
StyleDictionary.registerTemplate({
  name: "Swift/colors",
  template: __dirname + "/templates/swift/colors.template"
});

// $ExpectType Core
StyleDictionary.registerTransform({
  name: "time/seconds",
  type: "value",
  matcher: function(prop) {
    return prop.attributes.category === "time";
  },
  transformer: function(prop) {
    return (parseInt(prop.original.value) / 1000).toString() + "s";
  }
});

// $ExpectType Core
StyleDictionary.registerTransformGroup({
  name: "Swift",
  transforms: ["attribute/cti", "size/pt", "name/cti"]
});
