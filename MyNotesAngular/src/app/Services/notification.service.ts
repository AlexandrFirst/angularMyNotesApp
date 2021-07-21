import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { NotificationMessage, NotificationType } from '../Models/NotificationMessage';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private NotificationSubject: Subject<NotificationMessage> = new Subject<NotificationMessage>();

  sendMessage(message: NotificationMessage){
      this.NotificationSubject.next(message);
  }

  constructor(private toastrService: ToastrService) {
    this.NotificationSubject.subscribe(message => {
      switch(message.type){
        case NotificationType.success:
          this.toastrService.success(message.message);
          break;
        case NotificationType.error:
          this.toastrService.error(message.message);
          break;
        case NotificationType.warning:
          this.toastrService.warning(message.message);
          break;
        case NotificationType.info:
          this.toastrService.info(message.message);
          break;
        default:
          case NotificationType.info:
            this.toastrService.info(message.message);
            break;
      }
    }, err => {
      console.log("Error when processing toatstr message")
    });
   }
}
