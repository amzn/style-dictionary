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

var getFinalGroupErrors = function(errorGroup) {
  var errArr = [];
  errArr.push('\n' + errorGroup + ':\n');
  if(errorGroup && unsavedErrors[errorGroup] && unsavedErrors[errorGroup].length) {
    errArr = errArr.concat(unsavedErrors[errorGroup]);
    delete unsavedErrors[errorGroup];
  }
  errArr.push('\n\n');
  return errArr;
};

var consoleOutputErrArr = function(errArr, chalkType) {
  if(!chalkType) {
    chalkType = chalk.bold.red;
  }
  errArr.forEach(function(err) {
    console.error(chalkType(err.message || err));
  });
};

var ErrorHandler = {
  show: function (errorGroup, chalkType) {
    if(errorGroup) {
      if(unsavedErrors[errorGroup]) {
        consoleOutputErrArr(unsavedErrors[errorGroup], chalkType);
      }
    }
    else {
      consoleOutputErrArr(errors, chalkType);
    }
  },

  flush: function (errorGroup, chalkType) {
    if(errorGroup) {
      if(unsavedErrors[errorGroup]) {
        var errArr = getFinalGroupErrors(errorGroup);
        consoleOutputErrArr(errArr, chalkType);
      }
    }
    else {
      consoleOutputErrArr(errors, chalkType);
      errors = [];
    }
  },

  add: function (error) {
    var errorGroup = error.group;

    if(errorGroup) {
      if(!unsavedErrors[errorGroup]) {
        unsavedErrors[errorGroup] = [];
      }
      unsavedErrors[errorGroup].push(error);
    }
    else {
      errors.push(error);
    }
  },

  done: function (errorGroup) {
    if(unsavedErrors[errorGroup] && unsavedErrors[errorGroup].length) {
      var errArr = getFinalGroupErrors(errorGroup);
      errors = errors.concat(errArr);
    }
  },

  count: function (errorGroup) {
    return errorGroup ? (unsavedErrors[errorGroup] ? unsavedErrors[errorGroup].length : 0) : errors.length;
  },

  fetchMessages: function (errorGroup) {
    return (errorGroup ? unsavedErrors[errorGroup] : errors).map(function (err) { return err.message});
  },

  clear: function (errorGroup) {
    if (errorGroup) {
      unsavedErrors[errorGroup] && delete unsavedErrors[errorGroup];
    }
  }
};

module.exports = ErrorHandler;
