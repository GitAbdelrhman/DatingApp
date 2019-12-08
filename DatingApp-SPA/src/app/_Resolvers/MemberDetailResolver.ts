import {Injectable} from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_Models/User';
import { UserService } from '../_Services/User.service';
import { AlertifyService } from '../_Services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberDetailResolver  implements Resolve<User> {
    constructor(private userService: UserService , private route: Router , private alert: AlertifyService) {}
    resolve(route: ActivatedRouteSnapshot ): Observable<User> {
        return this.userService.getUser(route.params['id']).pipe(
            catchError(error => {
                this.alert.error('roblem retraving data');
                this.route.navigate(['/members']);
                return of(null);
            })
        );
    }
}