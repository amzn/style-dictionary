export default `<%
//
// Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License").
// You may not use this file except in compliance with the License.
// A copy of the License is located at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// or in the "license" file accompanying this file. This file is distributed
// on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
// express or implied. See the License for the specific language governing
// permissions and limitations under the License.

const tokens = dictionary.allTokens.filter(function(token) {
  return token.attributes.category !== 'asset' &&
         token.attributes.category !== 'border' &&
         token.attributes.category !== 'shadow' &&
         token.attributes.category !== 'transition';
}); %>
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<%= fileHeader({ file, commentStyle: 'xml' }) %>
<plist version="1.0">
  <dict>
    <% tokens.forEach(function(token) {
    %><key><%= token.name %></key>
    <% if (token.attributes.category === 'color') { %><dict>
      <key>r</key>
      <real><%= (options.usesW3C ? token.$value : token.value)[0]/255 %></real>
      <key>g</key>
      <real><%= (options.usesW3C ? token.$value : token.value)[1]/255 %></real>
      <key>b</key>
      <real><%= (options.usesW3C ? token.$value : token.value)[2]/255 %></real>
      <key>a</key>
      <real>1</real>
      </dict>
    <% } else if (token.attributes.category === 'size') { %></dict>
      <integer><%= options.usesW3C ? token.$value : token.value %></integer>
    <% } else { %></dict>
      <string><%= options.usesW3C ? token.$value : token.value %></string>
    <% } %><% if (token.comment) { %><!-- <%= token.comment %> --><% } %><% }); %>
  </dict>
</plist>`;
