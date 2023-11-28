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
import { fixDate } from '../../__helpers.js';
import fileHeader from '../../../lib/common/formatHelpers/fileHeader.js';

const defaultLine1 = `Do not edit directly`;
const defaultLine2 = `Generated on Sat, 01 Jan 2000 00:00:00 GMT`;

describe('common', () => {
  describe('formatHelpers', () => {
    beforeEach(() => {
      // reset Date again, for some reasons these tests are flaky otherwise in the pipelines
      fixDate();
    });

    describe('fileHeader', () => {
      it(`should default to /**/ comment style`, () => {
        const comment = fileHeader({});
        expect(comment).to.equal(
          `/**
 * ${defaultLine1}
 * ${defaultLine2}
 */

`,
        );
      });

      it(`should handle commentStyle short`, () => {
        const comment = fileHeader({ commentStyle: 'short' });
        expect(comment).to.equal(
          `
// ${defaultLine1}
// ${defaultLine2}

`,
        );
      });

      it(`should handle commentStyle xml`, () => {
        const comment = fileHeader({ commentStyle: 'xml' });
        expect(comment).to.equal(
          `<!--
  ${defaultLine1}
  ${defaultLine2}
-->`,
        );
      });

      it(`should handle showFileHeader option`, () => {
        const comment = fileHeader({
          file: {
            options: {
              showFileHeader: false,
            },
          },
        });
        expect(comment).to.equal('');
      });

      it(`should handle custom fileHeader function`, () => {
        const comment = fileHeader({
          file: {
            options: {
              fileHeader: () => {
                return [`Never gonna give you up`, `Never gonna let you down`];
              },
            },
          },
        });
        expect(comment).to.equal(
          `/**
 * Never gonna give you up
 * Never gonna let you down
 */

`,
        );
      });

      it(`should handle custom fileHeader function with default`, () => {
        const comment = fileHeader({
          file: {
            options: {
              fileHeader: (defaultMessage) => {
                return [...defaultMessage, `Never gonna give you up`, `Never gonna let you down`];
              },
            },
          },
        });
        expect(comment).to.equal(
          `/**
 * ${defaultLine1}
 * ${defaultLine2}
 * Never gonna give you up
 * Never gonna let you down
 */

`,
        );
      });

      it('should handle custom formatting', () => {
        const comment = fileHeader({
          formatting: {
            prefix: `  `,
            header: `{#\n`,
            footer: `\n#}`,
          },
        });
        expect(comment).to.equal(
          `{#
  ${defaultLine1}
  ${defaultLine2}
#}`,
        );
      });
    });
  });
});
