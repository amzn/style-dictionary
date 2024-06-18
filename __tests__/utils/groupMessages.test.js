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
import { expect } from 'chai';
import { GroupMessages } from '../../dist/esm/utils/groupMessages.mjs';

// TODO: add more tests

describe('groupMessage', () => {
  it('should allow removing messages', () => {
    const grpMessages = new GroupMessages();
    const FILTER_WARNINGS = grpMessages.GROUP.FilteredOutputReferences;
    grpMessages.add(FILTER_WARNINGS, '{foo.bar}');
    grpMessages.add(FILTER_WARNINGS, '{baz.qux}');
    grpMessages.add(FILTER_WARNINGS, '{another.one}');

    expect(grpMessages.count(FILTER_WARNINGS)).to.equal(3);
    grpMessages.remove(FILTER_WARNINGS, '{baz.qux}');
    expect(grpMessages.count(FILTER_WARNINGS)).to.equal(2);
    expect(grpMessages.fetchMessages(FILTER_WARNINGS)).to.eql(['{foo.bar}', '{another.one}']);
  });
});
