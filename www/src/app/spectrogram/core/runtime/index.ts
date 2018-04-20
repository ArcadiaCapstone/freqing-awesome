import {
  Util,
  AnalyserView
} from "../toolkit";

import Player from "./player";

const Toolkit: any = {};

declare const $: any;
declare const window: any;


Toolkit.spectrogram = (function() {

  let player:Player = null;

  let spec3D: any = {
    cxRot: 90,
    player,
    drawingMode: false,
    prevX: 0,
    isExporting: false,
    dataPoints: [],
    x: -180,
    y: -90,
    z: 90,

    handleTrack: function(e) {
      switch (e.type) {
        case 'mousedown':
        case 'touchstart':
          // START: MOUSEDOWN ---------------------------------------------
          spec3D.prevX = Number(e.pageX) || Number(e.originalEvent.touches[0].pageX);

          $(e.currentTarget).on('mousemove', spec3D.handleTrack);
          $(e.currentTarget).on('touchmove', spec3D.handleTrack);

          if (spec3D.drawingMode === false) {
            break;
          }

          let freq = spec3D.yToFreq(Number(e.pageY) || Number(e.originalEvent.touches[0].pageY));
          console.log('isPlaying()= ' + spec3D.isPlaying());
          if (spec3D.isPlaying()) {
            spec3D.player.setBandpassFrequency(freq);
          } else {
            spec3D.player.playTone(freq);
          }
          break;

        case 'mousemove' :
        case 'touchmove' :
          // TRACK --------------------------------------------------------
          let ddx = (Number(e.pageX) || Number(e.originalEvent.touches[0].pageX)) - spec3D.prevX;
          spec3D.prevX = Number(e.pageX) || Number(e.originalEvent.touches[0].pageX);
          if (spec3D.drawingMode) {
            let y = Number(e.pageY) || Number(e.originalEvent.touches[0].pageY);
            let freq1 = spec3D.yToFreq(y);
            // console.log('%f px maps to %f Hz', y, freq);

            if (spec3D.isPlaying()) {
              spec3D.player.setBandpassFrequency(freq1);
            } else {
              spec3D.player.playTone(freq1);
            }

          } else if (spec3D.isPlaying()) {
            spec3D.cxRot += (ddx * .2);

            if (spec3D.cxRot < 0) {
              spec3D.cxRot = 0;
            } else if ( spec3D.cxRot > 90) {
              spec3D.cxRot = 90;
                 }
          }
          break;
        case 'mouseup' :
        case 'touchend':
          // END: MOUSEUP -------------------------------------------------
          $(e.currentTarget).off('mousemove', spec3D.handleTrack);
          $(e.currentTarget).off('touchmove', spec3D.handleTrack);
          if (spec3D.drawingMode === false) {
            return false;
          }
          if (spec3D.isPlaying()) {
            spec3D.player.setBandpassFrequency(null);
          } else {
            spec3D.player.stopTone();
          }
          return false;
      }
    },

    attached: function() {
      console.log('spectrogram-3d attached');
      Util.setLogScale(20, 20, 20000, 20000);
      spec3D.onResize_();
      spec3D.init_();
      window.addEventListener('resize', spec3D.onResize_.bind(spec3D));
    },

    loop: function(loop) {
      console.log('loop', loop);
      spec3D.player.setLoop(loop);
    },

    play: function(src) {
      spec3D.src = src;
      spec3D.player.playSrc(src);
      console.log('play: ', src);
    },

    stop: function() {
      spec3D.player.stop();
      console.log("STOP");
    },

    isPlaying: function() {
      console.log('Playing?: ' + !!this.player.source);
      return !!this.player.source;
    },

    stopRender: function() {
      spec3D.isRendering = false;
      console.log('stopRender');
    },

    startRender: function() {
      if (spec3D.isRendering) {
        return;
      }
      spec3D.isRendering = true;
      spec3D.draw_();
    },

    live: function() {
      spec3D.player.live();
    },

    init_: function() {
      // Initialize everything.
      window.AudioContext = window.AudioContext || window.webkitAudioContext;



      let player = new Player();
      let analyserNode = player.getAnalyserNode();

      let analyserView = new AnalyserView(this.canvas);
      analyserView.setAnalyserNode(analyserNode);
      analyserView.initByteBuffer();
      analyserView.setAnalysisType(2);

      spec3D.player = player;
      spec3D.analyserView = analyserView;
      $('#spectrogram')
        .on('mousedown', this.handleTrack)
        .on('touchstart', this.handleTrack)
        .on('mouseup', this.handleTrack)
        .on('touchend', this.handleTrack);
    },

    switchAnalysisType(n) {
      let player = new Player();
      let analyserNode = player.getAnalyserNode();

      let analyserView = new AnalyserView(this.canvas);
      analyserView.setAnalyserNode(analyserNode);
      analyserView.initByteBuffer();
      analyserView.setAnalysisType(n);
      console.log("AnalysisType: " + n);
      spec3D.player = player;
      spec3D.analyserView = analyserView;
      $('#spectrogram')
        .on('mousedown', this.handleTrack)
        .on('touchstart', this.handleTrack)
        .on('mouseup', this.handleTrack)
        .on('touchend', this.handleTrack);
    },
    setSampleSrc() {
      let player = new Player();
      let analyserNode = player.getAnalyserNode();

      let analyserView = new AnalyserView(this.canvas);
      analyserView.setAnalyserNode(analyserNode);
      analyserView.initByteBuffer();
      analyserView.setAnalysisType(2);
      spec3D.player = player;
      spec3D.analyserView = analyserView;
      $('#spectrogram')
        .on('mousedown', this.handleTrack)
        .on('touchstart', this.handleTrack)
        .on('mouseup', this.handleTrack)
        .on('touchend', this.handleTrack);
    },

    rotateX(dx) {
      let angle_x =  dx + spec3D.x;
      spec3D.analyserView.cameraController.xRot = angle_x;
      console.log("xRot: " + angle_x);
    },
    rotateY(dy) {
      let angle_y =  dy + spec3D.y;
      spec3D.analyserView.cameraController.yRot = angle_y;
      console.log("yRot: " + angle_y);
    },
    rotateZ(dz) {
      let angle_z =  dz + spec3D.z;
      spec3D.analyserView.cameraController.zRot = angle_z;
      console.log("zRot: " + angle_z);
    },

    onResize_: function() {
      console.log('onResize_');
      let canvas = $('#spectrogram')[0];
      spec3D.canvas = canvas;

      // access sibling or parent elements here
      canvas.width = $(window).width();
      canvas.height = $(window).height();

      // Also resize the grid canvas.
      let legend = $('#grid')[0];
      legend.width = $(window).width();
      legend.height = $(window).height() - 158;

      spec3D.draw3DGrid();
    },

    draw_: function() {
      if (!spec3D.isRendering) {
        console.log('stopped draw_');
        return;
      }

      let data = spec3D.analyserView.doFrequencyAnalysis();
      if(spec3D.isExporting) {
        spec3D.dataPoints = data;
        console.log(data);
      }
      // spec3D.analyserView.doFrequencyAnalysis();
      requestAnimationFrame(spec3D.draw_.bind(spec3D));
    },

    recordRaw: function() {
      spec3D.isExporting = false;
      return spec3D.dataPoints;
    },

    switchComponent(elemId) {
      spec3D.stop();
      $('.switch').hide();
      $("[id*=" + elemId + "]").show();
    },
    toggleGrid(active) {
      let $grid = $('#grid');
      active ? $grid.show() : $grid.hide();
    },
    toggleElem(elemId, active) {
      let $e = $("[id*=" + elemId + "]");
      active ? $e.show() : $e.hide();
    },
    draw3DGrid: function() {
      let canvas = $('#grid')[0];
      let ctx = canvas.getContext('2d');

      let p = 10;
      let bw = canvas.width - 90;
      let bh = canvas.height  - 10;
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
      ctx.fillText('- 10 kHz', x, canvas.height - spec3D.freqToY(6000));
      ctx.fillText('- 8 kHz', x, canvas.height - spec3D.freqToY(3000));
      ctx.fillText('- 3.5 kHz', x, canvas.height - spec3D.freqToY(1000));
      ctx.fillText('- 300 Hz', x, canvas.height - spec3D.freqToY(75));
      ctx.fillText('- 200 Hz', x, canvas.height - spec3D.freqToY(35));
      ctx.fillText('- 100 Hz', x, canvas.height - spec3D.freqToY(20));

    },
    draw2DGrid: function() {

    },

    /**
     * Convert between frequency and the offset on the canvas (in screen space).
     * For now, we fudge this...
     *
     * TODO(smus): Make this work properly with WebGL.
     */
    freqStart: 20,
    freqEnd: 20000,
    padding: 30,
    yToFreq: function(y) {
      let padding = spec3D.padding;
      let height = $('#spectrogram').height();

      if (height < 2 * padding || // The spectrogram isn't tall enough
        y < padding || // Y is out of bounds on top.
        y > height - padding) { // Y is out of bounds on the bottom.
        return null;
      }
      let percentFromBottom = 1 - (y - padding) / (height - padding);
      let freq = spec3D.freqStart + (spec3D.freqEnd - spec3D.freqStart) * percentFromBottom;
      return Util.lin2log(freq);
    },

    // Just an inverse of yToFreq.
    freqToY: function(logFreq) {
      // Go from logarithmic frequency to linear.
      let freq = Util.log2lin(logFreq);
      let height = $('#spectrogram').height();
      let padding = spec3D.padding;
      // Get the frequency percentage.
      let percent = (freq - spec3D.freqStart) / (spec3D.freqEnd - spec3D.freqStart);
      // Apply padding, etc.
      return spec3D.padding + percent * (height - 2 * padding);
    },

  };

  return spec3D;

})();

Toolkit.startScript = null;


Toolkit.main = (function() {

  window.isMobile = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) );
  window.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  function pollyFillRequestAnimFrame( callback ) {
    window.setTimeout(callback, 1000 / 60);
  }

  window.requestAnimFrame =  window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || pollyFillRequestAnimFrame;


  Toolkit.startScript = () => {

    let parseQueryString = function() {
      $('.componentContainer').hide();
      let q = window.location.search.slice(1).split('&');
      for (let i = 0; i < q.length; ++i) {
        let qi = q[i].split('=');
        q[i] = {};
        q[i][qi[0]] = qi[1];
      }
      return q;
    };
    let getLocalization = function() {
      let q = parseQueryString();
      let lang = 'en';
      for (let i = 0; i < q.length; i++) {
        if (q[i].ln !== undefined) {
          lang = q[i].ln;
        }
      }
    };

    let startup = function() {
      // --------------------------------------------//
      getLocalization();
      window.parent.postMessage('ready', '*');
      Toolkit.spectrogram.attached();
      // --------------------------------------------//
      let $specialButton = $('.special-button');
      // --------------------------------------------//
      $specialButton.click(function() {
        Toolkit.spectrogram.startRender();
        let wasPlaying = Toolkit.spectrogram.isPlaying();
        Toolkit.spectrogram.stop();
        Toolkit.spectrogram.drawingMode = false;
        if ($(this).hasClass('selected')) {
          $specialButton.removeClass('selected');
          Toolkit.spectrogram.stop();
        }
        else {
          $specialButton.removeClass('selected');
          $(this).addClass('selected');
          if ($(this)[0].id === 'micButton') {
            if (window.isIOS) {
              window.parent.postMessage('error2', '*');
              $(this).removeClass('selected');
            } else {
              // Show Record Modal Screen *******************************
              $('#record').fadeIn().delay(2000).fadeOut();
              // Start Recording ****************************************
              Toolkit.spectrogram.live();
            }
            // Check for Start drawing fileName instruction  **********************
          }
          else if ($(this)[0].id === 'drawButton') {
            Toolkit.spectrogram.drawingMode = true;
          }
        }
      });


    };

    let elm = $('#iosButton');
    if (!window.isIOS) {
      startup();
      elm.addClass('hide');
    } else {
      window.parent.postMessage('loaded', '*');
      elm[0].addEventListener('touchend', function(e) {
        elm.addClass('hide');
        startup();
      }, false);
    }
  };

})();

export default Toolkit;
