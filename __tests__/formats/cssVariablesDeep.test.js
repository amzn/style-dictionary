var fs = require('fs-extra');
var helpers = require('../__helpers');
const formats = require('../../lib/common/formats');

var file = {
  "destination": "__output/",
  "format": "css/variables-deep"
};

var dictionary = {
  "allProperties": [
    {
      name: "color-blue-20",
      value: "#0000ff",
      original: {
        value: "#0000ff",
      },
    },
    {
      name: "primary",
      value: "#00ff00",
      original: {
        value: "{color.blue-20.value}",
      },
    },
    {
      name: "icon",
      value: "acme-icon",
      attributes: { "data-type": "string" },
    },
    {
      name: "width",
      value: "100px",
      attributes: { "data-type": "number" },
    }
  ]
};

describe('formats', () => {
  describe('css/variables-deep', () => {

    // mock the Date.now() call to a fixed value
    const constantDate = new Date('2000-01-01');
    const globalDate = global.Date;

    var formatter = formats['css/variables-deep'].bind(file);

    beforeEach(() => {
      global.Date = function() { return constantDate };
      helpers.clearOutput();
    });

    afterEach(() => {
      global.Date = globalDate;
      helpers.clearOutput();
    });

    it('should generate a css variables file with alias references', () => {
      fs.writeFileSync('./__tests__/__output/output.css', formatter(dictionary, {}) );
      const testFile = fs.readFileSync("./__tests__/__output/output.css", "UTF-8");
      expect(testFile).toMatchSnapshot();
    });

    it('should work with a prefix', () => {
      fs.writeFileSync('./__tests__/__output/output.css', formatter(dictionary, { prefix: "acme" }) );
      const testFile = fs.readFileSync("./__tests__/__output/output.css", "UTF-8");
      expect(testFile).toMatchSnapshot();
    });
  });

});
