import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public options = {
    position: ['bottom', 'right'],
    timeOut: 2500,
    lastOnBottom: true,
    preventLastDuplicates: 'visible',
    animate: 'fromLeft',
    showProgressBar: true,
    pauseOnHover: false,
    clickToClose: false
  };

  ngOnInit() {
    // Initialize Firebase
    // TODO: Replace with your project's customized code snippet
    const config = {
      apiKey: 'AIzaSyBhNntcL5UgZZ0hPwsFDkoYBmZea0PJqFY',
      authDomain: 'app-pruebas-972aa.firebaseapp.com',
      databaseURL: 'https://app-pruebas-972aa.firebaseio.com',
      projectId: 'app-pruebas-972aa',
      storageBucket: 'app-pruebas-972aa.appspot.com',
      messagingSenderId: '271450768634'
    };
    firebase.initializeApp(config);
    const messaging = firebase.messaging();
    messaging.requestPermission().then(function () {
      console.log('Notification permission granted.');
      return messaging.getToken();
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      // ...
    }).then(function (token) {
      console.log(token);
    }).catch(function (err) {
      console.log('Unable to get permission to notify.', err);
    });

    /* // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging.getToken()
      .then(function (currentToken) {
        if (currentToken) {
          sendTokenToServer(currentToken);
          updateUIForPushEnabled(currentToken);
        } else {
          // Show permission request.
          console.log('No Instance ID token available. Request permission to generate one.');
          // Show permission UI.
          updateUIForPushPermissionRequired();
          setTokenSentToServer(false);
        }
      })
      .catch(function (err) {
        console.log('An error occurred while retrieving token. ', err);
        showToken('Error retrieving Instance ID token. ', err);
        setTokenSentToServer(false);
      });

    // Callback fired if Instance ID token is updated.
    messaging.onTokenRefresh(function () {
      messaging.getToken()
        .then(function (refreshedToken) {
          console.log('Token refreshed.');
          // Indicate that the new Instance ID token has not yet been sent to the
          // app server.
          setTokenSentToServer(false);
          // Send Instance ID token to app server.
          sendTokenToServer(refreshedToken);
          // ...
        })
        .catch(function (err) {
          console.log('Unable to retrieve refreshed token ', err);
          showToken('Unable to retrieve refreshed token ', err);
        });
    }); */

    // Handle incoming messages. Called when:
    // - a message is received while the app has focus
    // - the user clicks on an app notification created by a sevice worker
    //   `messaging.setBackgroundMessageHandler` handler.
    messaging.onMessage(function (payload) {
      console.log('Message received. ', payload);
      // ...
    });

  }
}
