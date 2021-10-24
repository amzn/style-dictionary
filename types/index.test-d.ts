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

import { expectType, expectError, expectAssignable } from "tsd";
import StyleDictionary = require(".");

expectType<StyleDictionary.Core>(StyleDictionary.buildAllPlatforms());
expectType<StyleDictionary.Core>(StyleDictionary.buildPlatform("web"));

expectType<StyleDictionary.Core>(StyleDictionary.cleanAllPlatforms());

expectType<StyleDictionary.Core>(StyleDictionary.cleanPlatform("web"));
expectType<StyleDictionary.TransformedTokens>(StyleDictionary.exportPlatform("web"));

expectType<StyleDictionary.Core>(StyleDictionary.extend("config.json"));

expectType<StyleDictionary.Core>(
  StyleDictionary.extend({
    source: ["tokens/**/*.json"],
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
    matcher: function (token) {
      return token.attributes?.category === "color";
    },
  })
);

expectType<StyleDictionary.Core>(
  StyleDictionary.registerFormat({
    name: "json",
    formatter: function ({dictionary, file, options, platform}) {
      expectType<StyleDictionary.Dictionary>(dictionary);
      expectType<StyleDictionary.File>(file);
      expectType<StyleDictionary.Options>(options);
      expectType<StyleDictionary.Platform>(platform);
      return JSON.stringify(dictionary.tokens, null, 2);
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
    matcher: function (token) {
      return token.attributes?.category === "time";
    },
    transformer: function (token) {
      expectType<StyleDictionary.TransformedToken>(token);
      return (parseInt(token.original.value) / 1000).toString() + "s";
    },
  })
);

expectType<StyleDictionary.Core>(
  StyleDictionary.registerTransformGroup({
    name: "Swift",
    transforms: ["attribute/cti", "size/pt", "name/cti"],
  })
);

expectType<StyleDictionary.Core>(
  StyleDictionary.registerParser({
    pattern: /\.json$/,
    parse: ({ contents, filePath }) => {
      return {}
    }
  })
);

const file: StyleDictionary.File = {
  destination: `somePath.json`,
  format: `css/variables`,
  filter: (token) => {
    expectType<StyleDictionary.TransformedToken>(token);
    return false;
  },
  options: {
    showFileHeader: true,
  }
}

expectType<StyleDictionary.Options | undefined>(file.options);

// Files need a destination
expectError<StyleDictionary.File>({
  format: `css/variables`,
});

expectAssignable<StyleDictionary.File>({
  format: `css/variables`,
  destination: `variables.css`
});


expectAssignable<StyleDictionary.Platform>({
  basePxFontSize: 16,
});

expectAssignable<StyleDictionary.Platform>({
  transformGroup: `css`,
});

expectAssignable<StyleDictionary.Platform>({
  transforms: [`attribute/cti`],
});

expectAssignable<StyleDictionary.Platform>({
  transforms: [`attribute/cti`],
  files: [{
    destination: `destination`
  }]
});

expectError<StyleDictionary.Platform>({
  transforms: `css`,
});

expectError<StyleDictionary.Platform>({
  transformGroup: [`attribute/cti`],
});


/**
 * Testing Options type.
 * fileHeader needs to be a string or a function that returns a string[]
 * showFileHeader must be a boolean
 */
expectError<StyleDictionary.Options>({ fileHeader: false });
expectAssignable<StyleDictionary.Options>({ fileHeader: 'fileHeader' });
expectError<StyleDictionary.Options>({ fileHeader: () => 42 });
expectAssignable<StyleDictionary.Options>({ fileHeader: () => [`hello`] });
expectError<StyleDictionary.Options>({ showFileHeader: 'false' });