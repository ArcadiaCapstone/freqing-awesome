import {AnalyserView, Util} from "../toolkit";

declare const window:any;
declare const navigator:any;


class Player {
  public context: AudioContext;
  public mix;
  public bandpass;
  public filterGain;
  public analyser;
  public buffers;
  public loop;
  public playTimer;
  public osc: OscillatorNode;
  public input: any;
  public source: AudioBufferSourceNode;
  public stream;

  constructor() {
    let context = new AudioContext();

    let analyser = context.createAnalyser();
    analyser.fftSize = 2048 * 2 * 2;
    analyser.fftSize = (window.isMobile)? 2048 : 8192;
    analyser.fftSize = (window.isMobile)?1024 : 2048;
    analyser.smoothingTimeConstant = 0;

    // Create a mix.
    let mix = context.createGain();

    // Create a bandpass filter.
    let bandpass = context.createBiquadFilter();
    bandpass.Q.value = 10;
    bandpass.type = 'bandpass';

    let filterGain = context.createGain();
    filterGain.gain.value = 1;

    // Connect audio processing graph
    mix.connect(analyser);
    analyser.connect(filterGain);
    filterGain.connect(context.destination);

    this.context = context;
    this.mix = mix;
    this.bandpass = bandpass;
    this.filterGain = filterGain;
    this.analyser = analyser;

    this.buffers = {};
  }



  getAnalyserNode () {
    return this.analyser;
  };

  setBandpassFrequency(freq, fileName = 'bin/snd/empty.mp3') {
    if (freq === null) {
      console.log('Removing bandpass filter');
      // Remove the effect of the bandpass filter completely, connecting the mix to the analyser directly.
      this.mix.disconnect();
      this.mix.connect(this.analyser);
    } else {
      // console.log('Setting bandpass frequency to %d Hz', freq);
      // Only set the frequency if it's specified, otherwise use the old one.
      this.bandpass.frequency.value = freq;
      this.mix.disconnect();
      this.mix.connect(this.bandpass);
      // bandpass is connected to filterGain.
      this.filterGain.connect(this.analyser);
    }

    this.loadTrackSrc(fileName)
  };

  loadTrackSrc(file='bin/snd/empty.mp3') {
    Util.loadTrackSrc(this.context, file, function(buffer) {
      let source = this.createSource_(buffer, true);
      console.log('source: ', source);
      source.loop = false;
      source.start(0);
    }.bind(this));
  }
  loadSampleSrc(file='bin/snd/empty.mp3') {
    Util.loadSampleSrc(this.context, file, function(buffer) {
      let source = this.createSource_(buffer, true);
      console.log('source: ', source);
      source.loop = false;
      source.start(0);
    }.bind(this));
  }

  playTone (freq) {
    if (!this.osc) {
      this.osc = this.context.createOscillator();
      this.osc.connect(this.mix);
      this.osc.type = 'sine';
      this.osc.start(0);
    }
    this.osc.frequency.value = freq;
    this.filterGain.gain.value = .2;
    console.log("playtone");

  };

  stopTone () {
    this.osc.stop(0);
    this.osc = null;
  };

  playSample (src) {
    // Stop all of the mic stuff.
    this.filterGain.gain.value = 1;
    if (this.input) {
      this.input.disconnect();
      this.input = null;
      return;
    }

    if (this.buffers[src]) {
      // $('#loadingSound').fadeIn(100).delay(1000).fadeOut(500);
      this.playHelper_(src);
      return;
    }
    console.log('playSrc = ', src);
    // $('#loadingSound').fadeIn(100);
    Util.loadSampleSrc(this.context, src, function(buffer) {
      this.buffers[src] = buffer;
      this.playHelper_(src);
      // $('#loadingSound').delay(500).fadeOut(500);
    }.bind(this));
    console.log('playSrc = ', src);
  };

  playSrc (src) {
    // Stop all of the mic stuff.
    this.filterGain.gain.value = 1;
    if (this.input) {
      this.input.disconnect();
      this.input = null;
      return;
    }

    if (this.buffers[src]) {
      // $('#loadingSound').fadeIn(100).delay(1000).fadeOut(500);
      this.playHelper_(src);
      return;
    }
    console.log('playSrc = ', src);
    // $('#loadingSound').fadeIn(100);
    Util.loadTrackSrc(this.context, src, function(buffer) {
      this.buffers[src] = buffer;
      this.playHelper_(src);
      // $('#loadingSound').delay(500).fadeOut(500);
    }.bind(this));
    console.log('playSrc = ', src);
  };

  playHelper_ (src) {
    let buffer = this.buffers[src];
    this.source = this.createSource_(buffer, true);
    this.source.start(0);

    if (!this.loop) {
      this.playTimer = setTimeout(function() {
        this.stop();
      }.bind(this), buffer.duration * 2000);
    }
  };

  live () {
    if(window.isIOS){
      window.parent.postMessage('error2','*');
      console.log("cant use mic on ios");
    }else{
      if (this.input) {
        this.input.disconnect();
        this.input = null;
        return;
      }

      navigator.getUserMedia = (navigator.getUserMedia
        || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
      navigator.getUserMedia({audio: true},
        this.onStream_.bind(this),
        this.onStreamError_.bind(this));
      this.filterGain.gain.value = 0;
    }


  };

  onStream_ (stream) {
    let input = this.context.createMediaStreamSource(stream);
    input.connect(this.mix);
    this.input = input;
    this.stream = stream;
  };

  onStreamError_ (e) {
    // TODO: Error handling.
  };

  setLoop (loop) {
    this.loop = loop;
  };

  createSource_ (buffer, loop) {
    let source = this.context.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    source.connect(this.mix);
    return source;
  };

  setMicrophoneInput () {
    // TODO: Implement me!
  };

  stop () {
    if (this.source) {
      this.source.stop(0);
      this.source = null;
      clearTimeout(this.playTimer);
      this.playTimer = null;

    }
    if (this.input) {
      this.input.disconnect();
      this.input = null;

    }
  };
}

export default Player;

