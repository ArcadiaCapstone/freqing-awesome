import { Component, OnInit } from '@angular/core';
import {notes} from "../../core/runtime/notes";
import Toolkit from "../../core/runtime/index";
import {FormControl} from "@angular/forms";


@Component({
  selector: 'app-sampler',
  templateUrl: './sampler.component.html',
  styleUrls: ['./sampler.component.scss']
})
export class SamplerComponent implements OnInit {

  i: number;
  note: string;
  playing = false;
  sampleSrc: string = "";
  // selectedType: string;
  // typeIcon: string;
  waveType = '';
  waveTypeIcon = '../bin/icons/sin.svg';


  constructor() { }

  ngOnInit() {
    this.i = 0;
    // this.selectedType = '';
    // this.typeIcon = '"../bin/icons/sin.svg"';
    this.update();

  }

  prevSample() {
    this.playing = false;
    this.i === 0 ? this.i = notes.length : this.i--;
    this.update();
  }

  playSample() {
    this.playing = true;
    // Toolkit.spectrogram.drawingMode = false;
    Toolkit.spectrogram.play(this.sampleSrc);
    Toolkit.spectrogram.startRender();
  }
  nextSample() {
    this.playing = false;
    this.i === notes.length ? this.i = 0 : this.i++;
    this.update();
  }

  pauseSample() {
    this.playing = false;
    Toolkit.spectrogram.stopRender();
    Toolkit.spectrogram.stop();
  }

  stopSample() {
    this.playing = false;
    Toolkit.spectrogram.startRender();
    Toolkit.spectrogram.stop();
  }


  // selectChangeHandler (event: any) {
  //   this.selectedType = event.target.value;
  //   this.update();
  // }

  update() {
    // this.sampleSrc = 'bin/snd/' + notes[this.i].split(':')[1].toString() + this.selectedType + '.wav';
    // this.selectedType === '' ? this.typeIcon = '../bin/icons/sin.svg' : this.typeIcon = "../bin/icons/" + this.selectedType + ".svg";
    this.waveType === '' ? this.waveTypeIcon = '../bin/icons/sin.svg' : this.waveTypeIcon = "../bin/icons/" + this.waveType + ".svg";
    this.sampleSrc = 'bin/snd/' + notes[this.i].split(':')[1].toString() + this.waveType + '.wav';
    this.note = notes[this.i].split(':')[0].toString() + " " +
                notes[this.i].split(':')[1].toString() + "Hz";
  }

}
