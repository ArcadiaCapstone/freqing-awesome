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

  elemId: string;
  logged: boolean;
  photo: string;

  public toggle: boolean;
  public playlist: boolean;
  public settings: boolean;
  public specials: boolean;
  public authcomp: boolean;


  constructor(auth: AuthService) {
    this.logged = auth.isLoggedIn();
    this.photo = auth.getUserPhoto();
  }

  ngOnInit() {
    this.toggle = false;
    this.playlist = false;
    this.settings = false;
    this.specials = false;
    this.authcomp = false;
  }

  close(val) {
    this.sidenav.close().then();
    val !== null ? this.elemId = val + 'Container' : null;
    Toolkit.spectrogram.switchComponent(this.elemId);

  }






}



