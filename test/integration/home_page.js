process.env.NODE_ENV = 'test';
const
  http = require('http'),
  app = require('../../app'),
  Browser = require('zombie'),
  assert = require('assert'),
  nano = require('nano')(process.env.DB_HOST);

require('../../db_migrations/001_Create_BooksDb.js');

describe('home page', function(done) {
  before('put two books into database', function() {
    var testDatabase = nano.db.use('books');

    testDatabase.insert(
      {
        id: "guid1",
        google_books_id: "aRLyxbyMeVEC",
        title: "Building Node Applications with MongoDB and Backbone",
        votes: 2
      }
      , function(_,_) { });

    testDatabase.insert(
      {
        id: "guid2",
        google_books_id: "2cwMAQAAMAAJ",
        title: "Tackling vacant land",
        votes: 1
      }, done);
    });

    before('initialize server', function() {
      this.server = app.listen(process.env.HTTP_PORT);
    });

    before('visit the homepage', function(done) {
      this.browser = new Browser({site: 'http://localhost:' + process.env.HTTP_PORT});
      this.browser.visit('/', done);
    });

    before('get all returned books from output html', function() {
      this.returnedBooks = this.browser.queryAll(".proposed_book");
    });

    it('should list two books from DB', function() {
      assert.equal(this.returnedBooks.length, 2);
    });

    after(function(done) {
      nano.db.destroy('books')
      this.server.close(done);
    });
  });
