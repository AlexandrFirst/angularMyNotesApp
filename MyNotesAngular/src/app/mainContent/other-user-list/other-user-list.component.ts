import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { PaginatedResult } from 'src/app/Models/Pagination';
import { UserListInstance } from 'src/app/Models/UserListInstance';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-other-user-list',
  templateUrl: './other-user-list.component.html',
  styleUrls: ['./other-user-list.component.scss']
})
export class OtherUserListComponent implements OnInit {

  private isSubscribers: boolean | null = null;

  private pageIndex = 1;
  private totalPages = -1;

  userList: UserListInstance[] = [];

  @ViewChild('searchInput', { static: true }) input: ElementRef;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    fromEvent<any>(this.input.nativeElement, 'keyup').pipe(
      map(event => event.target.value),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => this.userService.GetOtherUserList(val, this.isSubscribers, this.pageIndex))
    ).subscribe((value: PaginatedResult<UserListInstance[]>) => {
      if (value.pagination) {
        this.pageIndex = value.pagination.currentPage;
        this.totalPages = value.pagination.totalPages;

        this.userList = value.result;
      }
      console.log(value);
    })
  }

  OnToggleValueChanaged($event) {
    this.isSubscribers = $event;
  }

  @HostListener("window:scroll", ["$event"])
  onScroll() {
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
    if (pos == max  && this.userList.length > 0) {
      console.log("The end of the list")
    }
  }
}
