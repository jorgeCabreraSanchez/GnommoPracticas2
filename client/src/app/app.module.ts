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
import { PushNotificationModule } from 'ng-push-notification';

import { AuthenticationService } from './services/authentication.service';
import { ProfilesService } from './services/profiles.service';
import { AlertService } from './services/alert.service';
// import { MessagesService } from './services/messages.service';

import { AlertComponent } from './directives/alert.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PasswordChangeComponent } from './password/password-change/password-change.component';
import { PasswordRecoverComponent } from './password/password-recover/password-recover.component';
import { PasswordRecoverRequestComponent } from './password/password-recover-request/password-recover-request.component';
import { HeaderComponent } from './header/header.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { NewMessageComponent } from './messages/new-message/new-message.component';
import { SentMessagesComponent } from './messages/sent-messages/sent-messages.component';
import { ReceivedMessagesComponent } from './messages/received-messages/received-messages.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'perfil', component: ProfileComponent },
  { path: 'recibidos', component: ReceivedMessagesComponent },
  { path: 'enviados', component: SentMessagesComponent },
  { path: 'nuevo', component: NewMessageComponent },
  { path: 'perfil/:id/editar', component: ProfileEditComponent },
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
    ProfileComponent,
    ProfileEditComponent,
    NewMessageComponent,
    SentMessagesComponent,
    ReceivedMessagesComponent
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
    PushNotificationModule.forRoot(/* Default settings here, interface PushNotificationSettings */)
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
    ProfilesService,
    AlertService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
