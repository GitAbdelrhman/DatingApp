import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BsDropdownModule, TabsModule, DatepickerModule, ButtonsModule } from 'ngx-bootstrap';
import { BsDatepickerModule ,PaginationModule } from 'ngx-bootstrap';

import { RouterModule } from '@angular/router';
import { JwtModule } from '@auth0/angular-jwt';
import { NgxGalleryModule } from 'ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { ValueComponent } from './Value/Value.component';
import {HttpClientModule} from '@angular/common/http';
import { AuthService } from './_Services/Auth.service';

import { HttpClient } from 'selenium-webdriver/http';
import { NavComponent } from './Nav/Nav.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './Home/Home.component';
import { errorInterceptorProvide } from './_Services/ErrorEnterceptor';
import { AlertifyService } from './_Services/alertify.service';
import { MemberListComponent } from './Members/Member-list/Member-list.component';
import { MemberCardComponent } from './Members/MemberCard/MemberCard.component';
import { MemberDetailsComponent } from './Members/MemberDetails/MemberDetails.component';
import { TimeagoModule } from 'ngx-timeago';

import { MessagesComponent } from './Messages/Messages.component';
import { ListesComponent } from './Listes/Listes.component';
import { appRoutes } from './Routes';
import { AuthGuard } from './_Guards/auth.guard';
import { MemberListResolver } from './_Resolvers/MemberListResolver';
import { ListsResolver } from './_Resolvers/Lists.resolver';

import { MemberDetailResolver } from './_Resolvers/MemberDetailResolver';
import { MemberEditComponent } from './Members/MemberEdit/MemberEdit.component';
import { PhotoEditorComponent } from './Members/PhotoEditor/PhotoEditor.component';
import { MemberEditResolver } from './_Resolvers/MemberEditResolver';
import { PreventUnsavedChanges } from './_Guards/PreventUnsavedChanges.guard';
import { TimeAgoPipe } from 'time-ago-pipe';
import { MessageResolver } from './_Resolvers/MessageResolver';
import { MemberMessagesComponent } from './Members/MemberMessages/MemberMessages.component';


export function tokenGetter(){
  return localStorage.getItem('token');
}


@NgModule({
   declarations: [
      AppComponent,
      ValueComponent,
      NavComponent,
      RegisterComponent,
      HomeComponent,
      MemberMessagesComponent,
      MemberListComponent,
      MessagesComponent,
      ListesComponent,
      MemberCardComponent,
      MemberDetailsComponent,
      MemberEditComponent,
      PhotoEditorComponent,
      TimeAgoPipe
   ],
   imports: [
      HttpClientModule,
      BrowserModule,
      FormsModule,
      NgxGalleryModule,
      ReactiveFormsModule,
      FileUploadModule,
      DatepickerModule.forRoot(),
      PaginationModule.forRoot(),
      ButtonsModule.forRoot(),
      TabsModule.forRoot(),
      BsDropdownModule.forRoot(),
      BsDatepickerModule.forRoot(),
      TimeagoModule.forRoot(),
      RouterModule.forRoot(appRoutes),
      JwtModule.forRoot( {
            config: {
                tokenGetter: tokenGetter,
               whitelistedDomains :['localhost:44323'],
               blacklistedRoutes :['localhost:44323/api/Auth']
            }
         })
   ],
   providers: [
      AuthService,
      errorInterceptorProvide,
      AlertifyService,
      AuthGuard,
      MemberDetailResolver,
      MemberListResolver,
      MemberEditResolver,
      ListsResolver,
      MessageResolver,
      PreventUnsavedChanges
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule {

 }
