const
  express = require('express'),
  router = express.Router(),
  nano = require('nano')(process.env.DB_HOST),
  flatten = require('../helpers/flatten_hashtable');

/* GET home page. */
router.get('/', function(req, res) {
  var books = nano.db.use('books');
  books.view('books', 'get_proposals', function(err, body) {
    if(err) {
      console.log(err);
      throw err;
    }

    res.render('index', { books: flatten(body.rows) });
  });
});

module.exports = router;
