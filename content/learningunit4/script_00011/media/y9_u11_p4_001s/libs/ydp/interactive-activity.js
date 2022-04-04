(function (wnd) {

    var InteractiveActivity = function (api) {
        // init sounds
        for (var i = 0; i < manifest.length; i++) {
            if (manifest[i].src.indexOf('.mp3') !== -1) {
                if (['allOk', 'ok', 'wrong'].indexOf(manifest[i].id) !== -1) {
                    api.initSound(manifest[i].src, callback, defaultEndCallback);
                } else {
                    api.initSound(manifest[i].src, callback, endCallback, pauseCallback);
                }
            }
        }
        init();
    };

    var p = InteractiveActivity.prototype;
    var drag = null;
    var navi = navigator.userAgent.toLowerCase();
    var touchDevice = /ipad|iphone|android|windows phone|blackberry/i.test(navi);
    var eDown = touchDevice ? 'touchstart' : 'mousedown';
    var eUp = touchDevice ? 'touchend' : 'mouseup';

    var callback = {
        onSoundCreated: function (sound, src) {
            var sndID = _.findWhere(manifest, {src: src}).id;
            sounds[sndID] = sound;
        }
    };
    var endCallback = {
        onEnd: function () {
        }
    };
	 var pauseCallback = {
        onPause: function () {
			if (innerDisrupt) {
				innerDisrupt = false;
				return;
			}
			stopAudio();
        }
    };
    var defaultEndCallback = {
        onEnd: function () {
        }
    };
	
	var sounds = {};
	var currentSound, currentSndID, innerDisrupt;
	var resource, drag, cpy;
	var xmlns = 'http://www.w3.org/2000/svg';
	var xlink = 'http://www.w3.org/1999/xlink';
	var xmlspace = 'http://www.w3.org/XML/1998/namespace';
	var imagesArr, texts, draggin;
	var done, todo;
	var myLightboxOptions;
	var myLightBox;
	
	var getAbsoluteUrl = (function() {
		var a;
		return function(url) {
			if(!a) a = document.createElement('a');
			a.href = url;
			return a.href;
		};
	})();

    function init() {
		
		var imgPath = getAbsoluteUrl().replace('undefined', '');
		var cW = parseInt($('.ia-container').css('max-width'));
		var cH = parseInt($('.ia-container').css('max-height'));
		
        $('#reset').on(eDown, function (e) {
            e.preventDefault();
			if (touchDevice) {
				$('#reset').attr('class', 'button pressed');
				$(document).on(eUp, function(ev) {
					ev.preventDefault();
					$('#reset').attr('class', 'button');
					$(document).off(eUp);
					$(parent.document).off(eUp);
				});
				$(parent.document).on(eUp, function(ev) {
					ev.preventDefault();
					$('#reset').attr('class', 'button');
					$(document).off(eUp);
					$(parent.document).off(eUp);
				});
			}
			resetPress();
        }).attr('transform', 'translate(' + (cW - 70) + ' ' + (cH - 70) + ')').show();

		if (!touchDevice) {
			$('#reset').attr('class', 'button non-mobile');
		}
		
		$('#welldone').attr('x', welldonePosition.x).attr('y', welldonePosition.y);
		
		resource = $('svg').get(0);
		imagesArr = [];
		texts = [];
		done = 0;
		todo = 0;
		
		for (var i=0;i<crossword.length;i++){
			for (var j=0;j<crossword[i].length;j++){
				
				var letter = crossword[i][j].split(' ').join('');
				var txt = letter.split('[').join('').split(']').join('');
				var num = parseInt(txt);
				
				if (letter !== '') {
					var mc = document.createElementNS(xmlns, 'g');
					var bg = document.createElementNS(xmlns, 'rect');
					bg.setAttributeNS(null, 'width', 39);
					bg.setAttributeNS(null, 'height', 39);
					
					var x = conf.x + (j*39) + 0.5;
					var y = conf.y + (i*39) + 0.5 + (i*conf.spaceY);
					
					mc.setAttributeNS(null, 'transform', 'translate(' + x + ' ' + y + ')');
					mc.setAttributeNS(null, 'data-x', x);
					mc.setAttributeNS(null, 'data-y', y);
					resource.appendChild(mc);
						
					if ((letter.charAt(0) === 'i' || letter.charAt(0) === 's') && letter.length > 1) {

						var imgID = letter.split('i').join('img');
						var sndID = letter.split('s').join('snd');
						var img = document.createElementNS(xmlns, 'image');
						img.setAttributeNS(xlink, 'href', (letter.charAt(0) === 'i') ? _.find(manifest, function(item){ return item.id === imgID; }).src : 'images/audio_1.png');
						img.setAttributeNS(null, 'x', -1);
						img.setAttributeNS(null, 'y', -1);
						img.setAttributeNS(null, 'width', 40);
						img.setAttributeNS(null, 'height', 40);
						
						bg.setAttributeNS(null, 'fill', 'none');
						bg.setAttributeNS(null, 'stroke', 'rgba(0,0,0,0.2)');
						
						mc.appendChild(img);
						mc.appendChild(bg);
						
						if (letter.charAt(0) === 'i') {
							if (enableLargeImages) {
								mc.setAttributeNS(null, 'class', 'img-mini');
								mc.setAttributeNS(null, 'data-img', imgID);
								$(mc).on(eDown, openBigImage);
								imagesArr.push(imgID);
							}
						} else {
							mc.setAttributeNS(null, 'class', 'snd-mini');
							mc.setAttributeNS(null, 'data-snd', sndID);
							$(mc).on(eDown, playAudio);
						}
						
					} else {
						
						bg.setAttributeNS(null, 'fill', '#E9E9ED');
						mc.appendChild(bg);
						
						var tf;
						var semiFrame;

						if (txt !== '#') {
							if (letter.indexOf('[') !== -1) {
								tf = createTextField(txt);
								mc.appendChild(tf);
							} else {
								tf = createTextField('');
								mc.appendChild(tf);
								mc.setAttributeNS(null, 'id', 'gap_' + i + '_' + j);
								mc.setAttributeNS(null, 'data-text', letter);
								mc.setAttributeNS(null, 'class', 'gap');
								bg.setAttributeNS(null, 'class', 'gap-area');
								// word highlight
								if (j === highlightedColumn) {
									bg.setAttributeNS(null, 'fill', '#9BCACC');
								}
								todo++;
							}
						}
						if (!isNaN(num)) {
							bg.setAttributeNS(null, 'fill', '#F17164');
							tf.setAttributeNS(null, 'fill', '#FFF');
						} else if (txt === '#') {
							// inactive gap
							bg.setAttributeNS(null, 'fill', '#9BCACC');
						}
						
						if (isNaN(num)) {
							semiFrame = document.createElementNS(xmlns, 'path');
							semiFrame.setAttributeNS(null, 'fill', 'rgba(0,0,0,0.2)');
							semiFrame.setAttributeNS(null, 'd', 'M0,0 39,0 39,2 2,2 2,39 0,39z');
							mc.appendChild(semiFrame);
							bg.setAttributeNS(null, 'stroke', 'rgba(0,0,0,0.2)');
						}
					}
				}
				
				
			}
		}

		// s-list
		var abc = 'abcdefghijklmnopqrstuvwxyz'.split('');
		var shiftX = 0;
		var shiftY = 0;
		var cntr = 0;
		for(var i=0;i<abc.length;i++) {
			var txt = abc[i];
			var tf = createTextField(txt, true);
			var element = document.createElementNS(xmlns, 'g');
			var bg = document.createElementNS(xmlns, 'rect');
			var shadow = document.createElementNS(xmlns, 'rect');
			
			var x = conf.slistX + shiftX;
			var y = conf.slistY + shiftY;
			
			element.setAttributeNS(null, 'class', 'source-list-element');
			element.setAttributeNS(null, 'transform', 'translate(' + x + ' ' + y + ')');
			element.setAttributeNS(null, 'data-x', x);
			element.setAttributeNS(null, 'data-y', y);
			element.setAttributeNS(null, 'data-start-x', x);
			element.setAttributeNS(null, 'data-start-y', y);
			element.setAttributeNS(null, 'data-text', txt);
			
			bg.setAttributeNS(null, 'class', 'element-bg');
			bg.setAttributeNS(null, 'width', 40);
			bg.setAttributeNS(null, 'height', 40);
			bg.setAttributeNS(null, 'fill', '#EEE');

			(touchDevice) ? shadow.setAttributeNS(null, 'fill', '#CCC') : shadow.setAttributeNS(null, 'fill', 'rgba(0,0,0,0.2)');
			shadow.setAttributeNS(null, 'class', 'element-shadow');
			shadow.setAttributeNS(null, 'x', 1);
			shadow.setAttributeNS(null, 'y', 1);
			shadow.setAttributeNS(null, 'width', 40);
			shadow.setAttributeNS(null, 'height', 40);

			texts.push(element);
			
			element.appendChild(shadow);
			element.appendChild(bg);
			element.appendChild(tf);
			resource.appendChild(element);
			
			shiftX += 45;
			cntr++;
			if (cntr === conf.slistRowElems) {
				cntr = 0;
				shiftX = 0;
				shiftY += 45;
			}
		}
		
		if (textQuestions && textQuestions.show) {
			var tf = document.createElementNS(xmlns, 'text');
			tf.setAttributeNS(null, 'font-size', '18px');
			tf.setAttributeNS(null, 'font-family', 'Arial');
			tf.setAttributeNS(null, 'fill', textQuestions.color);
			tf.setAttributeNS(null, 'transform', 'translate(' + textQuestions.x + ' ' + textQuestions.y + ')');
			
			for(var i=0;i<textQuestions.texts.length;i++) {
				var ts = document.createElementNS(xmlns, 'tspan');
				ts.setAttributeNS(null, 'x', 0);
				ts.setAttributeNS(null, 'y', 13 + (i * 20) + (i * textQuestions.shiftY));
				ts.textContent = textQuestions.texts[i];
				tf.appendChild(ts);
			}
			resource.appendChild(tf);
		}
		
		if (blacklines) {
			for(var i=0;i<blacklines.length;i++) {
				var rect = document.createElementNS(xmlns, 'rect');
				var obj = blacklines[i];
				rect.setAttributeNS(null, 'x', conf.x - (obj.type === 'v' ? 2 : 0) + obj.x * 39);
				rect.setAttributeNS(null, 'y', conf.y - (obj.type === 'v' ? 0 : 2) + obj.y * 39);
				rect.setAttributeNS(null, 'width', obj.type === 'v' ? 5 : 40);
				rect.setAttributeNS(null, 'height', obj.type === 'v' ? 40 : 5);
				resource.appendChild(rect);
			}
		}
		
		if (enableLargeImages && imagesArr.length) {
			myLightboxOptions = new window.parent.LightboxOptions();
			if (myLightboxOptions) {
				myLightboxOptions.labelImage = "";
				myLightboxOptions.labelOf = "";
				myLightBox = new window.parent.Lightbox(myLightboxOptions);
				for (var i=0; i<imagesArr.length; i++) {
					myLightBox.add(imgPath + _.findWhere(manifest, {id: imagesArr[i]+'f'}).src, "" );
				}
			}
		}
		
		initSourceList();
    }
	
	function openBigImage(e) {
		e.preventDefault();
		var imgID = imagesArr.indexOf($(this).attr('data-img'));
		if (myLightBox) {
			myLightBox.disableKeyboardNav();
			for (var i=1; i<=3100; i+=1000) {
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
	}
	
	function playAudio(e) {
		e.preventDefault();
		var sndID = $(this).attr('data-snd');
		if (currentSound) {
			innerDisrupt = true;
			currentSound.stop();
			currentSound = null;
		}
		if (sndID !== currentSndID) {
			if (currentSndID && currentSndID !== '') {
				$('.snd-mini[data-snd="' + currentSndID + '"]').find('image').get(0).setAttributeNS(xlink, 'href', 'images/audio_1.png');
			}
			currentSndID = sndID;
			currentSound = sounds[sndID];
			currentSound.play();
			$(this).find('image').get(0).setAttributeNS(xlink, 'href', 'images/audio_click.png');
		} else {
			stopAudio();
		}
	}
	
	function stopAudio() {
		if (currentSndID && currentSndID !== '') {
			$('.snd-mini[data-snd="' + currentSndID + '"]').find('image').get(0).setAttributeNS(xlink, 'href', 'images/audio_1.png');
			currentSound = null;
			currentSndID = '';
		}
	}
	
	function createTextField(s, isSList) {
		var txtfld = document.createElementNS(xmlns, 'text');
		txtfld.setAttributeNS(null, 'font-size', '18px');
		txtfld.setAttributeNS(null, 'font-family', 'Arial');
		txtfld.setAttributeNS(null, 'fill', '#595B68');
		txtfld.setAttributeNS(null, 'text-anchor', 'middle');
		txtfld.setAttributeNS(null, 'x', isSList ? 20 : 19);
		txtfld.setAttributeNS(null, 'y', 26);
		txtfld.textContent = s;
		return txtfld;
	}
	
	function initSourceList() {
		interact('.source-list-element')
            .draggable({
                inertia: false,
                onstart: dragStartListener,
                onmove: dragMoveListener,
                onend: dragEndListener
            })
            .styleCursor(false);
			
		interact('.gap')
            .draggable({
                inertia: false,
                onstart: dragStartListener2,
                onmove: dragMoveListener,
                onend: dragEndListener
            })
            .styleCursor(false);

        interact('.gap-area').dropzone({
            accept: '.source-list-element.active-mobile, .source-list-element.active, .gap',
            overlap: 'pointer',
            ondragenter: function (event) {
                event.target.parentNode.setAttribute('class', 'gap gap-target');
            },
            ondragleave: function (event) {
                event.target.parentNode.setAttribute('class', 'gap');
            },
            ondrop: function (event) {
                event.target.parentNode.setAttribute('class', 'gap');
                checkAnswer(event.target.parentNode);
            }
        });
	}
	
	function dragStartListener(event) {
        event.preventDefault();
		if (draggin)
			return false;
        drag = event.target;		
		cpy = drag.cloneNode(true);		
		$(cpy).find('.element-bg').css('fill', '#87889d');
		$(cpy).find('.element-shadow').css('fill', 'rgba(0,0,0.0.2)');
		$(cpy).find('text').attr('fill', '#FFF');
		(touchDevice) ? drag.setAttribute('class', 'source-list-element active-mobile') : drag.setAttribute('class', 'source-list-element active');
		resource.appendChild(cpy);
		resource.appendChild(drag);
		draggin = true;
    }

    function dragMoveListener(event) {
        event.preventDefault();
		if (draggin) {
			var x = (parseFloat(drag.getAttribute('data-x')) || 0) + event.dx / resizeFactor;
			var y = (parseFloat(drag.getAttribute('data-y')) || 0) + event.dy / resizeFactor;
			drag.setAttribute('data-x', x);
			drag.setAttribute('data-y', y);
			drag.setAttribute('transform', 'translate(' + x + ' ' + y + ')');
		}
    }

    function dragEndListener(event) {
        event.preventDefault();
		if (draggin) {
			var x = drag.getAttribute('data-start-x');
			var y = drag.getAttribute('data-start-y');
			drag.setAttribute('data-x', x);
			drag.setAttribute('data-y', y);
			drag.setAttribute('transform', 'translate(' + x + ' ' + y + ')');
			drag.setAttribute('class', 'source-list-element');
			$(cpy).remove();
		}
		draggin = false;
    }
	
	function dragStartListener2(event) {
        event.preventDefault();
		var g = event.target;
		var dropped = g.getAttributeNS(null, 'data-dropped')
		if (dropped && dropped !== '') {
			draggin = true;
			$(g).removeAttr('data-dropped').removeAttr('data-ok');
			$(g).find('text').get(0).textContent = '';
			drag = $('.source-list-element[data-text="' + dropped + '"]').get(0);
			
			cpy = drag.cloneNode(true);		
			$(cpy).find('.element-bg').css('fill', '#87889d');
			$(cpy).find('text').attr('fill', '#FFF');
			(touchDevice) ? drag.setAttribute('class', 'source-list-element active-mobile') : drag.setAttribute('class', 'source-list-element active');
			
			var x = parseInt(g.getAttribute('data-x'));
			var y = parseInt(g.getAttribute('data-y'));
			drag.setAttribute('data-x', x);
			drag.setAttribute('data-y', y);
			drag.setAttribute('transform', 'translate(' + x + ' ' + y + ')');
			
			resource.appendChild(cpy);
			resource.appendChild(drag);
		}
	}
	
	function checkAnswer(g) {
		var gTxt = g.getAttributeNS(null, 'data-text');
		var dTxt = drag.getAttributeNS(null, 'data-text');
		var gtf = $(g).find('text').get(0);
		gtf.textContent = dTxt;
		g.setAttributeNS(null, 'data-dropped', dTxt);
		if (gTxt === dTxt) {
			g.setAttributeNS(null, 'data-ok', true);
			done = $('.gap[data-ok="true"]').length;
			var errors = $('.gap[data-ok="false"]').length;

			if (done === todo && !errors) {
				sounds.allOk.play();
				onAllOk();
			} else {
				sounds.ok.play();
			}
		} else {
			g.setAttributeNS(null, 'data-ok', false);
			sounds.wrong.play();
		}
	}
	
	function onAllOk() {
		$('#welldone').show();
		resource.appendChild($('#welldone').get(0));
		interact('.source-list-element').draggable(false);
		interact('.gap').draggable(false);
		$('.source-list-element').attr('class', 'source-list-element disabled');
		$('.gap').attr('class', 'gap disabled');
	}
	
    function resetPress() {
		if (currentSound) {
			currentSound.stop();
			currentSound = null;
		}
		
        $('#welldone').hide();
		interact('.source-list-element').draggable(true);
		interact('.gap').draggable(true);
		$('.source-list-element').attr('class', 'source-list-element');
		$('.gap').attr('class', 'gap');
		var gaps = $('.gap[data-dropped]');
		for(var i=0;i<gaps.length;i++) {
			var g = $(gaps.get(i));
			g.find('text').get(0).textContent = '';
			g.removeAttr('data-dropped').removeAttr('data-ok');
		}
		done = 0;
    }

    p.reset = function () {
		
	};
	
    p.loadState = function (obj) {
        done = obj.done;
		var pressedObj = obj.pressed;
		for (var id in pressedObj) {
			var arr = pressedObj[id];
			$('#'+id).attr('data-dropped', arr[0]).attr('data-ok', arr[1]);
			$('#'+id).find('text').get(0).textContent = arr[0];
		}
		var errors = $('.gap[data-ok="false"]').length;
		if (done === todo && !errors) {
			onAllOk();
		}
    };

    p.saveState = function () {
		var pressed = $('.gap[data-dropped]');
		var pressedObj = {};
		for(var i=0;i<pressed.length;i++) {
			var g = $(pressed.get(i));
			pressedObj[g.attr('id')] = [g.attr('data-dropped'), g.attr('data-ok')];
		}
        return {
			done: done,
			pressed: pressedObj
		};
    };

    wnd.InteractiveActivity = InteractiveActivity;

})(window);