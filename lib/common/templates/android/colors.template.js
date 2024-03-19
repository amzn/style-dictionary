export default `<?xml version="1.0" encoding="UTF-8"?>
<%
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
  return token.type === 'color';
});
%>
<%= header %>
<resources>
  <% tokens.forEach(function(token) {
  %><color name="<%= token.name %>"><%= options.usesDtcg ? token.$value : token.value %></color><% if (token.comment) { %><!-- <%= token.comment %> --><% } %>
  <% }); %>
</resources>`;
