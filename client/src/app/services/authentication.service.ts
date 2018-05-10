import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient) { }

  asignRole(user) {
    if (user && user.id) {
      // login successful if there's a jwt token in the response
      const userId = user.userId;
      const params = new HttpParams().set('access_token', user.id);

      // Ponemos el access_token aquí porque el currentUser.id del interceptor aún no esta asignado (setItem)
      // Aun no esta asignado porque primero le voy a añadir el role
      return this.http.get(`http://localhost:3000/api/appusers/${userId}/get-roles-by-id`, { params: params })
        .map(
          (role: any) => {
            user.role = role.name;
            localStorage.setItem('currentUser', JSON.stringify(user));
            return user;
          },
          error => {
            throw error;
          });
    }
  }

  login(login: string, password: string) {
    if (login.indexOf('@') !== -1) {
      return this.http.post('http://localhost:3000/api/appusers/login', { 'email': login, 'password': password });
    } else {
      return this.http.post('http://localhost:3000/api/appusers/login', { 'username': login, 'password': password });
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      const appuserId = currentUser.userId;
      const token = currentUser.id;
      return await this.http.get(`http://localhost:3000/api/appusers/${appuserId}/accessTokens/${token}`)
        .map(
          (resultado: any) => {
            if (resultado && resultado.id) {
              return true;
            } else {
              return false;
            }
          },
          error => {
            return false;
          }).toPromise();
    } else {
      return false;
    }
  }

  registerUser(user: any) {
    const newuser = JSON.stringify(user);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post('http://localhost:3000/api/appusers', newuser, { headers });
  }

  emailReset(resetEmail: any) {
    const emailURL = 'http://localhost:3000/api/appusers/reset';
    const email = JSON.stringify(resetEmail);
    // console.log(email);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(emailURL, email, { headers });
    // .map(res => {
    //  console.log(res.json());
    // return res.json();
    // })
  }

  resetPassword(newPassword: any, routerUrl: string) {
    const passwordURL = 'http://localhost:3000/api/appusers/reset-password' + routerUrl;
    // console.log(passwordURL);
    const password = newPassword;
    // console.log(password);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(passwordURL, password, { headers });
    // .map(res => {
    //  console.log(res.json());
    // return res.json();
    // })
  }

  changePassword(Passwords: any) {
    // console.log(JSON.parse(localStorage.getItem('currentUser')).id);
    // tslint:disable-next-line:max-line-length
    const passwordURL = 'http://localhost:3000/api/appusers/change-password?access_token=' + JSON.parse(localStorage.getItem('currentUser')).id;
    // console.log(passwordURL);
    const password = Passwords;
    // console.log(password);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(passwordURL, password, { headers });
    // .map(res => {
    //  console.log(res.json());
    // return res.json();
    // })
  }

  logout() {
    // remove user from local storage to log user out
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      const params = new HttpParams().set('access_token', currentUser.id);
      const headers = new HttpHeaders().set('Content-Type', 'application/json');

      this.http.post('http://localhost:3000/api/appusers/logout', { headers }, { params: params })
        .subscribe(
          data => {
            console.log('logout');
          },
          error => {
            console.log(error);
          }
        );
      localStorage.removeItem('currentUser');
    }
  }
}
