import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  photo:any;
  profile: any;
  constructor(public auth: AuthService) {
    this.profile = this.auth.getUserPhoto();
    console.log(this.profile);
  }

  ngOnInit() {
  }

  onAuth() {
    this.auth.signInWithGoogle().then();
  }
  onLogOut() {
    this.auth.logout();
  }


}
