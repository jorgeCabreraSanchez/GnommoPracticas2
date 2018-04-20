import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-password-recover',
  templateUrl: './password-recover.component.html',
  styleUrls: ['./password-recover.component.css']
})
export class PasswordRecoverComponent implements OnInit {
  newPasswordForm: FormGroup;
  userdata: any;
  validate = false;

  erroresForm = {
    'password': '',
    'passwordCheck': ''
  };

  mensajesValidacion = {
    'password': {
      'required': 'Contraseña obligatoria',
      'pattern': 'La contraseña debe tener al menos una letra y un número ',
      'minlength': 'además de al menos 6 caracteres'
    },
    'passwordCheck': {
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
    this.titleService.setTitle('Email de recuperación');
    this.newPasswordForm = this.formBuilder.group({
      'password': ['', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6)
      ]
      ],
      'passwordCheck': ['', [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6)
      ]
      ]
    });
    this.newPasswordForm.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onSubmit() {
    const tokenPos = this.router.url.search('\\?access_token');
    const routerUrl = this.router.url.substring(tokenPos);
    this.userdata = this.saveUserdata();
    this.authService.resetPassword(this.userdata, routerUrl).subscribe(respuesta => {
      this.notification.success('Se ha cambiado la contraseña', '', {});
    }, error => {
      this.notification.error('Error', 'Autorización requerida', {});
    });
    this.router.navigate(['/']);
  }

  saveUserdata() {
    const saveUserdata = {
      newPassword: this.newPasswordForm.get('password').value
    };
    return saveUserdata;
  }

  onValueChanged(data?: any) {
    if (this.newPasswordForm.get('password').value === this.newPasswordForm.get('passwordCheck').value) {
      this.validate = true;
    } else {
      this.validate = false;
    }
    if (!this.newPasswordForm) { return; }
    const form = this.newPasswordForm;
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
