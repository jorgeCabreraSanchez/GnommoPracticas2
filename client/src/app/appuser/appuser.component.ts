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

  appuser: any = [];
  appuserId: string;

  constructor(private appuserService: AppuserService,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private router: Router) {
    const role = this.appuserService.getRole();
    if (role === 'admin') {
      this.titleService.setTitle('Usuarios');
      this.appuserService.getAppusers()
        .subscribe(
          appuser => {
            this.appuser = appuser;
          },
          error => {
            console.log(error);
            this.logout();
          });

    } else if (role === 'technician' || role === 'hospitalUser') {
      this.titleService.setTitle('Perfil personal');
      this.appuserService.getAppuser(JSON.parse(localStorage.getItem('currentUser')).userId)
        .subscribe(
          appuser => {
            this.appuser.push(appuser);
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
        this.appuser = [];
        this.appuserService.getAppusers()
          .subscribe(appuser => {
            // tslint:disable-next-line:forin
            for (const id$ in appuser) {
              const p = appuser[id$];
              p.id$ = id$;
              this.appuser.push(appuser[id$]);
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

