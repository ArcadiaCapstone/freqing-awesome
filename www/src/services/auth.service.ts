import {AngularFireAuth} from "angularfire2/auth";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import * as firebase from 'firebase/app';
import { Observable} from "rxjs/Observable";

@Injectable()
export class AuthService {

  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  private photo: string;
  // private provider = new firebase.auth.GoogleAuthProvider();

  constructor(private _firebaseAuth: AngularFireAuth, private router: Router) {
    this.user = _firebaseAuth.authState;
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          console.log(this.userDetails);
        }
        else {
          this.userDetails = null;
        }
      }
    )
    // this.provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    // this.provider.setCustomParameters({
    //   'login_hint': 'user@example.com'
    // });
  }

  signInWithGoogle() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    )
  }

  getUserDetails() {
    return firebase.auth().currentUser.providerData.forEach((profile) => {
      this.photo = profile.photoURL;
    });
  }

  getUserPhoto() {
    return this.photo
  }

  isLoggedIn() {
    return this.userDetails != null;
  }
  logout() {
    this._firebaseAuth.auth.signOut()
      .then(() => this.router.navigate(['/']))
  }
}

