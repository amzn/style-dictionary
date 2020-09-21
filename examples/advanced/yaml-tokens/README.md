## Yaml Tokens

This example shows how to use a custom parser to define yaml token files.

#### Running the example

First of all, set up the required dependencies running the command `npm install` in your local CLI environment (if you prefer to use *yarn* update the commands accordingly).

At this point, if you want to build the tokens you can run `npm run build`. This command will run the Style Dictionary CLI with the **sd.config.js** as the configuration file and will generate the files in the `build` folder.

#### How does it work?

Style Dictionary added the ability to use custom parsers for token files in the 3.0 release. A custom parser has a regular expression pattern to match against source filenames. The parse function is then run taking the text content of the file and returning an object. A custom parser is like a module rule in a webpack configuration.

#### What to look at

The [`sd.config.js`](sd.config.js) file is the first thing to look at. It has a lot of comments how everything works. It shows how you can add a custom parser and set it to the yaml parser. You can also look in the [`tokens/`](tokens/) directory to see a yaml token file. 

