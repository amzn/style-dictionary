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
var chalk = require('chalk');

var errors = [];
var unsavedErrors = {};

var getFinalThreadErrors = function(thread) {
  var errArr = [];
  errArr.push('\n' + thread + ':\n');
  if(thread && unsavedErrors[thread] && unsavedErrors[thread].length) {
    errArr = errArr.concat(unsavedErrors[thread]);
    delete unsavedErrors[thread];
  }
  errArr.push('\n\n');
  return errArr;
};

var consoleOutputErrArr = function(errArr, chalkType) {
  if(!chalkType) {
    chalkType = chalk.bold.red;
  }
  errArr.forEach(function(err) {
    console.error(chalkType(err));
  });
};

var ErrorHandler = {
  show: function (thread, chalkType) {
    if(thread) {
      if(unsavedErrors[thread]) {
        consoleOutputErrArr(unsavedErrors[thread], chalkType);
      }
    }
    else {
      consoleOutputErrArr(errors, chalkType);
    }
  },

  flush: function (thread, chalkType) {
    if(thread) {
      if(unsavedErrors[thread]) {
        var errArr = getFinalThreadErrors(thread);
        consoleOutputErrArr(errArr, chalkType);
      }
    }
    else {
      consoleOutputErrArr(errors, chalkType);
      errors = [];
    }
  },

  add: function (arg1, arg2) {
    var thread, error;
    if(arg2) {
      thread = arg1,
      error = arg2;
      if(!unsavedErrors[thread]) {
        unsavedErrors[thread] = [];
      }
      unsavedErrors[thread].push(error);
    }
    else {
      error = arg1;
      errors.push(error);
    }
  },

  done: function (thread) {
    if(unsavedErrors[thread] && unsavedErrors[thread].length) {
      var errArr = getFinalThreadErrors(thread);
      errors = errors.concat(errArr);
    }
  },

  count: function (thread) {
    return thread ? (unsavedErrors[thread] ? unsavedErrors[thread].length : 0) : errors.length;
  },

  fetch: function (thread) {
    return thread ? unsavedErrors[thread] : errors;
  },

  clear: function (thread) {
    if (thread) {
      unsavedErrors[thread] && delete unsavedErrors[thread];
    }
  }
};

module.exports = ErrorHandler;
