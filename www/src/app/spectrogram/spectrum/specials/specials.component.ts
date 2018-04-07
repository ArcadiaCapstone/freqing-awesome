import { Component, OnInit } from '@angular/core';
import Toolkit from "../../core/runtime";

@Component({
  selector: 'app-specials',
  templateUrl: './specials.component.html',
  styleUrls: ['./specials.component.scss']
})
export class SpecialsComponent implements OnInit {

  isPlaying = true;

  constructor() { }

  ngOnInit() {
  }
  play() {
    this.isPlaying = true;
    Toolkit.spectrogram.startRender();
  }

  pause() {
    this.isPlaying = false;
    Toolkit.spectrogram.stopRender();
    Toolkit.spectrogram.stop();
  }

  stop() {
    this.isPlaying = false;
    Toolkit.spectrogram.startRender();
    Toolkit.spectrogram.stop();
  }


}
