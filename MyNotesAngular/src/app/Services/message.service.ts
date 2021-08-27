import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import { MessageDto } from '../Models/MessageDto';
import { ExecutePaginatedQuery } from '../Models/Pagination';
import { HttpService } from './http.service';
import { SignalRService } from './SignalR.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  
  private hubConnection: HubConnection | undefined;
  
  constructor(private http: HttpService, private client: HttpClient, private signalRService: SignalRService) {
  }
  
  initialize() {
    this.signalRService.connectToHub();
  }

  getAllMessages(otherUderId, page?, pageSize?) {
    return ExecutePaginatedQuery<MessageDto>(this.client,
      this.http.baseUrl + "Message/UserChatRooms/" + otherUderId,
      page,
      pageSize
    );
  }


}
