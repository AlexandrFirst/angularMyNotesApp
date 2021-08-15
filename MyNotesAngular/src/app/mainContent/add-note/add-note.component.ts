import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig, UploadResponse } from '@kolkov/angular-editor';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoadingSignService } from 'src/app/loading-sign/loading-sign.service';
import { NotificationType } from 'src/app/Models/NotificationMessage';
import { PostNoteRequest } from 'src/app/Models/PostNoteRequest';
import { UploadPhoto } from 'src/app/Models/UploadPhoto';
import { NoteService } from 'src/app/Services/note.service';
import { NotificationService } from 'src/app/Services/notification.service';
import { PhotoService } from 'src/app/Services/photo.service';

import Quill from 'quill';
import { VideoHandler, ImageHandler, Options } from 'ngx-quill-upload';

Quill.register('modules/imageHandler', ImageHandler);
Quill.register('modules/videoHandler', VideoHandler);

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.scss']
})
export class AddNoteComponent implements OnInit {


  isDirty: boolean = false;
  isEditingMode: boolean = false;
  noteId: number = -1;

  uploadedImages: UploadPhoto[] = [];

  form = new FormGroup({
    titleImage: new FormControl(null, [Validators.required]),
    htmlContent: new FormControl(null, [Validators.required])
  });

  constructor(
    private photoService: PhotoService,
    private notificationService: NotificationService,
    private noteService: NoteService,
    private loadingSignService: LoadingSignService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.mode && params.mode == "editing" && params.noteid) {


        this.noteId = params.noteid;
        this.noteService.getNote(params.noteid).subscribe((success: PostNoteRequest) => {
          this.isEditingMode = true;
          console.log(params)

          console.log(success)
          this.form.get("titleImage").setValue(success.titleImage);
          this.form.get("htmlContent").setValue(success.noteText);

          this.uploadedImages.push(...success.uploadImages);
        })
      }
    })

    this.form.valueChanges.subscribe(val => {
      if (this.form.get("titleImage").value || this.form.get("htmlContent").value) {
        this.isDirty = true;
      }
    });
  }



  


  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],

      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction

      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],

      ['clean'],                                         // remove formatting button
      ['image']
    ],
    imageHandler: {
      upload: (file) => {

        return new Promise((resolve, reject) => {
          return this.photoService.sendPhoto(file).toPromise()
            .then((event: HttpResponse<UploadPhoto>) => {
              if (event.type == HttpEventType.Response) {
                let res = event.body.imageUrl;
                this.uploadedImages.push(event.body);
                resolve(res);
              }
            })
            .catch(error => {
              reject("Upload failed");
              console.log(error);
            });
        });
      },
      accepts: ['png', 'jpg'] // Extensions to allow for images (Optional) | Default - ['jpg', 'jpeg', 'png']
    } as Options,
  };

  @HostListener('window:beforeunload', ['$event'])
  beforeUnload($event) {
    if (this.form.get('titleImage') || this.form.get("htmlContent").value) {
      console.log("here")
      return false
    }
    else {
      return true;
    }
  }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    if (this.form.get('htmlContent')) {
      this.photoService.deletePhotoRange(this.uploadedImages.map(i => i.imagePublicId)).subscribe(success => {
        console.log(success);
        this.notificationService.sendMessage({
          message: "Ok",
          type: NotificationType.success
        });
      }, error => {
        this.notificationService.sendMessage({
          message: "Smth went wrong",
          type: NotificationType.error
        });
      });
    }
  }


  onSubmit() {

    if (!this.form.valid) {
      this.notificationService.sendMessage({
        message: "All fields should not be empty",
        type: NotificationType.warning
      });
      return;
    }

    console.log("html content: ", this.form.get('htmlContent').value);

    this.loadingSignService.activate();

    if (!this.isEditingMode) {

      this.noteService.postNote({
        noteText: this.form.get('htmlContent').value,
        titleImage: this.form.get('titleImage').value,
        uploadImages: this.uploadedImages
      }).subscribe(success => {
        this.notificationService.sendMessage({
          message: "Your note is succeesfully added",
          type: NotificationType.success
        });
        this.loadingSignService.deactivate();
        this.isDirty = false;
        this.router.navigate(['main']);
      }, error => {
        this.notificationService.sendMessage({
          message: error.error.Message,
          type: NotificationType.error
        });

        this.loadingSignService.deactivate();
      })

      console.log(this.form.get('titleImage').value);

    }
    else {
      this.noteService.updateNote(this.noteId, {
        noteText: this.form.get('htmlContent').value,
        titleImage: this.form.get('titleImage').value,
        uploadImages: this.uploadedImages
      }).subscribe(success => {
        this.notificationService.sendMessage({
          message: "Your note is succeesfully added",
          type: NotificationType.success
        });
        this.loadingSignService.deactivate();
        this.isDirty = false;
        this.router.navigate(['main']);
      }, error => {
        this.notificationService.sendMessage({
          message: error.error.Message,
          type: NotificationType.error
        });

        this.loadingSignService.deactivate();
      })
    }

  }

  cancelBtnClick() {
    if (!this.isEditingMode) {

      this.loadingSignService.activate();

      let deletePhotosRange:string[] = [];
      
      
      this.uploadedImages.map(im => im.imagePublicId).forEach(elem => {
        deletePhotosRange.push(elem);
      })

      if (this.form.get("titleImage").value) {
        deletePhotosRange.push(this.form.get("titleImage").value.imagePublicId);
      }

      this.photoService.deletePhotoRange(deletePhotosRange).subscribe(next => {
        this.loadingSignService.deactivate();
        this.notificationService.sendMessage({
          message: "Adding is cancelled",
          type: NotificationType.info
        });
        this.isDirty = false;
        this.router.navigate(['main']);
      }, error => {
        this.loadingSignService.deactivate();
        this.notificationService.sendMessage({
          message: "Smth went wrong! Try again",
          type: NotificationType.warning
        });
      });
    }

  }

  deleteNote() {
    this.route.queryParams.subscribe(params => {

      if (params.mode == "editing" && params.noteid) {

        this.loadingSignService.activate();
        this.noteService.deleteNote(params.noteid).subscribe(success => {
          this.loadingSignService.deactivate();
          this.notificationService.sendMessage({
            message: "The note is deleted successfully",
            type: NotificationType.success
          });
          this.isDirty = false;
          this.router.navigate(['main']);
        }, error => {
          this.loadingSignService.deactivate();
        });
      }
      else {
        this.notificationService.sendMessage({
          message: "Smth went wrong! Reload page and try again",
          type: NotificationType.error
        });
      }
    });
  }
}
