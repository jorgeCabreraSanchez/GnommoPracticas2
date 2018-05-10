import { Injectable } from '@angular/core';
import { HttpEvent, HttpHeaders, HttpInterceptor, HttpHandler, HttpRequest, HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AppuserService {

  conURL = 'http://localhost:3000/api/appusers';
  currentUser = JSON.parse(localStorage.getItem('currentUser'));

  constructor(private http: HttpClient) { }

  getRole() {
    // const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser) {
      console.log(this.currentUser.role);
      return this.currentUser.role;
    } else {
      return 'undefined';
    }
  }

  isAuthenticated() {
    return localStorage.getItem('currentUser') ? true : false;
  }

  getAppusers() {
    return this.http.get(this.conURL);
  }

  getAppuser(id: string) {
    const url = `${this.conURL}/${id}`;
    return this.http.get(url);
  }

  patchAppuser(doctor: any, id: string) {
    const editcon = JSON.stringify(doctor);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const url = `${this.conURL}/${id}`;
    return this.http.patch(url, editcon, { headers });
  }

  postAppuser(doctor: any) {
    const newcon = JSON.stringify(doctor);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.conURL, newcon, { headers });
  }

  delAppuser(id: string) {
    const url = `${this.conURL}/${id}`;
    return this.http.delete(url);
  }

  postImage(file: File, userId: string) {
    const fd = new FormData();
    fd.append('file', file);
    const headers = new HttpHeaders();
    return this.http.post(`http://localhost:3000/api/appusers/${userId}/upload-image`, fd, { headers });
  }

  postFiles(files: any, userId: string) {
    const fd = new FormData();
    fd.append('file', files);
    const headers = new HttpHeaders();
    return this.http.post(`http://localhost:3000/api/appusers/${userId}/upload-files`, fd, { headers });
  }

  createAlert(appuserId: string, alert: any) {
    const alertURL = 'http://localhost:3000/api/appusers/' + appuserId + '/alerts';
    const newalert = JSON.stringify(alert);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(alertURL, newalert, { headers });
  }

  assignAlert(appuserId: string, alertId: string) {
    const url = 'http://localhost:3000/api/appusers/' + this.currentUser.userId + '/assign-alert/' + alertId;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(url, { headers });
  }

  getReceivedAlerts(province: string) {
    // const url = 'http://localhost:3000/api/appusers/' + appuserId + '/received-alerts';
    const url = 'http://localhost:3000/api/appusers/' + this.currentUser.userId + '/get-alerts-by-owner-province';
    return this.http.get(url);
  }

  delReceivedAlerts(appuserId: string) {
    const url = 'http://localhost:3000/api/appusers/' + appuserId + '/received-alerts';
    return this.http.delete(url);
  }

  delReceivedAlert(appuserId: string, alertId: string) {
    const url = 'http://localhost:3000/api/appusers/' + appuserId + '/received-alerts/' + alertId;
    return this.http.delete(url);
  }

  getReceivedAlert(appuserId: string, alertId: string) {
    const url = 'http://localhost:3000/api/appusers/' + appuserId + '/received-alerts/' + alertId;
    return this.http.get(url);
  }

  getSentAlerts(appuserId: string) {
    const url = 'http://localhost:3000/api/appusers/' + appuserId + '/sent-alerts';
    return this.http.get(url);
  }

  delSentAlerts(appuserId: string) {
    const url = 'http://localhost:3000/api/appusers/' + appuserId + '/sent-alerts';
    return this.http.delete(url);
  }

  delSentAlert(appuserId: string, alertId: string) {
    const url = 'http://localhost:3000/api/appusers/' + appuserId + '/sent-alerts/' + alertId;
    return this.http.delete(url);
  }

  getSentAlert(appuserId: string, alertId: string) {
    const url = 'http://localhost:3000/api/appusers/' + appuserId + '/sent-alerts/' + alertId;
    return this.http.get(url);
  }

  /* editAlert(appuserId: string, alertId: string, alert: any) {
    const url = 'http://localhost:3000/api/appusers/' + appuserId + '/alerts/' + alertId;
    const editalert = JSON.stringify(alert);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(url, editalert, { headers });
  } */

}
