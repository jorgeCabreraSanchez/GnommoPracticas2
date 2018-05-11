import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../services/authentication.service';
import { AppuserService } from '../../services/appuser.service';

@Component({
  selector: 'app-sent-alerts',
  templateUrl: './sent-alerts.component.html',
  styleUrls: ['./sent-alerts.component.css']
})
export class SentAlertsComponent implements OnInit {

  alerts: any = [];
  appuserId: string;
  alertId: string;

  constructor(private appuserService: AppuserService,
    private titleService: Title,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private authenticationService: AuthenticationService) {
    this.appuserService.getSentAlerts(JSON.parse(localStorage.getItem('currentUser')).userId)
      .subscribe(alerts => {
        this.alerts = this.alerts;
      },
        error => {
          console.log(error);
          // this.router.navigate(['recibidas']);
        });
  }

  ngOnInit() {
    if (this.appuserService.getRole() !== 'admin' && this.appuserService.getRole() !== 'hospitalUser') {
      this.router.navigate(['/']);
    }
    this.titleService.setTitle('Alertas enviadas');
  }

  delSentAlert(appuserId$, AlertId$) {
    this.appuserService.delSentAlert(appuserId$, AlertId$)
      .subscribe(delalert => {
        this.alerts = [];
        this.appuserService.getSentAlerts(this.appuserId)
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

  delAlerts(appuserId$) {
    this.appuserService.delSentAlerts(appuserId$)
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
