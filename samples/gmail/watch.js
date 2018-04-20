'use strict';

const { google } = require('googleapis');
const sampleClient = require('../sampleclient');

const gmail = google.gmail({
  version: 'v1',
  auth: sampleClient.oAuth2Client
});

async function runSample () {
  const res = await gmail.users.watch({
    userId: 'me',
    resource: {
      // Replace with `projects/${PROJECT_ID}/topics/${TOPIC_NAME}`
      topicName: `projects/app-pruebas-972aa/topics/topico`
    }
  });
  console.log(res.data);
  return res.data;
}

const scopes = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.metadata',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.readonly'
];

if (module === require.main) {
  sampleClient.authenticate(scopes)
    .then(c => runSample())
    .catch(console.error);
}

module.exports = {
  runSample,
  client: sampleClient.oAuth2Client
};