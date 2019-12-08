import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_Models/User';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_Services/User.service';
import { AuthService } from 'src/app/_Services/Auth.service';

@Component({
  selector: 'app-MemberEdit',
  templateUrl: './MemberEdit.component.html',
  styleUrls: ['./MemberEdit.component.css']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm', { static: false }) editForm: NgForm;
  user: User;
  photoUrl :string;
  @HostListener('window:beforeunload', ['$event'])
  unLoadNotification($event: any) {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private alert: AlertifyService,
    private userService: UserService,
    private authService: AuthService
  ) { }
  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data["user"];
      this.user.photoUrl =  this.user.photoUrl;

    });
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
  }
  updateMainPhoto(photoUrl){
this.user.photoUrl = photoUrl;
  }
  updateUser() {
    this.userService
      .updateUser(this.authService.decodeToken.nameid, this.user)
      .subscribe(
        next => {
          this.alert.success('Profile Updaed Successfully');
          this.editForm.reset(this.user);
        },
        error => {
          this.alert.error(error);
        }
      );
  }
}
