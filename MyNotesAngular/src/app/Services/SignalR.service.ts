import { Injectable, OnInit } from '@angular/core';
import * as signalR from '@aspnet/signalr'
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserData } from '../Models/AuthResponse';
import { RTCMessage } from '../Models/RTCMessage';
import { ISignalRMessageService } from './Abstartions/ISignalRMessageService';
import { AccessResponseMessage, ISignalRWEBRtcService } from './Abstartions/ISignalRWEBRtcService';

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
    console.log("Sending message to user")
    this.hubConnection.invoke("SendMessageToUser", userId, message);
  }

  sendICECandiate(userId: number, iceCandidateData: string) {
    this.hubConnection.invoke("sendICECandiate", userId, iceCandidateData);
  }

  receiveICECandidate(): Observable<RTCMessage> {
    return new Observable(observer => {
      this.hubConnection.on("receiveICECandidate", (otherPeerICECandidate: RTCMessage) => {
        console.log("receiving other peer ice candidate");
        observer.next(otherPeerICECandidate);
      });
    })
  }

  sendSdpOffer(userId: number, offerData: string) {
    this.hubConnection.invoke("sendOffer", userId, offerData);
  }

  receiveOffer(): Observable<RTCMessage> {
    return new Observable(observer => {
      this.hubConnection.on("receiveOffer", (offerData: RTCMessage) => {
        console.log("receiving offer from other user");
        observer.next(offerData);
      });
    })
  }

  sendSdpAnswer(userId: number, answer: string) {
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

  sendAccessRequest(toUserId: number) {
    this.hubConnection.invoke("accessRequest", toUserId);
  }

  receiveAccessRequest(): Observable<number> {
    return new Observable(observer => {
      this.hubConnection.on("reciveAccessRequest", (fromUserId: number) => {
        observer.next(fromUserId)
      })
    })
  }
  
  sendAccessResponse(toUserId: number, canAccess: boolean) {
    this.hubConnection.invoke("accessResponse", toUserId, canAccess);
  }
  receiveAccessResponse(): Observable<AccessResponseMessage> {
    return new Observable(observer => {
      this.hubConnection.on("reciveAccessResponse", (response) => {
        console.log("access reposne: ", response)
        observer.next(response)
      })
    })
  }

  declineCall(userId: any) {
    this.hubConnection.invoke("declineCall", userId);
  }
  recieveDeclineCall(): Observable<void> {
    return new Observable(observer => {
      this.hubConnection.on("declineCallRecieve", () => {
        observer.next()
      })
    })
  }

}
