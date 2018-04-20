import { Component, OnInit } from '@angular/core';
import { ProfilesService } from '../../services/profiles.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.css']
})
export class NewMessageComponent implements OnInit {

  messageForm: FormGroup;
  message: any;
  profileId: string;

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
    });
  }

  onSubmit() {
    this.message = this.saveMessage();
    // Método para obtener el id del destinatario a partir de su email
    this.profilesService.createMessage(this.profileId, this.message).subscribe(newmessage => {
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
        this.notification.error('Error al crear el libro', '', {
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

}

