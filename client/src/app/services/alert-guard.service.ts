import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './authentication.service';
import { TechnicianService } from './technician.service';


@Injectable()
export class AlertGuardService implements CanActivate {

  // tslint:disable-next-line:max-line-length
  constructor(private authenticationService: AuthenticationService, private technicianService: TechnicianService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authenticationService.isAuthenticated().then(
      authenticated => {
        if (authenticated) {
          if (this.technicianService.getRole() === 'technician') {
            this.router.navigate(['recibidas']);
            return true;
          } else if (this.technicianService.getRole() === 'hospitalUser') {
            this.router.navigate(['enviadas']);
            return true;
          } else {
            return false;
          }
        }
      },
      error => {
        return false;
      });
  }
}
