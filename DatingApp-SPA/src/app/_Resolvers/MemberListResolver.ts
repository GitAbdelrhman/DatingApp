import {Injectable} from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_Models/User';
import { UserService } from '../_Services/User.service';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberListResolver  implements Resolve<User[]> {
    pageNumber = 1;
    pageSize = 4;
    constructor(private userService: UserService , private route: Router , private alert: AlertifyService) {}
    resolve(route: ActivatedRouteSnapshot ): Observable<User[]> {
        return this.userService.getUsers(this.pageNumber , this.pageSize).pipe(
            catchError(error => {
                this.alert.error('problem retraving data');
                this.route.navigate(['/home']);
                return of(null);
            })
        );
    }
}