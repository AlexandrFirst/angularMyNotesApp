import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule} from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';


import { AppComponent } from './app.component';
import { NotesComponent } from './notes/notes.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { AddNoteComponent } from './add-note/add-note.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { FileUploadComponent } from './file-upload/file-upload.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    AppComponent,
    NotesComponent,
    FooterComponent,
    HeaderComponent,
    AddNoteComponent,
    FileUploadComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, 
    AngularEditorModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFileUploaderModule,
    MatSliderModule,
    MatIconModule,
    MatProgressBarModule,
    RouterModule.forRoot([
      {path: 'addNotes', component: AddNoteComponent},
      {path: 'notes', component: NotesComponent},
      {path: '', redirectTo: '/notes', pathMatch: 'full'},
      {path: '**', component: NotesComponent}
    ]),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
