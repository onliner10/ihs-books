process.env.NODE_ENV = 'test';
const
  http = require('http'),
  app = require('../../app'),
  Browser = require('zombie'),
  assert = require('assert'),
  nano = require('nano')(process.env.DB_HOST);

describe('when proposing new book', function(done) {
    var baseUrl = 'http://localhost:' + process.env.HTTP_PORT;

    before('run db migration', function(done) {
      require('../../db_migrations/001_Create_BooksDb.js')(done);
    });

    before('initialize server', function() {
      this.server = app.listen(process.env.HTTP_PORT);
    });

    before('visit the homepage', function(done) {
      this.browser = new Browser({site: baseUrl});
      this.browser.visit('/', done);
    });

    it('should redirect to propose page, when clicking submit on search input', function() {
      this.browser.pressButton("Go!", function() {
        assert.equal(baseUrl + "/propose/", this.browser.location);
      });
    });

    after(function(done) {
      nano.db.destroy('books')
      this.server.close(done);
    });
});
