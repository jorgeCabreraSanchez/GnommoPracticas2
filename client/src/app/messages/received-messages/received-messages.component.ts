import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../services/authentication.service';
import { ProfilesService } from '../../services/profiles.service';
// import { PushNotificationService } from 'ng-push-notification';
import * as firebase from 'firebase';

import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-received-messages',
  templateUrl: './received-messages.component.html',
  styleUrls: ['./received-messages.component.css']
})
export class ReceivedMessagesComponent implements OnInit {

  messages: any = [];
  profileId: string;
  messageId: string;
  currentMessage = new BehaviorSubject(null);


  constructor(private profilesService: ProfilesService,
    private titleService: Title,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private authenticationService: AuthenticationService,
    /*private pushNotification: PushNotificationService*/) {
    setInterval(this.profilesService.getReceivedMessages(JSON.parse(localStorage.getItem('currentUser')).userId)
      .subscribe(messages => {
        this.messages = this.messages;
      },
        error => {
          console.log(error);
          // this.router.navigate(['recibidos']);
        })
      , 5000);
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
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      // ...
    }).catch(function (err) {
      console.log('Unable to get permission to notify.', err);
    });

    messaging.onMessage((payload) => {
      console.log('Message received. ', payload);
      this.currentMessage.next(payload);
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

