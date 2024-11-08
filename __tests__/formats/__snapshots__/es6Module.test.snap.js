/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["formats javascript/esm should be a valid JS file and match snapshot"] = 
`/**
 * Do not edit directly, this file was auto-generated.
 */

export default {
  colors: {
    red: {
      500: {
        value: "#ff0000",
        type: "color",
        path: ["colors", "red", "500"],
        filePath: "tokens.json",
        attributes: {
          foo: "bar",
        },
        name: "colors-red-500",
      },
    },
  },
  dimensions: {
    xs: {
      value: "15px",
      type: "dimension",
      path: ["dimension", "xs"],
      filePath: "tokens.json",
      attributes: {
        foo: "bar",
      },
      name: "dimension-xs",
    },
  },
};
`;
/* end snapshot formats javascript/esm should be a valid JS file and match snapshot */

snapshots["formats javascript/esm should optionally allow stripping StyleDictionary metadata"] = 
`/**
 * Do not edit directly, this file was auto-generated.
 */

export default {
  colors: {
    red: {
      500: {
        value: "#ff0000",
        type: "color",
      },
    },
  },
  dimensions: {
    xs: {
      value: "15px",
      type: "dimension",
    },
  },
};
`;
/* end snapshot formats javascript/esm should optionally allow stripping StyleDictionary metadata */

snapshots["formats javascript/esm should optionally allow stripping everything but an allowlist of props"] = 
`/**
 * Do not edit directly, this file was auto-generated.
 */

export default {
  colors: {
    red: {
      500: {
        value: "#ff0000",
        type: "color",
      },
    },
  },
  dimensions: {
    xs: {
      value: "15px",
      type: "dimension",
    },
  },
};
`;
/* end snapshot formats javascript/esm should optionally allow stripping everything but an allowlist of props */

snapshots["formats javascript/esm should optionally allow stripping custom list of metadata props"] = 
`/**
 * Do not edit directly, this file was auto-generated.
 */

export default {
  colors: {
    red: {
      500: {
        value: "#ff0000",
        type: "color",
        path: ["colors", "red", "500"],
        name: "colors-red-500",
      },
    },
  },
  dimensions: {
    xs: {
      value: "15px",
      type: "dimension",
      path: ["dimension", "xs"],
      name: "dimension-xs",
    },
  },
};
`;
/* end snapshot formats javascript/esm should optionally allow stripping custom list of metadata props */

snapshots["formats javascript/esm should optionally allow stripping StyleDictionary metadata for DTCG formatted tokens"] = 
`/**
 * Do not edit directly, this file was auto-generated.
 */

export default {
  colors: {
    red: {
      500: {
        $value: "#ff0000",
        $type: "color",
      },
    },
  },
  dimensions: {
    xs: {
      $value: "15px",
      $type: "dimension",
    },
  },
};
`;
/* end snapshot formats javascript/esm should optionally allow stripping StyleDictionary metadata for DTCG formatted tokens */

