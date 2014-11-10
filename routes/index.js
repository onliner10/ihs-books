const
  express = require('express'),
  router = express.Router(),
  nano = require('nano')(process.env.DB_HOST);

/* GET home page. */
router.get('/', function(req, res) {
  var books = nano.db.use('books');
  books.view('books', 'get_proposals', function(err, body) {
    if(err){
      console.log(err);
      throw err;
    }

    res.render('index', { books: body.rows });
  });
});

module.exports = router;
