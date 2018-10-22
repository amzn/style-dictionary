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
var groupedMessages = {};

var GroupMessages = {
  GROUP: {
    PropertyReferenceMessages: 'Property Reference Errors',
    PropertyValueCollisions: 'Property Value Collisions',
  },

  flush: function (messageGroup) {
    var errors = GroupMessages.fetchMessages(messageGroup);
    GroupMessages.clear(messageGroup);
    return errors;
  },

  add: function (messageGroup, error) {
    if(messageGroup) {
      if(!groupedMessages[messageGroup]) {
        groupedMessages[messageGroup] = [];
      }
      groupedMessages[messageGroup].push(error);
    }
  },

  count: function (messageGroup) {
    return groupedMessages[messageGroup] ? groupedMessages[messageGroup].length : 0;
  },

  fetchMessages: function (messageGroup) {
    return ((messageGroup && groupedMessages[messageGroup]) || []).map(function (err) { return err.message; });
  },

  clear: function (messageGroup) {
    messageGroup && groupedMessages[messageGroup] && delete groupedMessages[messageGroup];
  }
};

module.exports = GroupMessages;
