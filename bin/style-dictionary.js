#!/usr/bin/env node

'use strict';

import JSON5 from 'json5';
import program from 'commander';
import path from 'path';
import { fileURLToPath } from 'url';
import node_fs from 'node:fs';
// usually also node:fs in this context, but can be customized by user
import { fs } from 'style-dictionary/fs';
import StyleDictionary from 'style-dictionary';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pkg = JSON5.parse(node_fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));

function collect(val, arr) {
  arr.push(val);
  return arr;
}

function getConfigPath(options) {
  let configPath = options.config;

  if (!configPath) {
    if (fs.existsSync('./config.json')) {
      configPath = './config.json';
    } else if (fs.existsSync('./config.js')) {
      configPath = './config.js';
    } else {
      console.error('Build failed; unable to find config file.');
      process.exit(1);
    }
  }

  return path.resolve(configPath);
}

program.version(pkg.version).description(pkg.description).usage('[command] [options]');

program
  .command('build')
  .description('Builds a style dictionary package from the current directory.')
  .option('-c, --config <path>', 'set config path. defaults to ./config.json')
  .option(
    '-p, --platform [platform]',
    'only build specific platforms. Must be defined in the config',
    collect,
    [],
  )
  .action(styleDictionaryBuild);

program
  .command('clean')
  .description(
    'Removes files specified in the config of the style dictionary package of the current directory.',
  )
  .option('-c, --config <path>', 'set config path. defaults to ./config.json')
  .option(
    '-p, --platform [platform]',
    'only clean specific platform(s). Must be defined in the config',
    collect,
    [],
  )
  .action(styleDictionaryClean);

program
  .command('init <type>')
  .description('Generates a starter style dictionary')
  .action(function (type) {
    const types = ['basic', 'complete'];
    if (types.indexOf(type) < 0) {
      console.error('Please supply 1 type of project from: ' + types.join(', '));
      process.exit(1);
    }

    console.log('Copying starter files...\n');
    node_fs.copySync(path.join(__dirname, '..', 'examples', type), process.cwd());
    console.log('Source style dictionary starter files created!\n');
    console.log(
      'Running `style-dictionary build` for the first time to generate build artifacts.\n',
    );
    styleDictionaryBuild();
  });

// error on unknown commands
program.on('command:*', function () {
  console.error(
    'Invalid command: %s\nSee --help for a list of available commands.',
    process.argv.slice(2).join(' '),
  );
  process.exit(1);
});

async function styleDictionaryBuild(options) {
  options = options || {};
  const configPath = getConfigPath(options);

  // Create a style dictionary object with the config
  const styleDictionary = new StyleDictionary(configPath);

  if (options.platform && options.platform.length > 0) {
    return Promise.all(
      options.platforms.map((platform) => styleDictionary.buildPlatform(platform)),
    );
  } else {
    return styleDictionary.buildAllPlatforms();
  }
}

async function styleDictionaryClean(options) {
  options = options || {};
  const configPath = getConfigPath(options);

  // Create a style dictionary object with the config
  const styleDictionary = new StyleDictionary(configPath);

  if (options.platform && options.platform.length > 0) {
    return Promise.all(
      options.platforms.map((platform) => styleDictionary.cleanPlatform(platform)),
    );
  } else {
    return styleDictionary.cleanAllPlatforms();
  }
}

program.parse(process.argv);

// show help on no command
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
