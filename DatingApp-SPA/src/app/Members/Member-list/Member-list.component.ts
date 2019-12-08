import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_Services/User.service';
import { AlertifyService } from '../../_Services/alertify.service';
import { User } from '../../_Models/User';
import { Pagination } from '../../_Models/Pagination';
import { Route } from '@angular/router';
import { paginationResult } from 'src/app/_Models/Pagination';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-Member-list',
  templateUrl: './Member-list.component.html',
  styleUrls: ['./Member-list.component.css']
})
export class MemberListComponent implements OnInit {
users: User[];
user: User = JSON.parse(localStorage.getItem('user'));
genderList = [{value: 'male' , display: 'males' }, {value: 'female' , display: 'females'}];
userParams: any = {};
pagination: Pagination;
  constructor(private route: ActivatedRoute, private userService: UserService , private alert: AlertifyService ) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;

    });
    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge  = 99;
    this.userParams.orderBy = 'lastActive';
  }
resetFilters() {
  this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
  this.userParams.minAge = 18;
  this.userParams.maxAge  = 99;
}
  pageChanged(event: any ): void {
    this.pagination.currentPage  = event.page;
    this.loadUsers();
  }

loadUsers() {
this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage,this.userParams)
.subscribe((res: paginationResult<User[]>) => {
  this.users = res.result;
  this.pagination = res.pagination;
}, error => {
  this.alert.error(error);
});
}
}
