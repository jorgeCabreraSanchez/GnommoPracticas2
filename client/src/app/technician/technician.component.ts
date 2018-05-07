import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AuthenticationService } from '../services/authentication.service';
import { TechnicianService } from '../services/technician.service';

@Component({
  selector: 'app-technician',
  templateUrl: './technician.component.html',
  styleUrls: ['./technician.component.css']
})
export class TechnicianComponent implements OnInit {

  technician: any = [];
  technicianId: string;

  constructor(private technicianService: TechnicianService,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private router: Router) {
    const role = this.technicianService.getRole();
    if (role === 'admin') {
      this.technicianService.getTechnicians()
        .subscribe(
          technician => {
            this.technician = technician;
          },
          error => {
            console.log(error);
            this.logout();
          });

    } else if (role === 'normal') {
      this.technicianService.getTechnician(JSON.parse(localStorage.getItem('currentUser')).userId)
        .subscribe(
          technician => {
            this.technician.push(technician);
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
    this.titleService.setTitle('Perfil personal');
  }

  delTechnician(id, event: any) {
    this.technicianService.delTechnician(id)
      .subscribe(delcon => {
        this.technician = [];
        this.technicianService.getTechnicians()
          .subscribe(technician => {
            // tslint:disable-next-line:forin
            for (const id$ in technician) {
              const p = technician[id$];
              p.id$ = id$;
              this.technician.push(technician[id$]);
            }
          });
      });
  }

  idEliminar(id) {
    this.technicianId = id;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['']);
  }

}

