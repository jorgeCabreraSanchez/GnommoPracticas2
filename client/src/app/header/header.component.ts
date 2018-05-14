import { Component, OnInit } from '@angular/core';
import { RouterLinkActive } from '@angular/router';
import { AppuserService } from '../services/appuser.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // role: string;
  // auth: boolean;

  constructor(private appuserService: AppuserService) {

  }

  ngOnInit() {
   /*  this.auth = this.appuserService.isAuthenticated();
    if (this.auth) {
      this.role = this.appuserService.getRole();
    } */
  }

  getRole() {
    return this.appuserService.getRole();
  }

  isAuth() {
    return this.appuserService.isAuthenticated();
  }

}
