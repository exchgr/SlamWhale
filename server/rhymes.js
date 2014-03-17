/**
 * Module dependencies
 */
var Promise = require('bluebird')
  , request = Promise.promisify(require('request'));

/**
 * Finds words that rhyme with the given word using RhymeBrain
 *
 * @param {String} word
 * @returns {Promise<String[]>}
 */
exports.find = function(word) {
  return request('http://rhymebrain.com/talk?function=getRhymes&word=' + word)
  .spread(function(res, body) {
    return JSON.parse(body)
    .sort(function (a, b) { return b.score - a.score })
    .map(function (it) { return it.word })
    .slice(0, 10);
  });
};
