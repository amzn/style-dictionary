#!/usr/bin/env node

'use strict';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import node_fs from 'node:fs';
import JSON5 from 'json5';
import program from 'commander';
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

  return configPath;
}

program.version(pkg.version).description(pkg.description).usage('[command] [options]');

program
  .command('build')
  .description('Builds a style dictionary package from the current directory.')
  .option('-c, --config <path>', 'set config path. defaults to ./config.json')
  .option(
    '-v, --verbose',
    'enable verbose logging for reference errors, token collisions and filtered tokens with outputReferences',
  )
  .option('-n, --no-warn', 'disable all warnings, only success logs and fatal errors shown')
  .option('-s, --silent', 'silence all logging, except for fatal errors')
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
    '-v, --verbose',
    'enable verbose logging for reference errors, token collisions and filtered tokens with outputReferences',
  )
  .option('-n, --no-warn', 'disable all warnings, only success logs and fatal errors shown')
  .option('-s, --silent', 'silence all logging, except for fatal errors')
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
    /* eslint-disable no-console */
    console.log('Copying starter files...\n');
    node_fs.cpSync(path.join(__dirname, '..', 'examples', type), process.cwd(), {
      recursive: true,
    });
    console.log('Source style dictionary starter files created!\n');
    console.log(
      'Running `style-dictionary build` for the first time to generate build artifacts.\n',
    );
    /* eslint-disable no-console */
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

function getSD(configPath, options) {
  let verbosity;
  let warnings;
  if (options.verbose || options.silent) {
    verbosity = options.verbose ? 'verbose' : 'silent';
  }
  if (options.warn === false) {
    warnings = 'disabled';
  }
  return new StyleDictionary(configPath, { verbosity, warnings });
}

async function styleDictionaryBuild(options) {
  options = options || {};
  const configPath = getConfigPath(options);
  const sd = getSD(configPath, options);

  if (options.platform && options.platform.length > 0) {
    return Promise.all(options.platforms.map((platform) => sd.buildPlatform(platform)));
  } else {
    return sd.buildAllPlatforms();
  }
}

async function styleDictionaryClean(options) {
  options = options || {};
  const configPath = getConfigPath(options);
  const sd = getSD(configPath, options);

  if (options.platform && options.platform.length > 0) {
    return Promise.all(options.platforms.map((platform) => sd.cleanPlatform(platform)));
  } else {
    return sd.cleanAllPlatforms();
  }
}

program.parse(process.argv);

// show help on no command
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
