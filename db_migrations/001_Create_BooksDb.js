const
  nano = require('nano')(process.env.DB_HOST);

nano.db.create('books')

var books = nano.db.use('books');
books.insert(
  {
    _id:"_design/books",
    language: "javascript",
    views: {
      get_proposals: {
        map: function(doc) {
          emit(doc._id,
            {
              title: doc.title,
              google_books_id: doc.google_books_id,
              votes: doc.votes
            });
        }
      }
    }
  });
