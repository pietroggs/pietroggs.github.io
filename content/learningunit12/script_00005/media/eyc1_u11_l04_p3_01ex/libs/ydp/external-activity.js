(function (wnd) {

    var ExternalActivity = function (api) {
		for (var i = 0; i < manifest.length; i++) {
            if (manifest[i].src.indexOf('.mp3') !== -1) {
                api.initSound(manifest[i].src, initCallback, endCallback, pauseCallback);
            }
        }
        init();
    };

    var p = ExternalActivity.prototype;
    var touchDevice = /ipad|ipod|iphone|android|webos|windows phone|blackberry/i.test(navigator.userAgent.toLowerCase());
    var eDown = touchDevice ? 'touchstart' : 'mousedown';
	
	var initCallback = {
        onSoundCreated: function (sound, src) {
            var sndID = _.findWhere(manifest, {src: src}).id;
            sounds[sndID] = sound;
        }
    };
	var endCallback = {
		onEnd: function() {
			// no end-callbacks
		}
	};
	var pauseCallback = {
		onPause: function() {
			
			if (!audioButtonWantsToPlay) { 
			stopAudio();
			} else {
			var IntID = setTimeout(function(){
			audioButtonWantsToPlay = false;
			clearTimeout(IntID);
			},100)
			}
		}
	}
	var sounds = {};
	var currentSound;
	var soundFuse;
	var isPlaying = false;
	var conf, currentTab;
	var drag, dragID, dragData, gap, dropped;
	var sprite_anim0, sprite_anim1;
	var tweenID, requestID;
    var FPS = 25;
	var firstDragUse = false;
	
	
	var audioButtonWantsToPlay = false;
	
	function init() {
		
		$(document).on(eDown, function(e) {
			e.preventDefault();
			if (!firstDragUse && !audioButtonWantsToPlay) {
				fireFeedbackSounds();
				firstDragUse = true;
			};
		});
		
		sprite_anim0 = new ImageAnimation('sprite_anim0', 'images/character_anim0.json');
		sprite_anim0.setVisible(false);
		sprite_anim1 = new ImageAnimation('sprite_anim1', 'images/character_anim0.json');
		sprite_anim1.setVisible(false);
			
		
		$('.btn-audio').on(eDown, function(e) {
			e.preventDefault();
			fireFeedbackSounds();
			firstDragUse = true;
			audioButtonWantsToPlay = true;
			isPlaying = !isPlaying;
			if (isPlaying) {
				playAudio(this);
			} else {
				stopAudio();
			}
		});
		
		$('.btn-tab').on(eDown, function(e) {
			e.preventDefault();
			var id = parseInt($(this).attr('id').slice(-1));
			if (id !== currentTab) {
				stopAudio();
				currentTab = id;
				initTab();
			}
		});
		
		if (!touchDevice)
			$('.draggable').addClass('non-mobile');
		
		interact('.draggable:not(.answered)')
            .draggable({
                onstart: function (event) {
					event.preventDefault();
					dropped = false;
					drag = $(event.target);
					drag.addClass('dragged');
					dragID = drag.attr('data-ID');
					dragData = {x:0, y:0};
				},
                onmove: function (event) {
					event.preventDefault();
					var x = dragData.x + event.dx / resizeFactor;
					var y = dragData.y + event.dy / resizeFactor;
					// translate3d - force hardware acceleration
					drag.css({
						'-webkit-transform': 'translate3d(' + x + 'px, ' + y + 'px, 0px)',
						'transform': 'translate3d(' + x + 'px, ' + y + 'px, 0px)'
					});
					dragData = { x:x, y:y };
				},
                onend: function (event) {
					event.preventDefault();
					drag.removeClass('dragged');
					if (!dropped)
						resetDrag(drag);
				},
            })
            .styleCursor(false);
			
		interact('#gap').dropzone({
            accept: '.draggable',
            overlap: 0.5,
            ondrop: function (event) {
				dropped = true;
				check();
			}
        });
		
		droppables = $('#droppables');
		gap = $('#gap');
		currentTab = 0;
		initTab();
	}
	
	function fireFeedbackSounds() {
		sounds.allok.play();
		sounds.allok.stop();
		sounds.wrong.play();
		sounds.wrong.stop();
		sounds.ok.play();
		sounds.ok.stop();
	}
	
	function initTab() {
				
		sprite_anim0.setVisible(false);
		sprite_anim1.setVisible(false);
				
				
		if (config[currentTab].done == config[currentTab].todo) {
			$('.charactersStart').css('visibility', 'hidden');
			$('.charactersEnd').css('visibility', 'hidden');
			$('#characterEnd'+currentTab).css('visibility', 'visible');
		} else {
			$('.charactersEnd').css('visibility', 'hidden');
			$('.charactersStart').css('visibility', 'hidden');
			$('#characterStart'+currentTab).css('visibility', 'visible');
		}
		
		
		$('.btn-tab').attr('class', 'btn-tab');
		$('#btn'+currentTab).attr('class', 'btn-tab btn-current');
		
		conf = config[currentTab];
		if (!conf.answers.length) 
			conf.drag = _.shuffle(conf.drag);
		for(var i=0;i<conf.drag.length;i++) {
			var obj = conf.drag[i];
			var drag = $('#drag'+i);
			drag.removeClass('answered');
			drag.html('<img src="' + obj.src + '" width="' + obj.w + '" height="' + obj.h + '"/>');
			drag.attr({
				'data-answered': false,
				'data-ID': obj.id
			});
		}
		
		droppables.empty();
		
		var accept = [];
		
		for(var i=0;i<conf.drop.length;i++) {
			var obj = conf.drop[i];
			accept.push(obj.id);
			droppables.append('<img class="on-drop-image" data-ID="' + obj.id + '" src="' + obj.src + '" width="' + obj.w + '" height="' + obj.h + '" style="left:' + obj.x + 'px; top:' + obj.y + 'px;"/>');
		}
		gap.attr('data-accept', accept.join(','));
		
		restoreState();
	}
	
	function updateTween() {
		
		if (currentTab == 0) {
			sprite_anim0.gotoNextFrame();
		}
		if (currentTab == 1) {
			sprite_anim1.gotoNextFrame();
		}
		
		        
        tweenID = setTimeout(function () {
            requestID = requestAnimationFrame(updateTween);
						
			if (frameNumber == totalFrameNumber) {
			clearTimeout(tweenID);
			cancelAnimationFrame(requestID);
			
			}
			
			
			
			
        }, 1300 / FPS);
    }
	
	function restoreState() {
		for(var i=0;i<conf.answers.length;i++) {
			var dragID = conf.answers[i];
			var drag = $('.draggable[data-ID="' + dragID + '"]');
			drag.addClass('answered');
			var onDropImg = $('.on-drop-image[data-ID="' + dragID + '"]');
			onDropImg.addClass('answered');
		}
	}
	
	function check() {
		var ids = gap.attr('data-accept').split(',');
		if (ids.indexOf(dragID) > -1) {
			drag.addClass('answered');
			var onDropImg = $('.on-drop-image[data-ID="' + dragID + '"]');
			onDropImg.addClass('answered');
			conf.done++;
			conf.errors = 0;
			conf.answers.push(dragID);
			if (conf.done === conf.todo) {
				sounds.allok.play();
				$('.charactersStart').css('visibility', 'hidden');
				if (currentTab == 0) { sprite_anim0.setVisible(true) }
				if (currentTab == 1) { sprite_anim1.setVisible(true) }
				updateTween();
				playFeedback();
			} else {
				sounds.ok.play();
				playFeedback();
			}
		} else {
			if (conf.done < conf.todo) {
				conf.errors++;
				sounds.wrong.play();
				playFeedback();
			}
		}
		resetDrag(drag);
	}
	
	function resetDrag(d) {
		d.css({
			'-webkit-transform': 'translate3d(0px,0px,0px)',
			'transform': 'translate3d(0px,0px,0px)'
		});
	}
	
	function playAudio(btn) {
		currentSound = sounds['snd'+currentTab];
		currentSound.play();
		$(btn).find('.sound-waves').css('visibility', 'visible');
		var btnAudioCont = $(btn).parent();
		btnAudioCont.attr('class', 'btn-audio-container animated');
		
		if (touchDevice) {
			var delay = soundDurations['snd'+currentTab] + 3000;
			soundFuse = setTimeout(function() {
				stopAudio();
			}, delay);
		}
	}
	
	function stopAudio() {
		if (currentSound) {
			clearTimeout(soundFuse);
			isPlaying = false;
			currentSound.stop();
			currentSound = null;
			$('.sound-waves').css('visibility', 'hidden');
			$('.btn-audio-container').attr('class', 'btn-audio-container');
		}
	}
	
	function playFeedback() {
		_done = conf.done;
		_errors = conf.errors;
		fireChangeEvent();
	}
	
    p.reset = function () {
		stopAudio();
		_.each(config, function(obj) {
			obj.done = 0;
			obj.errors = 0;
			obj.answers = [];
		});
		currentTab = 0;
		
		clearTimeout(tweenID);
		cancelAnimationFrame(requestID);
		sprite_anim0 = new ImageAnimation('sprite_anim0', 'images/character_anim0.json');
		sprite_anim0.setVisible(false);
		sprite_anim1 = new ImageAnimation('sprite_anim1', 'images/character_anim1.json');
		sprite_anim1.setVisible(false);
		
		initTab();
	};

    p.showAnswers = function (_showanswers) {};
    p.markCorrect = function (_markcorrect) {};
    p.markWrong = function (_markwrong) {};
    p.lock = function (_lock) {};
	
    p.loadState = function (obj) {
		currentTab = obj.currentTab;
		config = obj.config;
		_done = obj.done;
		_errors = obj.errors;
		initTab();
	};
	
    p.saveState = function () {
        return {
			currentTab: currentTab,
			config: config,
			done: _done,
			errors: _errors
		};
    };

    wnd.ExternalActivity = ExternalActivity;

})(window);