/**
 * Load environment variables from .env
 */
require('dotenv').load();

/**
 * Module dependencies
 */
var express = require('express')
  , storage = require('./server/storage')
  , dictionary = require('./server/dictionary')
  , rhymes = require('./server/rhymes')
  , twitter = require('./server/twitter')
  , app = express();

/**
 * Configure app
 */
app.set('views', __dirname + '/views');
app.use(express.favicon());
app.use(express.static(__dirname + '/client'));
app.use(express.bodyParser());

/**
 * Set main API end point. Responds with rhyming tweets when POSTed a line.
 */
app.post('/rhyme', function (req, res) {
  var line = req.body.line
    , targetWord = line.substring(line.lastIndexOf(' ') + 1);

  rhymes.find(targetWord)
  .then(storage.find)
  .then(res.json.bind(res))
  .catch(function(err) {
    console.error('[REQUEST_FAILURE]', err.stack);
    res.send(500, '!?');
  });
});

/**
 * Initialize application and start listening on port
 */
dictionary.loadWordSet()
.then(twitter.startStreaming)
.then(function() {
  var port = process.env.PORT || 3000;
  console.log('Listening on port: ' + port);
  app.listen(port);
})
.catch(function(err) {
  console.error('[APP_FAILURE]', err.stack);
  process.exit(1);
});
