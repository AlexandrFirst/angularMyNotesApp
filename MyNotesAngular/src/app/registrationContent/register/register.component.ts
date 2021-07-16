import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor() { }

  showPassword = false;
  passType = "password"

  ngOnInit(): void {
  }

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
