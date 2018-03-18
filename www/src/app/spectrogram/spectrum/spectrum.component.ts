import {AfterViewInit, Component, OnInit} from '@angular/core';
import Toolkit from "../core/runtime";
import {DataService} from "../data.service";

@Component({
  selector: 'app-spectrum',
  templateUrl: './spectrum.component.html',
  styleUrls: ['./spectrum.component.scss']
})
export class SpectrumComponent implements OnInit,AfterViewInit {

  nestedSelector: string;

  constructor(private data: DataService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.nestedSelector = message);
    console.log('nestedSelector: ' + this.nestedSelector);
  }

  ngAfterViewInit(): void {
    Toolkit.startScript();
  }

}
