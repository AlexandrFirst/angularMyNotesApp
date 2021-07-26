import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationType } from '../Models/NotificationMessage';
import { NotificationService } from '../Services/notification.service';
import { UserService } from '../Services/user.service';

@Injectable({
  providedIn: 'root'
})
export class MainContentGuard implements CanActivateChild {

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router) {
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if(!this.userService.isRegistered){
        this.notificationService.sendMessage({
          message: "You shall not pass!!!",
          type: NotificationType.error
        });
        this.router.navigate(['register', 'login']);
        console.log('in auth guard');
        return false;
      }

    return true;
  }

}
