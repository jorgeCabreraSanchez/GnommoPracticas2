import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import * as $ from 'jquery';
import { Title } from '@angular/platform-browser';
import { AppuserService } from '../services/appuser.service';

@Component({
  selector: 'app-appuser-edit',
  templateUrl: './appuser-edit.component.html',
  styleUrls: ['./appuser-edit.component.css']
})
export class AppuserEditComponent implements OnInit {

  appuserForm: FormGroup;
  appuser: any = { name: '', surname: '', /* phone: '', */ email: '', image: '' };
  idAppuser: string;
  // username: string;
  name: string;
  surname: string;
  // phone: string;
  email: string;
  image: File;
  validate = false;
  // emailValid = true;

  constructor(private pf: FormBuilder, private appusersService: AppuserService, private router: Router,
    private activatedRouter: ActivatedRoute, private notification: NotificationsService, private titleService: Title) {
    this.activatedRouter.params
      .subscribe(parametros => {
        this.idAppuser = parametros['id'];
        this.appusersService.getAppuser(this.idAppuser).subscribe(appuser => {
          // console.log(appuser);
          this.appuser = appuser;
          // this.username = this.appuser.username;
          this.name = this.appuser.name;
          this.surname = this.appuser.surname;
          // this.phone = this.appuser.phone;
          this.email = this.appuser.email;
          // this.imagen = $("#imagen").val().replace(/^.*\\/, "")
          this.onChanges();
        });
      });
  }

  ngOnInit() {
    this.titleService.setTitle('Modificar perfil');
    this.appuserForm = this.pf.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      surname: ['', [Validators.required, Validators.minLength(3)]],
      // phone: ['', [Validators.pattern(/^(\+34|0034|34)?[6|7|9][0-9]{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      image: ['']
    });
  }

  onSubmit() {
    this.appuser = this.saveAppuser();
    this.appusersService.patchAppuser(this.appuser, this.idAppuser).subscribe((editcon: any) => {
      if ($('#image')[0].files[0]) {
        this.appusersService.postImage($('#image')[0].files[0], editcon.id).subscribe(data => {
          this.router.navigate(['/perfil']);
        },
          error => {
            console.log(error);
            this.router.navigate(['/perfil']);
            this.notification.error('Error al subir la imagen', '', {
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: false,
              maxLength: 10
            });
          });
      } else {
        this.router.navigate(['/perfil']);
      }

      this.notification.success('Usuario Modificado con éxito', '', {});

    },
      error => {
        this.notification.error('Error al modificar el usuario', '', {
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: false,
          maxLength: 10
        });
        // this.emailValid = false;
      });
  }

  saveAppuser() {
    const saveAppuser = {
      // username: this.appuserForm.get('username').value,
      name: this.appuserForm.get('name').value,
      surname: this.appuserForm.get('surname').value,
      // phone: this.appuserForm.get('phone').value,
      email: this.appuserForm.get('email').value
    };
    return saveAppuser;
  }

  onChanges(): void {
    this.appuserForm.valueChanges
      .subscribe(valor => {
        if (valor.name !== this.name
          || valor.surname !== this.surname || /* valor.phone !== this.phone || */ valor.email !== this.email) {
          this.validate = true;
          // alert(this.name + valor.name);
        } else {
          this.validate = false;
        }
      });
  }

  fileChangeEvent(fileInput: any) {
    // Volvería a ser falso si se cambia otro campo al mismo valor que el original, por tanto lo activaremos el botón con JQuery
    // this.validate = true;
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e: any) {
        $('#imagen').attr('src', e.target.result);
        $('#submit').prop('disabled', false);
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

}
