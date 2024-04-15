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
import setSwiftFileProperties from '../../../lib/common/formatHelpers/setSwiftFileProperties.js';

describe('common', () => {
  describe('formatHelpers', () => {
    describe('setSwiftFileProperties', () => {
      it('should default accessControl be public', () => {
        const file = setSwiftFileProperties({}, undefined, 'ios-swift');
        expect(file.accessControl).to.equal('public');
      });

      it('should default objectType be class', () => {
        const file = setSwiftFileProperties({}, undefined, 'ios-swift');
        expect(file.objectType).to.equal('class');
      });

      it('should default import be ["UIKit"]', () => {
        const file = setSwiftFileProperties({}, undefined, 'ios-swift');
        const fileSeparate = setSwiftFileProperties({}, undefined, 'ios-swift-separate');
        expect(file.import).to.eql(['UIKit']);
        expect(fileSeparate.import).to.eql(['UIKit']);
      });

      it('should transform string import to array', () => {
        const file = setSwiftFileProperties({ import: 'SwiftUI' }, undefined, 'ios-swift');
        expect(file.import).to.eql(['SwiftUI']);
      });

      it('should file be properly configured', () => {
        const file = setSwiftFileProperties(
          {
            objectType: 'extension',
            import: ['SwiftUI'],
            accessControl: 'public',
          },
          undefined,
          'ios-swift',
        );
        expect(file.objectType).to.equal('extension');
        expect(file.import).to.eql(['SwiftUI']);
        expect(file.accessControl).to.equal('public');
      });
    });
  });
});
