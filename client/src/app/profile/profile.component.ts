import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AuthenticationService } from '../services/authentication.service';
import { ProfilesService } from '../services/profiles.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profiles: any = [];
  profileId: string;

  constructor(private profilesService: ProfilesService,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private router: Router) {
    const role = this.profilesService.getRole();
    if (role === 'admin') {
      this.profilesService.getProfiles()
        .subscribe(
          profiles => {
            this.profiles = profiles;
          },
          error => {
            console.log(error);
            this.logout();
          });

    } else if (role === 'normal') {
      this.profilesService.getProfile(JSON.parse(localStorage.getItem('currentUser')).userId)
        .subscribe(
          profiles => {
            this.profiles.push(profiles);
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

  delProfile(id, event: any) {
    this.profilesService.delProfile(id)
      .subscribe(delcon => {
        this.profiles = [];
        this.profilesService.getProfiles()
          .subscribe(profiles => {
            // tslint:disable-next-line:forin
            for (const id$ in profiles) {
              const p = profiles[id$];
              p.id$ = id$;
              this.profiles.push(profiles[id$]);
            }
          });
      });
  }

  idEliminar(id) {
    this.profileId = id;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['']);
  }

}

