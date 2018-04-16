const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.safeLoad(fs.readFileSync('./config.yml'));
const deepExtend = require('style-dictionary/lib/utils/deepExtend');

// Need to combine properties files

// const StyleDictionary = require('style-dictionary')
