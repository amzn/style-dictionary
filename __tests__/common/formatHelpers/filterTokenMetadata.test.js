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

const {filterExcludeTokenMetadata, filterIncludeTokenMetadata} = require('../../../lib/common/formatHelpers/filterTokenMetadata');

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
  },
  fourthLevelResultExclude: {
    gradient: {
      border: {
        radius:{ 
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
          "original": {
            "description": null,
            "type": "color",
            "value": "#2196F3ff"
          },
        },
        "secondary": {
          "description": null,
          "type": "color",
          "value": "#3F51B5",
          "original": {
            "description": null,
            "type": "color",
            "value": "#3F51B5ff"
          },
        },
        "tertiary": {
          "description": null,
          "type": "color",
          "value": "#673AB7",
          "original": {
            "description": null,
            "type": "color",
            "value": "#673AB7ff"
          },
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
      const result = filterIncludeTokenMetadata(null, simpleData.target);
      const expectVal = {};
      expect(result).toEqual(expectVal);
    });

    it('should return source object when there is no target', function () {
      const result = filterIncludeTokenMetadata(simpleData.root);
      const expectVal = simpleData.root;
      expect(result).toEqual(expectVal);
    });

    it('should return empty object when it gets empty object', function () {
      const result = filterIncludeTokenMetadata(simpleData.empty,  simpleDataResultForFilter.target);
      const expectVal = {};
      expect(result).toEqual(expectVal);
    });

    it('should return empty object when nothing is found', function () {
      const result = filterIncludeTokenMetadata(simpleData.noTarget, simpleDataResultForFilter.target);
      const expectVal = {};
      expect(result).toEqual(expectVal);
    });

    it('should return valid json when it gets target on root level', function () {
      const result = filterIncludeTokenMetadata(simpleData.rootLevel, simpleDataResultForFilter.target);
      const expectVal = simpleDataResultForFilter.rootLevelResult;
      expect(result).toEqual(expectVal);
    });

    it('should return valid json when it gets target on first level', function () {
      const result = filterIncludeTokenMetadata(simpleData.firstLevel, ...simpleDataResultForFilter.targetArray);
      const expectVal = simpleDataResultForFilter.firstLevelResult;
      expect(result).toEqual(expectVal);
    });

    it('should return valid json when it gets target on fourth level', function () {
      const result = filterIncludeTokenMetadata(simpleData.fourthLevel, simpleDataResultForFilter.targetArray);
      const expectVal = simpleDataResultForFilter.fourthLevelResult;
      expect(result).toEqual(expectVal);
    });
    
    it('should return valid json when it gets target on fourth level (exclude)', function () {
      const result = filterExcludeTokenMetadata(simpleData.fourthLevel, 'primary');
      const expectVal = simpleDataResultForFilter.fourthLevelResultExclude;
      expect(result).toEqual(expectVal);
    });
    
    it('should return valid json when it gets complex json', function () {
      const result = filterIncludeTokenMetadata(complexData.validJSONTokens, complexData.targets);
      const expectVal = complexData.result;
      expect(result).toEqual(expectVal);
    });
  });
});
