import { Injectable } from '@angular/core';
import { NoteDto } from '../Models/NoteDto';
import { PostNoteRequest } from '../Models/PostNoteRequest';
import { HttpService } from './http.service';
import { PaginatedResult } from '../Models/Pagination';
import { HttpParams } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserData } from '../Models/AuthResponse';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpService, private client: HttpClient) { }

  postNote(noteBody: PostNoteRequest) {
    return this.http.SendData("Post/newPost", noteBody);
  }

  getNote(noteId) {
    return this.http.GetData("Post/note/" + noteId);
  }

  deleteNote(noteId) {
    return this.http.DeleteData("Post/note/" + noteId);
  }

  getMyNotes(page?, itemsPerPage?, userId?) {

    const paginatedResult: PaginatedResult<NoteDto[]> = new PaginatedResult<NoteDto[]>();
    let params = new HttpParams();
    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.client.get<NoteDto[]>(this.http.baseUrl + "Post/allNotes" + (userId == null? "" : "/" + userId), { observe: 'response', params }).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }

        return paginatedResult;
      })
    );
  }

  updateNote(noteId: number, noteBody: PostNoteRequest) {
    return this.http.SendData("Post/note/update/" + noteId, noteBody);
  }
}
