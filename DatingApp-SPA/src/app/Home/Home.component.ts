import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css']
})
export class HomeComponent implements OnInit {

  registerMode = false;
  constructor(private http: HttpClient) { }
  Values: any;

  ngOnInit() {
    this.getValues();
  }


  getValues() {
    this.http.get('https://localhost:44323/api/values').subscribe(response => {
      this.Values = response;
    }, error => {
      console.log(error);
    });
  }


  registerToggle() {
    this.registerMode = true;
  }

  cancelRegisterMode(registerMode: boolean) {
    this.registerMode = registerMode;
  }
}
