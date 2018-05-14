import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../services/authentication.service';
import { AppuserService } from '../../services/appuser.service';
// import * as firebase from 'firebase';
// import '@firebase/messaging';

@Component({
  selector: 'app-received-alerts',
  templateUrl: './received-alerts.component.html',
  styleUrls: ['./received-alerts.component.css']
})
export class ReceivedAlertsComponent implements OnInit {

  alerts: any = [];
  appuser: any = [];
  appuserId: string;
  alertId: string;
  province: string;

  constructor(private appuserService: AppuserService,
    private titleService: Title,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private authenticationService: AuthenticationService) {
    this.appuserService.getAppuser(JSON.parse(localStorage.getItem('currentUser')).userId)
      .subscribe(appuser => {
        this.appuser = appuser;
        this.province = this.appuser.province;
        console.log(this.province);
        /*setInterval(*/this.appuserService.getReceivedAlerts(this.province)
          .subscribe(alerts => {
            this.alerts = alerts;
          },
            error => {
              console.log(error);
              // this.router.navigate(['recibidas']);
            });
        // , 5000);
      },
        error => {
          console.log(error);
          // this.router.navigate(['recibidas']);
        });
  }

  ngOnInit() {
    this.titleService.setTitle('Alertas recibidas');
    if (this.appuserService.getRole() !== 'technician') {
      this.router.navigate(['/']);
    }
  }

  assignAlert(appuserId$, alertId$) {
    this.appuserService.assignAlert(appuserId$, alertId$)
      .subscribe(delalert => {
        this.alerts = [];
        this.appuserService.getReceivedAlerts(this.appuserId)
          .subscribe(alerts => {
            // tslint:disable-next-line:forin no-shadowed-variable
            for (const appuserId$ in alerts) {
              const p = alerts[appuserId$];
              p.appuserId$ = appuserId$;
              this.alerts.push(alerts[appuserId$]);
            }
          });
      });
  }

  /* unassignAlert(appuserId$, alertId$) {
    this.appuserService.unassignAlert(appuserId$, alertId$)
      .subscribe(delalert => {
        this.alerts = [];
        this.appuserService.getReceivedAlerts(this.appuserId)
          .subscribe(alerts => {
            // tslint:disable-next-line:forin no-shadowed-variable
            for (const appuserId$ in alerts) {
              const p = alerts[appuserId$];
              p.appuserId$ = appuserId$;
              this.alerts.push(alerts[appuserId$]);
            }
          });
      });
  } */

  delReceivedAlert(appuserId$, AlertId$) {
    this.appuserService.delReceivedAlert(appuserId$, AlertId$)
      .subscribe(delalert => {
        this.alerts = [];
        this.appuserService.getReceivedAlerts(this.appuserId)
          .subscribe(alerts => {
            // tslint:disable-next-line:forin no-shadowed-variable
            for (const appuserId$ in alerts) {
              const p = alerts[appuserId$];
              p.appuserId$ = appuserId$;
              this.alerts.push(alerts[appuserId$]);
            }
          });
      });
  }

  delReceivedAlerts(appuserId$) {
    this.appuserService.delReceivedAlerts(appuserId$)
      .subscribe(delalert => {
        this.alerts = [];
      });
  }

  idEliminar(id) {
    this.alertId = id;
  }

  idAsignar(id) {
    this.alertId = id;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['']);
  }

}

