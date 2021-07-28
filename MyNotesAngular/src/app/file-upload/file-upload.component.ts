import { HttpEventType } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FileUploadComponent),
    multi: true
  }]
})
export class FileUploadComponent implements ControlValueAccessor {


  @Input()
  requiredFileType: string;

  fileName = '';
  uploadProgress: number;
  uploadSub: Subscription;

  file: File;

  isFileChosen = false;


  onChange: (_: any) => void = (_: any) => { };

  onTouched: () => void = () => { };

  constructor(private http: HttpClient) { }

  updateChanges() {
    this.onChange(this.file);
  }

  writeValue(file: any): void {
    this.file = file;
    this.updateChanges();
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }


  onFileSelected(event) {
    this.file = event.target.files[0];

    if (this.file) {
      console.log(this.file)
      this.isFileChosen = true;
      this.fileName = this.file.name;
      this.updateChanges()
      const upload$ = this.http.post("/api/thumbnail-upload", this.file, {
        reportProgress: true,
        observe: 'events'
      })
        .pipe(
          finalize(() => this.reset())
        );

      this.uploadSub = upload$.subscribe(event => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
          console.log(this.uploadProgress)
        }
      })
    }
  }

  resetImage() {
    this.file = null;
    this.fileName = null;
    this.isFileChosen = false;

  }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }
}
