import {AfterViewInit, Component, OnInit} from '@angular/core';
import Toolkit from "../core/runtime";
import {NavMenuComponent} from "./nav-menu/nav-menu.component";


@Component({
  selector: 'app-spectrum',
  templateUrl: './spectrum.component.html',
  styleUrls: ['./spectrum.component.scss']
})
export class SpectrumComponent implements OnInit,AfterViewInit {

  constructor(public nav: NavMenuComponent) { }

  ngOnInit() {
    Toolkit.spectrogram.toggleGrid(false);
  }

  ngAfterViewInit(): void {
    Toolkit.startScript();

  }
}
