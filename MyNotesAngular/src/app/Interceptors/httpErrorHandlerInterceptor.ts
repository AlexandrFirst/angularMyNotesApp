import { Injectable } from '@angular/core';
import {
    HttpEvent, HttpRequest, HttpHandler,
    HttpInterceptor, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { NotificationService } from '../Services/notification.service';
import { NotificationType } from '../Models/NotificationMessage';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {


    constructor(private notificationService: NotificationService) {
        
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                console.log(error.error.Message)
                this.notificationService.sendMessage({
                    message: error.error.Message,
                    type: NotificationType.error
                })
                return throwError(error);
            })
        );
    }
}