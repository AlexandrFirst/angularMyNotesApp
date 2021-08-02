import { HttpEventType } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Component, forwardRef, HostListener, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NotificationType } from '../Models/NotificationMessage';
import { UploadPhotoResponse } from '../Models/UploadPhotoResponse';
import { NotificationService } from '../Services/notification.service';
import { PhotoService } from '../Services/photo.service';

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
  photoResponse: UploadPhotoResponse;

  isFileChosen = false;


  onChange: (_: any) => void = (_: any) => { };

  onTouched: () => void = () => { };

  constructor(private photoService: PhotoService,
    private messageService: NotificationService) { }

  updateChanges() {
    this.onChange(this.photoResponse);
  }

  writeValue(photoResponse: any): void {
    this.photoResponse = photoResponse;
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

  // @HostListener('window:beforeunload', ['$event'])
  // public beforeUnload($event) {
  //   if (this.photoResponse) {
  //     return false;
  //   }
  //   else{
  //     return true;
  //   }
  // }

  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    if (this.photoResponse) {
      this.resetImage();
    }
  }


  onFileSelected(event) {
    this.file = event.target.files[0];

    if (this.file) {
      console.log(this.file)
      this.isFileChosen = true;
      this.fileName = this.file.name;

      const upload$ = this.photoService.sendPhoto(this.file, true)
        .pipe(
          finalize(() => this.reset())
        );

      this.uploadSub = upload$.subscribe(event => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
          console.log(this.uploadProgress);
          event.type
        }
        else if (event.type == HttpEventType.Response) {
          console.log(event.body)
          this.photoResponse = JSON.parse(JSON.stringify(event.body));
          console.log(this.photoResponse)

          this.updateChanges();
        }
      })
    }
  }

  resetImage() {
    console.log(this.photoResponse);

    this.photoService.deletePhoto(this.photoResponse.imagePublicId).subscribe(success => {
      console.log("here")
      this.messageService.sendMessage({
        message: "Photo is deleted successfully",
        type: NotificationType.success
      });
      console.log("here")

      this.writeValue(null);

      this.file = null;
      this.fileName = null;
      this.isFileChosen = false;

    }, error => {
      this.messageService.sendMessage({
        message: error.error.Message,
        type: NotificationType.success
      });
    })

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
