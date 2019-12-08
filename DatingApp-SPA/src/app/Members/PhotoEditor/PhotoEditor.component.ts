import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_Models/Photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_Services/Auth.service';
import { UserService } from 'src/app/_Services/User.service';
import { AlertifyService } from 'src/app/_Services/alertify.service';

@Component({
  selector: 'app-PhotoEditor',
  templateUrl: './PhotoEditor.component.html',
  styleUrls: ['./PhotoEditor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();
  baseUrl = environment.baseUrl;
  currentMainPhoto: Photo;

  public uploader: FileUploader;
  public hasBaseDropZoneOver = false;
  constructor(private authService: AuthService , private userService: UserService , private alert: AlertifyService ) { }

  ngOnInit() {
    this.InitializeUploader();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
setMainPhoto(photo: Photo ) {
  this.userService.SetPhotoMain(this.authService.decodeToken.nameid, photo.id).subscribe (() => {
  this.alert.success('Photo Set Success');
  this.currentMainPhoto = this.photos.filter(p=>p.isMain === true)[0];
  this.currentMainPhoto.isMain = false;
  photo.isMain  = true;
  this.authService.changeMemberPhoto(photo.url);
  this.authService.currentUser.photoUrl  = photo.url;
  localStorage.setItem('user', JSON.stringify(this.authService.currentUser)); 
  // this.getMemberPhotoChange.emit(photo.url);
  }, error => {
    this.alert.error(error);
  });
}


deletePhoto(id : number){
  this.alert.confirm('Are you sure you want to delete this photo?' ,() => {
    debugger;

    this.userService.deletePhto(this.authService.decodeToken.nameid ,id ).subscribe(() => {
      this.photos.splice(this.photos.findIndex(p => p.id == id ), 1);
      this.alert.success('Photo has been Deleted');

    }, error => {
      this.alert.error('can not delete photo')
    });
  });
}

  InitializeUploader() {
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authService.decodeToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });
    this.uploader.onAfterAddingFile = (File) => { File.withCredentials = false; };
    this.uploader.onSuccessItem = (item, resopnse, status, headers) => {
      if (resopnse) {
        const res: Photo = JSON.parse(resopnse);
        const photo = {
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          describtion: res.describtion,
          isMain: res.isMain

        };
        this.photos.push(photo);
        if(photo.isMain){
          this.authService.changeMemberPhoto(photo.url);
          this.authService.currentUser.photoUrl  = photo.url;
          localStorage.setItem('user', JSON.stringify(this.authService.currentUser)); 
        }
      }
    };
  }
}
