import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_Models/User';
import { UserService } from 'src/app/_Services/User.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { AuthService } from 'src/app/_Services/Auth.service';

@Component({
  selector: 'app-MemberCard',
  templateUrl: './MemberCard.component.html',
  styleUrls: ['./MemberCard.component.css']
})
export class MemberCardComponent implements OnInit {
@Input() user: User;
  constructor(private userService: UserService , private alert: AlertifyService, private autService: AuthService) { }

  ngOnInit() {
  }

  sendLike (id: number) {
    this.userService.sendLike(this.autService.decodeToken.nameid, id).subscribe(data=>
    {
      this.alert.success('You have liked: ' + this.user.knownAs);

    }, error =>{
      this.alert.error('You already liked this user'+ this.user.knownAs);
    }
    )
  }

}
