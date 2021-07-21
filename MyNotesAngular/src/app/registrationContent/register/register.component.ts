import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NotificationMessage, NotificationType } from 'src/app/Models/NotificationMessage';
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
              private notificationService: NotificationService) { }

  showPassword = false;
  passType = "password"

  registrationForm = new FormGroup({
    name: new FormControl('',[
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)
    ]),
    mail: new FormControl('',[
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('',[
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'),
      Validators.minLength(8),
      Validators.maxLength(30)
    ]),
    confirmPassword: new FormControl('',[
      Validators.required
    ])
  }, paswordConfirmValidator);

  ngOnInit(): void {
  }

  get name(){
    return this.registrationForm.get('name');
  }

  get mail(){
    return this.registrationForm.get('mail');
  }
  
  get password(){
    return this.registrationForm.get('password');
  }

  get confirmPassword(){
    return this.registrationForm.get('confirmPassword');
  }

  get form(){
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

  OnRegister(){
    if(this.registrationForm.valid){
      console.log(this.registrationForm.value)
      this.notificationService.sendMessage({
        message: "verifieng...",
        type: NotificationType.info
      });
    }
    else{
      this.notificationService.sendMessage({
        message: "Fill in form correctly",
        type: NotificationType.error
      });
    }
  }

}
