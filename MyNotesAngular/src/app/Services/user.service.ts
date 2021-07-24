import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserRegistration } from '../Models/UserRegistration';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private isUserRegistered = false;

  get isRegistered() {
    return this.isUserRegistered;
  }

  constructor(private client: HttpService) {

    if (client.GetToken()) {
      this.isUserRegistered = true;
    }
  }

  RegisterUser(userToRegister: UserRegistration) {
    return this.client.SendData('User/registration', userToRegister);
  }
}
