import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../services/authentication.service';
import { ProfilesService } from '../../services/profiles.service';
// import * as firebase from 'firebase';
// import '@firebase/messaging';

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

