import {
  camera,
  Util,
  AnalyserView
} from "../toolkit";

import Player from "./player"
import {notes} from "./notes";

const Toolkit:any = {};

declare const $:any;
declare const window:any;


Toolkit.spectrogram = (function() {

  let spec3D:any = {
    cxRot: 90,
    drawingMode: false,
    prevX: 0,

    handleTrack: function(e) {
      switch(e.type){
        case 'mousedown':
        case 'touchstart':
          // START: MOUSEDOWN ---------------------------------------------
          spec3D.prevX = Number(e.pageX) || Number(e.originalEvent.touches[0].pageX);

          $(e.currentTarget).on('mousemove',spec3D.handleTrack);
          $(e.currentTarget).on('touchmove',spec3D.handleTrack);

          if (spec3D.drawingMode === false)
            break;

          let freq = spec3D.yToFreq(Number(e.pageY) || Number(e.originalEvent.touches[0].pageY));

          if (spec3D.isPlaying())
            spec3D.player.setBandpassFrequency(freq);
          else
            spec3D.player.playTone(freq);

          break;

        case 'mousemove' :
        case 'touchmove' :
          // TRACK --------------------------------------------------------
          let ddx = (Number(e.pageX) || Number(e.originalEvent.touches[0].pageX)) - spec3D.prevX;
          spec3D.prevX = Number(e.pageX) || Number(e.originalEvent.touches[0].pageX);

          if(spec3D.drawingMode){

            let y = Number(e.pageY) || Number(e.originalEvent.touches[0].pageY);
            let freq1 = spec3D.yToFreq(y);
            // console.log('%f px maps to %f Hz', y, freq);

            if (spec3D.isPlaying())
              spec3D.player.setBandpassFrequency(freq1);
            else
              spec3D.player.playTone(freq1);

          } else if (spec3D.isPlaying()) {
            spec3D.cxRot += (ddx * .2);

            if (spec3D.cxRot < 0)
              spec3D.cxRot = 0;
            else if ( spec3D.cxRot > 90)
              spec3D.cxRot = 90;

            // spec3D.analyserView.cameraController.yRot = spec3D.easeInOutCubic(spec3D.cxRot / 90, 180 , 90 , 1);
            // spec3D.analyserView.cameraController.zT = spec3D.easeInOutCubic(spec3D.cxRot / 90,-2,-1,1);
            // console.log(spec3D.cxRot / 90);
            // spec3D.analyserView.cameraController.zT = -6 + ((spec3D.cxRot / 90) * 4);
          }
          break;
        case 'mouseup' :
        case 'touchend':
          // END: MOUSEUP -------------------------------------------------
          $(e.currentTarget).off('mousemove',spec3D.handleTrack)
          $(e.currentTarget).off('touchmove',spec3D.handleTrack)
          if (spec3D.drawingMode === false)
            return false;
          if (spec3D.isPlaying())
            spec3D.player.setBandpassFrequency(null);
          else
            spec3D.player.stopTone();
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

    stop: function() {
      spec3D.player.stop();
    },

    isPlaying: function() {
      return !!this.player.source;
    },

    stopRender: function() {
      spec3D.isRendering = false;
    },

    startRender: function() {
      if (spec3D.isRendering) {
        return;
      }
      spec3D.isRendering = true;
      spec3D.draw_();
    },

    loopChanged: function(loop) {
      console.log('loopChanged', loop);
      // spec3D.player.setLoop(loop);
    },

    play: function(src) {
      spec3D.src = src;
      spec3D.player.playSrc(src);
    },

    live: function() {
      spec3D.player.live();
    },

    init_: function() {
      // Initialize everything.
      let player = new Player();
      let analyserNode = player.getAnalyserNode();

      let analyserView = new AnalyserView(this.canvas);
      analyserView.setAnalyserNode(analyserNode);
      analyserView.initByteBuffer();
      // spec3D.setdraw_();

      spec3D.player = player;
      spec3D.analyserView = analyserView;
      $('#spectrogram')
        .on('mousedown',this.handleTrack)
        .on('touchstart',this.handleTrack)
        .on('mouseup',this.handleTrack)
        .on('touchend',this.handleTrack)
    },

    onResize_: function() {
      console.log('onResize_');
      let canvas = $('#spectrogram')[0];
      spec3D.canvas = canvas;

      // access sibling or parent elements here
      canvas.width = $(window).width();
      canvas.height = $(window).height();

      // Also size the legend canvas.
      let legend = $('#legend')[0];
      legend.width = $(window).width();
      legend.height = $(window).height() - 158;

      spec3D.drawLegend_();
    },

    draw_: function() {
      if (!spec3D.isRendering) {
        console.log('stopped draw_');
        return;
      }
      spec3D.analyserView.doFrequencyAnalysis();
      requestAnimationFrame(spec3D.draw_.bind(spec3D));
    },

    hideGrid: function() {
      $('#legend').hide();
    },
    // showGrid: function() {
    //     $('#spectrogram').css("z-index", "0");
    //     console.log("SHOW GRID");
    // },

    drawLegend_: function() {
      let canvas = $('#legend')[0];
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

      ctx.strokeStyle="magenta";
      ctx.stroke();

      let x = canvas.width - 10;

      ctx.fillStyle = 'magenta';
      ctx.font = '14px Roboto';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText('20,000 Hz -', x, canvas.height - spec3D.freqToY(10000));
      ctx.fillText('300 Hz -', x, canvas.height - spec3D.freqToY(75));
      ctx.fillText('200 Hz -', x, canvas.height - spec3D.freqToY(35));
      ctx.fillText('100 Hz -', x, canvas.height - spec3D.freqToY(15));

    },

    updateDetails: function(details) {
      $('#freqSample').text(details[0].toString() + " " + details[1].toString() + "Hz");
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
      var padding = spec3D.padding;
      var height = $('#spectrogram').height();

      if (height < 2*padding || // The spectrogram isn't tall enough
        y < padding || // Y is out of bounds on top.
        y > height - padding) { // Y is out of bounds on the bottom.
        return null;
      }
      var percentFromBottom = 1 - (y - padding) / (height - padding);
      var freq = spec3D.freqStart + (spec3D.freqEnd - spec3D.freqStart)* percentFromBottom;
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
      return spec3D.padding + percent * (height - 2*padding);
    },

    easeInOutCubic: function (t, b, c, d) {
      if ((t/=d/2) < 1) return c/2*t*t*t + b;
      return c/2*((t-=2)*t*t + 2) + b;
    },
    easeInOutQuad: function (t, b, c, d) {
      if ((t/=d/2) < 1) return c/2*t*t + b;
      return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInOutQuint: function (t, b, c, d) {
      if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
      return c/2*((t-=2)*t*t*t*t + 2) + b;
    },
    easeInOutExpo: function (t, b, c, d) {
      if (t===0) return b;
      if (t===d) return b+c;
      if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
      return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
  };



  return spec3D;

})();
Toolkit.startScript = null;



Toolkit.main = (function() {


  window.isMobile = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) );
  window.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  function pollyFillRequestAnimFrame( callback ){
    window.setTimeout(callback, 1000 / 60);
  }

  window.requestAnimFrame =  window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || pollyFillRequestAnimFrame;


  Toolkit.startScript = () => {
    let clickCount = 0;

    $('#spectrogram')[0].ondblclick = function () {
      console.log("Dble")
      clickCount++;

      const controller:any = camera;

      if (clickCount === 1) {
        controller.xRot = -180;
        controller.yRot = 180;
        controller.zRot = 180;
      }
      if (clickCount === 2) {
        controller.xRot = -90;
        controller.yRot = 270;
        controller.zRot = 90;
      }
      if (clickCount === 3) {
        controller.xRot = -180;
        controller.yRot = 270;
        controller.zRot = 90;
        clickCount = 0;
      }
    }

    let parseQueryString = function() {
      let q = window.location.search.slice(1).split('&');
      for(let i=0; i < q.length; ++i){
        let qi = q[i].split('=');
        q[i] = {};
        q[i][qi[0]] = qi[1];
      }
      return q;
    };

    let getLocalization = function() {
      let q = parseQueryString();
      let lang = 'en';
      for(let i=0; i < q.length; i++){
        if(q[i].ln !== undefined){
          lang = q[i].ln;
        }
      }
      // var url = "https://gweb-musiclab-site.appspot.com/static/locales/" + lang + "/locale-music-lab.json";
      // $.ajax({
      // 	url: url,
      // 	dataType: "json",
      // 	async: true,
      // 	success: function( response ) {
      // 		$.each(response,function(key,value){
      // 			var item = $("[data-name='"+ key +"']");
      // 			if(item.length > 0){
      // 				console.log('value.message',value.message);
      // 				item.attr('data-name',value.message);
      // 			}
      // 		});
      // 	},
      // 	error: function(err){
      // 		console.warn(err);
      // 	}
      // });
    };

    let loadUploads = function() {
      let uploadList = $('.uploads');

      $.getJSON('/api/directory', function (data) {
        console.log(data);

        let items = [];
        for (let i = 0; i < data.length; i++) {
          items.push(data[i].fileName);
        }
        console.log(items);

        uploadList.empty();

        if (items.length) {
          let content = '<li>' + items.join('</li><li>') + '</li>';
          let list = $('<ul />').html(content);
          uploadList.append(list);
        }
      });

      uploadList.text('Loading the JSON file.');
    };

    let startup = function() {
      let i = 0;
      // loadUploads();
      getLocalization();
      window.parent.postMessage('ready','*');

      let sp = Toolkit.spectrogram;
      sp.updateDetails(notes[i].split(':'));
      sp.attached();

      // --------------------------------------------
      let $playButton = $('.music-box__buttons__sampler');
      $playButton.click(function(e) {
        if ($(this).hasClass('selected')) {
          $playButton.removeClass('selected');
          sp.stop();
        }
        else {
          $playButton.removeClass('selected');
          $(this).addClass('selected');
          let src = "bin/snd/";
          let info = notes[i].split(':');
          src += info[1];
          sp.startRender();
          sp.drawingMode = false;
          let waveType = $('#wavetype').val();
          console.log(waveType);
          if (waveType !== 'Sin')
            src += waveType;
          $(this).prop('data-src', src + ".wav");
          console.log($(this).prop('data-src'));
          if ($(this).prop('data-src') !== undefined) {
            sp.play($(this).prop('data-src'));
            // if(!sp.isPlaying())
            //     $(this).removeClass('selected');
          }
          console.log(sp.isPlaying());


        }
      });
      // --------------------------------------------
      let $toggle = $('.music-box__buttons__toggle');
      $toggle.click(function(e) {
        if ($(this).attr('data-name') === 'up')
          i === notes.length ? i = 0 : i++;
        if ($(this).attr('data-name') === 'down')
          i === 0 ? i = notes.length : i--;
        sp.updateDetails(notes[i].split(':'));

      });
      // --------------------------------------------
      let $music_bbb = $('.music-box__buttons__button');
      $music_bbb.click(function(e) {
        sp.startRender();
        let wasPlaying = sp.isPlaying();
        sp.stop();
        sp.drawingMode = false;
        if($(this).hasClass('selected')){
          $music_bbb.removeClass('selected');
          sp.stop();
        }
        else{
          $music_bbb.removeClass('selected');
          $(this).addClass('selected');
          // check for start recoding data instruction **********************
          if ($(this).attr('data-mic')!== undefined) {
            if(window.isIOS){
              // Throw Microphone Error *********************************
              window.parent.postMessage('error2','*');
              // Remove Selection ***************************************
              $(this).removeClass('selected');
            }else{
              // Show Record Modal Screen *******************************
              $('#record').fadeIn().delay(2000).fadeOut();
              // Start Recording ****************************************
              sp.live();
            }
            // Check for Start drawing data instruction  **********************
          }else if ($(this).attr('data-draw') !== undefined) {
            sp.drawingMode = true;
            $('#drawAnywhere').fadeIn().delay(2000).fadeOut();
            // Check for play audio data instruction **************************
          }else if ($(this).attr('data-src') !== undefined) {
            sp.loopChanged( true );
            $('#loadingMessage').text($(this).attr('data-name'));
            sp.play($(this).attr('data-src'));
          }
        }
      });
      // --------------------------------------------
      let $record = $('.music-box__buttons__record');
      $record.click(function(e) {
        sp.hideGrid();
      });


    };

    let elm = $('#iosButton');
    if(!window.isIOS){
      startup();
      elm.addClass('hide');
    }else{
      window.parent.postMessage('loaded','*');
      elm[0].addEventListener('touchend', function(e) {
        elm.addClass('hide');
        startup();
      },false);
    }
  };

})();

export default Toolkit;
