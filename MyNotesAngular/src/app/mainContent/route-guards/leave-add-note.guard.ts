import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationType } from 'src/app/Models/NotificationMessage';
import { NotificationService } from 'src/app/Services/notification.service';
import { AddNoteComponent } from '../add-note/add-note.component';

@Injectable({
  providedIn: 'root'
})
export class LeaveAddNoteGuard implements CanDeactivate<AddNoteComponent> {
  
  constructor(private notificationService: NotificationService) {}

  canDeactivate(component: AddNoteComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (component.isDirty) {
      this.notificationService.sendMessage({
        message:"You can't leave while you are editing!!!",
        type: NotificationType.warning
      });
      return false;
    }
    else {
      return true;
    }
  }


}
