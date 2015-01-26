/**
 * Module dependencies
 */
var Twitter = require('twitter')
  , storage = require('./storage');

/**
 * Initialize client to interact with Twitter API
 */
var twitter = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_TOKEN_SECRET
});

/**
 * Create a prototype for Tweets
 * @constructor
 */
function Tweet(id, text, user, avatar) {
  this.id = id;
  this.text = text.trim();
  this.user = user;
  this.avatar = avatar;
  this._id = storage.binHash(this.lastWord());
}
Tweet.prototype.lastWord = function() {
  return this.text.substring(this.text.lastIndexOf(' ') + 1);
};

/**
 * This function starts streaming from the Twitter API
 *
 * @param {Object} wordSet
 */
exports.startStreaming = function(wordSet) {
  twitter.stream('statuses/sample', function(stream) {
    stream.on('data', function(data) {
      if (!data.text) return;

      var tweet = new Tweet(
        data.id,
        data.text,
        data.user.screen_name,
        data.user.profile_image_url
      );
      if (!wordSet[tweet.lastWord()]) return;

      storage.add(tweet).catch(console.error);
    });
  });
};
