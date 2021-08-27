import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LoadingSignService } from 'src/app/loading-sign/loading-sign.service';
import { UserData } from 'src/app/Models/AuthResponse';
import { NoteDto } from 'src/app/Models/NoteDto';
import { PaginatedResult } from 'src/app/Models/Pagination';
import { NoteService } from 'src/app/Services/note.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  length = 0;
  pageSize = 1;
  pageSizeOption = [1, 2, 5, 10, 25, 100]
  pageIndex = 0;

  actualPageIndex = 1;

  notes: NoteDto[] = [];

  isMyNotes: boolean = true;
  userId: number = null;

  constructor(
    private noteService: NoteService,
    private loadingSignService: LoadingSignService,
    private router: Router,
    private route: ActivatedRoute) { }


  loadNotes(pageIndex, pageSize) {
    this.loadingSignService.activate();
    this.noteService.getMyNotes(pageIndex, pageSize, this.userId).subscribe((notes: PaginatedResult<NoteDto[]>) => {
      console.log(this.notes);
      this.notes = notes.result;
      this.pageIndex = notes.pagination.currentPage - 1;
      this.actualPageIndex = notes.pagination.currentPage;
      this.length = notes.pagination.totalItems;


      this.loadingSignService.deactivate();
    }, error => {
      this.loadingSignService.deactivate();
    });

  }
  ngOnInit(): void {
    var userId = null;
    this.route.params.subscribe((params: Params) => {
      if (params.userId) {
        userId = +params.userId;
        console.log(userId);
      }

      if (userId == null) {
        this.isMyNotes = true;
        this.userId = null;
        console.log("user id = null")
      } else {
        this.userId = +userId;
        this.isMyNotes = (this.userId == +localStorage.getItem(UserData.UserId));
        console.log(this.userId, "user id != null");
      }

      this.loadNotes(this.actualPageIndex, this.pageSize);
    })

  }


  editBtnClick(noteId: number) {
    console.log(noteId);
    this.router.navigate(['main', 'add'], { queryParams: { mode: "editing", noteid: noteId } });
  }

  pageEvent($event: PageEvent) {
    this.pageIndex = $event.pageIndex;
    this.pageSize = $event.pageSize

    this.actualPageIndex = $event.pageIndex + 1;
    console.log(this.pageIndex)
    console.log(this.actualPageIndex)

    this.loadNotes(this.actualPageIndex, this.pageSize);

    console.log($event);
  }
}
