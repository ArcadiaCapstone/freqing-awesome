import { Component, OnInit } from '@angular/core';
import Toolkit from "../core/runtime";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  grid: boolean;

  constructor() { }

  ngOnInit() {
    Toolkit.spectrogram.hideGrid();

  }
  setGrid(e) {
    this.grid = e.target.checked;
    this.update();
  }
  setFreqAnalysisType() {
    // Toolkit.spectrogram.stop();
    // Toolkit.spectrogram.init_(0);
  }
  update() {
    this.grid ? Toolkit.spectrogram.showGrid() : Toolkit.spectrogram.hideGrid();
    this.log();
  }

  log() {
    console.log("grid: " + this.grid);
  }


}
