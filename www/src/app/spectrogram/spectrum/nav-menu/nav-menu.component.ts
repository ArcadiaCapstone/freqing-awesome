import {Component, ViewChild, OnInit, } from '@angular/core';
import {MatSidenav} from '@angular/material';
import Toolkit from "../../core/runtime/index";
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent implements OnInit {

  @ViewChild('sidenav') private sidenav: MatSidenav;

  logged: boolean;
  photo: string;

  constructor(auth: AuthService) {
    this.logged = auth.isLoggedIn();
    this.photo = auth.getUserPhoto();
  }

  ngOnInit() {

  }

  close(elem) {
    if(elem !== null) {
      elem += 'Container';
      Toolkit.spectrogram.switchComponent(elem);
      // Toolkit.spectrogram.toggleElem(elem);
    }
    this.sidenav.close().then();
  }






}



