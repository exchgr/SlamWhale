var crypto = require('crypto')
  , request = require('request')
  , twit = new require('twitter')({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: process.env.TWITTER_TOKEN_KEY,
      access_token_secret: process.env.TWITTER_TOKEN_SECRET
    })
  , mongo = require('mongodb')
  , MongoClient = mongo.MongoClient
  , express = require('express')
  , app = express();

// To keep db small (free-mongo-hq size), I'm limiting to only tweets with last
// words from this list. Sticking them in a null object to get o(1)-ish look up.
var wordSet = Object.create(null);
request('http://www.cs.duke.edu/~ola/ap/linuxwords', function (err, res, body) {
  if (err) throw err;
  var wordList = body.split('\n');
  for (var i = 0; i < wordList.length; i++) {
    wordSet[wordList[i]] = true;
  }
});

function binHash(str) {
  return mongo.Binary(Buffer(crypto.createHash('md5').update(str).digest()));
}

// Using RhymeBrain for this shit
function rhymeWord(word, cb) {
  request(
    'http://rhymebrain.com/talk?function=getRhymes&word=' + word
    , function (err, res, body) {
      if(err) return cb(err, null);
      var matches = JSON.parse(body)
                        .sort(function (a, b) { return b.score - a.score })
                        .map(function (it) { return it.word })
                        .slice(0, 10);
      cb(null, matches);
    }
  );
}

// set up the app
app.set('views', __dirname + '/views');
app.use(express.favicon());
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());

// start mongo conn
MongoClient.connect(process.env.MONGOHQ_URL, function(err, db) {
  if (err) throw err;
  var col = db.collection('tweets');

  // tweet storing mechanism working off twitter streaming API
  twit.stream('statuses/sample', function(stream) {
    stream.on('data', function (data) {
      if (data.text) {
        var tweet = {
          'text': data.text,
          'tweetId': data.id,
          'user': data.user.screen_name,
          'avatar': data.user.profile_image_url
        }
          , lastWord = tweet.text.split(' ').pop();
        if (wordSet[lastWord]) {
          // use free _id index and enforce one tweet per ending-word
          var _id = binHash(lastWord);
          tweet._id = _id;
          col.update({'_id': _id}, tweet, {'upsert': true}, function (err) {
            if (err) console.error(err);
          });
        }
      }
    });
  });

  // main api end point, should return rhyming tweets when posted a line
  app.post('/rhyme', function (req, res) {
    var line = req.body.line
      , targetWord = line.split(' ').pop();

    rhymeWord(targetWord, function(err, matches) {
      if (err) return res.send(500, '!?');

      var cur = col.find({'_id': {'$in': matches.map(binHash)}});
      cur.toArray(function(err, docs) {
        if (err) return res.send(500, '!?');
        res.send(docs);
      });

    });
  });
});

app.listen(process.env.PORT || 3000);
