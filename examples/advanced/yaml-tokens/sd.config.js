const yaml = require('yaml');

module.exports = {
  parsers: [
    {
      // A custom parser will only run against filenames that match the pattern
      // This pattern will match any file with the .yaml extension.
      // This allows you to mix different types of files in your token source
      pattern: /\.yaml$/,
      // the parse function takes a single argument, which is an object with
      // 2 attributes: contents which is a string of the file contents, and
      // filePath which is the path of the file.
      // The function is expected to return a plain object.
      parse: ({ contents }) => yaml.parse(contents),
    },
  ],
  source: [`tokens/**/*.yaml`],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
        },
      ],
    },
  },
};
