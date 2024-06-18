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

import usesReferences from './references/usesReferences';
import { getReferences } from './references/getReferences';
import { resolveReferences } from './references/resolveReferences';
import { outputReferencesFilter } from './references/outputReferencesFilter';
import { outputReferencesTransformed } from './references/outputReferencesTransformed';
import createFormatArgs from './createFormatArgs';
import flattenTokens from './flattenTokens';
import { typeDtcgDelegate } from './typeDtcgDelegate';
import { convertToDTCG, convertJSONToDTCG, convertZIPToDTCG, readZIP } from './convertToDTCG';
import { deepmerge } from './deepmerge';
import combineJSON from './combineJSON';

// Public style-dictionary/utils API
export {
  usesReferences,
  getReferences,
  resolveReferences,
  outputReferencesFilter,
  outputReferencesTransformed,
  flattenTokens,
  typeDtcgDelegate,
  convertToDTCG,
  convertJSONToDTCG,
  convertZIPToDTCG,
  readZIP,
  createFormatArgs,
  deepmerge,
  combineJSON,
};
export * from '../common/formatHelpers/index';
