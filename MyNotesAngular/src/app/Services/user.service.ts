import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserLogin } from '../Models/UserLogin';
import { UserRegistration } from '../Models/UserRegistration';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private isUserRegistered = false;
  constructor(private client: HttpService) { }

  get isRegistered() {
    if (this.client.GetToken()) {
      this.isUserRegistered = true;
    }
    else {
      this.isUserRegistered = false;
    }
    return this.isUserRegistered;
  }

  get userName(){
    if(this.isRegistered){
      return this.client.GetName();
    }
    return "No valid name";
  }

  RegisterUser(userToRegister: UserRegistration) {
    return this.client.SendData('User/registration', userToRegister);
  }

  LoginUser(userToLogin: UserLogin) {
    return this.client.SendData('Login/authenticate', userToLogin);
  }
}
