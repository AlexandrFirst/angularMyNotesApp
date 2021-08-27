import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import { MessageDto } from '../Models/MessageDto';
import { ExecutePaginatedQuery } from '../Models/Pagination';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private hubConnection: HubConnection | undefined;

  constructor(private http: HttpService, private client: HttpClient) {
  }

  initialize() {
    this.stopConnection();

    this.hubConnection = new signalR.HubConnectionBuilder().withUrl(this.http.baseUrlSecured + "hubs", {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets
      // accessTokenFactory: () => {
      //   return localStorage[UserData.UserToken];
      // }
    }).configureLogging(signalR.LogLevel.Information).build();

    this.hubConnection.start().then((data: any) => {
      console.log('Now connected');
    }).catch((error) => {
      console.log('Could not connect ' + error);
    });
  }

  stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
      this.hubConnection = null;
    }
  };

  getAllMessages(otherUderId, page?, pageSize?) {
    return ExecutePaginatedQuery<MessageDto>(this.client,
      this.http.baseUrl + "Message/UserChatRooms/" + otherUderId,
      page,
      pageSize
    );
  }


}
