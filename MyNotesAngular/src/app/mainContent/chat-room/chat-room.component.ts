import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MessageDto } from 'src/app/Models/MessageDto';
import { PaginatedResult } from 'src/app/Models/Pagination';
import { MessageService } from 'src/app/Services/message.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit {

  messages: MessageDto[] = [];
  pageIndex = 1;
  pageSize = 10;

  constructor(private messageService: MessageService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.messageService.initialize();
    
    this.route.params.subscribe((params: Params) => {

      const userId = +params.userId;
      if (!userId) {
        throw new Error("can't get userId");
      }

      console.log(userId)

      this.messageService.getAllMessages(userId, this.pageIndex, this.pageSize).subscribe((result: PaginatedResult<MessageDto[]>) => {
        this.messages = result.result;
      }, error => {
        console.log(error)
      });

    })
  }

}
