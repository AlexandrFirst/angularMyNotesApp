import { Injectable, OnInit } from '@angular/core';
import * as signalR from '@aspnet/signalr'
import { UserData } from '../Models/AuthResponse';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  hubConnection: signalR.HubConnection;

  constructor() { }

  connectToHub = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/chat", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => localStorage[UserData.UserToken]
      })
      .build();
    this.hubConnection
      .start()
      .then(() => {
        console.log("Connected to the hub")
      })
      .catch(err => {
        console.log("Error: " + err);
      })
  }

}
