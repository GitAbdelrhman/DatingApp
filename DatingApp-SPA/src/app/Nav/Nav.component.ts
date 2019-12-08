import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_Services/Auth.service';
import { AlertifyService } from '../_Services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-Nav',
  templateUrl: './Nav.component.html',
  styleUrls: ['./Nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
photoUrl: string;

  constructor(
    private authService: AuthService,
    private alert: AlertifyService,
    private route: Router
  ) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
   }
  login() {
    this.authService.login(this.model).subscribe(
      next => {
        this.alert.success('Login Success');
      },
      error => {
        this.alert.error(error);
      },
      () => {
        this.route.navigate(['/members']);
      }
    );
  }
  loggedin() {
    return this.authService.loggedin();
  }
  Logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodeToken = null;
    this.authService.currentUser = null;
    this.alert.message('Logged out');
    this.route.navigate(['/home']);
  }
}
