import {AfterViewInit, Component} from '@angular/core';
import Toolkit from "../core/runtime/index";
import {Spectrogram} from "../core/runtime/spectrogram";
const TKS:Spectrogram = Toolkit["spectrogram"];


@Component({
  selector: 'app-spectrum',
  templateUrl: './spectrum.component.html',
  styleUrls: ['./spectrum.component.scss']
})
export class SpectrumComponent implements AfterViewInit {

  constructor() { }

  ngAfterViewInit(): void {
    Toolkit.startScript();
  }
}
