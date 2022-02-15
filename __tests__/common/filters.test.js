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

var filters = require('../../lib/common/filters');

describe('common', () => {
  describe('filters', () => {
    describe('removePrivate', () => {
      it('should keep a regular token in for distribution', () => {
        var regularToken = {
          name: 'color-border',
          value: '#1a1aed'
        }

        expect(filters["removePrivate"](regularToken)).toEqual(true);
      });

      it('should keep an unfiltered token in for distribution', () => {
        var unfilteredToken = {
          name: 'color-border',
          value: '#1a1aed',
          private: false
        }

        expect(filters["removePrivate"](unfilteredToken)).toEqual(true);
      });


      it('should remove a filtered token from the distribution output', () => {
        var filteredToken = {
          name: 'color-border',
          value: '#1a1aed',
          private: true
        }

        expect(filters["removePrivate"](filteredToken)).toEqual(false);
      });
    });
  });
});
