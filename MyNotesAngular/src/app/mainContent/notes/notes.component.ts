import { Component, OnInit } from '@angular/core';
import { LoadingSignService } from 'src/app/loading-sign/loading-sign.service';
import { NoteService } from 'src/app/Services/note.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {

  constructor(
    private noteService: NoteService,
    private loadingSignService: LoadingSignService) { }

  ngOnInit(): void {
    this.loadingSignService.activate();
    this.noteService.getMyNotes().subscribe(success => {


      this.loadingSignService.deactivate();
    }, error => {
      this.loadingSignService.deactivate();
    });
  }

}
