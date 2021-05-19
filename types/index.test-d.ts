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
import StyleDictionary, {
  TransformedTokens,
  TransformedToken,
  Dictionary,
  File,
  Options,
  Platform
} from ".";

// declare var styleDictionary: StyleDictionary;

expectType<StyleDictionary>(StyleDictionary.buildAllPlatforms());
expectType<StyleDictionary>(StyleDictionary.buildPlatform("web"));

expectType<StyleDictionary>(StyleDictionary.cleanAllPlatforms());

expectType<StyleDictionary>(StyleDictionary.cleanPlatform("web"));
expectType<TransformedTokens>(StyleDictionary.exportPlatform("web"));

expectType<StyleDictionary>(StyleDictionary.extend("config.json"));

expectType<StyleDictionary>(
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

expectType<StyleDictionary>(
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

expectType<StyleDictionary>(
  StyleDictionary.registerFilter({
    name: "isColor",
    matcher: function (token) {
      return token.attributes?.category === "color";
    },
  })
);

expectType<StyleDictionary>(
  StyleDictionary.registerFormat({
    name: "json",
    formatter: function ({dictionary, file, options, platform}) {
      expectType<Dictionary>(dictionary);
      expectType<File>(file);
      expectType<Options>(options);
      expectType<Platform>(platform);
      return JSON.stringify(dictionary.tokens, null, 2);
    },
  })
);

expectType<StyleDictionary>(
  StyleDictionary.registerTemplate({
    name: "Swift/colors",
    template: __dirname + "/templates/swift/colors.template",
  })
);

expectType<StyleDictionary>(
  StyleDictionary.registerTransform({
    name: "time/seconds",
    type: "value",
    matcher: function (token) {
      return token.attributes?.category === "time";
    },
    transformer: function (token) {
      expectType<TransformedToken>(token);
      return (parseInt(token.original.value) / 1000).toString() + "s";
    },
  })
);

expectType<StyleDictionary>(
  StyleDictionary.registerTransformGroup({
    name: "Swift",
    transforms: ["attribute/cti", "size/pt", "name/cti"],
  })
);

expectType<StyleDictionary>(
  StyleDictionary.registerParser({
    pattern: /\.json$/,
    parse: ({ contents, filePath }) => {
      return {}
    }
  })
);

const file: File = {
  destination: `somePath.json`,
  format: `css/variables`,
  filter: (token) => {
    expectType<TransformedToken>(token);
    return false;
  },
  options: {
    showFileHeader: true,
  }
}

expectType<Options | undefined>(file.options);

// Files need a destination
expectError<File>({
  format: `css/variables`,
});

expectAssignable<File>({
  format: `css/variables`,
  destination: `variables.css`
});


expectAssignable<Platform>({
  transformGroup: `css`,
});

expectAssignable<Platform>({
  transforms: [`attribute/cti`],
});

expectAssignable<Platform>({
  transforms: [`attribute/cti`],
  files: [{
    destination: `destination`
  }]
});

expectError<Platform>({
  transforms: `css`,
});

expectError<Platform>({
  transformGroup: [`attribute/cti`],
});


/**
 * Testing Options type.
 * fileHeader needs to be a string or a function that returns a string[]
 * showFileHeader must be a boolean
 */
expectError<Options>({ fileHeader: false });
expectAssignable<Options>({ fileHeader: 'fileHeader' });
expectError<Options>({ fileHeader: () => 42 });
expectAssignable<Options>({ fileHeader: () => [`hello`] });
expectError<Options>({ showFileHeader: 'false' });