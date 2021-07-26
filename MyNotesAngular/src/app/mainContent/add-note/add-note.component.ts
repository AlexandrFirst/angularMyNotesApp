import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularEditorConfig, UploadResponse } from '@kolkov/angular-editor';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.scss']
})

export class AddNoteComponent implements OnInit {


  titleImgName;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
  }

  form = new FormGroup({
    titleImage: new FormControl(''),
    htmlContent: new FormControl('')
  });


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

      uploadData.append('file', file, file.name);

      return this.http.post<UploadResponse>('someUrl', uploadData, {
        headers: {
          'enctype': 'multipart/form-data'
        },
        reportProgress: true,
        observe: 'events'
      });
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

  onSubmit() {
    console.log("html content: ", this.form.get('htmlContent').value);

    if (this.form.get('titleImage').value) {

      console.log(this.form.get('titleImage').value);

    }
  }

  cancelBtnClick(){
    this.router.navigate(['main']);
    console.log('herte')
  }

}
