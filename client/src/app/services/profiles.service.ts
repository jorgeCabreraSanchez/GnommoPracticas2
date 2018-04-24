import { Injectable } from '@angular/core';
import { HttpEvent, HttpHeaders, HttpInterceptor, HttpHandler, HttpRequest, HttpClient, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/map';


@Injectable()
export class ProfilesService {

  conURL = 'http://localhost:3000/api/doctors';

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

  getProfiles() {
    return this.http.get(this.conURL);
  }

  getProfile(id: string) {
    const url = `${this.conURL}/${id}`;
    return this.http.get(url);
  }

  patchProfile(doctor: any, id: string) {
    const editcon = JSON.stringify(doctor);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const url = `${this.conURL}/${id}`;
    return this.http.patch(url, editcon, { headers });
  }

  postProfile(doctor: any) {
    const newcon = JSON.stringify(doctor);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.conURL, newcon, { headers });
  }

  delProfile(id: string) {
    const url = `${this.conURL}/${id}`;
    return this.http.delete(url);
  }

  postImage(file: File, userId: string) {
    const fd = new FormData();
    fd.append('file', file);
    const headers = new HttpHeaders();
    return this.http.post(`http://localhost:3000/api/doctors/${userId}/upload-image`, fd, { headers });
  }

  postFiles(files: any, userId: string) {
    const fd = new FormData();
    fd.append('file', files);
    const headers = new HttpHeaders();
    return this.http.post(`http://localhost:3000/api/doctors/${userId}/upload-files`, fd, { headers });
  }

  createMessage(profileId: string, message: any) {
    const messageURL = 'http://localhost:3000/api/doctors/' + profileId + '/messages';
    const newmessage = JSON.stringify(message);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(messageURL, newmessage, { headers });
  }

  getReceivedMessages(profileId: string) {
    const url = 'http://localhost:3000/api/doctors/' + profileId + '/received-messages';
    return this.http.get(url);
  }

  delReceivedMessages(profileId: string) {
    const url = 'http://localhost:3000/api/doctors/' + profileId + '/received-messages';
    return this.http.delete(url);
  }

  delReceivedMessage(profileId: string, messageId: string) {
    const url = 'http://localhost:3000/api/doctors/' + profileId + '/received-messages/' + messageId;
    return this.http.delete(url);
  }

  getReceivedMessage(profileId: string, messageId: string) {
    const url = 'http://localhost:3000/api/doctors/' + profileId + '/received-messages/' + messageId;
    return this.http.get(url);
  }

  getSentMessages(profileId: string) {
    const url = 'http://localhost:3000/api/doctors/' + profileId + '/sent-messages';
    return this.http.get(url);
  }

  delSentMessages(profileId: string) {
    const url = 'http://localhost:3000/api/doctors/' + profileId + '/sent-messages';
    return this.http.delete(url);
  }

  delSentMessage(profileId: string, messageId: string) {
    const url = 'http://localhost:3000/api/doctors/' + profileId + '/sent-messages/' + messageId;
    return this.http.delete(url);
  }

  getSentMessage(profileId: string, messageId: string) {
    const url = 'http://localhost:3000/api/doctors/' + profileId + '/sent-messages/' + messageId;
    return this.http.get(url);
  }

  /* editMessage(profileId: string, messageId: string, message: any) {
    const url = 'http://localhost:3000/api/doctors/' + profileId + '/messages/' + messageId;
    const editmessage = JSON.stringify(message);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.put(url, editmessage, { headers });
  } */

}
