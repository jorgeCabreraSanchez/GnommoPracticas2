'use strict';
// var assert = require('assert');
module.exports = function(app) {
  var Technical = app.models.Technical;
  describe('Technical', function() {
    describe('#create()', function() {
      it('should save without error', function(done) {
        var user = Technical.create(
              {username: 'Jorge', email: 'kaska@gmail.com', name: 'Jorge', surname: 'Cabrera Sánchez',  password: 'j12345', province: 'Madrid', emailVerified: true},
            function(err, technical) {
              if (err) done(err);
              else done();
            });
      });
    });
  });
};

