import { Component, OnInit } from '@angular/core';
import {notes} from "../core/runtime/notes";
import Toolkit from "../core/runtime/index";


@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent implements OnInit {

  i: number;
  sample: string;
  src: string;
  selectedType: string;
  typeIcon: string;
  loop: boolean;

  constructor() { }

  ngOnInit() {
    this.i = 0;
    this.selectedType = '';
    this.typeIcon = 'sin';
    this.loop = false;
    this.update();

  }
  setLoop(e) {
    this.loop = e.target.checked;
  }

  selectChangeHandler (event: any) {
    this.selectedType = event.target.value;
    this.update();
  }
  toggleUP() {
    this.i === notes.length ? this.i = 0 : this.i++;
    this.update();
  }
  toggleDown() {
    this.i === 0 ? this.i = notes.length : this.i--;
    this.update();
  }
  update() {
    this.src = 'bin/snd/' + notes[this.i].split(':')[1].toString() + this.selectedType + '.wav';
    this.sample = notes[this.i].split(':')[0].toString() + " " +
                  notes[this.i].split(':')[1].toString() + "Hz";
    this.selectedType === '' ? this.typeIcon = 'sin' : this.typeIcon = this.selectedType;
  }

  playSample() {
    (!this.loop) ? Toolkit.spectrogram.stop() : null;
    Toolkit.spectrogram.drawingMode = false;
    Toolkit.spectrogram.play(this.src);
    Toolkit.spectrogram.startRender();
  }
  stopSample() {
    Toolkit.spectrogram.startRender();
    Toolkit.spectrogram.stop();


  }
  pauseSample() {
    Toolkit.spectrogram.stop();
    Toolkit.spectrogram.stopRender();

  }
  log() {
    console.log("I: " + this.i);
    console.log("Sample: " + this.sample);
    console.log("SRC: " + this.src);
    console.log("TYPE: " + this.selectedType)
  }




}
