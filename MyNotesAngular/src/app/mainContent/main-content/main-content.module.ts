import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { NotesComponent } from '../notes/notes.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { UserChatsComponent } from '../user-chats/user-chats.component';

import { LikedPostsComponent } from '../liked-posts/liked-posts.component';
import { SettingsComponent } from '../settings/settings.component';
import { AddNoteComponent } from '../add-note/add-note.component';
import { FileUploadComponent } from 'src/app/file-upload/file-upload.component';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { AdminAnaliticComponent } from '../admin-analitic/admin-analitic.component';
import { SubMainContentGuard } from 'src/app/route-guard/sub-main-content.guard';
import {MatProgressBarModule} from '@angular/material/progress-bar'

@NgModule({
  declarations: [
    NotesComponent,
    AddNoteComponent,
    FileUploadComponent,
    UserProfileComponent,
    UserChatsComponent,
    AdminAnaliticComponent,
    LikedPostsComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatIconModule,
    AngularEditorModule,
    MatProgressBarModule,
    RouterModule.forChild([
      {path: 'notes', component: NotesComponent},
      {path: 'add', component: AddNoteComponent},
      {path: 'likedposts', component: LikedPostsComponent},
      {path: 'userprofile', component: UserProfileComponent},
      {path: 'userchats', component: UserChatsComponent},
      {path: 'analitics', component: AdminAnaliticComponent},
      {path: 'settings', component: SettingsComponent},
      {path: '',  redirectTo: 'notes', pathMatch: 'full'},
      {path: '**',  redirectTo: 'notes', pathMatch: 'full'}
    ])
  ],
})
export class MainContentModule { }
