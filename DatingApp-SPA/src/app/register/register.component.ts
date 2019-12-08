import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_Services/Auth.service';
import { AlertifyService } from '../_Services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { User } from '../_Models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  @Input() valuesFromHome: any;
  @Output() cancelRegiser = new EventEmitter();
  registerForm: FormGroup;
  bsConfig: Partial<BsDatepickerConfig>;
  model: any = {};
  user: User;

  constructor(private router: Router, private authService: AuthService, private alert: AlertifyService, private fb: FormBuilder) { }

  ngOnInit() {
    this.bsConfig = {
      containerClass: 'theme0-red'
    },
      this.createRegisterForm();
    // this.registerForm = new FormGroup({
    //   userName: new FormControl('' , Validators.required),
    //   password: new FormControl('', [Validators.required , Validators.minLength(4) , Validators.maxLength(8)]),
    //   confirmPassword: new FormControl(),
    // }, this.passwordMatchValidator);
  }

  createRegisterForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      userName: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(e: FormGroup) {
    return e.get('password').value === e.get('confirmPassword').value ? null : { 'mismatch' : true };
  }

  register() {
    debugger;
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authService.register(this.user).subscribe(() => {
        this.alert.success('User Added Success ');
      }, error => {
        this.alert.error('There is error');
      }, () => {
        this.authService.login(this.user).subscribe(() => {
          this.router.navigate(['/members']);
        });
      });
    }
  }

  cancel() {
    this.cancelRegiser.emit(false);
    this.alert.warning('Cancelled');
  }
}
