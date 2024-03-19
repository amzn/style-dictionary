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
%>
//
// <%= file.destination %>
//
<%= header %>
#import "<%= file.className %>.h"

@implementation <%= file.className %>

+ (NSDictionary *)getProperty:(NSString *)keyPath {
  return [[self properties] valueForKeyPath:keyPath];
}

+ (nonnull)getValue:(NSString *)keyPath {
  return [[self properties] valueForKeyPath:[NSString stringWithFormat:@"%@.value", keyPath]];
}

+ (NSDictionary *)properties {
  static NSDictionary * dictionary;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    dictionary = <%= buildDictionary(dictionary.tokens) %>;
  });

  return dictionary;
}

@end

<% function buildDictionary(token, indent) {
  indent = indent || '  ';
  var to_ret = '@{\\n';
  if (Object.hasOwn(token, \`\${options.usesDtcg ? '$' : ''}value\`)) {
    let value = options.usesDtcg ? token.$value : token.value;
    if (token.type === 'dimension' || token.type === 'fontSize' || token.type === 'time') {
      value = '@' + value;
    }
    to_ret += indent + '@"value": ' + value + ',\\n';
    to_ret += indent + '@"name": @"' + token.name + '",\\n';

    for(const name in token.attributes) {
      if (token.attributes[name]) {
        to_ret += indent + '@"' + name + '": @"' + token.attributes[name] + '",\\n';
      }
    }

    // remove last comma
    return to_ret.slice(0, -2) + '\\n' + indent + '}';
  } else {
    for(const name in token) {
      to_ret += indent + '@"' + name + '": ' + buildDictionary(token[name], indent + '  ') + ',\\n';
    }
    // remove last comma
    return to_ret.slice(0, -2) + '\\n' + indent + '}';
  }
} %>`;
