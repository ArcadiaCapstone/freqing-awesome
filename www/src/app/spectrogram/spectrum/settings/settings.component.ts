import Toolkit from "../../core/runtime/index";
import {
  Component,
  ViewEncapsulation
} from '@angular/core';
import {Spectrogram} from "../../core/runtime/spectrogram";

const TKS:Spectrogram = Toolkit["spectrogram"];

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
  preserveWhitespaces: false
})
export class SettingsComponent {

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


  changeType(n) {
    TKS.stop();
    this.analysisType = n;
    if (n !== 2) {
      this.grid = false;
      this.toggleGrid();
    }
    TKS.switchAnalysisType(this.analysisType);
  }
  toggleGrid() {
    TKS.toggleGrid(this.grid);
  }
  rotationX() {
    TKS.rotateX(this.dx);
    this.grid = false;
    TKS.toggleGrid(this.grid);
  }
  rotationY() {
    TKS.rotateY(this.dy);
    this.grid = false;
    TKS.toggleGrid(this.grid);
  }
  rotationZ() {
    TKS.rotateZ(this.dz);
    this.grid = false;
    TKS.toggleGrid(this.grid);
  }
  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }

  private _tickInterval = 1;






}








