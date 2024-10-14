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
import { isNode } from '../../lib/utils/isNode.js';

describe('utils', () => {
  describe('convertToBase64', () => {
    it('should error if filePath isnt a string', async () => {
      const err = 'filePath name must be a string';
      await expect(convertToBase64()).to.eventually.be.rejectedWith(err);
      await expect(convertToBase64([])).to.eventually.be.rejectedWith(err);
      await expect(convertToBase64({})).to.eventually.be.rejectedWith(err);
    });

    it('should error if filePath isnt a file', async () => {
      let errMessage;
      try {
        await convertToBase64('foo');
      } catch (e) {
        errMessage = e.message;
      }
      // Note: on windows fs.readFileSync ENOENT error puts the full path in the error
      // on linux only the name of the filepath "foo"
      expect(errMessage).to.satisfy((msg) =>
        msg.startsWith('ENOENT: no such file or directory, open'),
      );
    });

    it('should return a string', async () => {
      expect(typeof (await convertToBase64('__tests__/__configs/test.json'))).to.equal('string');
    });

    it('should be a valid base64 string', async () => {
      expect(await convertToBase64('__tests__/__json_files/simple.json')).to.equal(
        'ewogICJmb28iOiAiYmFyIiwKICAiYmFyIjogIntmb299Igp9',
      );
    });

    it('should convert binary files', async () => {
      /**
       * The base64 is different between these environment because of
       * the fact that the browser uses the FileReaderAPI as a round-about way
       * to turn the binary file into a base64 string, so the data representation
       * is different in browsers than when doing buffer.toString in Node.
       * Using memfs in browser to read/store a binary file is also not really supported I think..
       * which may also cause a different base64 string result, but the utility is mostly for Node users anyways
       */
      if (!isNode) {
        await expect(
          await convertToBase64('__tests__/__assets/images/mdpi/flag_us_small.png'),
        ).to.matchSnapshot(1);
      } else {
        await expect(
          await convertToBase64('__tests__/__assets/images/mdpi/flag_us_small.png'),
        ).to.matchSnapshot(2);
      }
    });
  });
});
