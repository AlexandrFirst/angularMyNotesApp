import { Injectable } from '@angular/core';
import { PostNoteRequest } from '../Models/PostNoteRequest';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpService) { }

  postNote(noteBody: PostNoteRequest) {
    return this.http.SendData("Post/newPost", noteBody);
  }

  getNote(noteId) {
    return this.http.GetData("Post/note/" + noteId);
  }

  deleteNote(noteId) {
    return this.http.DeleteData("Post/note/" + noteId);
  }

  getMyNotes() {
    return this.http.GetData("Post/allNotes");
  }

  updateNote(noteId: number, noteBody: PostNoteRequest) {
    return this.http.SendData("Post/note/update/" + noteId, noteBody);
  }
}
