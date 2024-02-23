/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["integration valid custom file headers file options registered file header should match snapshot"] = 
`/**
 * hello
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

:root {
  --color-red: #ff0000;
}
`;
/* end snapshot integration valid custom file headers file options registered file header should match snapshot */

snapshots["integration valid custom file headers file options config file header should match snapshot"] = 
`/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 * hello, world!
 */

:root {
  --color-red: #ff0000;
}
`;
/* end snapshot integration valid custom file headers file options config file header should match snapshot */

snapshots["integration valid custom file headers file options inline file header should match snapshot"] = 
`/**
 * build version 1.0.0
 */

:root {
  --color-red: #ff0000;
}
`;
/* end snapshot integration valid custom file headers file options inline file header should match snapshot */

snapshots["integration valid custom file headers platform options no file options should match snapshot"] = 
`/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 * hello, world!
 */

module.exports = {
  "color": {
    "red": {
      "value": "#ff0000",
      "original": {
        "value": "#ff0000"
      },
      "name": "ColorRed",
      "attributes": {
        "category": "color",
        "type": "red"
      },
      "path": [
        "color",
        "red"
      ]
    }
  }
};
`;
/* end snapshot integration valid custom file headers platform options no file options should match snapshot */

snapshots["integration valid custom file headers platform options showFileHeader should match snapshot"] = 
`module.exports = {
  "color": {
    "red": {
      "value": "#ff0000",
      "original": {
        "value": "#ff0000"
      },
      "name": "ColorRed",
      "attributes": {
        "category": "color",
        "type": "red"
      },
      "path": [
        "color",
        "red"
      ]
    }
  }
};
`;
/* end snapshot integration valid custom file headers platform options showFileHeader should match snapshot */

snapshots["integration valid custom file headers platform options file header override should match snapshot"] = 
`/**
 * Header overridden
 */

module.exports = {
  "color": {
    "red": {
      "value": "#ff0000",
      "original": {
        "value": "#ff0000"
      },
      "name": "ColorRed",
      "attributes": {
        "category": "color",
        "type": "red"
      },
      "path": [
        "color",
        "red"
      ]
    }
  }
};
`;
/* end snapshot integration valid custom file headers platform options file header override should match snapshot */

