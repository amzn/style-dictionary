/**
 * @typedef {import('../../../types/ReferenceError.d.ts').ReferenceErrorObject[]} RefErrors
 */

export class ReferenceError extends Error {
  /**
   *
   * @param {string} message
   * @param {RefErrors} errors
   */
  constructor(message, errors) {
    super(message);
    /** @type {RefErrors} */
    this.errors = errors;
  }
}
