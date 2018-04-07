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

  photo: string;
  settings: boolean = false;
  dataExport: boolean = false;

  constructor(public auth: AuthService) {
  }

  ngOnInit() {

  }

  close(elem) {
    if (elem != null) {
      Toolkit.spectrogram.stop();
      Toolkit.spectrogram.stopRender();
      Toolkit.spectrogram.switchComponent(elem + 'Container');
    }
    this.sidenav.close().then();
  }

  toggleSettings() {
    this.settings = !this.settings;
    Toolkit.spectrogram.toggleElem('settingsContainer', this.settings);
    this.sidenav.close().then();
  }
  toggleDataExport() {
    this.dataExport = !this.dataExport;
    Toolkit.spectrogram.toggleElem('exportContainer', this.dataExport);
    this.sidenav.close().then();
  }






}



