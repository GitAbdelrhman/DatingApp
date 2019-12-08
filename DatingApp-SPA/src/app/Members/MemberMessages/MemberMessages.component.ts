import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_Models/Message';
import { AuthService } from 'src/app/_Services/Auth.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { UserService } from 'src/app/_Services/User.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-MemberMessages',
  templateUrl: './MemberMessages.component.html',
  styleUrls: ['./MemberMessages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[];
  newMessage: any = {};
  constructor(private authService: AuthService, private alert: AlertifyService, private userService: UserService) { }

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    const currentUserId = +this.authService.decodeToken.nameid;
    this.userService.getMessagesThread(this.authService.decodeToken.nameid, this.recipientId)
      .pipe(tap(messages => {
        for (let i = 0; i < messages.length; i++) {
          if (messages[i].isRead === false && messages[i].recipientId === currentUserId) {
            this.userService.markAsRead(currentUserId, messages[i].id);
          }

        }
      })

      )
      .subscribe(
        messages => {
          this.messages = messages;
        }, error => {
          this.alert.error(error);
        }
      );
  }

  sendMessage() {
    this.newMessage.recipientId = this.recipientId;
    this.userService.sendMessage(this.authService.decodeToken.nameid, this.newMessage).subscribe(
      (message: Message) => {
        this.messages.unshift(message);
        this.newMessage.content = '';
      }, error => {
        this.alert.error(error);
      }
    )
  }

}
