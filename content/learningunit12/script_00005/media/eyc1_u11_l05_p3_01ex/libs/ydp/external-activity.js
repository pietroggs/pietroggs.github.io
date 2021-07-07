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
	var touchDevice = /ipad|iphone|android|windows phone|blackberry/i.test(navigator.userAgent.toLowerCase());
	var eDown = touchDevice ? 'touchstart' : 'mousedown';
	var eUp = touchDevice ? 'touchend' : 'mouseup';
	var eMove = touchDevice ? 'touchmove' : 'mousemove';

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
			stopAudio();
			isPlaying = false;
		}
	}
	var sounds = {};
	var currentSound;
	var soundFuse;
	var isPlaying = false;
	var cLevel = 0;
	var done = [[0], [0], [0]];
	var todo = 0;
	var bacteries, shown, delayID;
	var lvlBacteria = [4, 4, 4];
	var numBacteria = [[0, 1, 2, 3], [0, 1, 2, 3], [0, 1, 2, 3]];
	var currentTab = 0;
	
	var tab0ok, tab0wrong, tab1ok, tab1wrong, tab2ok, tab2wrong;
	var tweenID, requestID;
    var FPS = 25;
	var currentAnim;
	var feedbackIsPlaying = false;

	function init() {
		
		tab0ok = new ImageAnimation('tab0ok', 'images/tab0ok.json');
		tab0ok.setVisible(false);
		tab0wrong = new ImageAnimation('tab0wrong', 'images/tab0wrong.json');
		tab0wrong.setVisible(false);
		tab1ok = new ImageAnimation('tab1ok', 'images/tab1ok.json');
		tab1ok.setVisible(false);
		tab1wrong = new ImageAnimation('tab1wrong', 'images/tab1wrong.json');
		tab1wrong.setVisible(false);
		tab2ok = new ImageAnimation('tab2ok', 'images/tab2ok.json');
		tab2ok.setVisible(false);
		tab2wrong = new ImageAnimation('tab2wrong', 'images/tab2wrong.json');
		tab2wrong.setVisible(false);
		
		$('.btn-audio').on(eDown, function(e) {
			e.preventDefault();
			if (done[currentTab] < lvlBacteria[currentTab] &&!isPlaying) {
			isPlaying = !isPlaying;
			
			if (isPlaying) {
				playAudio(this);
				$('#blenda').hide();
				waitingForQuestion = false;
			} else {
				stopAudio();
			}
			}
		});
		
		$('.active').on(eDown, function (e) {
			e.preventDefault();
			if (!feedbackIsPlaying) {
			check($(this));
			}
		});
		
		$('.wrongs').on(eDown, function (e) {
			e.preventDefault();
			if (!feedbackIsPlaying) {
			sounds.wrong.play();
			startAnimation("wrong");
			}
		});

		$('.btn-normal').on(eDown, function (e) {
			e.preventDefault();
			var id = parseInt($(this).attr('id').slice(-1));
			if (id !== currentTab) {
				//stopAudio();
				currentTab = id;
				//initTab();
				showLevel();
			}
		});
		
		showLevel();
	}

	function showLevel() {
		hideBacteria();
		stopAudio();
				
		tab0ok.setVisible(false);
		tab0wrong.setVisible(false);
		tab1ok.setVisible(false);
		tab1wrong.setVisible(false);
		tab2ok.setVisible(false);
		tab2wrong.setVisible(false);
		clearTimeout(tweenID);
		cancelAnimationFrame(requestID);
		
		$('.bg-img').css('visibility', 'hidden');
		$('#bg'+currentTab).css('visibility', 'visible');
		
		$('.obrus').css('visibility', 'hidden');
		$('#obrus0'+currentTab).css('visibility', 'visible');
		
		$('.character').css('visibility', 'hidden');
		$('#character_tab'+currentTab).css('visibility', 'visible');
		
		if (currentTab === 0) {
			$('#level-0').show()
		} else {
			$('#level-0').hide();
		}

		if (currentTab === 1) {
			$('#level-1').show()
		} else {
			$('#level-1').hide();
		}

		if (currentTab === 2) {
			$('#level-2').show()
		} else {
			$('#level-2').hide();
		}

		todo = lvlBacteria[currentTab];
		shown = numBacteria[currentTab];
		//done = done[currentTab];
		
		$('.btn-normal').attr('class', 'btn-normal');
		$('#btn' + currentTab).attr('class', 'btn-normal btn-current');

		var groups = $('#level-' + currentTab).find('g');
		for (var i = 0; i < shown.length; i++) {
			$(groups.get(shown[i])).show();
		}
		feedbackIsPlaying = false;
	}
	
	function updateTween() {
			
			currentAnim.gotoNextFrame();
		        
			tweenID = setTimeout(function () {
            requestID = requestAnimationFrame(updateTween);
						
			if (frameNumber == totalFrameNumber) {
				currentAnim.setVisible(false);
				clearTimeout(tweenID);
				cancelAnimationFrame(requestID);
				$('#character_tab'+currentTab).css('visibility', 'visible');
				
				tab0ok = new ImageAnimation('tab0ok', 'images/tab0ok.json');
				tab0ok.setVisible(false);
				tab0wrong = new ImageAnimation('tab0wrong', 'images/tab0wrong.json');
				tab0wrong.setVisible(false);
				tab1ok = new ImageAnimation('tab1ok', 'images/tab1ok.json');
				tab1ok.setVisible(false);
				tab1wrong = new ImageAnimation('tab1wrong', 'images/tab1wrong.json');
				tab1wrong.setVisible(false);
				tab2ok = new ImageAnimation('tab2ok', 'images/tab2ok.json');
				tab2ok.setVisible(false);
				tab2wrong = new ImageAnimation('tab2wrong', 'images/tab2wrong.json');
				tab2wrong.setVisible(false);
				feedbackIsPlaying = false;
			}
	
        }, 1300 / FPS);
    }
	
	function startAnimation(animTarget) {
			if (currentTab == 0) {
				if (animTarget == "ok") {
				currentAnim = tab0ok;
				} else {
				currentAnim = tab0wrong;
				}
				$('.character').css('visibility', 'hidden');
				currentAnim.setVisible(true);
				updateTween();
			}
			if (currentTab == 1) {
				if (animTarget == "ok") {
				currentAnim = tab1ok;
				} else {
				currentAnim = tab1wrong;
				}
				$('.character').css('visibility', 'hidden');
				currentAnim.setVisible(true);
				updateTween();
			}
			if (currentTab == 2) {
				if (animTarget == "ok") {
				currentAnim = tab2ok;
				} else {
				currentAnim = tab2wrong;
				}
				$('.character').css('visibility', 'hidden');
				currentAnim.setVisible(true);
				updateTween();
			}
			feedbackIsPlaying = true;
	}
	

	function check(el) {
		el.hide();
		var g = $(el.parent());
		g.find('.bacteria-small').hide();
		g.find('.bacteria-full').show();
		
		done[currentTab]++;

		_done = Math.round((done[currentTab] / todo) * _todo);
		fireChangeEvent();

		if (done[currentTab] < todo) {
			sounds.ok.play();
			startAnimation("ok");
			
		} else {
			sounds.allok.play();
			startAnimation("ok");
			cLevel++;
		}
	}

	function hideBacteria() {
		$('#level-0').find('g').hide();
		$('#level-1').find('g').hide();
		$('#level-2').find('g').hide();
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
	
	function pulseSpeaker() {
				
		$('.btn-audio').find('.sound-waves').css('visibility', 'hidden');
		var btnAudioCont = $('.btn-audio').parent();
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


	// komunikacja z yPubem

	p.reset = function () {
		stopAudio();
		currentTab = 0;
		$('#blenda').velocity('stop').removeData().hide();
		clearTimeout(delayID);
		sounds.allok.stop();
		sounds.ok.stop();
		sounds.wrong.stop();
		done = [[0], [0], [0]];
		_done = 0;
		cLevel = 0;
		$('.active').show();
		$('.btn-current').attr('class', 'btn-normal');
		$('.btn-good').attr('class', 'btn-normal');
		$('.bacteria-small').show();
		$('.bacteria-full').hide();
		
		clearTimeout(tweenID);
		cancelAnimationFrame(requestID);
		
		tab0ok = new ImageAnimation('tab0ok', 'images/tab0ok.json');
		tab0ok.setVisible(false);
		tab0wrong = new ImageAnimation('tab0wrong', 'images/tab0wrong.json');
		tab0wrong.setVisible(false);
		tab1ok = new ImageAnimation('tab1ok', 'images/tab1ok.json');
		tab1ok.setVisible(false);
		tab1wrong = new ImageAnimation('tab1wrong', 'images/tab1wrong.json');
		tab1wrong.setVisible(false);
		tab2ok = new ImageAnimation('tab2ok', 'images/tab2ok.json');
		tab2ok.setVisible(false);
		tab2wrong = new ImageAnimation('tab2wrong', 'images/tab2wrong.json');
		tab2wrong.setVisible(false);
		feedbackIsPlaying = false;
		showLevel();
	};

	p.showAnswers = function (_showanswers) {};
	p.markCorrect = function (_markcorrect) {};
	p.markWrong = function (_markwrong) {};
	p.lock = function (_lock) {};
	p.loadState = function (obj) {
		currentTab = obj.currentTab;
		shown = obj.shown;
		done = obj.done;
		_done = obj._done;
		cLevel = obj.cLevel;
		todo = obj.todo;
		objTab1 = obj.objTab1;
		objTab2 = obj.objTab2;
		objTab3 = obj.objTab3;
		objTab1active = obj.objTab1active;
		objTab2active = obj.objTab2active;
		objTab3active = obj.objTab3active;
		
		var arr1 = objTab1.arr1;
		var arr1active = objTab1active.arr1active;       
		for (var i = 0; i < numBacteria[0].length; i++) {      
			$('#level0bacteria' + i + '-small').css('display', arr1[i*2]);
			$('#level0bacteria' + i + '-full').css('display', arr1[i*2+1]);
			$('#level0active' + i).css('display', arr1active[i]);
		}

		var arr2 = objTab2.arr2;
		var arr2active = objTab2active.arr2active;      
		for (var i = 0; i < numBacteria[1].length; i++) {      
			$('#level1bacteria' + i + '-small').css('display', arr2[i*2]);
			$('#level1bacteria' + i + '-full').css('display', arr2[i*2+1]);
			$('#level1active' + i).css('display', arr2active[i]);
		}

		var arr3 = objTab3.arr3;
		var arr3active = objTab3active.arr3active;      
		for (var i = 0; i < numBacteria[2].length; i++) {      
			$('#level2bacteria' + i + '-small').css('display', arr3[i*2]);
			$('#level2bacteria' + i + '-full').css('display', arr3[i*2+1]);
			$('#level2active' + i).css('display', arr3active[i]);
		}

		showLevel();
	};
	
	p.saveState = function () {
		$('#blenda').velocity('stop').removeData().hide();
		clearTimeout(delayID);

		var objTab1 = {};
		var objTab1active = {};
		var arr1 = [];
		var arr1active = [];    
		for (var i = 0; i < numBacteria[0].length; i++) {           
			arr1.push($('#level0bacteria' + i + '-small').css('display'));
			arr1.push($('#level0bacteria' + i + '-full').css('display'));
			arr1active.push($('#level0active' + i).css('display'));
		}
		objTab1.arr1 = arr1;
		objTab1active.arr1active = arr1active;

		var objTab2 = {};
		var objTab2active = {};
		var arr2 = [];
		var arr2active = [];     
		for (var i = 0; i < numBacteria[1].length; i++) {           
			arr2.push($('#level1bacteria' + i + '-small').css('display'));
			arr2.push($('#level1bacteria' + i + '-full').css('display'));
			arr2active.push($('#level1active' + i).css('display'));     
		}
		objTab2.arr2 = arr2;
		objTab2active.arr2active = arr2active;

		var objTab3 = {};
		var objTab3active = {};
		var arr3 = [];
		var arr3active = [];     
		for (var i = 0; i < numBacteria[2].length; i++) {           
			arr3.push($('#level2bacteria' + i + '-small').css('display'));
			arr3.push($('#level2bacteria' + i + '-full').css('display'));
			arr3active.push($('#level2active' + i).css('display'));     
		}
		objTab3.arr3 = arr3;
		objTab3active.arr3active = arr3active;
		
		

		return {
			currentTab: currentTab,
			shown: shown,
			done: done,
			_done: _done,
			cLevel: cLevel,
			todo: todo,
			objTab1: objTab1,
			objTab2: objTab2,
			objTab3: objTab3,
			objTab1active: objTab1active,
			objTab2active: objTab2active,
			objTab3active: objTab3active

		};
	};

	wnd.ExternalActivity = ExternalActivity;

})(window);