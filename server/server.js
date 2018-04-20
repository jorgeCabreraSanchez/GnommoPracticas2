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

// subscription gmail
// Imports the Google Cloud client library
const PubSub = require('@google-cloud/pubsub');

// var client = new PubSub.v1.PublisherClient({
//   // optional auth parameters.
// });

// var Gmail = require('node-gmail-api');
// passport.use(new GoogleStrategy({
//   clientID: '271450768634-v2prf1e6uuklsdf10ec2m5nsrg09lrbe.apps.googleusercontent.com'
//   , clientSecret: 'config.googleApp.clientSecret'
//   , userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
//   , callbackURL: config.baseurl + '/oauth2callback'
// }
// , function(accessToken, refreshToken, profile, done) {
//   var gmail = new Gmail(accessToken);
//   const res = await gmail.users.watch({
//     userId: 'me',
//     resource: {
//     // Replace with `projects/${PROJECT_ID}/topics/${TOPIC_NAME}`
//     topicName: `projects/app-pruebas-972aa/topics/topico`
//   }
// });
// console.log(res.data);
// }
// ))



// Your Google Cloud Platform project ID
const projectId = 'app-pruebas-972aa';

// Instantiates a client
const pubsubClient = new PubSub({
  keyFilename: './credentials/app-pruebas-210a587e9289.json',
});

const subscriptionName = 'projects/app-pruebas-972aa/subscriptions/mySubscription';
const timeout = 60 * 1;

// References an existing subscription
const subscription = pubsubClient.subscription(subscriptionName);
// request = {
//   'labelIds': ['INBOX'],
//   'topicName': 'projects/myproject/topics/mytopic',
// };
// gmail.users().watch(userId = 'me', body = request).execute();

// Create an event handler to handle messages
let messageCount = 0;
const messageHandler = message => {
  console.log(`Received message ${message.id}:`);
  console.log(`\tData: ${message.data}`);
  console.log(`\tAttributes: ${message.attributes}`);
  console.log(message.attributes);
  messageCount += 1;

  // "Ack" (acknowledge receipt of) the message
  message.ack();
};

// Create an event handler to handle errors
const errorHandler = function(error) {
  // Do something with the error
  console.error(`ERROR: ${error}`);
};

// Listen for new messages until timeout is hit
subscription.on('message', messageHandler);
console.log('Escuchando mensajes gmail');
// setTimeout(() => {
//   subscription.removeListener('message', messageHandler);
//   console.log(`${messageCount} message(s) received.`);
// }, timeout * 1000);

// The name for the new topic
// const topicName = 'my-new-topic';

// Creates the new topic
// pubsubClient
//   .createTopic(topicName)
//   .then(results => {
//     const topic = results[0];
//     console.log(`Topic ${topic.name} created.`);
//   })
//   .catch(err => {
//     console.error('ERROR:', err);
//   });

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
