import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/_Services/User.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_Models/User';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-MemberDetails',
  templateUrl: './MemberDetails.component.html',
  styleUrls: ['./MemberDetails.component.css']
})
export class MemberDetailsComponent implements OnInit {
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;
  user: User;
  galleryOption: NgxGalleryOptions[];
  galleryImage: NgxGalleryImage[];
  constructor(private userService: UserService, private alert: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
    // this.loadUser();
    let param1 = this.route.snapshot.queryParams["tab"];
    this.memberTabs.tabs[param1 > 0 ? param1 : 0].active = true;

    // this.route.queryParams.subscribe(params => {
    //   const tab = params['tab'];
    //   this.memberTabs.tabs[tab > 0 ? tab : 0 ].active = true;
    //   console.log(tab);
    // });



    this.galleryOption = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];
    this.galleryImage = this.getImages();

  }
  selectTab(tabId: number) {
    this.memberTabs.tabs[tabId].active = true;
  }
  getImages() {
    const imageUrls = [];
    for (let i = 0; i < this.user.photos.length; i++) {
      imageUrls.push({
        small: this.user.photos[i].url,
        medium: this.user.photos[i].url,
        big: this.user.photos[i].url,
        describtion: this.user.photos[i].describtion,
      });
    }
    return imageUrls;
  }

  // loadUser() {
  //   this.userService.getUser(+this.route.snapshot.params['id']).subscribe(
  //     (user: User) => {
  //       this.user = user;
  //     }, error => {
  //       this.alert.error(error);
  //     });
  // }
}
