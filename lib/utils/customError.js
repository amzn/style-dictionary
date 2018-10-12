'use strict';

module.exports = function CustomError(message, obj) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  Object.assign(this, obj);
};

require('util').inherits(module.exports, Error);
