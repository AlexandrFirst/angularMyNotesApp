import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HubConnection } from '@aspnet/signalr';
import { Subject } from 'rxjs';
import { MessageDto } from '../Models/MessageDto';
import { ExecutePaginatedQuery } from '../Models/Pagination';
import { ISignalRMessageService } from './Abstartions/ISignalRMessageService';
import { HttpService } from './http.service';
import { SignalRProvider } from './Providers/SignalRProvider';

@Injectable({
  providedIn: 'root',
})
export class MessageService {

  private hubConnection: HubConnection | undefined;

  private otherMessageStream = new Subject<string>();

  constructor(private http: HttpService,
    private client: HttpClient,
    @Inject(SignalRProvider)
    private signalRService: ISignalRMessageService) {

    if (!signalRService.IsConnected) {
      signalRService.connectToHub();
      signalRService.getFromUserMessage().subscribe(message => {
        this.otherMessageStream.next(message);
      })
    }

  }

  sendMessage(userId: number, message: string) {
    this.signalRService.sendToUserMessage(userId, message);
  }

  getMessageStream() {
    return this.otherMessageStream.asObservable();
  }

  getAllMessages(otherUderId, page?, pageSize?) {
    return ExecutePaginatedQuery<MessageDto>(this.client,
      this.http.baseUrl + "Message/UserChatRooms/" + otherUderId,
      page,
      pageSize
    );
  }




}
