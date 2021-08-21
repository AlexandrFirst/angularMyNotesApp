import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../Models/Pagination';
import { UserListInstance } from '../Models/UserListInstance';
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
    console.log(searchPattern);
    const paginatedResult: PaginatedResult<UserListInstance[]> = new PaginatedResult<UserListInstance[]>();
    let params = new HttpParams();

    if (page != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', "50");
    }
    

    params = params.append('searchPattern', searchPattern);

    if (isSubscribed != null)
      params = params.append('isSubscribed', isSubscribed);

    return this.client.get<UserListInstance[]>(this.http.baseUrl + "User/findUser", { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
      })
    );
  }
}
