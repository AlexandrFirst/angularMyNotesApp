import { Component, OnInit } from '@angular/core';
import { PaginatedResult } from 'src/app/Models/Pagination';
import { UserListChatInstance } from 'src/app/Models/UserListInstance';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-user-chats',
  templateUrl: './user-chats.component.html',
  styleUrls: ['./user-chats.component.scss']
})
export class UserChatsComponent implements OnInit {

  chatRooms: UserListChatInstance[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.GetOtherUserChatList("").subscribe((items: PaginatedResult<UserListChatInstance[]>) => {
      this.chatRooms = items.result;
    }, error => {
      console.log(error, "can't get chat rooms list")
    })
  }

}
