import { Component, OnInit } from '@angular/core';
import { RouterLinkActive } from '@angular/router';

import { ProfilesService } from '../services/profiles.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private profilesService: ProfilesService) {

  }

  ngOnInit() { }

  role() {
    return this.profilesService.getRole();
  }

  auth() {
    return this.profilesService.isAuthenticated();
  }

}
