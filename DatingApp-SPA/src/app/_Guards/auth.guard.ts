import { Injectable } from '@angular/core';
import { CanActivate, Route, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_Services/Auth.service';
import { AlertifyService } from '../_Services/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private autService: AuthService , private route: Router , private alert: AlertifyService) {

  }
  canActivate(): boolean {
    if (this.autService.loggedin()) {

      return true;
    }
    this.alert.error('you shall not pass !!!!');
    this.route.navigate(['/home']);
    return false;
  }
}
