/**
 * Module dependencies
 */
var Promise = require('bluebird')
  , request = Promise.promisify(require('request'));

/**
 * To keep db small (free-mongo-hq size), we'll limit to only tweets with last
 * words in this list. Sticking them in a null object to get o(1)-ish look up.
 *
 * @returns {Promise<Object>}
 */
exports.loadWordSet = function() {
  return request('http://www.cs.duke.edu/~ola/ap/linuxwords')
  .spread(function (res, body) {
    var wordSet = Object.create(null);
    body.split('\n').forEach(function(word) { wordSet[word] = true });
    return wordSet;
  });
};
