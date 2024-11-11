/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["utils stripMeta should strip meta data properties that are supplied"] = 
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
}`;
/* end snapshot utils stripMeta should strip meta data properties that are supplied */

snapshots["utils stripMeta supports passing an allowlist instead"] = 
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
}`;
/* end snapshot utils stripMeta supports passing an allowlist instead */

snapshots["utils stripMeta should only strip these properties on the token level, not group level"] = 
`{
  "name": {
    "red": {
      "500": {
        "value": "#ff0000",
        "type": "color"
      }
    }
  },
  "dimensions": {
    "attributes": {
      "value": "15px",
      "type": "dimension"
    }
  }
}`;
/* end snapshot utils stripMeta should only strip these properties on the token level, not group level */

snapshots["utils stripMeta should work for DTCG formatted tokens"] = 
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
}`;
/* end snapshot utils stripMeta should work for DTCG formatted tokens */

