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

import { usesReference, getReferences } from 'style-dictionary/utils';

export default (opts) => {
  const { file, fileHeader, dictionary } = opts;

  const resourceType = file.resourceType || null;

  const resourceMap = file.resourceMap || {
    size: 'dimen',
    color: 'color',
    string: 'string',
    content: 'string',
    time: 'integer',
    number: 'integer',
  };

  function propToType(prop) {
    if (resourceType) {
      return resourceType;
    }
    if (resourceMap[prop.attributes.category]) {
      return resourceMap[prop.attributes.category];
    }
    return 'string';
  }

  function propToValue(prop) {
    if (file.options && file.options.outputReferences && usesReference(prop.original.value)) {
      return `@${propToType(prop)}/${getReferences(dictionary, prop.original.value)[0].name}`;
    } else {
      return prop.value;
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>

${fileHeader({ file, commentStyle: 'xml' })}
<resources>
  ${dictionary.allTokens
    .map(
      (prop) =>
        `<${propToType(prop)} name="${prop.name}">${propToValue(prop)}</${propToType(prop)}>${
          prop.comment ? `<!-- ${prop.comment} -->` : ''
        }`,
    )
    .reduce((acc, curr) => acc + `${curr}\n  `, '')}
</resources>`;
};
