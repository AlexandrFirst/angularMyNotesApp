import { Component, OnInit } from '@angular/core';
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
    private loadingSignService: LoadingSignService) { }

  ngOnInit(): void {
    this.loadingSignService.activate();
    this.noteService.getMyNotes().subscribe((notes: NoteDto[]) => {
      console.log(this.notes);

      
      this.loadingSignService.deactivate();
    }, error => {
      this.loadingSignService.deactivate();
    });
  }

}
