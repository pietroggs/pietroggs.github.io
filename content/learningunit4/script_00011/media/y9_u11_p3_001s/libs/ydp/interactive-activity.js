(function (wnd) {

    var InteractiveActivity = function (api) {
		for (var i = 0; i < manifest.length; i++) {
            if (manifest[i].src.indexOf('.mp3') !== -1) {
				var sndID = manifest[i].id;
				if (['ok', 'allOk', 'wrong'].indexOf(sndID) > -1) {
					api.initSound(manifest[i].src, callback, defaultEndCallback);
				} else {
					api.initSound(manifest[i].src, callback, endCallback, pauseCallback);
				}
            }
        }
        init();
    };

    var p = InteractiveActivity.prototype;
    var touchDevice = /ipad|iphone|android|windows phone|blackberry/i.test(navigator.userAgent.toLowerCase());
    var eDown = touchDevice ? 'touchstart' : 'mousedown';
    var eUp = touchDevice ? 'touchend' : 'mouseup';
    var eMove = touchDevice ? 'touchmove' : 'mousemove';
	
	var callback = {
        onSoundCreated: function (sound, src) {
			var obj = _.findWhere(manifest, {src: src});
            sounds[obj.id] = sound;
        }
    };
	var defaultEndCallback = {
		onEnd: function () {}
	}
	var endCallback = {
		onEnd: function () {
			innerDisrupt = true;
			setTimeout(function() {
				innerDisrupt = false;
			}, 10);
			currentSound = null;
			currentSoundID = '';
			$('.snd-tip').removeClass('pressed');
			$('.tip').removeClass('pressed');
		}
	}
	var pauseCallback = {
		onPause: function () {
			if (innerDisrupt) {
				innerDisrupt = false;
				return;
			}
			stopAudio();
		}
	}

	var sounds = {};
	var currentSound, currentSoundID, innerDisrupt;
	var elemsArr, elemsWordArr, almightyObj;
	var maxX, maxY;
	var todo, done = 0, errors = 0;
	var timerID, gameState = '';
	var timerProgress, timerTxt, counters;
	var time, timePassed;
	var largeImages;
	var myLightBox;
	var myLightboxOptions;
	var wordCellsID;
	
	var getAbsoluteUrl = (function() {
		var a;
		return function(url) {
			if(!a) a = document.createElement('a');
			a.href = url;
			return a.href;
		};
	})();
    
	function init() {
		
		time = 10 * 60; // sec
		timePassed = 0;
		
		$('#'+graphVersion+'-graph').show();
		
		$('.reset-btn').on(eDown, function(e) {
			e.preventDefault();
			resetGame();
		});
		
		$('.start-btn').on(eDown, function(e) {
			e.preventDefault();
			if (gameState === '' || gameState === 'SAVED') {
				gameState = 'PLAY';
				$(this).addClass('button-pressed').removeClass('button');
				$('.words-cell').removeClass('disabled');
				if (!touchDevice) {
					$('.snd-tip').addClass('non-mobile');
					$('.img-btn').addClass('non-mobile');
				}
				timerID = setInterval(updateTimeProgress, 1000);
			}
		});
		
		createTips();
		
		timerProgress = $('#timer-prog');
		timerTxt = $('#timer');
		counters = $('#counters');
		counters.text('0/' + words.length).show();
		timerTxt.text(getFormatedTime(time));
		
		maxX = size[0];
		maxY = size[1];
		var rowType = (maxX === 15) ? 'words-row-15' : 'words-row-10';
		var str = '';
		for(var i=0;i<maxY;i++) {
			str += '<div class="words-row ' + rowType + '">'
			for(var j=0;j<maxX;j++) {
				str += '<div class="words-cell"><span></span></div>';
			}
			str += '</div>';
		}
		
		$('#letters').html(str);
		
		$('.words-cell').on(eDown, function(e) {
			e.preventDefault();
			if (gameState !== 'PLAY') {
				return;
			}
			var pressed = ($(this).attr('data-pressed')  === 'true') ? false : true;
			$(this).attr('data-pressed', pressed);
			check($(this), pressed);
		}).addClass('disabled');
		
		
		if (!touchDevice) {
			$('.reset-btn').addClass('non-mobile');
			$('.start-btn').addClass('non-mobile');
			$('.words-cell').addClass('words-animated');
		}
		
		words = _.sortBy(words, function(str){ return -str.length });
		todo = words.join('').length;
		initCrossword();
	}
	
	function createTips() {
		var tipImgSnd = '';
		var tipTxt = '';
		
		$('#tips').css({ left:tipsConf.x+'px', top:tipsConf.y+'px' });
		
		if (txtTips.length) {
			$('#txt-tips').html(txtTips.join('<br/>'));
		}
		
		if (imgTips.length) {
			var currImg = 0;
			var currRow = 0;
			var sx = -1, x = 0, y = 0;
			var maxImg = 0;
			if (imgTipsConfig.align) {
				maxImg = _.max(imgTipsConfig.set);
			}
			for(var i=0;i<imgTips.length;i++) {
				var tip = imgTips[i];
				var nImg = imgTipsConfig.set[currRow];
				if (sx === -1) {
					if (maxImg && maxImg > imgTipsConfig.set[currRow]) {
						sx = ((imgTipsConfig.w * maxImg) + (imgTipsConfig.spaceX * (maxImg - 1))) - ((imgTipsConfig.w * nImg) + (imgTipsConfig.spaceX * (nImg - 1)));
						sx = sx / 2;
					} else {
						sx = 0;
					}
				}
				if(tip.img && tip.img !== '') {
					tipImgSnd +='<div class="tip" ' + (tip.miniature ? 'data-big="' + tip.bigImg + '"' : '') + 'style="left:' + (sx + x) + 'px; top:' + y + 'px; width:' + (imgTipsConfig.w + 4) + 'px; height:' + (imgTipsConfig.h + 4) + 'px;">' +
								'<img class="img-tip" src="' + _.findWhere(manifest, {id:tip.img}).src + '"/>' +
								((tip.snd && tip.snd !== '') ? '<img class="img-btn" data-snd="' + tip.snd + '" src="images/audioBtn.png"/>' : '') +
								'<img class="img-frame" src="' + imgTipsConfig.frame + '"/></div>';
					currImg++;
					x += imgTipsConfig.w + imgTipsConfig.spaceX;
					if (currImg === nImg) {
						currRow++;
						currImg = 0;
						x = 0;
						y += imgTipsConfig.h + imgTipsConfig.spaceY;
						sx = -1;
					}
				}
			}
			$('#img-snd-tips').html(tipImgSnd);
			
			var tipButtons = $('.tip:has(.img-btn)');
			if(tipButtons.length) {
				tipButtons.addClass('active');
				tipButtons.on(eDown, function(e) {
					e.preventDefault();
					if (gameState === 'PLAY' || gameState === 'OVER' || gameState === 'FAILED') {
						$('.tip').removeClass('pressed');
						$(this).addClass('pressed');
						var snd = $(this).find('.img-btn').attr('data-snd');
						playAudio(snd);
					}
				});
			}
			
			var tipMini = $('.tip[data-big]');
			if(tipMini.length) {
				
				myLightboxOptions = new window.parent.LightboxOptions();
				myLightboxOptions.labelImage = "";
				myLightboxOptions.labelOf = "";
				myLightBox = new window.parent.Lightbox(myLightboxOptions);
				
				var imgPath = getAbsoluteUrl().replace('undefined', '');	
				largeImages = [];
				
				for(var i=0;i<tipMini.length;i++) {
					var imgID = $(tipMini.get(i)).attr('data-big');
					largeImages.push(imgID);
					myLightBox.add(imgPath + _.findWhere(manifest, {id:imgID}).src, "" );
				}
				
				tipMini.addClass('active');
				tipMini.on(eDown, function(e) {
					e.preventDefault();
					var imgID = $(this).attr('data-big');
					openBigImage(largeImages.indexOf(imgID));
				});
			}
		}
		
		if (sndTips.length) {
			for(var i=0;i<sndTips.length;i++) {
				var tip = sndTips[i];
				tipImgSnd += '<div class="snd-tip" data-snd="' + tip.snd + '" style="left:' + tip.x + 'px; top:' + tip.y + 'px;"></div>';
			}
			$('#img-snd-tips').html(tipImgSnd);
			
			$('.snd-tip').on(eDown, function(e) {
				e.preventDefault();
				if (gameState === 'PLAY' || gameState === 'OVER' || gameState === 'FAILED') {
					var snd = $(this).attr('data-snd');
					playAudio(snd, true, $(this));
				}
			});
		}	
	}
	
	function openBigImage(imgID) {
		myLightBox.disableKeyboardNav();
		for (var i=0; i<=3000; i+=1000) {
			setTimeout(function() {
				myLightBox.disableKeyboardNav();
			}, i);
		}
		
		myLightBox.overrideHandlers(myLightBox);			
		$(window.parent).on("resize", myLightBox.sizeOverlay);
		$('select, object, embed', parent.document).css({
			visibility: "hidden"
		});
		$('#lightboxOverlay').width($(window.parent).width()).height($(window.parent).height()).fadeIn(myLightBox.options.fadeDuration);
		$('.lightboxOverlay').css({ overflow: "scroll" });

		myLightBox.prepareView();
		myLightBox.changeImage(imgID);
		
		$('.lb-nav, .lb-prev, .lb-next, .lb-number', parent.document).css({
			visibility: "hidden"
		});
	}
	
	function initCrossword() {
		if (gameState === 'SAVED' || gameState === 'PLAY') {
			return;
		}
		elemsArr = resetArray();
		elemsWordArr = resetArray();
		almightyObj = {};
		
		var rows = $('.words-row');
		
		for(var i=0;i<words.length;i++) {
			var word = words[i];
			var pObj = getFreePlace(word);
			if (!pObj) {
				return initCrossword();
			} else {
				almightyObj[word] = pObj;
				var r = pObj.y;
				var c = pObj.x;
				for(var j=0;j<word.length;j++) {
					r = (pObj.dir === "vertical") ? pObj.y + j : pObj.y;
					c = (pObj.dir === "vertical") ? pObj.x : pObj.x + j;
					elemsArr[r][c] = word.charAt(j);
					elemsWordArr[r][c] = word;
				}
			}
		}
		
		for(var i=0;i<maxY;i++) {
			var row = $(rows.get(i));
			var cells = $(row).find('.words-cell');
			for(var j=0;j<maxX;j++) {
				var cell = $(cells.get(j));
				var txt = elemsArr[i][j];
				var span = cell.find('span');
				if (txt === '' || txt === undefined) {
					elemsArr[i][j] = txt = _.sample(abc);
					cell.removeAttr('data-ok').removeAttr('data-allwordok').removeAttr('data-word');
				} else {
					cell.attr('data-ok', true).attr('data-allwordok', false).attr('data-word', elemsWordArr[i][j]);
				}
				cell.attr('data-pressed', false);
				span.text(txt);
			}
		}
		getWordCells();	
	}
	
	function getWordCells() {
		var rows = $('.words-row');
		var str = '';
		for(var i=0;i<words.length;i++) {
			var word = words[i];
			var pObj = almightyObj[word];
			var r = pObj.y;
			var c = pObj.x;
			//almightyObj[word].cells = (pObj.dir === "vertical") ? $(rows).find('.words-cell:nth-child(' + (c + 1) +')').slice(r, r + word.length) : $(rows.get(r)).find('.words-cell').slice(c, c + word.length);
			almightyObj[word].cells = $(rows).find('.words-cell[data-word="' + word + '"]');
		}
	}
	
	function getVerticalCells(rows, word, r, c) {
		console.log(word, '   row:', r, '   col:', c);
		return $(rows).find('.words-cell:nth-child(' + (c + 1) +')').slice(r, r + word.length) 
	}

	function getFreePlace(word) {
		var maxiterations = 50;
		var iterations = 0;
		
		do {
			var randStartX = Math.floor(Math.random() * maxX);
			var randStartY = Math.floor(Math.random() * maxY);
			var direction = (Math.random() > 0.5) ? "vertical" : "horizontal";
			var isOK = true;
				
			if (direction === "vertical") {
				if (randStartY + word.length <= maxY) {
					for(var i=0;i<word.length;i++) {
						var letter = elemsArr[randStartY + i][randStartX];
						if (!(letter === '' || letter === undefined)) {
							isOK = false;
							break;
						}
					}
				} else {
					isOK = false;
				}
			} else {
				if (randStartX + word.length <= maxX) {
					for(var i=0;i<word.length;i++) {
						var letter = elemsArr[randStartY][randStartX + i];
						if (!(letter === '' || letter === undefined)) {
							isOK = false;
							break;
						}
					}
				} else {
					isOK = false;
				}
			}
			iterations++;
			if (iterations === maxiterations) {
				return false;
			}
		} while (!isOK)
		
		return { x:randStartX, y:randStartY, dir:direction };
	}
	
	function check(el, pressed) {
		var ok = (el.attr('data-ok') === 'true');
		if (pressed) {
			if (ok) {
				done++;
				if (done < todo) {
					sounds.ok.play();
				} else if (!errors) {
					sounds.allOk.play();
					stopGame(true);
				} else {
					sounds.ok.play();
				}
			} else {
				sounds.wrong.play();
				errors++;
			}
		} else {
			if (ok) {
				done--;
			} else {
				errors--;
			}
			if (done === todo && !errors) {
				sounds.allOk.play();
				stopGame(true);
			}
		}
		checkSingleWords();
	}
	
	function checkSingleWords() {
		var dn = 0;
		for(var i=0;i<words.length;i++){
			var pObj = almightyObj[words[i]];
			var lettersTodo = words[i].length;
			var lettersDone = $(pObj.cells).filter('[data-pressed="true"]').length;
			if (lettersTodo === lettersDone) {
				dn++;
				$(pObj.cells).attr('data-allwordok', 'true');
			} else {
				$(pObj.cells).attr('data-allwordok', 'false');
			}
		}
		counters.text(dn + '/' + words.length);
	}
	
	function updateTimeProgress() {
		timePassed++;
		if (timePassed > time) {
			timePassed = time;
		}
		var progW = (graphVersion === 'lower') ? 150 : 142;
		timerProgress.attr('width', progW * (timePassed / time));
		timerTxt.text(getFormatedTime(time - timePassed));
		if (timePassed === time) {
			stopGame(false);
		}
	}
	
	function getFormatedTime(sec) {
		var minutes = Math.floor(sec / 60);
		var seconds = sec % 60;
		var minStr = (minutes < 10) ? "0" + minutes : minutes;
		var secStr = (seconds < 10) ? "0" + seconds : seconds;
		return (minStr + ":" + secStr);
	}
	
	function resetArray() {
		var arr = _.range(maxY).map(function () {
			return _.range(maxX).map(function () {
				return '';
			});
		});
		return arr;
	}
	
	function stopGame(allOK) {
		gameState = allOK ? 'OVER' : 'FAILED';
		clearInterval(timerID);
		if (currentSound) {
			currentSound.stop();
			currentSound = null;
		}
		$('.words-cell').addClass('disabled');
		if (allOK)
			$('#welldone').show();
		else
			$('.words-cell').addClass('showanswers');
	}
	
	function playAudio(snd, isAudioButton, btn) {
		if (currentSound) {
			innerDisrupt = true;
			currentSound.stop();
			$('.snd-tip').removeClass('pressed');
		}
		if (snd !== currentSoundID) {
			currentSound = sounds[snd];
			currentSound.play();
			currentSoundID = snd;
			if (isAudioButton)
				btn.addClass('pressed');
		} else {
			currentSoundID = '';
			$('.tip').removeClass('pressed');
		}
	}
	
	function stopAudio() {
		if (currentSound) {
			currentSound.stop();
			currentSound = null;
		}
		currentSoundID = '';
		$('.snd-tip').removeClass('pressed');
		$('.tip').removeClass('pressed');
	}
	
	function resetGame() {
		clearTimeout(wordCellsID);
		done = 0;
		errors = 0;
		gameState = '';
		timePassed = 0;
		currentSoundID = '';
		clearInterval(timerID);
		if (currentSound) {
			innerDisrupt = true;
			currentSound.stop();
			currentSound = null;
		}
		$('.snd-tip').removeClass('non-mobile').removeClass('pressed');
		$('.tip').removeClass('pressed');
		$('.img-btn').removeClass('non-mobile');
		$('.start-btn').addClass('button').removeClass('button-pressed');
		$('.words-cell').addClass('disabled').removeClass('showanswers');
		$('#welldone').hide();
		counters.text('0/' + words.length);
		timerProgress.attr('width', 0);
		timerTxt.text(getFormatedTime(time));
		initCrossword();
	}
	
    p.reset = function () {
        
    };

    p.loadState = function (obj) {
		gameState = obj.gameState;
		elemsArr = obj.elemsArr;
		elemsWordArr = obj.elemsWordArr;
		almightyObj = obj.almightyObj;
		done = obj.done;
		errors = obj.errors;
		timePassed = obj.timePassed;
		
		var letters = obj.letters;
		var rows = $('.words-row');
		for(var i=0;i<maxY;i++) {
			var row = $(rows.get(i));
			var cells = $(row).find('.words-cell');
			for(var j=0;j<maxX;j++) {
				var cell = $(cells.get(j));
				var txt = elemsArr[i][j];
				var span = cell.find('span');
				span.text(txt);
				var id = (i * maxY) + j;
				var cellsaved = letters[i][j];
				if (cellsaved.ok) {
					cell.attr('data-ok', true).attr('data-allwordok', cellsaved.all).attr('data-word', cellsaved.word);
				} else {
					cell.removeAttr('data-ok').removeAttr('data-allwordok').removeAttr('data-word');
				}
				cell.attr('data-pressed', cellsaved.pressed);
			}
		}
		
		for(var i=0;i<words.length;i++) {
			var word = words[i];
			var pObj = almightyObj[word];
			var r = pObj.y;
			var c = pObj.x;
			almightyObj[word].cells = $(rows).find('.words-cell[data-word="' + word + '"]'); //(pObj.dir === "vertical") ? $(rows).find('.words-cell:nth-child(' + (c + 1) +')').slice(r, r + word.length) : $(rows.get(r)).find('.words-cell').slice(c, c + word.length);
		}
		
        if (gameState === 'PLAY') {
			gameState = 'SAVED';
		} else if (gameState === 'OVER' || gameState === 'FAILED') {
			stopGame(gameState === 'OVER');
			$('.start-btn').addClass('button-pressed').removeClass('button');
		}
		if (timePassed) {
			timerTxt.text(getFormatedTime(time - timePassed));
			timerProgress.attr('width', 142 * (timePassed / time));
		}
		checkSingleWords();
    };

    p.saveState = function () {
		var letters = [];
		var rows = $('.words-row');
		for(var i=0;i<maxY;i++) {
			var row = $(rows.get(i));
			var cells = $(row).find('.words-cell');
			letters[i] = [];
			for(var j=0;j<maxX;j++) {
				var cell = $(cells.get(j));
				letters[i][j] = { 'pressed': cell.attr('data-pressed'), 'ok': cell.attr('data-ok'), 'all': cell.attr('data-allwordok'), 'word': cell.attr('data-word') };
			}
		}
		
        return {
			gameState: gameState,
			almightyObj: almightyObj,
			elemsArr: elemsArr,
			elemsWordArr: elemsWordArr,
			done: done,
			errors: errors,
			timePassed: timePassed,
			letters: letters
		};
    };

    wnd.InteractiveActivity = InteractiveActivity;

})(window);