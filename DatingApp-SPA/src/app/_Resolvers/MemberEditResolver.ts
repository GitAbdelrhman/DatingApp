import {Injectable} from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_Models/User';
import { UserService } from '../_Services/User.service';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_Services/Auth.service';

@Injectable()
export class MemberEditResolver  implements Resolve<User> {
    constructor(private userService: UserService , 
        private authService : AuthService, private route: Router , private alert: AlertifyService) {}
    resolve(route: ActivatedRouteSnapshot ): Observable<User> {
        return this.userService.getUser(this.authService.decodeToken.nameid).pipe(
            catchError(error => {
                this.alert.error('roblem retraving data');
                this.route.navigate(['/members']);
                return of(null);
            })
        );
    }
}