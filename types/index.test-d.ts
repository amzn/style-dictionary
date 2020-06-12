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

import { expectType } from "tsd";
import StyleDictionary = require(".");

expectType<StyleDictionary.Core>(StyleDictionary.buildAllPlatforms());
expectType<StyleDictionary.Core>(StyleDictionary.buildPlatform("web"));

expectType<StyleDictionary.Core>(StyleDictionary.cleanAllPlatforms());

expectType<StyleDictionary.Core>(StyleDictionary.cleanPlatform("web"));
expectType<StyleDictionary.Properties>(StyleDictionary.exportPlatform("web"));

expectType<StyleDictionary.Core>(StyleDictionary.extend("config.json"));

expectType<StyleDictionary.Core>(
  StyleDictionary.extend({
    source: ["properties/**/*.json"],
    platforms: {
      scss: {
        transformGroup: "scss",
        buildPath: "build/",
        files: [
          {
            destination: "variables.scss",
            format: "scss/variables",
          },
        ],
      },
    },
  })
);

expectType<StyleDictionary.Core>(
  StyleDictionary.registerAction({
    name: "copy_assets",
    do: function (dictionary, config) {
      console.log(
        "Copying assets directory",
        "assets",
        config.buildPath + "assets"
      );
    },
    undo: function (dictionary, config) {
      console.log("Cleaning assets directory", config.buildPath + "assets");
    },
  })
);

expectType<StyleDictionary.Core>(
  StyleDictionary.registerFilter({
    name: "isColor",
    matcher: function (prop) {
      return prop.attributes.category === "color";
    },
  })
);

expectType<StyleDictionary.Core>(
  StyleDictionary.registerFormat({
    name: "json",
    formatter: function (dictionary, config) {
      return JSON.stringify(dictionary.properties, null, 2);
    },
  })
);

expectType<StyleDictionary.Core>(
  StyleDictionary.registerTemplate({
    name: "Swift/colors",
    template: __dirname + "/templates/swift/colors.template",
  })
);

expectType<StyleDictionary.Core>(
  StyleDictionary.registerTransform({
    name: "time/seconds",
    type: "value",
    matcher: function (prop) {
      return prop.attributes.category === "time";
    },
    transformer: function (prop) {
      return (parseInt(prop.original.value) / 1000).toString() + "s";
    },
  })
);

expectType<StyleDictionary.Core>(
  StyleDictionary.registerTransformGroup({
    name: "Swift",
    transforms: ["attribute/cti", "size/pt", "name/cti"],
  })
);
