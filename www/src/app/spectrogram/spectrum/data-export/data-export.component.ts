import { Component, OnInit } from '@angular/core';
import {Spectrogram} from "../../core/runtime/spectrogram";
import Toolkit from "../../core/runtime/index";
const TKS:Spectrogram = Toolkit["spectrogram"];

@Component({
  selector: 'app-data-export',
  templateUrl: './data-export.component.html',
  styleUrls: ['./data-export.component.scss']
})
export class DataExportComponent implements OnInit {

  isExporting: boolean = false;
  fs: any;

  constructor() { }

  ngOnInit() {
  }

  beginExport() {
    this.isExporting = true;
    TKS.dataPoints = [];
    TKS.isExporting = true;
  }
  finishExport() {
    this.isExporting = false;
    let data = TKS.recordRaw();
    TKS.stop();
    TKS.stopRender();
    for(let i=0; i < data.length; i++) {
      if (data[i] !== ',') {
        console.log(i + "\t" + data[i]);
      }
    }

  }

}
