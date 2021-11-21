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

const filterDictionary = require('../../../lib/common/formatHelpers/filterDictionary');

const simpleData = {
  empty: {},
  noTarget: {
    color: {
      tertiary: "#222",
    },
  },
  rootLevel: {
    primary: {
      color: 'darkblue',
    },
    color: {
      tertiary: "#222",
    },
  },
  firstLevel: {
    primary: {
      color: 'darkblue',
    },
    color: {
      primary: "#333",
      secondary: "#222",
      tertiary: "#111",
    },
  },
  fourthLevel: {
    gradient: {
      border: {
        radius: {
          primary: "30px",
          secondary: "40px",
        },
      },
    },
    motion: {
      border: {
        radius: {
          tertiary: '50px',
          accent: '60px',
        },
      }
    },
  },
};

const simpleDataResultForFilter = {
  target: 'primary',
  targetArray: ['primary', 'secondary'],
  rootLevelResult: {
    primary: {
      color: 'darkblue',
    },
  },
  firstLevelResult: {
    primary: {
      color: 'darkblue',
    },
    color: {
      primary: "#333",
      secondary: "#222",
    },
  },
  firstLevelResultWithRoot: {
    color: {
      primary: "#333",
    },
  },
  fourthLevelResult: {
    gradient: {
      border: {
        radius: {
          primary: "30px",
          secondary: "40px",
        },
      },
    },
  }
};

const complexData = {
  validJSONTokens: {
    "color": {
      "common": {
        "primary": {
          "description": null,
          "type": "color",
          "value": "#2196F3",
          "filePath": "tokens/design-tokens.json",
          "isSource": true,
          "original": {
            "description": null,
            "type": "color",
            "value": "#2196F3ff"
          },
          "name": "primary",
          "attributes": {},
          "path": [
            "color",
            "common",
            "primary"
          ]
        },
        "secondary": {
          "description": null,
          "type": "color",
          "value": "#3F51B5",
          "filePath": "tokens/design-tokens.json",
          "isSource": true,
          "original": {
            "description": null,
            "type": "color",
            "value": "#3F51B5ff"
          },
          "name": "secondary",
          "attributes": {},
          "path": [
            "color",
            "common",
            "secondary"
          ]
        },
        "tertiary": {
          "description": null,
          "type": "color",
          "value": "#673AB7",
          "filePath": "tokens/design-tokens.json",
          "isSource": true,
          "original": {
            "description": null,
            "type": "color",
            "value": "#673AB7ff"
          },
          "name": "tertiary",
          "attributes": {},
          "path": [
            "color",
            "common",
            "tertiary"
          ]
        }
      }
    }
  },
  result: {
    "color": {
      "common": {
        "primary": {
          "description": null,
          "type": "color",
          "value": "#2196F3",
        },
        "secondary": {
          "description": null,
          "type": "color",
          "value": "#3F51B5",
        },
        "tertiary": {
          "description": null,
          "type": "color",
          "value": "#673AB7",
        }
      }
    }
  },
  targets: [
    "description",
    "type",
    "value",
  ],
};

describe('common', function () {
  describe('formatHelpers', function () {
    it('should return empty object when it gets null object', function () {
      const result = filterDictionary(null, null, simpleData.target);
      const expectVal = {};
      expect(result).toEqual(expectVal);
    });

    it('should return source object when there is no target', function () {
      const result = filterDictionary(simpleData.root);
      const expectVal = simpleData.root;
      expect(result).toEqual(expectVal);
    });

    it('should return empty object when it gets empty object', function () {
      const result = filterDictionary(simpleData.empty, null,  simpleDataResultForFilter.target);
      const expectVal = {};
      expect(result).toEqual(expectVal);
    });

    it('should return empty object when nothing is found', function () {
      const result = filterDictionary(simpleData.noTarget, 'original', simpleDataResultForFilter.target);
      const expectVal = {};
      expect(result).toEqual(expectVal);
    });

    it('should return valid json when it gets target on root level', function () {
      const result = filterDictionary(simpleData.rootLevel, 'original', simpleDataResultForFilter.target);
      const expectVal = simpleDataResultForFilter.rootLevelResult;
      expect(result).toEqual(expectVal);
    });

    it('should return valid json when it gets target on first level', function () {
      const result = filterDictionary(simpleData.firstLevel, 'original', ...simpleDataResultForFilter.targetArray);
      const expectVal = simpleDataResultForFilter.firstLevelResult;
      expect(result).toEqual(expectVal);
    });

    it('should return valid json when it gets target on fourth level', function () {
      const result = filterDictionary(simpleData.fourthLevel, 'original', simpleDataResultForFilter.targetArray);
      const expectVal = simpleDataResultForFilter.fourthLevelResult;
      expect(result).toEqual(expectVal);
    });

    it('should return valid json when it gets complex json', function () {
      const result = filterDictionary(complexData.validJSONTokens, 'original', complexData.targets);
      const expectVal = complexData.result;
      expect(result).toEqual(expectVal);
    });
  });
});
