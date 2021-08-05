import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingSignService } from 'src/app/loading-sign/loading-sign.service';
import { NoteDto } from 'src/app/Models/NoteDto';
import { NoteService } from 'src/app/Services/note.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {


  notes: NoteDto[] = [];

  constructor(
    private noteService: NoteService,
    private loadingSignService: LoadingSignService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadingSignService.activate();
    this.noteService.getMyNotes().subscribe((notes: NoteDto[]) => {
      console.log(this.notes);
      this.notes = notes;
      
      this.loadingSignService.deactivate();
    }, error => {
      this.loadingSignService.deactivate();
    });
  }


  editBtnClick(noteId: number){
    console.log(noteId);
    this.router.navigate(['main','add'], {queryParams: {mode: "editing", noteid: noteId}});
  }
}
