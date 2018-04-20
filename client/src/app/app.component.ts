import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public options = {
    position: ['bottom', 'right'],
    timeOut: 2500,
    lastOnBottom: true,
    preventLastDuplicates: 'visible',
    animate: 'fromLeft',
    showProgressBar: true,
    pauseOnHover: false,
    clickToClose: false
  };
}
