import {Component, ViewChild, OnInit, } from '@angular/core';
import {MatSidenav} from '@angular/material';
import {DataService} from '../data.service'
import Toolkit from "../core/runtime";

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss'],
})
export class NavMenuComponent implements OnInit {

  @ViewChild('sidenav') private sidenav: MatSidenav;

  elemId: string;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.elemId = message);
  }

  close(val) {
    this.sidenav.close().then();
    val !== null ? this.elemId = val + 'Container' : null;
    this.data.changeMessage(this.elemId);
    Toolkit.spectrogram.showMe(this.elemId);

  }




}



