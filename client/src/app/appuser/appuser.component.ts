import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AuthenticationService } from '../services/authentication.service';
import { AppuserService } from '../services/appuser.service';

@Component({
  selector: 'app-appuser',
  templateUrl: './appuser.component.html',
  styleUrls: ['./appuser.component.css']
})
export class AppuserComponent implements OnInit {

  appusers: any = [];
  appuserId: string;
  role: string;

  constructor(private appuserService: AppuserService,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private router: Router) {
    this.role = this.appuserService.getRole();
    if (this.role === 'admin') {
      this.titleService.setTitle('Usuarios');
      this.appuserService.getAppusers()
        .subscribe(
          appusers => {
            this.appusers = appusers;
          },
          error => {
            console.log(error);
            this.logout();
          });

    } else if (this.role === 'technician' || this.role === 'hospitalUser') {
      this.titleService.setTitle('Perfil personal');
      this.appuserService.getAppuser(JSON.parse(localStorage.getItem('currentUser')).userId)
        .subscribe(
          appusers => {
            this.appusers.push(appusers);
          },
          error => {
            console.log(error);
            this.logout();
          });
    } else {
      this.logout();
      console.log('No tiene ningun rol asignado');
    }
  }

  ngOnInit() {

  }

  delAppuser(id, event: any) {
    this.appuserService.delAppuser(id)
      .subscribe(delcon => {
        this.appusers = [];
        this.appuserService.getAppusers()
          .subscribe(appusers => {
            // tslint:disable-next-line:forin
            for (const id$ in appusers) {
              const p = appusers[id$];
              p.id$ = id$;
              this.appusers.push(appusers[id$]);
            }
          });
      });
  }

  idEliminar(id) {
    this.appuserId = id;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['']);
  }

}

