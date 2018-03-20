import {AfterViewInit, Component, OnInit} from '@angular/core';
import Toolkit from "../core/runtime";


@Component({
  selector: 'app-spectrum',
  templateUrl: './spectrum.component.html',
  styleUrls: ['./spectrum.component.scss']
})
export class SpectrumComponent implements OnInit,AfterViewInit {

  nestedSelector: string;

  constructor() { }

  ngOnInit() {
    console.log('nestedSelector: ' + this.nestedSelector);
  }

  ngAfterViewInit(): void {
    Toolkit.startScript();
  }

}
