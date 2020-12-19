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

const reduce = function(obj, f, accumulator_init) {
  return Object.keys(obj || {}).reduce((accumulator, key) => {
    let value = obj[key]
    return f(accumulator, value, key, obj)
  }, accumulator_init)
}

const forEach = function(obj, f) {
  Object.keys(obj || {}).forEach((key) => {
    let value = obj[key]
    f(value, key)
  });
}

const cloneDeep = function(obj) {
  if(obj === null || obj === undefined || typeof obj !== 'object') {
    return obj
  }

  if(obj instanceof Array) {
    return obj.reduce((arr, item, i) => {
      arr[i] = cloneDeep(item)
      return arr
    }, [])
  }

  if(obj instanceof Object) {
    return Object.keys(obj || {}).reduce((cpObj, key) => {
      cpObj[key] = cloneDeep(obj[key])
      return cpObj
    }, {})
  }
}

const isObject = function(value) {
  const type = typeof value
  return value != null && (type === 'object' || type === 'function')
}

const isString = function(obj) {
  return typeof obj === 'string' || obj instanceof String
}

const isArray = function(obj) {
  return Array.isArray(obj)
}

const isEmpty = function(obj) {
  return [Object, Array].includes((obj || {}).constructor) && !Object.entries((obj || {})).length
}

const filter = function (arr, filter) {
  if (typeof(filter) !== 'function') {
    throw("filter is not a function")
  }
  if (typeof arr === 'undefined') {
    return []
  }
  return arr.filter(filter)
}

const assign = function () {
  let args = Array.prototype.slice.call(arguments)
  args.unshift({})
  return Object.assign(...args)
}

const upperFirst = function (str) {
  return str ? str[0].toUpperCase() + str.substr(1) : ''
}

function getTag(value) {
  if (value == null) {
    return value === undefined ? '[object Undefined]' : '[object Null]'
  }
  return Object.prototype.toString.call(value)
}

function isSymbol(value) {
  const type = typeof value
  return type == 'symbol' || (type === 'object' && value != null && getTag(value) == '[object Symbol]')
}

const INFINITY = 1 / 0
function toString(value) {
  if (value == null) {
    return ''
  }
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value === 'string') {
    return value
  }
  if (Array.isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return `${value.map((other) => other == null ? other : toString(other))}`
  }
  if (isSymbol(value)) {
    return value.toString()
  }
  const result = `${value}`
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result
}

const hasUnicodeWord = RegExp.prototype.test.bind(
  /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/
)

/** Used to match words composed of alphanumeric characters. */
const reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g

function asciiWords(string) {
  return string.match(reAsciiWord)
}

/** Used to compose unicode character classes. */
const rsAstralRange = '\\ud800-\\udfff'
const rsComboMarksRange = '\\u0300-\\u036f'
const reComboHalfMarksRange = '\\ufe20-\\ufe2f'
const rsComboSymbolsRange = '\\u20d0-\\u20ff'
const rsComboMarksExtendedRange = '\\u1ab0-\\u1aff'
const rsComboMarksSupplementRange = '\\u1dc0-\\u1dff'
const rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange + rsComboMarksExtendedRange + rsComboMarksSupplementRange
const rsDingbatRange = '\\u2700-\\u27bf'
const rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff'
const rsMathOpRange = '\\xac\\xb1\\xd7\\xf7'
const rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf'
const rsPunctuationRange = '\\u2000-\\u206f'
const rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000'
const rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde'
const rsVarRange = '\\ufe0e\\ufe0f'
const rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange

/** Used to compose unicode capture groups. */
const rsApos = "['\u2019]"
const rsBreak = `[${rsBreakRange}]`
const rsCombo = `[${rsComboRange}]`
const rsDigit = '\\d'
const rsDingbat = `[${rsDingbatRange}]`
const rsLower = `[${rsLowerRange}]`
const rsMisc = `[^${rsAstralRange}${rsBreakRange + rsDigit + rsDingbatRange + rsLowerRange + rsUpperRange}]`
const rsFitz = '\\ud83c[\\udffb-\\udfff]'
const rsModifier = `(?:${rsCombo}|${rsFitz})`
const rsNonAstral = `[^${rsAstralRange}]`
const rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}'
const rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]'
const rsUpper = `[${rsUpperRange}]`
const rsZWJ = '\\u200d'

/** Used to compose unicode regexes. */
const rsMiscLower = `(?:${rsLower}|${rsMisc})`
const rsMiscUpper = `(?:${rsUpper}|${rsMisc})`
const rsOptContrLower = `(?:${rsApos}(?:d|ll|m|re|s|t|ve))?`
const rsOptContrUpper = `(?:${rsApos}(?:D|LL|M|RE|S|T|VE))?`
const reOptMod = `${rsModifier}?`
const rsOptVar = `[${rsVarRange}]?`
const rsOptJoin = `(?:${rsZWJ}(?:${[rsNonAstral, rsRegional, rsSurrPair].join('|')})${rsOptVar + reOptMod})*`
const rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])'
const rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])'
const rsSeq = rsOptVar + reOptMod + rsOptJoin
const rsEmoji = `(?:${[rsDingbat, rsRegional, rsSurrPair].join('|')})${rsSeq}`

const reUnicodeWords = RegExp([
  `${rsUpper}?${rsLower}+${rsOptContrLower}(?=${[rsBreak, rsUpper, '$'].join('|')})`,
  `${rsMiscUpper}+${rsOptContrUpper}(?=${[rsBreak, rsUpper + rsMiscLower, '$'].join('|')})`,
  `${rsUpper}?${rsMiscLower}+${rsOptContrLower}`,
  `${rsUpper}+${rsOptContrUpper}`,
  rsOrdUpper,
  rsOrdLower,
  `${rsDigit}+`,
  rsEmoji
].join('|'), 'g')

/**
 * Splits a Unicode `string` into an array of its words.
 *
 * @private
 * @param {string} The string to inspect.
 * @returns {Array} Returns the words of `string`.
 */
function unicodeWords(string) {
  return string.match(reUnicodeWords)
}

function words(string, pattern) {
  if (pattern === undefined) {
    const result = hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string)
    return result || []
  }
  return string.match(pattern) || []
}

const camelCase = (string) => (
  words(toString(string).replace(/['\u2019]/g, '')).reduce((result, word, index) => {
    word = word.toLowerCase()
    return result + (index ? upperFirst(word) : word)
  }, '')
)

const snakeCase = (string) => (
  words(toString(string).replace(/['\u2019]/g, '')).reduce((result, word, index) => (
    result + (index ? '_' : '') + word.toLowerCase()
  ), '')
)

const kebabCase = (string) => (
  words(toString(string).replace(/['\u2019]/g, '')).reduce((result, word, index) => (
    result + (index ? '-' : '') + word.toLowerCase()
  ), '')
)

module.exports = {
  each: forEach,
  forEach: forEach,
  forIn: forEach,
  keys: Object.keys,
  cloneDeep: cloneDeep,
  isString: isString,
  isArray: isArray,
  isObject: isObject,
  isEmpty: isEmpty,
  filter: filter,
  reduce: reduce,
  assign: assign,
  upperFirst: upperFirst,
  camelCase: camelCase,
  snakeCase: snakeCase,
  kebabCase: kebabCase,
}
