import { Component, OnInit } from '@angular/core';
import { ProfilesService } from '../../services/profiles.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';
import * as $ from 'jquery';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css']
})
export class NewMessageComponent implements OnInit {

  messageForm: FormGroup;
  message: any;
  profileId: string;
  storedFiles: any = [];

  constructor(private pf: FormBuilder,
    private profilesService: ProfilesService,
    private router: Router,
    private notification: NotificationsService,
    private activatedRouter: ActivatedRoute,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Nuevo mensaje');
    this.messageForm = this.pf.group({
      to: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      message: ['', [Validators.required, Validators.minLength(3)]],
      files: []
    });
  }

  onSubmit() {
    this.message = this.saveMessage();
    // Método para obtener el id del destinatario a partir de su email
    this.profilesService.createMessage(this.profileId, this.message).subscribe(newmessage => {
      if ($('#image')[0].files[0]) {
        this.profilesService.postFiles(this.storedFiles, this.profileId).subscribe(data => {
          this.router.navigate(['/recibidos']);
        },
          error => {
            console.log(error);
            this.router.navigate(['/recibidos']);
            this.notification.error('Error al subir los archivos', '', {
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: false,
              maxLength: 10
            });
          });
      } else {
        this.router.navigate(['/recibidos']);
      }

      this.router.navigate(['recibidos']);
      this.notification.success('Mensaje enviado con éxito', '', {
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: false,
        maxLength: 10
      });
    },
      error => {
        console.log(error);
        this.notification.error('Error al enviar el mensaje', '', {
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: false,
          maxLength: 10
        });
      });
  }

  saveMessage() {
    const saveMessage = {
      to: this.messageForm.get('to').value,
      subject: this.messageForm.get('subject').value,
      message: this.messageForm.get('message').value
    };
    return saveMessage;
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
