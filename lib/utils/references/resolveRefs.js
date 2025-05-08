import usesReferences from './usesReferences.js';
import getName from './getName.js';
import { regexCaptureGroups } from './createReferenceRegex.js';

/**
 * @typedef {Partial<import('../../../types/DesignToken.d.ts').DesignToken>} DesignToken
 */

/**
 * @template {Partial<import('../../../types/DesignToken.d.ts').DesignToken>} [T=DesignToken]
 * @typedef {import('../../../types/DesignToken.d.ts').TokenMap<T>} TokenMap<T>
 */

/**
 * @typedef {import('../../../types/Config.d.ts').ResolveReferencesOptions} RefOpts
 * @typedef {import('../../../types/Config.d.ts').ResolveReferencesOptionsInternalNew} RefOptsInternal
 * @typedef {import('../../../types/DesignToken.d.ts').TransformedTokens} Tokens
 * @typedef {Partial<import('../../../types/DesignToken.d.ts').TransformedToken>} Token
 * @typedef {import('../../../types/ReferenceError.d.ts').ReferenceErrorObject[]} RefErrors
 * @typedef {{ ignorePaths?: Set<string>; ignoreKeys?: Set<string>; usesDtcg?: boolean; objectsOnly?: boolean }} Options
 */

const defaultIgnoreKeys = new Set(['original', 'key', 'path', 'attributes']);

/**
 * Resolve references within a TokenMap,
 * or resolve a single token value's references within that TokenMap
 *
 * When not passing tokenValue, you can turn on mutateMap to mutate
 * the tokenMap input instead of returning a resolved clone.
 * This is more performant for large sets.
 *
 * The return value is always an object with an errors property.
 * In case of mutateMap, we throw an error with errors property instead.
 * @template {DesignToken} [T=DesignToken]
 * @param {TokenMap<T>} _tokenMap
 * @param {Options & {
 *   tokenValue?: Token['value'];
 *   mutateMap?: boolean;
 *   trackRefs?: boolean;
 * }} [options]
 */
export function resolveRefs(_tokenMap, { trackRefs = true, ...opts } = {}) {
  const options = { ...opts, trackRefs };
  const valueKey = `${options.usesDtcg ? '$' : ''}value`;
  if (options?.mutateMap && options.tokenValue) {
    throw new Error('`mutateMap` and `tokenValue` option cannot be combined.');
  }

  let tokenMap = _tokenMap;
  if (!options?.mutateMap) {
    tokenMap = structuredClone(_tokenMap);
  }
  if (options?.tokenValue) {
    // resolve only this value from map
    const { resolved, errors, refs } = resolveRefValueWrapper(
      /** @type {Partial<T>} */ ({ [valueKey]: options.tokenValue }),
      tokenMap,
      options,
    );
    return { resolved: resolved[valueKey], errors, refs };
  }
  const errors = resolveMap(tokenMap, options);

  return { resolved: tokenMap, errors };
}

/**
 * Always mutates the input.
 *
 * @template {DesignToken} [T=DesignToken]
 * @param {TokenMap<Partial<T>>} tokenMap
 * @param {Options & { trackRefs?: boolean; }} [_opts]
 * @returns
 */
export function resolveMap(tokenMap, _opts = {}) {
  let ignoreKeys = defaultIgnoreKeys;

  /** @type {RefErrors} */
  let errors = [];
  if (_opts && _opts.ignoreKeys instanceof Set) {
    ignoreKeys = ignoreKeys.union(_opts.ignoreKeys);
  }
  const opts = { ..._opts, ignoreKeys };
  // Note: we might need to create a clone of the tokenMap
  for (const [key, token] of Array.from(tokenMap)) {
    const { resolved, errors: _errors, refs } = resolveRefValueWrapper(token, tokenMap, opts);
    errors = errors.concat(_errors);
    if (opts.trackRefs) {
      resolved.refs = refs;
    }
    tokenMap.set(key, resolved);
  }
  return errors;
}

/**
 * This has to traverse objects in case the token property (e.g. .value) is an object
 * @template {DesignToken} [T=DesignToken]
 * @param {Partial<T>} slice - slice within the full object
 * @param {TokenMap<T>} tokenMap
 * @param {Options} [opts] - options such as regex, ignoreKeys, ignorePaths, etc.
 * @param {string} current_context - keeping track of the token group context that we're in
 * @param {Record<string, boolean>} foundCirc
 * @param {RefErrors} errors
 * @param {Partial<T>} [originalToken] - slice within the full object
 * @param {string[]} [refs] - keeping track of refs
 */
export function resolveRefValueWrapper(
  slice,
  tokenMap,
  opts = {},
  current_context = '',
  foundCirc = {},
  errors = [],
  originalToken,
  refs = [],
) {
  if (!originalToken) {
    // for reference later on in error reporting
    // ideal would be to make a clone here so we can report with the original token, not mutated with resolved refs
    // unfortunately, this would degrade performance significantly because deep cloning in JS is expensive
    // users will have to be content with a token that may be partially mutated from the original for successful resolutions
    originalToken = slice;
  }

  for (const key in slice) {
    const prop = slice[key];

    // We want to check for ignoredKeys, this is to
    // skip over attributes that should not be
    // mutated, like a copy of the original or key property.
    // Note: we only check this for traversal depth === 1
    // after that, we're already inside the token.($)value and keys should not be skipped
    if (opts.ignoreKeys && opts.ignoreKeys.has(key)) {
      continue;
    }

    current_context = /** @type {string} */ (slice.key);
    if (typeof prop === 'object') {
      const { errors: nestedErrors, refs: _refs } = resolveRefValueWrapper(
        prop,
        tokenMap,
        opts,
        current_context,
        foundCirc,
        errors,
        originalToken,
        refs,
      );
      errors = errors.concat(nestedErrors);

      // not sure why it complains about implicit any when we don't use an intermediate variable here
      const intermediateToPleaseTypescript = /** @type {string[]} */ (_refs);
      refs = refs.concat(intermediateToPleaseTypescript);
    } else if (typeof prop === 'string') {
      if (usesReferences(prop)) {
        // if we wanna resolve only for token values that resolve to objects,
        // we should guard for token values that are not exclusively 1 reference
        // because a token value with more than just a ref always resolves to a string
        // this way, we're saving a lot of work when resolving refs for the Expand util
        if (opts.objectsOnly && !prop.match(/^{[^{}]+?}$/g)) {
          // do nothing
        } else {
          const {
            resolved,
            errors: refErrors,
            refs: _refs,
          } = _resolveReferences(prop, tokenMap, {
            ...opts,
            current_context,
            foundCirc,
            token: /** @type {Partial<T>} */ (originalToken),
          });
          slice[key] = /** @type {Partial<T>['value']} */ (resolved);
          errors = errors.concat(refErrors);
          refs = refs.concat(_refs);
        }
      }
    }
    current_context = '';
  }

  // dedupe refs in case of duplicates
  return { resolved: slice, errors, refs: [...new Set(refs)] };
}

/**
 * Utility to resolve references inside a string value
 * @template {DesignToken} [T=DesignToken]
 * @param {string} value
 * @param {TokenMap<Partial<T>>} tokenMap
 * @param {RefOptsInternal} opts
 */
export function _resolveReferences(
  value,
  tokenMap,
  {
    usesDtcg = false,
    // for internal usage
    ignorePaths = new Set(),
    current_context = '',
    stack = [],
    foundCirc = {},
    firstIteration = true,
    objectsOnly = false,
    // used for reporting the token that caused the ref error
    // chain for circular issues, token/nestedRefToken for not-found issues
    tokenChain = [],
    token,
    nestedRefToken,
  },
) {
  tokenChain.push(nestedRefToken ?? token);
  /** @type {{ resolved: unknown; errors: RefErrors; refs: string[] }} */
  let to_ret = { resolved: value, errors: [], refs: [] };

  const valProp = usesDtcg ? '$value' : 'value';
  const reg = regexCaptureGroups;

  // When we know the current context:
  // the key associated with the value that we are resolving the reference for
  // Then we can push this to the stack to improve our circular reference warnings
  // by starting them with the key
  if (firstIteration && current_context) {
    stack.push(getName([current_context]));
  }

  // this replace may be confusing, since we don't do anything with the return value
  // we just use this as a regex match iterator, so read it like a "for each match"
  value.replace(reg, (match) => {
    // trim spaces between right after { or before } e.g. '{ foo.bar }' => '{foo.bar}'
    let trimmedMatch = `{${match.slice(1, match.length - 1).trim()}}`;
    if (ignorePaths.has(match)) {
      return '';
    }

    stack.push(trimmedMatch);
    to_ret.refs.push(trimmedMatch);

    const ref = tokenMap.get(trimmedMatch);
    const refVal = ref?.[valProp];
    /**
     * @param {unknown} refVal
     */
    const replaceMatchWithRef = (refVal) => {
      if (objectsOnly && typeof refVal !== 'object') {
        return to_ret.resolved;
      }
      // If the token value is exclusively the ref
      // we can put the ref in "as is", rather than stringifying.
      // this way, if the reference is a primitive type like boolean, array, object, number,
      // it will remain that type.
      if (match === to_ret.resolved) {
        return refVal;
      }
      // otherwise, stringify the ref (e.g. when it's a number ref inside a bigger string)
      return `${to_ret.resolved}`.replace(match, `${refVal}`);
    };

    if (typeof refVal !== 'undefined') {
      if (typeof refVal === 'string' && usesReferences(refVal)) {
        // Recursive, therefore we can compute multi-layer variables like a = b, b = c, eventually a = c
        // Compare to found circular references
        if (Object.hasOwn(foundCirc, refVal)) {
          // If the current reference is a member of a circular reference, do nothing
        } else if (stack.indexOf(refVal) !== -1) {
          // If the current stack already contains the current reference, we found a new circular reference
          // chop down only the circular part, save it to our circular reference info, and spit out an error

          // Get the position of the existing reference in the stack
          const stackIndexReference = stack.indexOf(refVal);

          // Get the portion of the stack that starts at the circular reference and brings you through until the end
          const circStack = stack.slice(stackIndexReference);

          // For all the references in this list, add them to the list of references that end up in a circular reference
          circStack.forEach(function (key) {
            foundCirc[key] = true;
          });

          // Add our found circular reference to the end of the cycle
          circStack.push(refVal);
          to_ret.refs.push(refVal);

          let chain = circStack;
          // 3 or more items with first 2 being the same
          // means that our current_context & first item can be deduped
          if (chain.length > 2 && chain[0] === chain[1]) {
            chain.splice(0, 1);
          }

          to_ret.errors.push({
            ref: circStack[0],
            type: 'circular',
            // report with the token in the chain that contains the first item in the circular
            // reference stack, as this is the token that initiated the circ reference issue.
            token:
              tokenChain.find((tok) => JSON.stringify(tok[valProp]).includes(circStack[0])) ??
              token,
            chain,
          });
          to_ret.resolved = replaceMatchWithRef(circStack[0]);
        } else {
          const {
            resolved: nestedResult,
            errors: nestedErrors,
            refs: nestedRefs,
          } = _resolveReferences(refVal, tokenMap, {
            ignorePaths,
            usesDtcg,
            current_context,
            stack,
            foundCirc,
            firstIteration: false,
            token,
            nestedRefToken: ref,
            tokenChain,
          });
          to_ret.refs = to_ret.refs.concat(nestedRefs);
          to_ret.errors = to_ret.errors.concat(nestedErrors);
          to_ret.resolved = replaceMatchWithRef(nestedResult);
        }
      } else {
        to_ret.resolved = replaceMatchWithRef(refVal);
      }
    } else {
      to_ret.refs.push(trimmedMatch);
      // prefer reporting the current nestedRefToken
      to_ret.errors.push({ ref: match, type: 'not-found', token: nestedRefToken ?? token });
    }
    stack.pop();
    return match;
  });

  to_ret.refs = [...new Set(to_ret.refs)];

  return to_ret;
}
