import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../services/authentication.service';
import { TechnicianService } from '../../services/technician.service';
// import * as firebase from 'firebase';
// import '@firebase/messaging';

@Component({
  selector: 'app-received-alerts',
  templateUrl: './received-alerts.component.html',
  styleUrls: ['./received-alerts.component.css']
})
export class ReceivedAlertsComponent implements OnInit {

  alerts: any = [];
  profile: any = [];
  profileId: string;
  alertId: string;
  province: string;

  constructor(private technicianService: TechnicianService,
    private titleService: Title,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private authenticationService: AuthenticationService) {
    this.technicianService.getTechnician(JSON.parse(localStorage.getItem('currentUser')).userId)
      .subscribe(profile => {
        this.profile = profile;
        this.province = this.profile.province;
        console.log(this.province);
        /*setInterval(*/this.technicianService.getReceivedAlerts(this.province)
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
  }

  assignAlert(profileId$, alertId$) {
    this.technicianService.assignAlert(profileId$, alertId$)
      .subscribe(delalert => {
        this.alerts = [];
        this.technicianService.getReceivedAlerts(this.profileId)
          .subscribe(alerts => {
            // tslint:disable-next-line:forin no-shadowed-variable
            for (const profileId$ in alerts) {
              const p = alerts[profileId$];
              p.profileId$ = profileId$;
              this.alerts.push(alerts[profileId$]);
            }
          });
      });
  }

  /* unassignAlert(profileId$, alertId$) {
    this.technicianService.unassignAlert(profileId$, alertId$)
      .subscribe(delalert => {
        this.alerts = [];
        this.technicianService.getReceivedAlerts(this.profileId)
          .subscribe(alerts => {
            // tslint:disable-next-line:forin no-shadowed-variable
            for (const profileId$ in alerts) {
              const p = alerts[profileId$];
              p.profileId$ = profileId$;
              this.alerts.push(alerts[profileId$]);
            }
          });
      });
  } */

  delReceivedAlert(profileId$, AlertId$) {
    this.technicianService.delReceivedAlert(profileId$, AlertId$)
      .subscribe(delalert => {
        this.alerts = [];
        this.technicianService.getReceivedAlerts(this.profileId)
          .subscribe(alerts => {
            // tslint:disable-next-line:forin no-shadowed-variable
            for (const profileId$ in alerts) {
              const p = alerts[profileId$];
              p.profileId$ = profileId$;
              this.alerts.push(alerts[profileId$]);
            }
          });
      });
  }

  delReceivedAlerts(profileId$) {
    this.technicianService.delReceivedAlerts(profileId$)
      .subscribe(delalert => {
        this.alerts = [];
      });
  }

  idEliminar(id) {
    this.alertId = id;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['']);
  }

}

