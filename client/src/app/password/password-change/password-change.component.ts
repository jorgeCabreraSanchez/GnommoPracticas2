import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.css']
})
export class PasswordChangeComponent implements OnInit {

  changePasswordForm: FormGroup;
  userdata: any;

  erroresForm = {
    'oldPassword': '',
    'newPassword': ''
  };

  mensajesValidacion = {
    'oldPassword': {
      'required': 'Contraseña obligatoria',
      'pattern': 'La contraseña debe tener al menos una letra y un número ',
      'minlength': 'además de al menos 6 caracteres'
    },
    'newPassword': {
      'required': 'Contraseña obligatoria',
      'pattern': 'La contraseña debe tener al menos una letra y un número ',
      'minlength': 'además de al menos 6 caracteres'
    }
  };

  constructor(private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private notification: NotificationsService,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Cambiar contraseña');
    this.changePasswordForm = this.formBuilder.group({
      'oldPassword': ['', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6)]],
      'newPassword': ['', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6)]]
    });
    this.changePasswordForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onSubmit() {
    // const tokenPos = this.router.url.search("\\?access_token");
    // const routerUrl = this.router.url.substring(tokenPos);
    this.userdata = this.saveUserdata();
    this.authService.changePassword(this.userdata).subscribe(respuesta => {
      this.notification.success('Se ha cambiado la contraseña', '', {});
    }, error => {
      this.notification.error('Error al cambiar la contraseña', '', {});
    });
    this.router.navigate(['/']);
  }

  saveUserdata() {
    const saveUserdata = {
      oldPassword: this.changePasswordForm.get('oldPassword').value,
      newPassword: this.changePasswordForm.get('newPassword').value
    };
    return saveUserdata;
  }

  onValueChanged(data?: any) {
    if (!this.changePasswordForm) { return; }
    const form = this.changePasswordForm;
    // tslint:disable-next-line:forin
    for (const field in this.erroresForm) {
      this.erroresForm[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.mensajesValidacion[field];
        // tslint:disable-next-line:forin
        for (const key in control.errors) {
          this.erroresForm[field] += messages[key] + ' ';
        }
      }
    }
  }

}

