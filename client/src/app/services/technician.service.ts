import { Injectable } from '@angular/core';
import { HttpEvent, HttpHeaders, HttpInterceptor, HttpHandler, HttpRequest, HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';


@Injectable()
export class TechnicianService {

  conURL = 'http://localhost:3000/api/technicians';

  constructor(private http: HttpClient) { }

  getRole() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      return currentUser.role;
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
    return this.http.post(`http://localhost:3000/api/technicians/${userId}/upload-image`, fd, { headers });
  }

  postFiles(files: any, userId: string) {
    const fd = new FormData();
    fd.append('file', files);
    const headers = new HttpHeaders();
    return this.http.post(`http://localhost:3000/api/technicians/${userId}/upload-files`, fd, { headers });
  }

  createAlert(technicianId: string, alert: any) {
    const alertURL = 'http://localhost:3000/api/technicians/' + technicianId + '/alerts';
    const newalert = JSON.stringify(alert);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(alertURL, newalert, { headers });
  }

  assignAlert(technicianId: string, alertId: string) {
    const url = 'http://localhost:3000/api/technicians/' + technicianId + 'assign-alert/' + alertId;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(url, { headers });
  }

  getReceivedAlerts(province: string) {
    // const url = 'http://localhost:3000/api/technicians/' + technicianId + '/received-alerts';
    const url = 'http://localhost:3000/api/technicians/get-alerts-by-province/' + province;
    return this.http.get(url);
  }

  delReceivedAlerts(technicianId: string) {
    const url = 'http://localhost:3000/api/technicians/' + technicianId + '/received-alerts';
    return this.http.delete(url);
  }

  delReceivedAlert(technicianId: string, alertId: string) {
    const url = 'http://localhost:3000/api/technicians/' + technicianId + '/received-alerts/' + alertId;
    return this.http.delete(url);
  }

  getReceivedAlert(technicianId: string, alertId: string) {
    const url = 'http://localhost:3000/api/technicians/' + technicianId + '/received-alerts/' + alertId;
    return this.http.get(url);
  }

  getSentAlerts(technicianId: string) {
    const url = 'http://localhost:3000/api/technicians/' + technicianId + '/sent-alerts';
    return this.http.get(url);
  }

  delSentAlerts(technicianId: string) {
    const url = 'http://localhost:3000/api/technicians/' + technicianId + '/sent-alerts';
    return this.http.delete(url);
  }

  delSentAlert(technicianId: string, alertId: string) {
    const url = 'http://localhost:3000/api/technicians/' + technicianId + '/sent-alerts/' + alertId;
    return this.http.delete(url);
  }

  getSentAlert(technicianId: string, alertId: string) {
    const url = 'http://localhost:3000/api/technicians/' + technicianId + '/sent-alerts/' + alertId;
    return this.http.get(url);
  }

  /* editAlert(technicianId: string, alertId: string, alert: any) {
    const url = 'http://localhost:3000/api/technicians/' + technicianId + '/alerts/' + alertId;
    const editalert = JSON.stringify(alert);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(url, editalert, { headers });
  } */

}
