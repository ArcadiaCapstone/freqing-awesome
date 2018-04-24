import { Component } from '@angular/core';
import {Spectrogram} from "../../core/runtime/spectrogram";

import Toolkit from "../../core/runtime/index";
const TKS:Spectrogram = Toolkit["spectrogram"];
@Component({
  selector: 'app-specials',
  templateUrl: './specials.component.html',
  styleUrls: ['./specials.component.scss']
})
export class SpecialsComponent {

  isPlaying = true;
  draw = false;

  constructor() { }

  stop() {
    this.isPlaying = false;
    TKS.startRender();
    TKS.stop();
  }

}
