var app = require('../app'),
    request = require('supertest');

describe('Attic :: heartbeat', function() {
  describe('when requesting test resource /heartbeat', function() {
    it('should respond with 200', function(done) {
      request(app)
        .get('/heartbeat')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });
  });
});