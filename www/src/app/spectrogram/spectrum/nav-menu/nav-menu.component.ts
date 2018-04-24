import {Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import {MatSidenav} from '@angular/material';
import {AuthService} from "../../../../services/auth.service";
import {Spectrogram} from "../../core/runtime/spectrogram";
import Toolkit from "../../core/runtime/index";
const TKS:Spectrogram = Toolkit["spectrogram"];

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent implements OnInit, AfterViewInit{

  @ViewChild('sidenav') private sidenav: MatSidenav;

  settings: boolean = false;
  dataExport: boolean = false;

  constructor(public auth: AuthService) {}

  ngOnInit() {
    TKS.toggleGrid(false);
  }
  ngAfterViewInit() {
  }

  close(elem) {
    if (elem != null) {
      TKS.stop();
      TKS.stopRender();
      TKS.switchComponent(elem + 'Container');
    }
    this.sidenav.close().then();
  }
  onAuth() {
    this.auth.signInWithGoogle().then();
  }
  onLogOut() {
    this.auth.logout();
  }
  toggleSettings() {
    this.settings = !this.settings;
    TKS.toggleElem('settingsContainer', this.settings);
    this.sidenav.close().then();
  }
  toggleDataExport() {
    this.dataExport = !this.dataExport;
    TKS.toggleElem('exportContainer', this.dataExport);
    this.sidenav.close().then();
  }






}



