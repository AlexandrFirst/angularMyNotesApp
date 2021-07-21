import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private baseUrl = "http://localhost:5000/";

  constructor(private client: HttpClient) { }

  GetToken(){
    return localStorage.getItem("token");
  }

  SendData(url, body) {
    const token = this.GetToken();
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token });

    return this.client.post(this.baseUrl + url, body, { headers });
  }

}
