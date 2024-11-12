/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["formats json should be a valid JSON file and match snapshot"] = 
`{
  "colors": {
    "red": {
      "500": {
        "value": "#ff0000",
        "type": "color",
        "path": [
          "colors",
          "red",
          "500"
        ],
        "filePath": "tokens.json",
        "attributes": {
          "foo": "bar"
        },
        "name": "colors-red-500"
      }
    }
  },
  "dimensions": {
    "xs": {
      "value": "15px",
      "type": "dimension",
      "path": [
        "dimension",
        "xs"
      ],
      "filePath": "tokens.json",
      "attributes": {
        "foo": "bar"
      },
      "name": "dimension-xs"
    }
  }
}
`;
/* end snapshot formats json should be a valid JSON file and match snapshot */

snapshots["formats json should optionally allow stripping StyleDictionary metadata"] = 
`{
  "colors": {
    "red": {
      "500": {
        "value": "#ff0000",
        "type": "color"
      }
    }
  },
  "dimensions": {
    "xs": {
      "value": "15px",
      "type": "dimension"
    }
  }
}
`;
/* end snapshot formats json should optionally allow stripping StyleDictionary metadata */

snapshots["formats json should optionally allow stripping everything but an allowlist of props"] = 
`{
  "colors": {
    "red": {
      "500": {
        "value": "#ff0000",
        "type": "color"
      }
    }
  },
  "dimensions": {
    "xs": {
      "value": "15px",
      "type": "dimension"
    }
  }
}
`;
/* end snapshot formats json should optionally allow stripping everything but an allowlist of props */

snapshots["formats json should optionally allow stripping custom list of metadata props"] = 
`{
  "colors": {
    "red": {
      "500": {
        "value": "#ff0000",
        "type": "color",
        "path": [
          "colors",
          "red",
          "500"
        ],
        "name": "colors-red-500"
      }
    }
  },
  "dimensions": {
    "xs": {
      "value": "15px",
      "type": "dimension",
      "path": [
        "dimension",
        "xs"
      ],
      "name": "dimension-xs"
    }
  }
}
`;
/* end snapshot formats json should optionally allow stripping custom list of metadata props */

snapshots["formats json should optionally allow stripping StyleDictionary metadata for DTCG formatted tokens"] = 
`{
  "colors": {
    "red": {
      "500": {
        "$value": "#ff0000",
        "$type": "color"
      }
    }
  },
  "dimensions": {
    "xs": {
      "$value": "15px",
      "$type": "dimension"
    }
  }
}
`;
/* end snapshot formats json should optionally allow stripping StyleDictionary metadata for DTCG formatted tokens */

