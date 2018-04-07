import { Component, OnInit } from '@angular/core';
import Toolkit from "../../core/runtime";


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
    Toolkit.spectrogram.dataPoints = [];
    Toolkit.spectrogram.isExporting = true;
  }
  finishExport() {
    this.isExporting = false;
    let data = Toolkit.spectrogram.recordRaw();
    Toolkit.spectrogram.stop();
    Toolkit.spectrogram.stopRender();
    for(let i=0; i < data.length; i++) {
      if (data[i] !== ',') {
        console.log(i + "\t" + data[i]);
      }
    }

  }

}
