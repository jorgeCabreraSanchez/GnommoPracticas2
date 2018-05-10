import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { FormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { AuthenticationService } from './services/authentication.service';
import { AppuserService } from './services/appuser.service';
import { AlertService } from './services/alert.service';

import { AlertComponent } from './directives/alert.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PasswordChangeComponent } from './password/password-change/password-change.component';
import { PasswordRecoverComponent } from './password/password-recover/password-recover.component';
import { PasswordRecoverRequestComponent } from './password/password-recover-request/password-recover-request.component';
import { HeaderComponent } from './header/header.component';
import { AppuserComponent } from './appuser/appuser.component';
import { AppuserEditComponent } from './appuser-edit/appuser-edit.component';
import { NewAlertComponent } from './alerts/new-alert/new-alert.component';
import { SentAlertsComponent } from './alerts/sent-alerts/sent-alerts.component';
import { ReceivedAlertsComponent } from './alerts/received-alerts/received-alerts.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'usuario', component: AppuserComponent },
  { path: 'usuarios', component: AppuserComponent },
  { path: 'recibidas', component: ReceivedAlertsComponent },
  { path: 'enviadas', component: SentAlertsComponent },
  { path: 'nuevo', component: NewAlertComponent },
  { path: 'usuario/:id/editar', component: AppuserEditComponent },
  { path: 'nueva-contrasena', component: PasswordRecoverComponent },
  { path: 'recuperar-contrasena', component: PasswordRecoverRequestComponent },
  { path: 'cambiar-contrasena', component: PasswordChangeComponent },
  { path: '**', redirectTo: 'alertas' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    PasswordChangeComponent,
    PasswordRecoverComponent,
    PasswordRecoverRequestComponent,
    HeaderComponent,
    AlertComponent,
    AppuserComponent,
    AppuserEditComponent,
    NewAlertComponent,
    SentAlertsComponent,
    ReceivedAlertsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' }),
    HttpClientModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    AngularFontAwesomeModule,
    BsDropdownModule.forRoot(),
    // PushNotificationModule.forRoot(/* Default settings here, interface PushNotificationSettings */)
  ],
  exports: [
    BsDropdownModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  },
    AuthenticationService,
    AppuserService,
    AlertService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
