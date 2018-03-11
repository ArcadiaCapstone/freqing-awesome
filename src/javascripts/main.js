
window.isMobile = ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) );
window.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

function pollyFillRequestAnimFrame( callback ){
    window.setTimeout(callback, 1000 / 60);
}

window.requestAnimFrame =  window.requestAnimationFrame
                        || window.webkitRequestAnimationFrame
                        || window.mozRequestAnimationFrame
                        || pollyFillRequestAnimFrame;

let spec3D = require('./ui/spectrogram');
let notes = require("./constants/notes");

function startScript() {

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

        let sp = spec3D;
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
}

$(startScript);
