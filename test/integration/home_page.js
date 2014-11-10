process.env.NODE_ENV = 'test';
const
  http = require('http'),
  app = require('../../index'),
  Browser = require('zombie'),
  assert = require('assert'),
  nano = require('nano')(process.env.DB_HOST);

describe('home page', function() {
  before('put two books into database', function() {
      nano.db.create(process.env.DB)
      var testDatabase = nano.db.use(process.env.DB);

      testDatabase.insert({
        id: "guid1",
        google_boks_id: "aRLyxbyMeVEC",
        votes: 2
      }, "proposed_book", function(err, body) { });

      testDatabase.insert({
        id: "guid2",
        google_boks_id: "2cwMAQAAMAAJ",
        votes: 1
      }, "proposed_book", function(err, body) { });
  });

  before('initialize server', function() {
    this.server = app.listen(process.env.HTTP_PORT);
  });

  before('visit the homepage', function(done) {
    this.browser = new Browser({site: 'http://localhost:' + process.env.HTTP_PORT});
    this.browser.visit('/', done);
  });

  it('should list all books proposed', function() {
    assert.ok(this.browser.success);

    var returnedBooks = this.browser.queryAll(".proposed_book");

    assert.lengthOf(returnedBooks, 2, 'homepage shows all the propositions');
    assert.equals(
      returnedBooks[0].text("h1"),
      "Building Node Applications with MongoDB and Backbone");

    assert.equals(
      returnedBooks[1].text("h1"),
      "Tackling vacant land");
  });

  after(function(done) {
    this.server.close(done);
    nano.db.destroy(process.env.DB)
  });
});
