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
  note: string;
  src: string = "";
  selectedType: string;
  typeIcon: string;
  loop: boolean;

  constructor() { }

  ngOnInit() {
    this.i = 0;
    this.selectedType = '';
    this.typeIcon = '"../bin/icons/sin.svg"';
    this.loop = false;
    this.update();
  }

  toggleDown() {
    this.i === 0 ? this.i = notes.length : this.i--;
    this.update();
  }

  toggleUP() {
    this.i === notes.length ? this.i = 0 : this.i++;
    this.update();
  }

  selectChangeHandler (event: any) {
    this.selectedType = event.target.value;
    this.update();
  }

  setLoop(e) {
    this.loop = e.target.checked;
  }

  playSample(which=null) {
    (!this.loop) ? Toolkit.spectrogram.stop() : null;
    Toolkit.spectrogram.drawingMode = false;
    Toolkit.spectrogram.startRender();
    Toolkit.spectrogram.play(this.src);
  }

  pauseSample(which=null) {
    Toolkit.spectrogram.stop();
    Toolkit.spectrogram.stopRender();

  }

  stopSample(which=null) {
    Toolkit.spectrogram.startRender();
    Toolkit.spectrogram.stop();
  }
  update() {
    this.src = 'bin/snd/' + notes[this.i].split(':')[1].toString() + this.selectedType + '.wav';
    this.selectedType === '' ? this.typeIcon = '../bin/icons/sin.svg' : this.typeIcon = "../bin/icons/" + this.selectedType + ".svg";
    this.note = notes[this.i].split(':')[0].toString() + " " +
                  notes[this.i].split(':')[1].toString() + "Hz";
  }

}
