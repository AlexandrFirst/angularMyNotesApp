import { Injectable, OnInit } from '@angular/core';
import * as signalR from '@aspnet/signalr'
import { Observable, Subject } from 'rxjs';
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


  getFromUserMessage() {
    return new Observable<string>(observer => {
      this.hubConnection.on("RecieveMessage", (message: string) => {
        console.log("here");
        observer.next(message);
      })
    })

  }

  sendToUserMessage(userId: number, message: string) {
    this.hubConnection.invoke("SendMessageToUser", userId, message);
  }

}
