import { Component, OnInit } from '@angular/core';
import { RouterLinkActive } from '@angular/router';

import { TechnicianService } from '../services/technician.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private techniciansService: TechnicianService) {

  }

  ngOnInit() { }

  getRole() {
    return this.techniciansService.getRole();
  }

  isAuth() {
    return this.techniciansService.isAuthenticated();
  }

}
