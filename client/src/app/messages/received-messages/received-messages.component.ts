import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../services/authentication.service';
import { ProfilesService } from '../../services/profiles.service';
import * as firebase from 'firebase';
import '@firebase/messaging';

@Component({
  selector: 'app-received-messages',
  templateUrl: './received-messages.component.html',
  styleUrls: ['./received-messages.component.css']
})
export class ReceivedMessagesComponent implements OnInit {

  messages: any = [];
  profile: any = [];
  profileId: string;
  messageId: string;
  province: string;

  constructor(private profilesService: ProfilesService,
    private titleService: Title,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private authenticationService: AuthenticationService) {
    this.profilesService.getProfile(JSON.parse(localStorage.getItem('currentUser')).userId)
      .subscribe(profile => {
        this.profile = profile;
        this.province = this.profile.province;
        console.log(this.province);
        /*setInterval(*/this.profilesService.getReceivedMessages(this.province)
          .subscribe(messages => {
            this.messages = messages;
          },
            error => {
              console.log(error);
              // this.router.navigate(['recibidos']);
            });
        // , 5000);
      },
        error => {
          console.log(error);
          // this.router.navigate(['recibidos']);
        });
  }

  ngOnInit() {
    this.titleService.setTitle('Mensajes recibidos');

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

  assignAlert(profileId$, alertId$) {
    this.profilesService.assignAlert(profileId$, alertId$)
      .subscribe(delmessage => {
        this.messages = [];
        this.profilesService.getReceivedMessages(this.profileId)
          .subscribe(messages => {
            // tslint:disable-next-line:forin no-shadowed-variable
            for (const profileId$ in messages) {
              const p = messages[profileId$];
              p.profileId$ = profileId$;
              this.messages.push(messages[profileId$]);
            }
          });
      });
  }

  unassignAlert(profileId$, alertId$) {
    this.profilesService.unassignAlert(profileId$, alertId$)
      .subscribe(delmessage => {
        this.messages = [];
        this.profilesService.getReceivedMessages(this.profileId)
          .subscribe(messages => {
            // tslint:disable-next-line:forin no-shadowed-variable
            for (const profileId$ in messages) {
              const p = messages[profileId$];
              p.profileId$ = profileId$;
              this.messages.push(messages[profileId$]);
            }
          });
      });
  }

  delReceivedMessage(profileId$, MessageId$) {
    this.profilesService.delReceivedMessage(profileId$, MessageId$)
      .subscribe(delmessage => {
        this.messages = [];
        this.profilesService.getReceivedMessages(this.profileId)
          .subscribe(messages => {
            // tslint:disable-next-line:forin no-shadowed-variable
            for (const profileId$ in messages) {
              const p = messages[profileId$];
              p.profileId$ = profileId$;
              this.messages.push(messages[profileId$]);
            }
          });
      });
  }

  delReceivedMessages(profileId$) {
    this.profilesService.delReceivedMessages(profileId$)
      .subscribe(delmessage => {
        this.messages = [];
      });
  }

  idEliminar(id) {
    this.messageId = id;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['']);
  }

}

