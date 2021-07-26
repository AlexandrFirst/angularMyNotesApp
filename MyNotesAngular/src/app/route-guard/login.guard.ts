import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationType } from '../Models/NotificationMessage';
import { NotificationService } from '../Services/notification.service';
import { UserService } from '../Services/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivateChild, CanActivate {

  constructor(
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.userService.isRegistered) {

      this.notificationService.sendMessage({
        message: "You are registered",
        type: NotificationType.success
      });

      this.router.navigate(['main']);
      return false;
    }

    return true;
  }

  canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    if (this.userService.isRegistered) {

      this.notificationService.sendMessage({
        message: "You are registered",
        type: NotificationType.success
      });

      this.router.navigate(['main']);
      return false;
    }

    return true;
  }

}
