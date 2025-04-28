/**
 * @typedef {import('../../../types/ReferenceError.d.ts').ReferenceErrors} ReferenceErrors
 */

export class ReferenceError extends Error {
  /**
   *
   * @param {string} message
   * @param {ReferenceErrors} errors
   */
  constructor(message, errors) {
    super(message);
    /** @type {ReferenceErrors} */
    this.errors = errors;
  }
}
