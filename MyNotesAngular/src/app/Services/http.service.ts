import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserData } from '../Models/AuthResponse';
import { httpHeaders } from '../Models/httpHeaders';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  protected baseUrl = "http://localhost:5000/";

  constructor(private client: HttpClient) { }

  GetToken() {
    return localStorage.getItem(UserData.UserToken);
  }

  GetName() {
    return localStorage.getItem(UserData.UserName);
  }

  SendData(url, body, my_headers: httpHeaders = null) {

    console.log(this.baseUrl + url);
    console.log(body);

    const headers = new HttpHeaders();

    if (my_headers) {
      for (let header of my_headers.values) {
        headers.append(header.name, header.value);
      }
    }
    
    return this.client.post(this.baseUrl + url, body, { headers });
  }

  GetData(url){
    return this.client.get(this.baseUrl + url);
  }

  DeleteData(url){
    return this.client.delete(this.baseUrl + url)
  }
}
