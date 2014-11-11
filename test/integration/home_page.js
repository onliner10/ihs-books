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
        thumbnails: {
          big:"big_thumbnail1",
          small: "small_thumbnail1"
        },
        votes: 2
      }
      , function(_,_) { });

    testDatabase.insert(
      {
        id: "guid2",
        google_books_id: "2cwMAQAAMAAJ",
        title: "Tackling vacant land",
        thumbnails: {
          big:"big_thumbnail2",
          small: "small_thumbnail2"
        },
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


    it('should list two books from DB', function() {
      var returnedBooks = this.browser
                              .queryAll(".proposed_book");

      assert.equal(returnedBooks.length, 2);
    });

    it('should start with the book with higher votes', function() {
      var votes = this.browser
                      .queryAll('.proposed_book .votes')
                      .map(function(vote) {
                        return vote.textContent;
                      });

      assert.deepEqual(["2","1"], votes);
    });


    it('books should have correct titles', function() {
      var titles = this.browser
                       .queryAll('.proposed_book h1')
                       .map(function(vote) {
                         return vote.textContent;
                       });;

      assert.equal(titles[0], "Building Node Applications with MongoDB and Backbone");
      assert.equal(titles[1], "Tackling vacant land");
    });

    it('books should have small thumbnails', function() {
      var thumbnails = this.browser
                           .queryAll('.proposed_book .thumbnail')
                           .map(function(vote) {
                             return vote.getAttribute('src');
                           });;

      assert.equal(thumbnails[0], "small_thumbnail1");
      assert.equal(thumbnails[1], "small_thumbnail2");
    });

    after(function(done) {
      nano.db.destroy('books')
      this.server.close(done);
    });
  });
