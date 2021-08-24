import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { NotesComponent } from '../notes/notes.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
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
import { LeaveAddNoteGuard } from '../route-guards/leave-add-note.guard';
import { QuillModule } from 'ngx-quill';
import { OtherUserListComponent } from '../other-user-list/other-user-list.component';
import { ThreeStateToggleSwitchComponent } from 'src/app/three-state-toggle-switch/three-state-toggle-switch.component';
import { ChatRoomComponent } from '../chat-room/chat-room.component';

@NgModule({
  declarations: [
    NotesComponent,
    AddNoteComponent,
    FileUploadComponent,
    UserProfileComponent,
    UserChatsComponent,
    AdminAnaliticComponent,
    LikedPostsComponent,
    SettingsComponent,
    OtherUserListComponent,
    ThreeStateToggleSwitchComponent,
    ChatRoomComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatIconModule,
    MatPaginatorModule,
    AngularEditorModule,
    MatProgressBarModule,
    QuillModule,
    RouterModule.forChild([
      {path: 'notes', component: NotesComponent},
      {path: 'notes/:userId', component: NotesComponent},
      {path: 'add', component: AddNoteComponent, canDeactivate: [LeaveAddNoteGuard]},
      {path: 'likedposts', component: LikedPostsComponent},
      {path: 'userprofile', component: UserProfileComponent},
      {path: 'userchats', component: UserChatsComponent},
      {path: 'userchats/:userId', component: ChatRoomComponent},
      {path: 'analitics', component: AdminAnaliticComponent},
      {path: 'settings', component: SettingsComponent},
      {path: 'otherUsers', component: OtherUserListComponent},
      {path: '',  redirectTo: 'notes', pathMatch: 'full'},
      {path: '**',  redirectTo: 'notes', pathMatch: 'full'}
    ])
  ],
})
export class MainContentModule { }
