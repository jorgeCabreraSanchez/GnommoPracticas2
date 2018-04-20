import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../services/authentication.service';
import { ProfilesService } from '../../services/profiles.service';

@Component({
  selector: 'app-sent-messages',
  templateUrl: './sent-messages.component.html',
  styleUrls: ['./sent-messages.component.css']
})
export class SentMessagesComponent implements OnInit {

  messages: any = [];
  profileId: string;
  messageId: string;

  constructor(private profilesService: ProfilesService,
    private titleService: Title,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private authenticationService: AuthenticationService) {
    this.profilesService.getSentMessages(JSON.parse(localStorage.getItem('currentUser')).userId)
      .subscribe(messages => {
        this.messages = this.messages;
      },
        error => {
          console.log(error);
          // this.router.navigate(['recibidos']);
        });
  }

  ngOnInit() {
    this.titleService.setTitle('Mensajes enviados');
  }

  delSentMessage(profileId$, MessageId$) {
    this.profilesService.delSentMessage(profileId$, MessageId$)
      .subscribe(delmessage => {
        this.messages = [];
        this.profilesService.getSentMessages(this.profileId)
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

  delMessages(profileId$) {
    this.profilesService.delSentMessages(profileId$)
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
