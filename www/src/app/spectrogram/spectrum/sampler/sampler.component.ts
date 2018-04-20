import { Component, OnInit } from '@angular/core';
import {notes} from "./notes";
import {Spectrogram} from "../../core/runtime/spectrogram";

import Toolkit from "../../core/runtime/index";
const TKS:Spectrogram = Toolkit["spectrogram"];

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
  waveType = '';
  waveTypeIcon = '../bin/icons/sin.svg';
  
  constructor() { }

  ngOnInit() {
    this.i = 0;
    this.update();
  }

  prevSample() {
    this.playing = false;
    this.i === 0 ? this.i = notes.length : this.i--;
    this.update();
  }

  playSample() {
    TKS.stop();
    this.playing = true;
    TKS.play(this.sampleSrc);
    TKS.startRender();
  }
  nextSample() {
    this.playing = false;
    this.i === notes.length ? this.i = 0 : this.i++;
    this.update();
  }

  pauseSample() {
    this.playing = false;
    TKS.stopRender();
    TKS.stop();
  }

  stopSample() {
    this.playing = false;
    TKS.startRender();
    TKS.stop();
  }

  update() {
    this.waveType === '' ? this.waveTypeIcon = '../bin/icons/sin.svg' : this.waveTypeIcon = "../bin/icons/" + this.waveType + ".svg";
    this.sampleSrc = notes[this.i].split(':')[1].toString() + this.waveType + '.wav';
    this.note = notes[this.i].split(':')[0].toString() + " " +
                notes[this.i].split(':')[1].toString() + "Hz";
  }

}
