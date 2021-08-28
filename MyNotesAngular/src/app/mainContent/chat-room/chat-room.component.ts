import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ChatState, MessageDto } from 'src/app/Models/MessageDto';
import { PaginatedResult } from 'src/app/Models/Pagination';
import { MessageService } from 'src/app/Services/message.service';
import * as $ from 'jquery';
import { Browser } from 'protractor';
import { Platform } from '@angular/cdk/platform';
import { getBrowserName } from 'src/app/Models/helpers';


@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, AfterViewInit {

  private otherUserId: number;

  messages: MessageDto[] = [];
  pageIndex = 1;
  pageSize = 30;
  totalPages = -1;

  messageText: string = "";
  chatState: ChatState = ChatState.StickToBottom;

  @ViewChild("messageContainer") private messageContainer: ElementRef;

  constructor(private messageService: MessageService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.messageService.initialize();
    // console.log(this.messageContainer.nativeElement);
    this.messageService.getMessageStream().subscribe(message => {
      this.messages.push(
        {
          isMyMessage: false,
          messageText: message,
          sendTime: new Date(),
          messageId: -1
        });
      if (this.chatState == ChatState.StickToBottom) {
        this.scrollToBottom();
      }
    })

    this.route.params.subscribe((params: Params) => {

      const userId = +params.userId;
      if (!userId) {
        throw new Error("can't get userId");
      }
      console.log(userId)
      this.otherUserId = userId;

      this.messageService.getAllMessages(userId, this.pageIndex, this.pageSize).subscribe((result: PaginatedResult<MessageDto[]>) => {
        this.messages = result.result.reverse();
        this.totalPages = result.pagination.totalPages;

        this.pageIndex = result.pagination.currentPage + 1;

      }, error => {
        console.log(error)
      });

    })

  }

  ngAfterViewInit() {
    this.scrollToBottom();
    setTimeout(() => {
      this.messageContainer.nativeElement.addEventListener('scroll', () => {
        if (this.messageContainer.nativeElement.scrollTop - 100 <= 0) {
          console.log("Scrolled to top");

          if (this.pageIndex <= this.totalPages) {
            this.messageService.getAllMessages(this.otherUserId, this.pageIndex, this.pageSize).subscribe((result: PaginatedResult<MessageDto[]>) => {


              // var scrollTop = this.messageContainer.nativeElement.scrollTop;
              // var oldHeight = this.messageContainer.nativeElement.scrollHeight;

              var $container = $(".message-container");
              var container = $container[0];
              var scrollTop = $container.scrollTop();
              var oldHeight = container.scrollHeight;
              // var oldHeight = this.messageContainer.nativeElement.scrollHeight;


              this.messages.unshift(...result.result);

              this.pageIndex = result.pagination.currentPage + 1;

              // setTimeout(() => {
              //   var diff = this.messageContainer.nativeElement.scrollHeight - oldHeight;
              //   this.messageContainer.nativeElement.scrollTop = diff + scrollTop;
              // });


              if (getBrowserName() == "chrome") {
                var diff = container.scrollHeight - oldHeight;
                $container.scrollTop(diff + scrollTop);
              }
              else {
                setTimeout(() => {
                  var diff = container.scrollHeight - oldHeight;
                  $container.scrollTop(diff + scrollTop);
                })
              }

            }, error => {
              console.log(error)
            });
          } else {
            console.log("All messages are loaded");
          }


          this.chatState = ChatState.Default;
        }
        else if (this.messageContainer.nativeElement.scrollHeight - this.messageContainer.nativeElement.scrollTop <= this.messageContainer.nativeElement.clientHeight + 10) {
          this.chatState = ChatState.StickToBottom;
          console.log("scrolled to down");
        }
        else {
          this.chatState = ChatState.Default;
        }
      })
    }, 300);
  }
  sendMessage() {
    console.log("here");
    if (this.messageText.length <= 0) {
      console.log("can't send empty message");
    } else {
      this.messageService.sendMessage(this.otherUserId, this.messageText);
      this.messages.push(
        {
          isMyMessage: true,
          messageText: this.messageText,
          sendTime: new Date(),
          messageId: -1
        });
      this.messageText = "";
    }
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => { this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight; }, 100)
    } catch (err) { }
  }

}
