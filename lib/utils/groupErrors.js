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

var groupedErrors = {};

var getFinalGroupErrors = function(errorGroup) {
  var errArr = [];
  errArr.push('\n' + errorGroup + ':\n');
  if(errorGroup && groupedErrors[errorGroup] && groupedErrors[errorGroup].length) {
    errArr = errArr.concat(groupedErrors[errorGroup]);
    delete groupedErrors[errorGroup];
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

var GroupErrors = {
  GROUP: {
    PropertyReferenceErrors: 'Property Reference Errors',
    PropertyValueCollisions: 'Property Value Collisions',
  },

  flush: function (errorGroup, chalkType) {
    if(errorGroup) {
      if(groupedErrors[errorGroup]) {
        var errArr = getFinalGroupErrors(errorGroup);
        consoleOutputErrArr(errArr, chalkType);
      }
    }
  },

  add: function (error) {
    var errorGroup = error.group;

    if(errorGroup) {
      if(!groupedErrors[errorGroup]) {
        groupedErrors[errorGroup] = [];
      }
      groupedErrors[errorGroup].push(error);
    }
  },

  count: function (errorGroup) {
    return groupedErrors[errorGroup] ? groupedErrors[errorGroup].length : 0;
  },

  fetchMessages: function (errorGroup) {
    return (groupedErrors[errorGroup] || []).map(function (err) { return err.message});
  },

  clear: function (errorGroup) {
    if (errorGroup) {
      groupedErrors[errorGroup] && delete groupedErrors[errorGroup];
    }
  }
};

module.exports = GroupErrors;
