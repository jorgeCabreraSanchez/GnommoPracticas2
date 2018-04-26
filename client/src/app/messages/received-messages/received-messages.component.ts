import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../services/authentication.service';
import { ProfilesService } from '../../services/profiles.service';
import { PushNotificationService } from 'ng-push-notification';


@Component({
  selector: 'app-received-messages',
  templateUrl: './received-messages.component.html',
  styleUrls: ['./received-messages.component.css']
})
export class ReceivedMessagesComponent implements OnInit {

  messages: any = [];
  profileId: string;
  messageId: string;

  constructor(private profilesService: ProfilesService,
    private titleService: Title,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private pushNotification: PushNotificationService) {
    this.profilesService.getReceivedMessages(JSON.parse(localStorage.getItem('currentUser')).userId)
      .subscribe(messages => {
        this.messages = this.messages;
      },
        error => {
          console.log(error);
          // this.router.navigate(['recibidos']);
        });
  }

  ngOnInit() {
    this.titleService.setTitle('Mensajes recibidos');
  }

  showPush() {
    this.pushNotification.show(
      'Show me that message!',
      { icon: '../assets/bell.png'/* any settings, e.g. icon */ },
      6000, // close delay.
    );
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

