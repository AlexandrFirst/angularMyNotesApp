import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadPhotoResponse } from '../Models/UploadPhotoResponse';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoService extends HttpService {
  constructor(private http: HttpClient) {
    super(http);
  }

  sendPhoto(photo, isMain = false): Observable<HttpEvent<UploadPhotoResponse>> {

    const sendingFoto = new FormData();
    sendingFoto.append("photo", photo);

    return this.http.post(this.baseUrl + "photo/upload/" + isMain, sendingFoto, {
      reportProgress: true,
      observe: 'events'
    }) as Observable<HttpEvent<UploadPhotoResponse>>;
  }

  deletePhoto(photoId: string) {
    console.log(photoId);
    return this.http.delete(this.baseUrl + "photo/delete/" + photoId);
  }

  deletePhotoRange(pahotoIds: string[]) {
    return this.http.post(this.baseUrl + "photo/deleteRange", pahotoIds);
  }
}

