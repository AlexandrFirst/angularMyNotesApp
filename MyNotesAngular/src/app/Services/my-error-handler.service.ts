import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NotificationMessage, NotificationType } from '../Models/NotificationMessage';
import { NotificationService } from './notification.service';

@Injectable()
export class MyErrorHandlerService extends ErrorHandler {

  private notificationService: NotificationService;

  constructor(private injector: Injector) {
    super();
  }

  handleError(error: any): void {

    if (this.notificationService == null) {
      this.notificationService = this.injector.get(NotificationService);
    }

    console.log(this.notificationService)

    if (error instanceof HttpErrorResponse) {

      if (error.error) {
        console.error(error.error.Message);
      }
      else {
        console.error(error.message)
      }
    }
    else {
      console.error('An error occurred:', error.message);
    }
  }
}
