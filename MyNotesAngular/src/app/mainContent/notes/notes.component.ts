import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { LoadingSignService } from 'src/app/loading-sign/loading-sign.service';
import { NoteDto } from 'src/app/Models/NoteDto';
import { PaginatedResult } from 'src/app/Models/Pagination';
import { NoteService } from 'src/app/Services/note.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  length = 100;
  pageSize = 1;
  pageSizeOption = [1, 2, 5, 10, 25, 100]
  pageIndex = 0;

  actualPageIndex = 1;

  notes: NoteDto[] = [];

  constructor(
    private noteService: NoteService,
    private loadingSignService: LoadingSignService,
    private router: Router) { }


  loadImages(pageIndex, pageSize) {
    this.loadingSignService.activate();
    this.noteService.getMyNotes(pageIndex, pageSize).subscribe((notes: PaginatedResult<NoteDto[]>) => {
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
    this.loadImages(this.actualPageIndex, this.pageSize);
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

    this.loadImages(this.actualPageIndex, this.pageSize);

    console.log($event);
  }
}
