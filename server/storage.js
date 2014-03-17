/**
 * Module dependencies
 */
var Promise = require('bluebird')
  , crypto = require('crypto')
  , mongo = require('mongodb');

/**
 * Promisify Mongo client and collections
 */
Promise.promisifyAll(mongo.MongoClient);
Promise.promisifyAll(mongo.Collection.prototype);
mongo.Collection.prototype._find = mongo.Collection.prototype.find;
mongo.Collection.prototype.find = function() {
  // Cursor is not built from prototype, so this needs to be done
  var cursor = this._find.apply(this, arguments);
  cursor.toArrayAsync = Promise.promisify(cursor.toArray, cursor);
  return cursor;
};

/**
 * Convenient top-level variables
 */
var storage = module.exports
  , client = mongo.MongoClient;

/**
 * Cache for connection to MongoDB server
 */
var connection;

/**
 * Connects to the database and yields a connection to the collection
 * containing tweets. This caches the connection for subsequent calls.
 *
 * @returns {Promise<Mongo.Collection>}
 */
storage.connect = function() {
  var host = process.env.MONGOHQ_URL;
  connection = connection || client.connectAsync(host).call('collection', 'tweets');
  return connection;
};

/**
 * Generate a binary hash to use as an id
 *
 * @param {String} str
 * @returns {String}
 */
storage.binHash = function(str) {
  return mongo.Binary(Buffer(crypto.createHash('md5').update(str).digest()));
};

/**
 * Adds tweet to collection if the id for it is free
 *
 * @param {Tweet} tweet
 * @returns {Promise}
 */
storage.add = function(tweet) {
  return storage.connect()
  .call('updateAsync', { _id: tweet._id }, tweet, { upsert: true });
};

/**
 * Finds tweets that end with any of the given rhymes
 *
 * @param {String[]} rhymes
 * @returns {Promise<Object[]>}
 */
storage.find = function(rhymes) {
  return storage.connect()
  .call('find', { _id: { '$in': rhymes.map(storage.binHash) } })
  .call('toArrayAsync');
};
