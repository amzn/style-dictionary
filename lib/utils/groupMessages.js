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
    PropertyReferenceWarnings: 'Property Reference Errors',
    PropertyValueCollisions: 'Property Value Collisions',
    TemplateDeprecationWarnings: 'Template Deprecation Warnings',
    RegisterTemplateDeprecationWarnings: 'Register Template Deprecation Warnings',
    SassMapFormatDeprecationWarnings: 'Sass Map Format Deprecation Warnings',
    MissingRegisterTransformErrors: 'Missing Register Transform Errors',
    PropertyNameCollisionWarnings: 'Property Name Collision Warnings',
  },

  flush: function (messageGroup) {
    var messages = GroupMessages.fetchMessages(messageGroup);
    GroupMessages.clear(messageGroup);
    return messages;
  },

  add: function (messageGroup, message) {
    if(messageGroup) {
      if(!groupedMessages[messageGroup]) {
        groupedMessages[messageGroup] = [];
      }
      if(groupedMessages[messageGroup].indexOf(message) === -1) {
        groupedMessages[messageGroup].push(message);
      }
    }
  },

  count: function (messageGroup) {
    return groupedMessages[messageGroup] ? groupedMessages[messageGroup].length : 0;
  },

  fetchMessages: function (messageGroup) {
    return (messageGroup && groupedMessages[messageGroup]) || [];
  },

  clear: function (messageGroup) {
    messageGroup && groupedMessages[messageGroup] && delete groupedMessages[messageGroup];
  }
};

module.exports = GroupMessages;
