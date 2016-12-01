var _ = require('lodash');

/**
 * Performs any actions in a platform config. Pretty
 * simple really. Actions should be an array of functions,
 * the calling function should map the functions accordingly.
 * @memberOf StyleDictionary
 * @param {Object} dictionary
 * @param {Object} platform
 * @returns {null}
 */
function performActions(dictionary, platform) {
  if (platform.actions) {
    _.each(platform.actions, function(action) {
      action(dictionary, platform);
    });
  }
}


module.exports = performActions;