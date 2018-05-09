import { Injectable } from '@angular/core';
import { HttpEvent, HttpHeaders, HttpInterceptor, HttpHandler, HttpRequest, HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TechnicianService {

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

  getTechnicians() {
    return this.http.get(this.conURL);
  }

  getTechnician(id: string) {
    const url = `${this.conURL}/${id}`;
    return this.http.get(url);
  }

  patchTechnician(doctor: any, id: string) {
    const editcon = JSON.stringify(doctor);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const url = `${this.conURL}/${id}`;
    return this.http.patch(url, editcon, { headers });
  }

  postTechnician(doctor: any) {
    const newcon = JSON.stringify(doctor);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.conURL, newcon, { headers });
  }

  delTechnician(id: string) {
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

  createAlert(technicianId: string, alert: any) {
    const alertURL = 'http://localhost:3000/api/appusers/' + technicianId + '/alerts';
    const newalert = JSON.stringify(alert);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(alertURL, newalert, { headers });
  }

  assignAlert(technicianId: string, alertId: string) {
    const url = 'http://localhost:3000/api/appusers/' + technicianId + 'assign-alert/' + alertId;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(url, { headers });
  }

  getReceivedAlerts(province: string) {
    // const url = 'http://localhost:3000/api/appusers/' + technicianId + '/received-alerts';
    const url = 'http://localhost:3000/api/appusers/' + this.currentUser.userId + '/get-alerts-by-owner-province';
    return this.http.get(url);
  }

  delReceivedAlerts(technicianId: string) {
    const url = 'http://localhost:3000/api/appusers/' + technicianId + '/received-alerts';
    return this.http.delete(url);
  }

  delReceivedAlert(technicianId: string, alertId: string) {
    const url = 'http://localhost:3000/api/appusers/' + technicianId + '/received-alerts/' + alertId;
    return this.http.delete(url);
  }

  getReceivedAlert(technicianId: string, alertId: string) {
    const url = 'http://localhost:3000/api/appusers/' + technicianId + '/received-alerts/' + alertId;
    return this.http.get(url);
  }

  getSentAlerts(technicianId: string) {
    const url = 'http://localhost:3000/api/appusers/' + technicianId + '/sent-alerts';
    return this.http.get(url);
  }

  delSentAlerts(technicianId: string) {
    const url = 'http://localhost:3000/api/appusers/' + technicianId + '/sent-alerts';
    return this.http.delete(url);
  }

  delSentAlert(technicianId: string, alertId: string) {
    const url = 'http://localhost:3000/api/appusers/' + technicianId + '/sent-alerts/' + alertId;
    return this.http.delete(url);
  }

  getSentAlert(technicianId: string, alertId: string) {
    const url = 'http://localhost:3000/api/appusers/' + technicianId + '/sent-alerts/' + alertId;
    return this.http.get(url);
  }

  /* editAlert(technicianId: string, alertId: string, alert: any) {
    const url = 'http://localhost:3000/api/appusers/' + technicianId + '/alerts/' + alertId;
    const editalert = JSON.stringify(alert);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(url, editalert, { headers });
  } */

}
