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

  disabled: false;
  invert: false;
  max: 100;
  min: 0;
  showTicks: false;
  step: 1;
  thumbLabel: false;
  value: 0;
  vertical: false;
  autoTicks: false;
  grid: false;
  dx: -180;
  dy: 170;
  dz: 90;

  constructor() { }

  ngOnInit() {

  }

  switchAnalysisType(n) {
    Toolkit.spectrogram.stop();
    Toolkit.spectrogram.init(n);
  }

  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }
  set tickInterval(v) {
    this._tickInterval = Number(v);
  }
  private _tickInterval = 1;

  toggleGrid() {
    Toolkit.spectrogram.toggleGrid(this.grid);
  }




}








