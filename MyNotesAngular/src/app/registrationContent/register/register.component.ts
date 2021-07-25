import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoadingSignService } from 'src/app/loading-sign/loading-sign.service';
import { NotificationMessage, NotificationType } from 'src/app/Models/NotificationMessage';
import { UserRegistration } from 'src/app/Models/UserRegistration';
import { NotificationService } from 'src/app/Services/notification.service';
import { UserService } from 'src/app/Services/user.service';
import { paswordConfirmValidator } from 'src/app/Validators/paswordConfirmValidator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private userSerice: UserService,
    private notificationService: NotificationService,
    private loadingSignService: LoadingSignService,
    private router: Router) { }

  showPassword = false;
  passType = "password"

  registrationForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)
    ]),
    mail: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'),
      Validators.minLength(8),
      Validators.maxLength(30)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required
    ])
  }, paswordConfirmValidator);

  ngOnInit(): void {
  }

  get name() {
    return this.registrationForm.get('name');
  }

  get mail() {
    return this.registrationForm.get('mail');
  }

  get password() {
    return this.registrationForm.get('password');
  }

  get confirmPassword() {
    return this.registrationForm.get('confirmPassword');
  }

  get form() {
    return this.registrationForm;
  }

  showHidePass() {
    if (!this.showPassword) {
      this.passType = "text"

    }
    else {
      this.passType = "password"
    }

    this.showPassword = !this.showPassword;
  }

  OnRegister() {
    this.router.navigate(['/login']);

    if (this.registrationForm.valid) {

      this.loadingSignService.activate();


      this.userSerice.RegisterUser({
        Mail: this.mail.value,
        Name: this.name.value,
        Password: this.password.value
      } as UserRegistration).subscribe(
        success => {
          console.log(success);

          this.notificationService.sendMessage({
            message: "You are registered",
            type: NotificationType.success
          });
          this.router.navigate(['/register/login']);
        }, error => {
          this.notificationService.sendMessage({
            message: error.error.Message,
            type: NotificationType.error
          } as NotificationMessage)

          this.loadingSignService.deactivate();

          throw error;
        }, () => {
          this.loadingSignService.deactivate();
        });
    }
    else {
      this.notificationService.sendMessage({
        message: "Fill in form correctly",
        type: NotificationType.warning
      });
    }
  }
}
