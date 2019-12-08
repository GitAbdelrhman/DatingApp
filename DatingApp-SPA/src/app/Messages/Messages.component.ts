import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_Services/Auth.service';
import { AlertifyService } from '../_Services/alertify.service';
import { UserService } from '../_Services/User.service';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../_Models/Message';
import { Pagination, paginationResult } from '../_Models/Pagination';

@Component({
  selector: 'app-Messages',
  templateUrl: './Messages.component.html',
  styleUrls: ['./Messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';
  constructor(private authService: AuthService, private alert: AlertifyService, private userService: UserService, private route: ActivatedRoute) { }


  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
      debugger;
    });
  }
  loadMessages() {
    this.userService.getMessages(
      this.authService.decodeToken.nameid,
      this.pagination.currentPage,
      this.pagination.itemsPerPage,
      this.messageContainer)
      .subscribe((
        res: paginationResult<Message[]>) => {
        this.messages = res.result;
        this.pagination = res.pagination;
        this.alert.success('Mesages loaded');
      }, error => {
        this.alert.error(error);
      }
      );
  }
  deleteMessage (id: number){
    this.alert.confirm('Are you sure you want to delete message', ()=>{
      this.userService.deleteMessage(this.authService.decodeToken.nameid, id).subscribe(()=>{
        this.messages.splice(this.messages.findIndex(f=>f.id === id),1);
        this.alert.success('Message has been deleted');
      },error =>{
        this.alert.error(error);
      });
    });
  }
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }
}
