import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import * as $ from 'jquery';
import { Title } from '@angular/platform-browser';
import { TechnicianService } from '../services/technician.service';

@Component({
  selector: 'app-technician-edit',
  templateUrl: './technician-edit.component.html',
  styleUrls: ['./technician-edit.component.css']
})
export class TechnicianEditComponent implements OnInit {

  technicianForm: FormGroup;
  technician: any = { name: '', surname: '', /* phone: '', */ email: '', image: '' };
  idTechnician: string;
  // username: string;
  name: string;
  surname: string;
  // phone: string;
  email: string;
  image: File;
  validate = false;
  // emailValid = true;

  constructor(private pf: FormBuilder, private techniciansService: TechnicianService, private router: Router,
    private activatedRouter: ActivatedRoute, private notification: NotificationsService, private titleService: Title) {
    this.activatedRouter.params
      .subscribe(parametros => {
        this.idTechnician = parametros['id'];
        this.techniciansService.getTechnician(this.idTechnician).subscribe(technician => {
          // console.log(technician);
          this.technician = technician;
          // this.username = this.technician.username;
          this.name = this.technician.name;
          this.surname = this.technician.surname;
          // this.phone = this.technician.phone;
          this.email = this.technician.email;
          // this.imagen = $("#imagen").val().replace(/^.*\\/, "")
          this.onChanges();
        });
      });
  }

  ngOnInit() {
    this.titleService.setTitle('Modificar perfil');
    this.technicianForm = this.pf.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      surname: ['', [Validators.required, Validators.minLength(3)]],
      // phone: ['', [Validators.pattern(/^(\+34|0034|34)?[6|7|9][0-9]{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      image: ['']
    });
  }

  onSubmit() {
    this.technician = this.saveTechnician();
    this.techniciansService.patchTechnician(this.technician, this.idTechnician).subscribe((editcon: any) => {
      if ($('#image')[0].files[0]) {
        this.techniciansService.postImage($('#image')[0].files[0], editcon.id).subscribe(data => {
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

  saveTechnician() {
    const saveTechnician = {
      // username: this.technicianForm.get('username').value,
      name: this.technicianForm.get('name').value,
      surname: this.technicianForm.get('surname').value,
      // phone: this.technicianForm.get('phone').value,
      email: this.technicianForm.get('email').value
    };
    return saveTechnician;
  }

  onChanges(): void {
    this.technicianForm.valueChanges
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
