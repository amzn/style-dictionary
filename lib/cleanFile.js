import chalk from 'chalk';
import { join } from 'path-unified/posix';
import { fs } from 'style-dictionary/fs';
import { logVerbosityLevels } from './enums/index.js';

/**
 * @typedef {import('../types/Volume.d.ts').Volume} Volume
 * @typedef {import('../types/File.d.ts').File} File
 * @typedef {import('../types/Config.d.ts').PlatformConfig} PlatformConfig
 */

const { silent } = logVerbosityLevels;

/**
 * Takes the style property object and a format and returns a
 * string that can be written to a file.
 * @memberOf StyleDictionary
 * @param {File} file
 * @param {PlatformConfig} [platform]
 * @param {Volume} [vol]
 */
export default async function cleanFile(file, platform = {}, vol = fs) {
  /** @type {Record<'warning'|'success', string[]>} */
  const cleanLogs = {
    warning: [],
    success: [],
  };
  let { destination } = file;

  if (typeof destination !== 'string') throw new Error('Please enter a valid destination');

  // if there is a clean path, prepend the destination with it
  if (platform.buildPath) {
    destination = join(platform.buildPath, destination);
  }
  destination = destination.replace(/\\/g, '/');

  if (!vol.existsSync(destination) && platform?.log?.verbosity !== silent) {
    cleanLogs.success.push(chalk.bold.red('!') + ' ' + destination + ', does not exist');
    return cleanLogs;
  }

  vol.unlinkSync(destination);
  if (platform?.log?.verbosity !== silent) {
    cleanLogs.success.push(chalk.bold.red('-') + ' ' + destination);
  }
  return cleanLogs;
}
