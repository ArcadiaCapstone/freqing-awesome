import {AngularFireAuth} from "angularfire2/auth";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import * as firebase from 'firebase/app';
import { Observable} from "rxjs/Observable";

@Injectable()
export class AuthService {

  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;
  public userEmail: string | null;
  public userName: string | null;
  public userPhoto: string | null;


  // private provider = new firebase.auth.GoogleAuthProvider();

  constructor(private _firebaseAuth: AngularFireAuth, private router: Router) {
    this.user = _firebaseAuth.authState;
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          console.log(this.userDetails);
          this.userEmail = this.userDetails.email;
          this.userName = this.userDetails.displayName;
          this.userPhoto = this.userDetails.photoURL;
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
    firebase.auth().currentUser.providerData.forEach((profile) => {
      this.userEmail = profile.email;
      this.userName = profile.displayName;
      this.userPhoto = profile.photoURL;
    });

  }



  isLoggedIn() {
    return this.userDetails != null;
  }
  logout() {
    this._firebaseAuth.auth.signOut()
      .then(() => this.router.navigate(['/']))
  }
}

