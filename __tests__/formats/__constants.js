const createDictionary = require("../../lib/utils/createDictionary");

const colorPropertyName = "color-base-red-400";
const colorPropertyValue = "#EF5350";

const colorProperties = {
  color: {
    base: {
      red: {
        400: {
          "name": colorPropertyName,
          "value": colorPropertyValue,
          "original": {
            "value": colorPropertyValue
          },
          "attributes": {
            "category": "color",
            "type": "base",
            "item": "red",
            "subitem": "400"
          },
          "path": [
            "color",
            "base",
            "red",
            "400"
          ]
        }
      }
    }
  }
};

const iconPropertyName = "content-icon-email";
const iconPropertyValue = "'\\E001'";
const itemClass = "3d_rotation";

const iconProperties = {
  content: {
    icon: {
      email: {
        "name": iconPropertyName,
        "value": iconPropertyValue,
        "original": {
          "value": iconPropertyValue
        },
        "attributes": {
          "category": "content",
          "type": "icon",
          "item": itemClass
        },
        path: ['content','icon','email']
      }
    }
  }
};

const colorDictionary = createDictionary({ properties: colorProperties });
const iconDictionary = createDictionary({ properties: iconProperties });

module.exports = {
  colorDictionary,
  iconDictionary
}