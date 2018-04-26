'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

    // Extend the life of the access token to 30 minutes from now when a new
    // call is made using it.
app.use(loopback.token({
  model: app.models.AccessToken,
}));
app.use((req, res, next) => {
  const token = req.accessToken;

  if (!token) {
    return next();
  }

  const now = new Date();

      req.accessToken.created = now; // eslint-disable-line
  return req.accessToken.save(next);
});

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
