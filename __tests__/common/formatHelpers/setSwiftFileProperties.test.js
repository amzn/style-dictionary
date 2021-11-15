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

const setSwiftFileProperties = require('../../../lib/common/formatHelpers/setSwiftFileProperties');

describe('common', () => {
  describe('formatHelpers', () => {

    describe('setSwiftFileProperties', () => {
      it('should default accessControl be public', () => {
        const file = setSwiftFileProperties({}, undefined, 'ios-swift');
        expect(file.accessControl).toEqual('public ');
      });

      it('should default objectType be class', () => {
        const file = setSwiftFileProperties({}, undefined, 'ios-swift');
        expect(file.objectType).toEqual('class');
      });

      it('should default import be ["UIKit"]', () => {
        const file = setSwiftFileProperties({}, undefined, 'ios-swift');
        const fileSeparate = setSwiftFileProperties({}, undefined, 'ios-swift-separate');
        expect(file.import).toEqual(['UIKit']);
        expect(fileSeparate.import).toEqual(['UIKit']);
      });

      it('should transform string import to array', () => {
        const file = setSwiftFileProperties({ import: 'SwiftUI' }, undefined, 'ios-swift');
        expect(file.import).toEqual(['SwiftUI']);
      });

      it('should file be properly configured', () => {
        const file = setSwiftFileProperties({ objectType: 'extension', import: ['SwiftUI'], accessControl: 'public'}, undefined, 'ios-swift');
        expect(file.objectType).toEqual('extension');
        expect(file.import).toEqual(['SwiftUI']);
        expect(file.accessControl).toEqual('public ');
      });

    });
  })
})