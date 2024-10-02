---
title: Splitting output files
---

Common questions are:

- How do I prevent my global/primitive tokens from getting to the output?
- How do I split and output my component tokens in their respective component folders?

This example will show how you can dynamically generate file outputs for each component, and filter out global/primitive tokens.
The trick is to dynamically generate the files array, generate one for each output file you want, and use filters to ensure those outputs only contain the tokens that are relevant.

~ sd-playground

```json tokens
{
  "global": {
    "colors": {
      "black": {
        "value": "#000000",
        "type": "color"
      },
      "white": {
        "value": "#ffffff",
        "type": "color"
      },
      "gray": {
        "100": {
          "value": "#f7fafc",
          "type": "color"
        },
        "200": {
          "value": "#edf2f7",
          "type": "color"
        },
        "300": {
          "value": "#e2e8f0",
          "type": "color"
        },
        "400": {
          "value": "#cbd5e0",
          "type": "color"
        },
        "500": {
          "value": "#a0aec0",
          "type": "color"
        },
        "600": {
          "value": "#718096",
          "type": "color"
        },
        "700": {
          "value": "#4a5568",
          "type": "color"
        },
        "800": {
          "value": "#2d3748",
          "type": "color"
        },
        "900": {
          "value": "#1a202c",
          "type": "color"
        }
      },
      "orange": {
        "100": {
          "value": "#fffaf0",
          "type": "color"
        },
        "200": {
          "value": "#feebc8",
          "type": "color"
        },
        "300": {
          "value": "#fbd38d",
          "type": "color"
        },
        "400": {
          "value": "#f6ad55",
          "type": "color"
        },
        "500": {
          "value": "#ed8936",
          "type": "color"
        },
        "600": {
          "value": "#dd6b20",
          "type": "color"
        },
        "700": {
          "value": "#c05621",
          "type": "color"
        },
        "800": {
          "value": "#9c4221",
          "type": "color"
        },
        "900": {
          "value": "#7b341e",
          "type": "color"
        }
      }
    },
    "spacing": {
      "0": {
        "value": "0px",
        "type": "dimension"
      },
      "1": {
        "value": "4px",
        "type": "dimension"
      },
      "2": {
        "value": "8px",
        "type": "dimension"
      },
      "3": {
        "value": "12px",
        "type": "dimension"
      },
      "4": {
        "value": "16px",
        "type": "dimension"
      },
      "5": {
        "value": "20px",
        "type": "dimension"
      },
      "6": {
        "value": "24px",
        "type": "dimension"
      },
      "7": {
        "value": "28px",
        "type": "dimension"
      },
      "8": {
        "value": "32px",
        "type": "dimension"
      },
      "max": {
        "value": "9999px",
        "type": "dimension"
      }
    }
  },
  "button": {
    "padding": {
      "vertical": {
        "value": "{global.spacing.2}",
        "type": "dimension"
      },
      "horizontal": {
        "value": "{global.spacing.3}",
        "type": "dimension"
      }
    },
    "primary": {
      "default": {
        "backgroundColor": {
          "value": "{global.colors.orange.500}",
          "type": "color"
        },
        "textColor": {
          "value": "{global.colors.white}",
          "type": "color"
        },
        "border": {
          "value": {
            "width": "2px",
            "color": "{global.colors.orange.500}",
            "style": "solid"
          },
          "type": "border"
        }
      },
      "hover": {
        "backgroundColor": {
          "value": "{global.colors.orange.400}",
          "type": "color"
        },
        "border": {
          "value": {
            "width": "2px",
            "color": "{global.colors.orange.400}",
            "style": "solid"
          },
          "type": "border"
        }
      }
    },
    "secondary": {
      "default": {
        "backgroundColor": {
          "value": "transparent",
          "type": "color"
        },
        "textColor": {
          "value": "{global.colors.orange.500}",
          "type": "color"
        },
        "border": {
          "value": {
            "width": "2px",
            "color": "{global.colors.orange.500}",
            "style": "solid"
          },
          "type": "border"
        }
      },
      "hover": {
        "backgroundColor": {
          "value": "{global.colors.orange.500}",
          "type": "color"
        }
      }
    }
  },
  "select": {
    "padding": {
      "vertical": {
        "value": "{global.spacing.2}",
        "type": "dimension"
      },
      "horizontal": {
        "value": "{global.spacing.4}",
        "type": "dimension"
      }
    }
  },
  "switch": {
    "track": {
      "borderRadius": {
        "value": "{global.spacing.max}",
        "type": "borderRadius"
      },
      "height": {
        "value": "{global.spacing.5}",
        "type": "dimension"
      },
      "width": {
        "value": "{global.spacing.8}",
        "type": "dimension"
      }
    },
    "thumb": {
      "borderRadius": {
        "value": "{global.spacing.max}",
        "type": "borderRadius"
      },
      "size": {
        "value": "{global.spacing.4}",
        "type": "dimension"
      }
    }
  }
}
```

```js config
function generateComponentFiles(components) {
  return components.map((comp) => ({
    // output the component tokens in the right folder and file e.g. components/button/button-vars.css
    destination: `components/${comp}/${comp}-vars.css`,
    format: 'css/variables',
    // only include the tokens that are inside this component token group
    filter: (token) => token.path[0] === comp,
  }));
}

export default {
  source: ['tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      files: [
        {
          destination: 'global.css',
          format: 'css/variables',
          // filter only the tokens that are inside the global object
          filter: (token) => token.path[0] === 'global',
        },
        // dynamically generate file outputs for each component
        ...generateComponentFiles(['button', 'select', 'switch']),
      ],
    },
  },
};
```

:::note
You can click the download button to the top right of the interactive demo to download a ZIP file for this particular example.
This contains a README.md telling you which commands to run to get this example running locally.
You will need NodeJS and NPM installed, Node v18 minimum being required.
:::

More information can be found on the [filters documentation](/reference/hooks/filters) and [files config](/reference/hooks/formats/#format-configuration).
