import {Routes} from '@angular/router';
import { HomeComponent } from './Home/Home.component';
import { MemberListComponent } from './Members/Member-list/Member-list.component';
import { MemberDetailsComponent } from './Members/MemberDetails/MemberDetails.component';
import { MemberEditComponent } from './Members/MemberEdit/MemberEdit.component';
import { MemberEditResolver } from './_Resolvers/MemberEditResolver';
import { MemberListResolver } from './_Resolvers/MemberListResolver';
import { ListsResolver } from './_Resolvers/Lists.resolver';
import { MessageResolver } from './_Resolvers/MessageResolver';
import { MemberDetailResolver } from './_Resolvers/MemberDetailResolver';
import { PreventUnsavedChanges } from './_Guards/PreventUnsavedChanges.guard';
import { MessagesComponent } from './Messages/Messages.component';
import { ListesComponent } from './Listes/Listes.component';
import { AuthGuard } from './_Guards/auth.guard';

export const appRoutes: Routes = [
    {path: 'home' , component: HomeComponent},
    {
        path : '',
        runGuardsAndResolvers : 'always',
        canActivate : [AuthGuard],
        children : [

        {path: 'members' , component: MemberListComponent , resolve : {users : MemberListResolver} },
          {path: 'members/:id' , component: MemberDetailsComponent , resolve : {user : MemberDetailResolver} },
            {path: 'member/edit' , component: MemberEditComponent , 
            resolve : {user : MemberEditResolver} ,
             canDeactivate: [PreventUnsavedChanges]},

            {path: 'messages' , component: MessagesComponent ,resolve : {messages : MessageResolver}},
            {path: 'listes' , component: ListesComponent , resolve:{users : ListsResolver}}
            
        ]
    },
    {path: '**', redirectTo : 'home', pathMatch : 'full'},
];
