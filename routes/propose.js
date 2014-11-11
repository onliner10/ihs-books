const
  express = require('express'),
  router = express.Router(),
  nano = require('nano')(process.env.DB_HOST),
  flatten = require('../helpers/flatten_hashtable');

/* GET home page. */
router.get('/', function(req, res) {
    res.render('propose');
});

module.exports = router;
