import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../services/authentication.service';
import { AppuserService } from '../services/appuser.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;

  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private appuserService: AppuserService,
    private Notification: NotificationsService,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Alertru-Iniciar sesión');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      console.log(this.appuserService.getRole());
      console.log(this.appuserService.isAuthenticated());

      if (this.appuserService.isAuthenticated() && this.appuserService.getRole() === 'technician') {
        this.router.navigate(['recibidas']);
      } else if (this.appuserService.isAuthenticated() && this.appuserService.getRole() === 'hospitalUser') {
        this.router.navigate(['enviadas']);
      } else if (this.appuserService.isAuthenticated() && this.appuserService.getRole() === 'admin') {
        this.router.navigate(['usuarios']);
      } else {
        this.authenticationService.logout();
        console.log('Borra el currentUser');
      }
    }
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.email, this.model.password)
      .subscribe(
        data => {
          this.authenticationService.getRole(data)
            .subscribe(resultado => {
              if (this.appuserService.isAuthenticated() && this.appuserService.getRole() === 'appuser') {
                this.router.navigate(['recibidas']);
              } else if (this.appuserService.isAuthenticated() && this.appuserService.getRole() === 'hospitalUser') {
                this.router.navigate(['enviadas']);
              } else if (this.appuserService.isAuthenticated() && this.appuserService.getRole() === 'admin') {
                this.router.navigate(['usuarios']);
              }
              // this.router.navigate(['recibidas']);
            });
        },
        error => {
          console.log(error);
          let message;
          if (error.error.error.message) {
            message = error.error.error.message;
          } else {
            message = 'Ha ocurrido un error con la aplicación';
          }
          this.Notification.error(message, '', {});
          this.loading = false;
        });
  }

}
