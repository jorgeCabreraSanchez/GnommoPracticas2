import { Component, OnInit } from '@angular/core';
import { RouterLinkActive } from '@angular/router';

import { TechnicianService } from '../services/technician.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  role: string;
  auth: boolean;

  constructor(private techniciansService: TechnicianService) {

  }

  ngOnInit() {
    this.role = this.techniciansService.getRole();
    this.auth = this.techniciansService.isAuthenticated();
    console.log(this.role);
    console.log(this.auth);
   }

  getRole() {
    return this.techniciansService.getRole();
  }

  isAuth() {
    return this.techniciansService.isAuthenticated();
  }

}
