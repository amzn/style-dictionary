import type { Dictionary, TransformedToken } from '../../types';
import GroupMessages from '../groupMessages';
import { getReferences } from './getReferences';

const FILTER_WARNINGS = GroupMessages.GROUP.FilteredOutputReferences;

/**
 *
 * @param {TransformedToken} token
 * @param {{ dictionary: Dictionary, usesDtcg?: boolean }} dictionary
 * @returns
 */
export function outputReferencesFilter(
  token: TransformedToken,
  { dictionary, usesDtcg }: { dictionary: Dictionary; usesDtcg?: boolean },
) {
  const originalValue = usesDtcg ? token.original.$value : token.original.value;
  // get refs, pass unfilteredTokens to ensure we find the refs even if they are filtered out
  const refs = getReferences(originalValue, dictionary.tokens, {
    unfilteredTokens: dictionary.unfilteredTokens,
    usesDtcg,
    warnImmediately: false,
  });
  return refs.every((ref) => {
    // check whether every ref can be found in the filtered set of tokens
    const foundToken = dictionary.allTokens.find((token) => token.name === ref.name);
    if (!foundToken) {
      // remove the warning about this ref being filtered out, since we now prevent it from outputting it as a ref
      GroupMessages.remove(FILTER_WARNINGS, ref.path.join('.'));
    }

    return !!foundToken;
  });
}
