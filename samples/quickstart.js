const fs = require('fs');
var readline = require('readline');
const {google} = require('googleapis');
var googleAuth = require('google-auth-library');
const path = require('path');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/gmail-nodejs-quickstart.json
// var SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
// process.env.USERPROFILE) + '/.credentials/';
// var TOKEN_PATH = TOKEN_DIR + 'token.json';
// console.log(TOKEN_PATH);

// // Load client secrets from a local file.
// fs.readFile('credentials/client_secret.json', function processClientSecrets(err, content) {
//   if (err) {
//     console.log('Error loading client secret file: ' + err);
//     return;
//   }
//   // Authorize a client with the loaded credentials, then call the
//   // Gmail API.
//   authorize(JSON.parse(content), listLabels);
// });

// /**
//  * Create an OAuth2 client with the given credentials, and then execute the
//  * given callback function.
//  *
//  * @param {Object} credentials The authorization client credentials.
//  * @param {function} callback The callback to call with the authorized client.
//  */
// function authorize(credentials, callback) {
//   var clientSecret = credentials.installed.client_secret;
//   var clientId = credentials.installed.client_id;
//   var redirectUrl = credentials.installed.redirect_uris[0];
//   var auth = new googleAuth();
//   var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

//   // Check if we have previously stored a token.
//   fs.readFile(TOKEN_PATH, function(err, token) {
//     if (err) {
//       getNewToken(oauth2Client, callback);
//     } else {
//       oauth2Client.credentials = JSON.parse(token);
//       callback(oauth2Client);
//     }
//   });
// }

// /**
//  * Get and store new token after prompting for user authorization, and then
//  * execute the given callback with the authorized OAuth2 client.
//  *
//  * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
//  * @param {getEventsCallback} callback The callback to call with the authorized
//  *     client.
//  */
// function getNewToken(oauth2Client, callback) {
//   var authUrl = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES,
//   });
//   console.log('Authorize this app by visiting this url: ', authUrl);
//   var rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question('Enter the code from that page here: ', function(code) {
//     rl.close();
//     oauth2Client.getToken(code, function(err, token) {
//       if (err) {
//         console.log('Error while trying to retrieve access token', err);
//         return;
//       }
//       oauth2Client.credentials = token;
//       storeToken(token);
//       callback(oauth2Client);
//     });
//   });
// }

// /**
//  * Store token to disk be used in later program executions.
//  *
//  * @param {Object} token The token to store to disk.
//  */
// function storeToken(token) {
//   try {
//     fs.mkdirSync(TOKEN_DIR);
//   } catch (err) {
//     if (err.code != 'EEXIST') {
//       throw err;
//     }
//   }
//   fs.writeFile(TOKEN_PATH, JSON.stringify(token));
//   console.log('Token stored to ' + TOKEN_PATH);


// const clientSecret = require('./credentials/client_secret.json');
// const oauth2Client = new google.auth.OAuth2(
//   YOUR_CLIENT_ID,
//   YOUR_CLIENT_SECRET,
//   YOUR_REDIRECT_URL
// );

// // set auth as a global default
// google.options({
//   auth: oauth2Client
// });
var APIKEY_PATH = (process.env.HOME || process.env.HOMEPATH ||
  process.env.USERPROFILE) + '/.credentials/apiKey';
fs.readFile(TOKEN_PATH, function(err, token) {
  if (err) {
    getNewToken(oauth2Client, callback);
  } else {
    oauth2Client.credentials = JSON.parse(token);
    
  }
});
const plus = google.plus({
  version: 'v1',
  auth: 'AIzaSyCU4rcP1F5ZmHcEm7e-F6tcS50ZETSXMV0', // specify your API key here
});

async function main() {
  const res = await plus.people.get({ userId: 'me' });
  console.log(`Hello ${res.data.displayName}!`);
});

main().catch(console.error);

// const gmail = google.gmail({
//   version: 'v1',
//   auth: 'AIzaSyCU4rcP1F5ZmHcEm7e-F6tcS50ZETSXMV0',
// });
// gmail.users.watch({
//   userId: 'me',
//   resource: {
//         // Replace with `projects/${PROJECT_ID}/topics/${TOPIC_NAME}`
//     topicName: 'projects/app-pruebas-972aa/topics/topico',
//   },
// }, function(err, response) {
//   if (err) {
//     console.log('The API returned an error: ' + err);
//     return;
//   }
//   console.log(response);
// });

