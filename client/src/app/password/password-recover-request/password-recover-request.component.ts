import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-password-recover-request',
  templateUrl: './password-recover-request.component.html',
  styleUrls: ['./password-recover-request.component.css']
})
export class PasswordRecoverRequestComponent implements OnInit {

  resetForm: FormGroup;
  userdata: any;

  erroresForm = {
    'email': ''
  };

  mensajesValidacion = {
    'email': {
      'required': 'Email obligatorio',
      'email': 'Introduzca una dirección email correcta'
    }
  };

  constructor(private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private notification: NotificationsService,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Contraseña nueva');
    this.resetForm = this.formBuilder.group({
      'email': ['', [
        Validators.required,
        Validators.email]],
    });
    this.resetForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onSubmit() {
    this.userdata = this.saveUserdata();
    this.authService.emailReset(this.userdata).subscribe(respuesta => {
      this.notification.success('Se ha enviado un email para restablecer la contraseña', '', {});
    }, error => {
      this.notification.error('Error', 'El email no está registrado', {});
    });
    this.router.navigate(['/']);

  }

  saveUserdata() {
    const saveUserdata = {
      email: this.resetForm.get('email').value
    };
    return saveUserdata;
  }

  onValueChanged(data?: any) {
    if (!this.resetForm) { return; }
    const form = this.resetForm;
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
