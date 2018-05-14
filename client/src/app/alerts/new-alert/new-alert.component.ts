import { Component, OnInit } from '@angular/core';
import { AppuserService } from '../../services/appuser.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';
import * as $ from 'jquery';

@Component({
  selector: 'app-new-alert',
  templateUrl: './new-alert.component.html',
  styleUrls: ['./new-alert.component.css']
})
export class NewAlertComponent implements OnInit {

  alertForm: FormGroup;
  alert: any;
  appuserId: string;
  storedFiles: any = [];

  constructor(private pf: FormBuilder,
    private appuserService: AppuserService,
    private router: Router,
    private notification: NotificationsService,
    private activatedRouter: ActivatedRoute,
    private titleService: Title) { }

  ngOnInit() {
    if (this.appuserService.getRole() !== 'admin' && this.appuserService.getRole() !== 'hospitalUser') {
      this.router.navigate(['/']);
    }
    this.titleService.setTitle('Nueva alerta');
    this.alertForm = this.pf.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      province: ['Madrid', [Validators.required]],
      files: []
    });
  }

  onSubmit() {
    this.alert = this.saveAlert();
    // Método para obtener el id del destinatario a partir de su email
    this.appuserService.createAlert(this.appuserId, this.alert).subscribe(newalert => {
      if ($('#files')[0].files[0]) {
        this.appuserService.postFiles(this.storedFiles, this.appuserId).subscribe(data => {
          this.router.navigate(['/enviadas']);
        },
          error => {
            console.log(error);
            this.router.navigate(['/enviadas']);
            this.notification.error('Error al subir los archivos', '', {
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: false,
              maxLength: 10
            });
          });
      } else {
        this.router.navigate(['/enviadas']);
      }

      this.router.navigate(['/enviadas']);
      this.notification.success('Alerta enviada con éxito', '', {
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: false,
        maxLength: 10
      });
    },
      error => {
        console.log(error);
        this.notification.error('Error al enviar la alerta', '', {
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: false,
          maxLength: 10
        });
      });
  }

  saveAlert() {
    const saveAlert = {
      title: this.alertForm.get('title').value,
      description: this.alertForm.get('description').value,
      province: this.alertForm.get('province').value
    };
    return saveAlert;
  }

  fileChangeEvent(fileInput: any) {
    $('#preview').empty();
    this.storedFiles = [];

    for (let i = 0; i < fileInput.target.files.length; i++) {
      const readFile = new FileReader();
      const file = fileInput.target.files[i];
      this.storedFiles.push(file);
      // console.log(this.storedFiles);
      // tslint:disable-next-line:no-shadowed-variable
      readFile.onload = (function (file) {
        return function (e) {
          if (file.type.match('image.*')) {
            $('#preview').append(
              '<div class=\'file\'> ' +
              '<img class = \'img-thumb\' src = \'' + e.target.result + '\'/>' +
              // tslint:disable-next-line:max-line-length
              '<a class = \'delete_image\' title = \'Cancel\'><img class = \'delete-btn\' src = \'assets/button_delete.png\' (click)=\'deleteFile()\' /></a>' +
              '<p class = \'file_name\'>' + file.name + '</p>' +
              '</div>'
            );
          } else if (file.type === 'application/pdf') {
            $('#preview').append(
              '<div class=\'file\'> ' +
              '<img class = \'img-thumb\' src = \'assets/pdf.png\'/>' +
              // tslint:disable-next-line:max-line-length
              '<a class = \'delete_image\' title = \'Cancel\'><img class = \'delete-btn\' src = \'assets/button_delete.png\' (click)=\'deleteFile()\' /></a>' +
              '<p class = \'file_name\'>' + file.name + '</p>' +
              '</div>'
            );
          } else {
            $('#preview').append(
              '<div class=\'file\'> ' +
              '<img class = \'img-thumb\' src = \'assets/file.png\'/>' +
              // tslint:disable-next-line:max-line-length
              '<a class = \'delete_image\' title = \'Cancel\'><img class = \'delete-btn\' src = \'assets/button_delete.png\' (click)=\'deleteFile()\' /></a>' +
              '<p class = \'file_name\'>' + file.name + '</p>' +
              '</div>'
            );
          }
        };
      })(file);
      readFile.readAsDataURL(file);
      const self = this;

      $('#preview').on('click', '.delete_image', function () {
        // tslint:disable-next-line:no-shadowed-variable
        const file = $(this).next().text();
        $(this).parent().remove();
        // console.log(file);
        for (i = 0; i < self.storedFiles.length; i++) {
          if (self.storedFiles[i].name === file) {
            self.storedFiles.splice(i, 1);
            break;
          }
        }
      });
    }
  }

}
