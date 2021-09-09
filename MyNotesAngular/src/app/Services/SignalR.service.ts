import { Injectable, OnInit } from '@angular/core';
import * as signalR from '@aspnet/signalr'
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserData } from '../Models/AuthResponse';
import { ISignalRMessageService } from './Abstartions/ISignalRMessageService';
import { ISignalRWEBRtcService } from './Abstartions/ISignalRWEBRtcService';

@Injectable({
  providedIn: 'root'
})
export class SignalRService implements ISignalRMessageService, ISignalRWEBRtcService {

  hubConnection: signalR.HubConnection;
  private isConnected: boolean = false;

  constructor() { }
  
  
 

  IsConnected(): boolean {
    return this.isConnected;
  }

  connectToHub(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.apiUrl + "chat", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => localStorage[UserData.UserToken]
      })
      .build();

    this.hubConnection
      .start()
      .then(() => {
        console.log("Connected to the hub")
        this.isConnected = true;
      })
      .catch(err => {
        console.log("Error: " + err);
        this.isConnected = false;
      })
  }


  getFromUserMessage(): Observable<string> {
    return new Observable<string>(observer => {
      this.hubConnection.on("RecieveMessage", (message: string) => {
        console.log("receiving message");
        observer.next(message);
      })
    })

  }

  sendToUserMessage(userId: number, message: string) {
    this.hubConnection.invoke("SendMessageToUser", userId, message);
  }

  sendICECandiate(userId: number, iceCandidateData: string) {
    this.hubConnection.invoke("sendICECandiate", userId, iceCandidateData);
  }

  receiveICECandidate(): Observable<string> {
    return new Observable(observer => {
      this.hubConnection.on("receiveICECandidate", (otherPeerICECandidate: string) => {
        console.log("receiving other peer ice candidate");
        observer.next(otherPeerICECandidate);
      });
    })
  }

  sendOffer(userId: number, offerData: string) {
    this.hubConnection.invoke("sendOffer", userId, offerData);
  }

  receiveOffer(): Observable<string> {
    return new Observable(observer => {
      this.hubConnection.on("receiveOffer", (offerData: string) => {
        console.log("receiving offer from other user");
        observer.next(offerData);
      });
    })
  }

  sendAnswer(userId: number, answer: string) {
    this.hubConnection.invoke("sendAnswer", userId, answer);
  }
  receiveAnswer(): Observable<string> {
    return new Observable(observer => {
      this.hubConnection.on("receiveAnswer", (answer: string) => {
        console.log("receiving offer from other user");
        observer.next(answer);
      });
    })
  }
}
