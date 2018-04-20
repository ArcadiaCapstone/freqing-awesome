// import Player from "./player";

export interface Spectrogram {
  rotateX: (x:number) => void;
  rotateY: (y:number) => void;
  rotateZ: (z:number) => void;
  toggleGrid: (grid:boolean) => void;
  switchAnalysisType: (type:number) => void;
  play: (src:string) => void;
  stop: () => void;
  stopRender: () => void;
  startRender: () => void;
  switchComponent: (comp:any) => void;
  toggleElem: (elem:any, visible:boolean) => void;
  attached: () => void;
}


/**
  class Spectrogram {

  private player: Player;
  private analyserView: any;
  private canvas: any;
  private isRendering: boolean;
  private prevX: number = 0;
  private cxRot: number = 90;
  private src: any;
  private drawingMode: boolean = false;
  private x: -180;
  private y: -90;
  private z: 90;


  handleTrack(e) {
    switch (e.type) {
      case 'mousedown':
      case 'touchstart':
        // START: MOUSEDOWN ---------------------------------------------
        this.prevX = Number(e.pageX) || Number(e.originalEvent.touches[0].pageX);

        $(e.currentTarget).on('mousemove', this.handleTrack);
        $(e.currentTarget).on('touchmove', this.handleTrack);

        if (this.drawingMode === false) {
          break;
        }

        let freq = this.yToFreq(Number(e.pageY) || Number(e.originalEvent.touches[0].pageY));
        console.log('isPlaying()= ' + this.isPlaying());
        if (this.isPlaying()) {
          this.player.setBandpassFrequency(freq);
        } else {
          this.player.playTone(freq);
        }
        break;

      case 'mousemove' :
      case 'touchmove' :
        // TRACK --------------------------------------------------------
        let ddx = (Number(e.pageX) || Number(e.originalEvent.touches[0].pageX)) - this.prevX;
        this.prevX = Number(e.pageX) || Number(e.originalEvent.touches[0].pageX);
        if (this.drawingMode) {
          let y = Number(e.pageY) || Number(e.originalEvent.touches[0].pageY);
          let freq1 = this.yToFreq(y);
          // console.log('%f px maps to %f Hz', y, freq);

          if (this.isPlaying()) {
            this.player.setBandpassFrequency(freq1);
          } else {
            this.player.playTone(freq1);
          }

        } else if (this.isPlaying()) {
          this.cxRot += (ddx * .2);

          if (this.cxRot < 0) {
            this.cxRot = 0;
          } else if (this.cxRot > 90) {
            this.cxRot = 90;
          }
        }
        break;
      case 'mouseup' :
      case 'touchend':
        // END: MOUSEUP -------------------------------------------------
        $(e.currentTarget).off('mousemove', this.handleTrack);
        $(e.currentTarget).off('touchmove', this.handleTrack);
        if (this.drawingMode === false) {
          return false;
        }
        if (this.isPlaying()) {
          this.player.setBandpassFrequency(null);
        } else {
          this.player.stopTone();
        }
        return false;
    }
  }

  attached() {
    console.log('spectrogram-3d attached');
    Util.setLogScale(20, 20, 20000, 20000);
    this.onResize_();
    this.init_();
    window.addEventListener('resize', this.onResize_.bind(this));
  }

  loop(loop) {
    console.log('loop', loop);
    this.player.setLoop(loop);
  }

  play(src) {
    this.src = src;
    this.player.playSrc(src);
    console.log('play: ', src);
  }

  stop() {
    this.player.stop();
    console.log("STOP");
  }

  isPlaying() {
    console.log('Playing?: ' + !!this.player.source);
    return !!this.player.source;
  }

  stopRender() {
    this.isRendering = false;
    console.log('stopRender');
  }

  startRender() {
    if (this.isRendering) {
      return;
    }
    this.isRendering = true;
    this.draw_();
  }

  live() {
    this.player.live();
  }

  init_() {
    // Initialize everything.
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    let player = new Player();
    let analyserNode = player.getAnalyserNode();

    let analyserView = new AnalyserView(this.canvas);
    analyserView.setAnalyserNode(analyserNode);
    analyserView.initByteBuffer();
    analyserView.setAnalysisType(2);

    this.player = player;
    this.analyserView = analyserView;
    $('#spectrogram')
      .on('mousedown', this.handleTrack)
      .on('touchstart', this.handleTrack)
      .on('mouseup', this.handleTrack)
      .on('touchend', this.handleTrack);
  }

  switchAnalysisType(n) {
    let player = new Player();
    let analyserNode = player.getAnalyserNode();

    let analyserView = new AnalyserView(this.canvas);
    analyserView.setAnalyserNode(analyserNode);
    analyserView.initByteBuffer();
    analyserView.setAnalysisType(n);
    console.log("AnalysisType: " + n);
    this.player = player;
    this.analyserView = analyserView;
    $('#spectrogram')
      .on('mousedown', this.handleTrack)
      .on('touchstart', this.handleTrack)
      .on('mouseup', this.handleTrack)
      .on('touchend', this.handleTrack);
  }

  rotateX(dx) {
    let angle_x = dx + this.x;
    this.analyserView.cameraController.xRot = angle_x;
    console.log("xRot: " + angle_x);
  }

  rotateY(dy) {
    let angle_y = dy + this.y;
    this.analyserView.cameraController.yRot = angle_y;
    console.log("yRot: " + angle_y);
  }

  rotateZ(dz) {
    let angle_z = dz + this.z;
    this.analyserView.cameraController.zRot = angle_z;
    console.log("zRot: " + angle_z);
  }

  onResize_() {
    console.log('onResize_');
    let canvas = $('#spectrogram')[0];
    this.canvas = canvas;

    // access sibling or parent elements here
    canvas.width = $(window).width();
    canvas.height = $(window).height();

    // Also resize the grid canvas.
    let legend = $('#grid')[0];
    legend.width = $(window).width();
    legend.height = $(window).height() - 158;

    this.draw3DGrid();
  }

  draw_() {
    if (!this.isRendering) {
      console.log('stopped draw_');
      return;
    }

    this.analyserView.doFrequencyAnalysis();
    requestAnimationFrame(this.draw_.bind(this));
  }

  switchComponent(elemId) {
    this.stop();
    $('.switch').hide();
    $("[id*=" + elemId + "]").show();
  }

  toggleGrid(active) {
    let $grid = $('#grid');
    active ? $grid.show() : $grid.hide();
  }

  toggleElem(elemId, active) {
    let $e = $("[id*=" + elemId + "]");
    active ? $e.show() : $e.hide();
  }

  draw3DGrid() {
    let canvas = $('#grid')[0];
    let ctx = canvas.getContext('2d');

    let p = 10;
    let bw = canvas.width - 90;
    let bh = canvas.height - 10;
    for (let dx = 0; dx <= bw; dx += 30) {
      ctx.moveTo(0.5 + dx + p, p);
      ctx.lineTo(0.5 + dx + p, bh + p);
    }

    for (let dy = 0; dy <= bh; dy += 30) {
      ctx.moveTo(p, 0.5 + dy + p);
      ctx.lineTo(bw + p, 0.5 + dy + p);
    }

    ctx.strokeStyle = "#FFF";
    ctx.stroke();

    let x = canvas.width - 10;

    ctx.fillStyle = 'whitesmoke';
    ctx.font = '14px Roboto';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText('- 10 kHz', x, canvas.height - this.freqToY(6000));
    ctx.fillText('- 8 kHz', x, canvas.height - this.freqToY(3000));
    ctx.fillText('- 3.5 kHz', x, canvas.height - this.freqToY(1000));
    ctx.fillText('- 300 Hz', x, canvas.height - this.freqToY(75));
    ctx.fillText('- 200 Hz', x, canvas.height - this.freqToY(35));
    ctx.fillText('- 100 Hz', x, canvas.height - this.freqToY(20));

  }

  draw2DGrid() {

  }

  /**
   * Convert between frequency and the offset on the canvas (in screen space).
   * For now, we fudge this...
   *
   * TODO(smus): Make this work properly with WebGL.

freqStart: 20;
freqEnd: 20000;
padding: 30;

yToFreq(y) {
  let padding = this.padding;
  let height = $('#spectrogram').height();

  if (height < 2 * padding || // The spectrogram isn't tall enough
    y < padding || // Y is out of bounds on top.
    y > height - padding) { // Y is out of bounds on the bottom.
    return null;
  }
  let percentFromBottom = 1 - (y - padding) / (height - padding);
  let freq = this.freqStart + (this.freqEnd - this.freqStart) * percentFromBottom;
  return Util.lin2log(freq);
}

// Just an inverse of yToFreq.
freqToY(logFreq) {
  // Go from logarithmic frequency to linear.
  let freq = Util.log2lin(logFreq);
  let height = $('#spectrogram').height();
  let padding = this.padding;
  // Get the frequency percentage.
  let percent = (freq - this.freqStart) / (this.freqEnd - this.freqStart);
  // Apply padding, etc.
  return this.padding + percent * (height - 2 * padding);
}

*/
