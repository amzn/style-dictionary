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
import convertToBase64 from '../../lib/utils/convertToBase64.js';

describe('utils', () => {
  describe('convertToBase64', () => {
    it('should error if filePath isnt a string', () => {
      expect(convertToBase64.bind(null)).to.throw('filePath name must be a string');
      expect(convertToBase64.bind(null, [])).to.throw('filePath name must be a string');
      expect(convertToBase64.bind(null, {})).to.throw('filePath name must be a string');
    });

    it('should error if filePath isnt a file', () => {
      let errMessage;
      try {
        convertToBase64('foo');
      } catch (e) {
        errMessage = e.message;
      }
      // Note: on windows fs.readFileSync ENOENT error puts the full path in the error
      // on linux only the name of the filepath "foo"
      expect(errMessage).to.satisfy((msg) =>
        msg.startsWith('ENOENT: no such file or directory, open'),
      );
    });

    it('should return a string', () => {
      expect(typeof convertToBase64('__tests__/__configs/test.json')).to.equal('string');
    });

    it('should be a valid base64 string', () => {
      expect(convertToBase64('__tests__/__json_files/simple.json')).to.equal(
        'ewogICJmb28iOiAiYmFyIiwKICAiYmFyIjogIntmb299Igp9',
      );
    });
  });
});
