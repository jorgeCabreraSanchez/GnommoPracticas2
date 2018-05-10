import { Component, OnInit } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { AppuserService } from '../services/appuser.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  role: string;
  auth: boolean;

  constructor(private appuserService: AppuserService) {

  }

  ngOnInit() {
    this.role = this.appuserService.getRole();
    this.auth = this.appuserService.isAuthenticated();
  }

  getRole() {
    return this.appuserService.getRole();
  }

  isAuth() {
    return this.appuserService.isAuthenticated();
  }

}
