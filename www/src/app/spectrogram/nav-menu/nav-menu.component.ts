import { Component, ViewChild, OnInit } from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit {

  @ViewChild('sidenav') sidenav: MatSidenav;

  reason = '';

  constructor() { }



  ngOnInit() {
  }
  close(reason: string) {
    this.reason = reason;
    this.sidenav.close();
  }


}



