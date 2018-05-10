import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './authentication.service';
import { AppuserService } from './appuser.service';


@Injectable()
export class AlertGuardService implements CanActivate {

  // tslint:disable-next-line:max-line-length
  constructor(private authenticationService: AuthenticationService, private appuserService: AppuserService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authenticationService.isAuthenticated().then(
      authenticated => {
        if (authenticated) {
          if (this.appuserService.getRole() === 'appuser') {
            this.router.navigate(['recibidas']);
            return true;
          } else if (this.appuserService.getRole() === 'hospitalUser') {
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
