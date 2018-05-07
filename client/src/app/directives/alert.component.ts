import { Component, OnInit } from '@angular/core';

import { AlertService } from '../services/alert.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  alert: any;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.getMessage().subscribe(alert => { this.alert = alert; });
  }

}


