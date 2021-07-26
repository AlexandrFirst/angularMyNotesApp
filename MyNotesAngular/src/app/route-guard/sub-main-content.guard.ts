import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationType } from '../Models/NotificationMessage';
import { NotificationService } from '../Services/notification.service';
import { UserService } from '../Services/user.service';

@Injectable({
  providedIn: 'root'
})
export class SubMainContentGuard implements CanActivate {

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (!this.userService.isRegistered) {
      this.notificationService.sendMessage({
        message: "Please, register before continue",
        type: NotificationType.warning
      });
      this.router.navigate(['register', 'login']);
      console.log('in auth guard');
      return false;
    }

    return true;
  }

}
