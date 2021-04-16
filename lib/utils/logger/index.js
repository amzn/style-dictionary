/*
 * Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */

const chalk = require('chalk');
const FileLogger = require('./file');
const PlatformLogger = require('./platform');
const ConfigLogger = require('./config');
const { LOG_LEVELS, LOG_MAP, LOG_COLORS } = require('./consts');

const Logger = {
  logLevel: 'info',
  init: function() {
    // Start a timer so we can show how long the process takes
    this._startTime = Date.now();
    return this;
  },

  setLogLevel: function(level = 'notice') {
    const logLevel = level.toLowerCase().trim();

    // Log on the logger... inception
    if (LOG_LEVELS.includes(logLevel)) {
      this.logLevel = logLevel;
    } else {
      this.warn(`The log level "${level}" is not one of the recognized levels: ${LOG_LEVELS.join(', ')}. Defaulting to 'notice'`);
      this.logLevel = `notice`;
    }
    return this;
  },

  log: function(level, message, deferred) {
    if (message.trim().length === 0) {
      return;
    }

    if (deferred) {
      this.DEFERRED[level].push(message);
    } else {
      const currentLogLevel = LOG_MAP[this.logLevel];
      const levelValue = LOG_MAP[level];
      // Only display this message if it less than or equal to the
      // current log level. The higher the log level, the less messages
      // get shown.
      if (currentLogLevel <= levelValue) {
        console.log(
          chalk[LOG_COLORS[level]](message)
        );
      }
    }
  },

  info: function(message, deferred = false) {
    this.log(`info`, message, deferred);
  },

  warn: function(message, deferred = false) {
    this.log(`warn`, message, deferred);
  },

  error: function(message, deferred = false) {
    this.hasErrored = true;
    this.log(`error`, message, deferred);
  },

  file: new FileLogger({}),
  files: [],

  // this is a bit different than flushing all messages
  emitFile: function() {
    // const { status } = this.file;
    // this.log(status, this.file.title());
    // this.log(status, this.file.messages());
    this.files.push(this.file);
    this.platform.addFile(this.file);
  },

  platform: new PlatformLogger({}),
  platforms: [],

  // this is a bit different than flushing all messages
  emitPlatform: function() {
    const { status } = this.platform;
    this.log(status, this.platform.title());
    this.log(status, this.platform.messages());
    this.platforms.push(this.platform);
    const hasErrored = LOG_MAP[status] >= LOG_MAP.error ? true : false;
    return hasErrored;
  },

  config: new ConfigLogger({}),

  emitConfig: function() {
    const { status } = this.config;
    // this.log(status, this.config.title());
    this.log(status, this.config.messages());
  },

  clear: function() {
    this.files = [];
    this.platforms = [];
    this.platform = new PlatformLogger({});
    this.file = new FileLogger({});
    this.config = new ConfigLogger({});
  },
};

module.exports = Logger;