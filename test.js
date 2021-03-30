const StyleDictionary = require('./index');

StyleDictionary.extend({
  properties: {
    color: {
      red: { value: "#f00" },
      blue: { value: "#00f" },
      danger: { value: "calc({color.red.value}, {color.blue.value})" },
      test: { value: "{color.red.value}" }
    }
  },
  platforms: {
    css: {
      transformGroup: `css`,
      files: [{
        destination: `variables.css`,
        format: `css/variables`,
        options: {
          outputReferences: true
        }
      }]
    }
  }
}).buildAllPlatforms();