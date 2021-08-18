import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AppComponent } from './app.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MainContentViewComponent } from './mainContent/main-content-view/main-content-view.component';
import { ToastrModule } from 'ngx-toastr';
import { LoadingSignComponent } from './loading-sign/loading-sign.component';
import { MyErrorHandlerService } from './Services/my-error-handler.service';
import { MainContentGuard } from './route-guard/main-content.guard';
import { LoginGuard } from './route-guard/login.guard';
import { AddHeaderInterceptor } from './Interceptors/addHeadersInterceptor';
import { ServerErrorInterceptor } from './Interceptors/httpErrorHandlerInterceptor';
import { QuillModule } from 'ngx-quill';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    NavBarComponent,
    MainContentViewComponent,
    LoadingSignComponent
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
    BrowserAnimationsModule,
    QuillModule.forRoot(),
    ToastrModule.forRoot(),
    RouterModule.forRoot([
      {
        path: 'register',
        loadChildren: () => import('./registrationContent/registration/registration.module').then(m => m.RegistrationModule),
        canActivateChild: [LoginGuard]
      },
      {
        path: 'main', component: MainContentViewComponent,
        loadChildren: () => import('./mainContent/main-content/main-content.module').then(m => m.MainContentModule),
        canActivateChild: [MainContentGuard]
      },
      { path: '', redirectTo: '/register/register', pathMatch: 'full' },
      { path: '**', redirectTo: '/register/register', pathMatch: 'full' }
    ])
  ],
  providers: [
    MyErrorHandlerService,
    { provide: ErrorHandler, useClass: MyErrorHandlerService },
    { provide: HTTP_INTERCEPTORS, useClass: AddHeaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
