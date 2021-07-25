import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { NotificationMessage, NotificationType } from '../Models/NotificationMessage';
import { NotificationService } from './notification.service';

@Injectable()
export class MyErrorHandlerService implements ErrorHandler {


  constructor() {}

  handleError(error: any): void {
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
