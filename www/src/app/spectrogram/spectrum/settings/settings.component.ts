import { Component, OnInit } from '@angular/core';
import Toolkit from "../../core/runtime/index";

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
  switchAnalysisType(n) {
    Toolkit.spectrogram.stop();
    Toolkit.spectrogram.init(n);
  }
  update() {
    this.grid ? Toolkit.spectrogram.showGrid() : Toolkit.spectrogram.hideGrid();
    this.log();
  }

  log() {
    console.log("grid: " + this.grid);
  }


}
