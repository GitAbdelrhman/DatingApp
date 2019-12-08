import {Injectable} from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_Services/User.service';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../_Models/Message';
import { AuthService } from '../_Services/Auth.service';

@Injectable()
export class MessageResolver  implements Resolve<Message[]> {
    pageNumber = 1;
    pageSize = 4;
    messageContianer = 'Unread';
    constructor(private userService: UserService , private route: Router ,private authService: AuthService , private alert: AlertifyService) {}
    resolve(route: ActivatedRouteSnapshot ): Observable<Message[]> {
        return this.userService.getMessages(this.authService.decodeToken.nameid , this.pageNumber , this.pageSize,this.messageContianer).pipe(
            catchError(error => {
                this.alert.error('problem retraving Messages');
                this.route.navigate(['/home']);
                return of(null);
            })
        );
    }
}