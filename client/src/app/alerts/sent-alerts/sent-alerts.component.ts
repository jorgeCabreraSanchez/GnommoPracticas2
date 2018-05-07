import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthenticationService } from '../../services/authentication.service';
import { TechnicianService } from '../../services/technician.service';

@Component({
  selector: 'app-sent-alerts',
  templateUrl: './sent-alerts.component.html',
  styleUrls: ['./sent-alerts.component.css']
})
export class SentAlertsComponent implements OnInit {

  alerts: any = [];
  profileId: string;
  alertId: string;

  constructor(private technicianService: TechnicianService,
    private titleService: Title,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private authenticationService: AuthenticationService) {
    this.technicianService.getSentAlerts(JSON.parse(localStorage.getItem('currentUser')).userId)
      .subscribe(alerts => {
        this.alerts = this.alerts;
      },
        error => {
          console.log(error);
          // this.router.navigate(['recibidas']);
        });
  }

  ngOnInit() {
    this.titleService.setTitle('Alertas enviadas');
  }

  delSentAlert(profileId$, AlertId$) {
    this.technicianService.delSentAlert(profileId$, AlertId$)
      .subscribe(delalert => {
        this.alerts = [];
        this.technicianService.getSentAlerts(this.profileId)
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

  delAlerts(profileId$) {
    this.technicianService.delSentAlerts(profileId$)
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
