import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import * as $ from 'jquery';
import { Title } from '@angular/platform-browser';
import { ProfilesService } from '../services/profiles.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {

  profileForm: FormGroup;
  profile: any = { name: '', surname: '', /* phone: '', */ email: '', image: '' };
  idProfile: string;
  // username: string;
  name: string;
  surname: string;
  // phone: string;
  email: string;
  image: File;
  validate = false;
  // emailValid = true;

  constructor(private pf: FormBuilder, private profilesService: ProfilesService, private router: Router,
    private activatedRouter: ActivatedRoute, private notification: NotificationsService, private titleService: Title) {
    this.activatedRouter.params
      .subscribe(parametros => {
        this.idProfile = parametros['id'];
        this.profilesService.getProfile(this.idProfile).subscribe(profile => {
          // console.log(profile);
          this.profile = profile;
          // this.username = this.profile.username;
          this.name = this.profile.name;
          this.surname = this.profile.surname;
          // this.phone = this.profile.phone;
          this.email = this.profile.email;
          // this.imagen = $("#imagen").val().replace(/^.*\\/, "")
          this.onChanges();
        });
      });
  }

  ngOnInit() {
    this.titleService.setTitle('Modificar perfil');
    this.profileForm = this.pf.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      surname: ['', [Validators.required, Validators.minLength(3)]],
      // phone: ['', [Validators.pattern(/^(\+34|0034|34)?[6|7|9][0-9]{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      image: ['']
    });
  }

  onSubmit() {
    this.profile = this.saveProfile();
    this.profilesService.patchProfile(this.profile, this.idProfile).subscribe((editcon: any) => {
      if ($('#image')[0].files[0]) {
        this.profilesService.postImage($('#image')[0].files[0], editcon.id).subscribe(data => {
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

  saveProfile() {
    const saveProfile = {
      // username: this.profileForm.get('username').value,
      name: this.profileForm.get('name').value,
      surname: this.profileForm.get('surname').value,
      // phone: this.profileForm.get('phone').value,
      email: this.profileForm.get('email').value
    };
    return saveProfile;
  }

  onChanges(): void {
    this.profileForm.valueChanges
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
