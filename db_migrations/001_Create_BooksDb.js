const
  nano = require('nano')(process.env.DB_HOST);

nano.db.create('books')

var books = nano.db.use('books');
books.insert(
  { "views":
    { "get_proposals":
      { "map": function(doc) { emit([doc.title, doc.google_books_id, votes], doc._id); } }
    }
  });
