import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_Models/User';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  baseUrl = environment.baseUrl + 'Auth/';
  jwtHelper = new JwtHelperService();
  PhotoUrl = new BehaviorSubject<string>('../../assets/16.1 user.png.png');
  currentPhotoUrl = this.PhotoUrl.asObservable();
  decodeToken: any;
  currentUser: User;

  constructor(private http: HttpClient) { }
  changeMemberPhoto(photoUrl: string) {
    this.PhotoUrl.next(photoUrl);
  }

  login(model: any) {
    return this.http.post(this.baseUrl + 'Login', model)
      .pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            localStorage.setItem('token', user.token);
            localStorage.setItem('user', JSON.stringify(user.user));
            this.decodeToken = this.jwtHelper.decodeToken(user.token);
            this.currentUser = user.user;
            this.changeMemberPhoto(this.currentUser.photoUrl);
          }
        })
      );
  }

  register(user: User) {
    return this.http.post(this.baseUrl + 'Register', user);
  }

  loggedin() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}
