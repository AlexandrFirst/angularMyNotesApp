import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ExecutePaginatedQuery, PaginatedResult } from '../Models/Pagination';
import { UserListChatInstance, UserListInstance } from '../Models/UserListInstance';
import { UserLogin } from '../Models/UserLogin';
import { UserRegistration } from '../Models/UserRegistration';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private isUserRegistered = false;
  constructor(private http: HttpService, private client: HttpClient) { }

  get isRegistered() {
    if (this.http.GetToken()) {
      this.isUserRegistered = true;
    }
    else {
      this.isUserRegistered = false;
    }
    return this.isUserRegistered;
  }

  get userName() {
    if (this.isRegistered) {
      return this.http.GetName();
    }
    return "No valid name";
  }

  RegisterUser(userToRegister: UserRegistration) {
    return this.http.SendData('User/registration', userToRegister);
  }

  LoginUser(userToLogin: UserLogin) {
    return this.http.SendData('Login/authenticate', userToLogin);
  }

  GetOtherUserList(searchPattern, isSubscribed, page?) {
    return ExecutePaginatedQuery<UserListInstance>(this.client,
      this.http.baseUrl + "User/findUser",
      page, //pageIndex
      50,   //pageSize
      { name: "searchPattern", value: searchPattern },
      { name: "isSubscribed", value: isSubscribed });
  }


  GetOtherUserChatList(searchPattern, page?) {
    return ExecutePaginatedQuery<UserListInstance>(this.client,
      this.http.baseUrl + "Message/UserChatRooms",
      page,
      50,
      { name: "searchQuery", value: searchPattern },
    );
  }
}
