const
  express = require('express'),
  router = express.Router(),
  nano = require('nano')(process.env.DB_HOST);

/* GET home page. */
router.get('/', function(req, res) {
  var books = nano.db.use('books');
  books.list(function(err, body) {
    if(err){
      throw err;
    }

    body.rows.forEach(function(doc) {
      console.log(doc);
    });
  });

  res.render('index', { title: 'Express' });
});

module.exports = router;
