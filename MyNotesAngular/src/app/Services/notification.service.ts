import { Injectable, Injector } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { NotificationMessage, NotificationType } from '../Models/NotificationMessage';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {


  private toastrService: ToastrService;
  private NotificationSubject: Subject<NotificationMessage> = new Subject<NotificationMessage>();

  sendMessage(message: NotificationMessage) {
    this.NotificationSubject.next(message);
  }

  constructor(private injector: Injector) {

    if(this.toastrService == null){
      this.toastrService = this.injector.get(ToastrService);
    }

    this.NotificationSubject.subscribe(message => {
      switch (message.type) {
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
