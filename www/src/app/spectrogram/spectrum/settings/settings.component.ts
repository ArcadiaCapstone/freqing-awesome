import {
  Component,
  ViewEncapsulation
} from '@angular/core';
import Toolkit from "../../core/runtime/index";
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
  x:number= 0;
  y:number= 0;
  z:number= 0;
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
    this.x == 270 ? TKS.rotateX(this.x=0) : TKS.rotateX(this.x+=90);
    this.grid = false;
    TKS.toggleGrid(this.grid);
  }
  rotationY() {
    this.y == 270 ? TKS.rotateY(this.y=0) : TKS.rotateY(this.y+=90);
    this.grid = false;
    TKS.toggleGrid(this.grid);
  }
  rotationZ() {
    this.z == 270 ? TKS.rotateZ(this.z=0) : TKS.rotateZ(this.z+=90);
    this.grid = false;
    TKS.toggleGrid(this.grid);
  }

}








