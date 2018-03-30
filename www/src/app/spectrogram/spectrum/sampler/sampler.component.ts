import { Component, OnInit } from '@angular/core';
import {notes} from "../../core/runtime/notes";
import Toolkit from "../../core/runtime/index";


@Component({
  selector: 'app-sampler',
  templateUrl: './sampler.component.html',
  styleUrls: ['./sampler.component.scss']
})
export class SamplerComponent implements OnInit {

  i: number;
  note: string;
  sampleSrc: string = "";
  selectedType: string;
  typeIcon: string;
  loop: false;

  constructor() { }

  ngOnInit() {
    this.i = 0;
    this.selectedType = '';
    this.typeIcon = '"../bin/icons/sin.svg"';
    this.loop = false;
    this.update();
  }

  prevSample() {
    this.i === 0 ? this.i = notes.length : this.i--;
    this.update();
  }

  playSample() {
    (!this.loop) ? Toolkit.spectrogram.stop() : null;
    Toolkit.spectrogram.drawingMode = false;
    Toolkit.spectrogram.play(this.sampleSrc);
    Toolkit.spectrogram.startRender();
    console.log('sampleSrc: ' + this.sampleSrc);
  }
  nextSample() {
    this.i === notes.length ? this.i = 0 : this.i++;
    this.update();
  }

  pauseSample() {
    Toolkit.spectrogram.stop();
    Toolkit.spectrogram.stopRender();
  }

  stopSample() {
    Toolkit.spectrogram.startRender();
    Toolkit.spectrogram.stop();
  }


  selectChangeHandler (event: any) {
    this.selectedType = event.target.value;
    this.update();
  }

  setLoop() {
    Toolkit.spectrogram.loop(this.loop);
  }

  update() {
    this.sampleSrc = 'bin/snd/' + notes[this.i].split(':')[1].toString() + this.selectedType + '.wav';
    this.selectedType === '' ? this.typeIcon = '../bin/icons/sin.svg' : this.typeIcon = "../bin/icons/" + this.selectedType + ".svg";
    this.note = notes[this.i].split(':')[0].toString() + " " +
                  notes[this.i].split(':')[1].toString() + "Hz";
  }

}
