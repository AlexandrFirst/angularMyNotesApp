import { HttpClient, HttpResponse } from '@angular/common/http';
import { error } from '@angular/compiler/src/util';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.scss']
})

export class AddNoteComponent implements OnInit {


  titleImg: UploadPhoto;

  isEditingMode: boolean = false;

  form = new FormGroup({
    titleImage: new FormControl(''),
    htmlContent: new FormControl('')
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

        this.noteService.getNote(params.noteid).subscribe((success: PostNoteRequest) => {
          this.isEditingMode = true;

          this.titleImg = success.TitleImage;
          this.form.get("htmlContent").setValue(success.NoteText);
        })
      }
    })
  }



  uploadedImages: UploadPhoto[];

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '300px',
    maxHeight: '600px',
    width: 'auto',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    upload: (file: File) => {
      const uploadData: FormData = new FormData();

      uploadData.append('file', file);

      let response = this.photoService.sendPhoto(uploadData).pipe(map((elem: HttpResponse<any>) => {

        const inputResponse = JSON.parse(JSON.stringify(elem.body)) as UploadPhoto;
        this.uploadedImages.push(inputResponse);

        let new_reponse: UploadResponse = {
          imageUrl: inputResponse.imgPath
        }

        let outputResponse: HttpResponse<UploadResponse> = {
          body: new_reponse,
          type: elem.type,
          headers: elem.headers,
          ok: elem.ok,
          status: elem.status,
          statusText: elem.statusText,
          url: elem.url,
          clone: elem.clone
        }

        return outputResponse;
      }))

      return response;
    },
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [],
      [
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode']
    ],
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
    console.log("html content: ", this.form.get('htmlContent').value);

    this.loadingSignService.activate();

    if (this.form.get('titleImage').value) {

      this.noteService.postNote({
        NoteText: this.form.get('htmlContent').value,
        TitleImage: this.form.get('titleImage').value,
        UploadImages: this.uploadedImages
      }).subscribe(success => {
        this.notificationService.sendMessage({
          message: "Your note is succeesfully added",
          type: NotificationType.success
        });
        this.loadingSignService.deactivate();
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
  }

  cancelBtnClick() {
    this.router.navigate(['main']);
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
          this.router.navigate(['main']);
        }, error => {
          this.loadingSignService.deactivate();
        });
      }
      else{
        this.notificationService.sendMessage({
          message: "Smth went wrong! Reload page and try again",
          type: NotificationType.error
        });
      }
    });
  }
}
