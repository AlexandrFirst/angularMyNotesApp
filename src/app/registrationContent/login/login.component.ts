import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  passType = "password"
  showPassword = false;

  showHidePass(){
    if(!this.showPassword){
      this.passType = "text"
      
    }
    else{
      this.passType = "password"
    }

    this.showPassword = !this.showPassword;
  }

}
