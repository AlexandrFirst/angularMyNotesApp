import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserData } from '../Models/AuthResponse';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private baseUrl = "http://localhost:5000/";

  constructor(private client: HttpClient) { }

  GetToken(){
    return localStorage.getItem(UserData.UserToken);
  }

  GetName(){
    return localStorage.getItem(UserData.UserName);
  }

  SendData(url, body) {

    console.log(this.baseUrl + url);
    console.log(body);

    const token = this.GetToken();
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token});

    return this.client.post(this.baseUrl + url, body, { headers });
  }

}
