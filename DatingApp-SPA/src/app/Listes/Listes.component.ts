import { Component, OnInit } from '@angular/core';
import { User } from '../_Models/User';
import { Pagination, paginationResult } from '../_Models/Pagination';
import { UserService } from '../_Services/User.service';
import { AlertifyService } from '../_Services/alertify.service';
import { AuthService } from '../_Services/Auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-Listes',
  templateUrl: './Listes.component.html',
  styleUrls: ['./Listes.component.css']
})
export class ListesComponent implements OnInit {
users : User[];
pagination : Pagination;
likesParam: string;
  constructor(private userService: UserService,
     private alert: AlertifyService,
      private autService : AuthService ,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.likesParam = 'likers';
  }
  pageChanged(event: any ): void {
    this.pagination.currentPage  = event.page;
    this.loadUsers();
  }

loadUsers() {
this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage,null,this.likesParam)
.subscribe((res: paginationResult<User[]>) => {
  this.users = res.result;
  this.pagination = res.pagination;
}, error => {
  this.alert.error(error);
});
}
}
