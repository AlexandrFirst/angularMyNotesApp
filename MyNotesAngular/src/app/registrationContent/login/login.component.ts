import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingSignService } from 'src/app/loading-sign/loading-sign.service';
import { AuthReponse, saveAuthResponse } from 'src/app/Models/AuthResponse';
import { NotificationMessage, NotificationType } from 'src/app/Models/NotificationMessage';
import { UserLogin } from 'src/app/Models/UserLogin';
import { NotificationService } from 'src/app/Services/notification.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private notificationService: NotificationService,
    private userService: UserService,
    private loadingSignService: LoadingSignService) { }

  ngOnInit(): void {
    this.loadingSignService.deactivate();
  }

  form = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });


  passType = "password"
  showPassword = false;

  showHidePass() {
    if (!this.showPassword) {
      this.passType = "text"

    }
    else {
      this.passType = "password"
    }

    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.form.valid) {
      this.loadingSignService.activate();
      this.userService.LoginUser({
        UserMail: this.form.get('email').value,
        UserPassword: this.form.get('password').value,
      } as UserLogin).subscribe((success: AuthReponse) => {

        this.notificationService.sendMessage({
          message: "You are in",
          type: NotificationType.success
        });
        console.log(success);

        saveAuthResponse(success);

      }, error => {
        this.notificationService.sendMessage({
          message: error.error.message,
          type: NotificationType.error
        });
        this.loadingSignService.deactivate();

        throw error;
      }, () => {
        this.loadingSignService.deactivate();
      })
    }
    else {
      this.notificationService.sendMessage({
        message: "Fill form corretly please",
        type: NotificationType.warning
      } as NotificationMessage)
    }
  }

}
