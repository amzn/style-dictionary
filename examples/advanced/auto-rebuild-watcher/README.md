## How to use a watcher to auto-rebuild

This example shows how to use a "watcher" to rebuild automatically the files every time a token file is updated.

This is quite handy when there are continuous changes to the token values (e.g. during development) and we want to avoid to run the "build" command at every update.

#### Running the example

First of all, set up the required dependencies running the command `npm install` in your local CLI environment (if you prefer to use *yarn*, update the commands accordingly).

At this point, if you want to build once the tokens you can run `npm run build`. This command will generate the files in the `build` folder.

If instead you want to automatically build the tokens every time a token file is updated, run the command `npm run watch` in your CLI.

This will start to watch the files in the "tokens" folder, and whenever a file is updated and saved, the files in `build` are re-generated with the new/updated values.

If you want to see it in action, open one of the files generated in "build", open a token file and update one of the values: you will see immediately updated also the generated file.

**Important**: when in "watch" mode, to interrupt and exit the process and get back to your command line, use the `ctrl-c` command in your terminal.

#### How does it work

The "watch" runner will start a process (using a special filesystem watcher called [Chokidar](https://github.com/paulmillr/chokidar)) that will listen to changes to a list of "watched" files. Whenever one of this file is changed/updated (more precisely, is saved to disk) the watch process will trigger a command specified by the user (as an argument passed to the watcher).

In this example, we have selected all the JSON files in the `tokens` folder (using the glob pattern `tokens/**/*.json`) but you can specify your own path of watched files.

The command that we automatically run at every update is the `npm run build` command, passed as parameter to the watcher via `-c 'npm run build'`.

#### What to look at

Open the `package.json` file and see how in the "scripts" block there is an additional entry for "watch". This is the way the "watch" mode is invoked and run.
