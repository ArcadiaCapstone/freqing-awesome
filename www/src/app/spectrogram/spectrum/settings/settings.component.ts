import Toolkit from "../../core/runtime/index";
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class SettingsComponent implements OnInit {

  // 0 = 2D, 2 = 3D 3 = WaveForm
  analysisType: number = 2;

  grid = false;
  disabled = false;
  invert = true;
  showTicks = false;
  thumbLabel = true;
  vertical = true;
  autoTicks = false;
  step: 1;
  dx: number;
  dy: number;
  dz: number;

  constructor() { }

  ngOnInit() {

  }

  changeType(n) {
    Toolkit.spectrogram.stop();
    this.analysisType = n;
    if (n !== 2) {
      this.grid = false;
      this.toggleGrid();
    }
    Toolkit.spectrogram.switchAnalysisType(this.analysisType, 'bin/snd/empty.mp3');
  }
  toggleGrid() {
    Toolkit.spectrogram.toggleGrid(this.grid);
  }
  rotationX() {
    Toolkit.spectrogram.rotateX(this.dx);
    this.grid = false;
    Toolkit.spectrogram.toggleGrid(this.grid);
  }
  rotationY() {
    Toolkit.spectrogram.rotateY(this.dy);
    this.grid = false;
    Toolkit.spectrogram.toggleGrid(this.grid);
  }
  rotationZ() {
    Toolkit.spectrogram.rotateZ(this.dz);
    this.grid = false;
    Toolkit.spectrogram.toggleGrid(this.grid);
  }
  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }
  set tickInterval(v) {
    this._tickInterval = Number(v);
  }
  private _tickInterval = 1;






}








