import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserData } from 'src/app/Models/AuthResponse';

export class AddHeaderInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Clone the request to add the new header
        const bearerToken = localStorage.getItem(UserData.UserToken);

        const clonedRequest = req.clone({ headers: req.headers.append('Authorization', 'Bearer ' + bearerToken) });

        // Pass the cloned request instead of the original request to the next handle
        return next.handle(clonedRequest);
    }
}