(function (wnd) {

    var InteractiveActivity = function (api) {
		for (var i = 0; i < manifest.length; i++) {
            if (manifest[i].src.indexOf('.mp3') !== -1) {
                api.initSound(manifest[i].src, callback);
            }
        }
        init();
    };

    var p = InteractiveActivity.prototype;
    var touchDevice = /ipad|ipod|iphone|android|webos|windows phone|blackberry/i.test(navigator.userAgent.toLowerCase());
    var eDown = touchDevice ? 'touchstart' : 'mousedown';
	
	var callback = {
        onSoundCreated: function (sound, src) {
            var sndID = _.findWhere(manifest, {src: src}).id;
            sounds[sndID] = sound;
        }
    };
	var sounds = {};
	var currentSound;
	var currentBtnID = -1;
	var tukanState = 0;
	var audioPlayed = [0,0,0];
	var btnTimeout, tukanTimeout, animDelay;
	var headMC, wing0MC, wing1MC, neckMC, bodyMC, leg0MC, leg1MC, tailMC;
	var currentFrame;
	var previousFrame = -1;
	var totalFrames = [0,150,150,90];
	var okSnd = 'none';
	var lastFeedback = 'none';
	
	function init() {
		
		
		$('.btn-audio').on(eDown, function(e) {
			e.preventDefault();
			
			sounds.ok01.stop();
			sounds.ok02.stop();
			var id = parseInt($(this).attr('id').slice(-1));
			if (audioPlayed.join('') === '111' || audioPlayed[id]) {
				//return;
			}
			//if (currentBtnID !== id) {
				if (currentBtnID !== -1) {
					turnButton('off', currentBtnID);
					currentSound.stop();
					sounds.allok.stop();
				}
				currentBtnID = id;
				currentSound = sounds['snd'+id];
				currentSound.play();
				turnButton('on', currentBtnID);
				clearTimeout(btnTimeout);
				clearTimeout(tukanTimeout);
				setTukan(1);
				
				var delay = soundDurations['snd'+id];
				if (touchDevice)
					delay += 750;
				
				btnTimeout = setTimeout(function() {
					turnButton('off', currentBtnID);
				}, delay);
				
				if (audioPlayed.join('') != '111') {
				tukanTimeout = setTimeout(function() {
					setTukan(2);
					
				}, 500);
				}
			//}
		});
		
		headMC = new MovieClip($('#tukan-head'));
		wing0MC = new MovieClip($('#tukan-wing-0'));
		wing1MC = new MovieClip($('#tukan-wing-1'));	
		neckMC = new Sprite('tukan-neck');
		bodyMC = new Sprite('tukan-body');
		leg0MC = new Sprite('tukan-leg-0');
		leg1MC = new Sprite('tukan-leg-1');
		tailMC = new Sprite('tukan-tail');
		
		
		createjs.Ticker.addEventListener("tick", tick);
		createjs.Ticker.setFPS(25);
		createjs.Ticker.setPaused(true);
		
		
		$('#btn-tukan').on(eDown, function(e) {
			e.preventDefault();
			if (currentBtnID !== -1) {
					turnButton('off', currentBtnID);
					currentSound.stop();
				}
			if (tukanState === 2) {
				$('#btn-tukan').hide();
				setTukan(3);
				audioPlayed[currentBtnID] = 1;
				//$('#btn' + currentBtnID).attr('class', 'btn-audio disabled');
				
				if (audioPlayed.join('') === '111') {
					sounds.allok.play();
				} else {
					//var okSnd = _.sample(['ok01', 'ok02']);
					lastFeedback = okSnd;
					okSnd = 'ok0' + (audioPlayed[0] + audioPlayed[1] + audioPlayed[2]);
					if (lastFeedback == okSnd) {
						if (okSnd == 'ok01') { okSnd = 'ok02' };
						if (okSnd == 'ok02') { okSnd = 'ok01' };
					}
					sounds[okSnd].play();
				}
				
			}
		});
	}
	
	function tick(event) {
		if (!tukanState || createjs.Ticker.getPaused()) return;
		if (currentFrame !== previousFrame) {
			
			headMC.gotoAndStop(currentFrame);
			wing0MC.gotoAndStop(currentFrame);
			wing1MC.gotoAndStop(currentFrame);
			neckMC.gotoAndStop(currentFrame);
			bodyMC.gotoAndStop(currentFrame);
			leg0MC.gotoAndStop(currentFrame);
			leg1MC.gotoAndStop(currentFrame);
			tailMC.gotoAndStop(currentFrame);
			
			previousFrame = currentFrame;
			currentFrame++;
			if (currentFrame >= totalFrames[tukanState]) {
				currentFrame = 0; // loop
				if (tukanState === 3) {
					createjs.Ticker.setPaused(true);
					setTukan(0);
				}
			}
		}
	}
	
	function turnButton(mode, id) {
		$('#btn'+id).find('.sound-waves').css('display', (mode === 'off' ? 'none' : 'block'));
		var cls = $('#btn'+id).attr('class');
		if (mode === 'on' && cls.indexOf('animated') < 0) {
			cls += ' animated';
		} else if (mode === 'off' && cls.indexOf('animated') > -1) {
			cls = cls.replace(' animated', '');
		}
		$('#btn'+id).attr('class', cls);
	}
	
	function setTukan(phase) {
		tukanState = phase;
		clearTimeout(animDelay);
		createjs.Ticker.setPaused(true);
		clearAnimation();
		start = 0;
		currentFrame = -1;
		previousFrame = -10;
		
		if (phase === 1) {
			setAnimation1();
			animDelay = setTimeout(function() { createjs.Ticker.setPaused(false); }, 250);
		} else if (phase === 2) {
			setAnimation2();
			animDelay = setTimeout(function() { createjs.Ticker.setPaused(false); }, 250);
			$('#btn-tukan').show();
		} else if (phase === 3) {
			setAnimation3();
			animDelay = setTimeout(function() { createjs.Ticker.setPaused(false); }, 250);
		}
	}
	
	function clearAnimation() {
		headMC.setTimeline([[0,'head-init']]);
		headMC.setTransforms({frame0:'translateZ(0px)|0.01s'});
		headMC.reset();
		wing1MC.setTimeline([[0,'wing-closed']]);
		wing1MC.setTransforms({frame0:'translateZ(0px)|0.01s'});
		wing1MC.reset();
		neckMC.setTransforms({frame0:'translateZ(0px)|0.01s'});
		neckMC.reset();
		bodyMC.setTransforms({frame0:'translateZ(0px)|0.01s'});
		bodyMC.reset();
		leg0MC.setTransforms({frame0:'translateZ(0px)|0.01s'});
		leg0MC.reset();
		leg1MC.setTransforms({frame0:'translateZ(0px)|0.01s'});
		leg1MC.reset();
		tailMC.setTransforms({frame0:'translateZ(0px)|0.01s'});
		tailMC.reset();
		wing1MC.setTimeline([[0,'wing-closed']]);
		wing0MC.setTransforms({frame0:'translate3d(0px,0px,0px) rotateZ(-106.5deg)|0.01s'});
		wing0MC.reset();
	}
	
	function setAnimationWingTest() {
		wing1MC.setTimeline([[0,'wing-closed'], [5,'wing-open'], [14,'wing-opened'], [24,'wing-close']]);
		wing1MC.setTransforms({
			frame0:'translateX(5px) translateZ(0px) rotateZ(-30deg)|0.2s', 
			frame24:'translateZ(0px)|0.4s'});
		
		wing0MC.setTimeline([[0,'wing-closed'], [7,'wing-open'], [16,'wing-opened'], [24,'wing-close']]);
		wing0MC.setTransforms({
			frame0:'translateX(25px) translateY(5px) rotateZ(25deg)|0.2s',
			frame24:'translateX(0px) translateY(0px) rotateZ(-106.5deg)|0.4s'});
	}
	
	function setAnimation1() {
		headMC.setTimeline([[0,'head-on'], [3,'head-blink'], [12,'head-mouth'], [30,'head-normal'], [60,'head-blink'], [70,'head-normal'], [90,'head-blink'], [110,'head-off']]);
		headMC.setTransforms({
			frame0:'translateZ(0px)|0.2s', 
			frame15:'translateX(-4px) translateY(1px) translateZ(0px) rotateZ(2.2deg)|0.2s', 
			frame30:'translateZ(0px)|0.2s'});
		
		wing1MC.setTimeline([[0,'wing-closed'],[10,'wing-closed']]);
		wing1MC.setTransforms({
			frame0:'translateZ(0px)|0.2s', 
			frame15:'translateX(-2px) translateZ(0px) rotateZ(-17deg)|0.2s', 
			frame30:'translateZ(0px)|0.2s'});
		
		neckMC.setTransforms({
			frame0:'translateZ(0px)|0.1s', 
			frame15:'translateZ(0px) rotateZ(-2deg)|0.2s', 
			frame30:'translateZ(0px)|0.2s'});
		
		bodyMC.setTransforms({
			frame0:'translateZ(0px)|0.1s', 
			frame15:'translateX(-1px) translateZ(0px)|0.2s', 
			frame30:'translateZ(0px)|0.2s'});
		
		leg0MC.setTransforms({
			frame0:'translateZ(0px)|0.1s', 
			frame15:'translateX(-2px) translateZ(0px) skewX(1.1deg)|0.2s', 
			frame30:'translateZ(0px)|0.2s'});
		
		leg1MC.setTransforms({
			frame0:'translateZ(0px)|0.1s', 
			frame15:'translateX(-2px) translateZ(0px) skewX(1.1deg)|0.2s', 
			frame30:'translateZ(0px)|0.2s'});
		
		tailMC.setTransforms({
			frame0:'translateZ(0px)|0.1s', 
			frame15:'translateX(-2px) translateZ(0px) rotateZ(-4.7deg)|0.2s', 
			frame30:'translateZ(0px)|0.2s'});
		
		wing0MC.setTimeline([[0,'wing-closed'],[10,'wing-closed']]);
		wing0MC.setTransforms({
			frame0:'translate3d(0px,0px,0px) rotateZ(-106.5deg)|0.1s'});
	}
	
	function setAnimation2() {
		headMC.setTimeline([[0,'head-on'], [7,'head-blink'], [12,'head-smile'], [29,'head-normal'], [60,'head-blink'], [70,'head-normal'], [90,'head-blink'], [110,'head-off']]);
		headMC.setTransforms({
			frame0:'translateX(38px) translateY(-3px) translateZ(0px) rotateZ(-7.3deg)|0.2s', 
			frame24:'translateZ(0px)|0.4s'});
		
		wing1MC.setTimeline([[0,'wing-closed'], [5,'wing-open'], [14,'wing-opened'], [24,'wing-close']]);
		wing1MC.setTransforms({
			frame0:'translateX(5px) translateZ(0px) rotateZ(-30deg)|0.2s', 
			frame24:'translateZ(0px)|0.4s'});
		
		neckMC.setTransforms({
			frame0:'translateX(6px) translateY(1px) translateZ(0px) rotateZ(13.2deg)|0.2s', 
			frame24:'translateZ(0px)|0.4s'});
		
		bodyMC.setTransforms({
			frame0:'translateX(6px) translateY(1px) translateZ(0px) rotateZ(13.2deg)|0.2s', 
			frame24:'translateZ(0px)|0.4s'});
		
		leg0MC.setTransforms({
			frame0:'translateX(3px) translateZ(0px) skewX(-3deg)|0.9s', 
			frame24:'translateZ(0px)|0.4s'});
		
		leg1MC.setTransforms({
			frame0:'translateX(3px) translateZ(0px) skewX(-3deg)|0.9s', 
			frame24:'translateZ(0px)|0.4s'});
		
		tailMC.setTransforms({
			frame0:'translateZ(0px)|0.1s', 
			frame6:'translateX(3px) translateY(4px) translateZ(0px) rotateZ(-6.8deg)|0.2s', 
			frame24:'translateZ(0px)|0.4s'});
		
		wing0MC.setTimeline([[0,'wing-closed'], [7,'wing-open'], [16,'wing-opened'], [24,'wing-close']]);
		wing0MC.setTransforms({
			frame0:'translate3d(25px,0px,0px) rotateZ(25deg)|0.2s',
			frame24:'translate3d(0px,0px,0px) rotateZ(-106.5deg)|0.4s'});
	}
	
	function setAnimation3() {
		headMC.setTimeline([[0,'head-on'], [9,'head-smile'], [30,'head-normal'], [40,'head-blink'], [50,'head-normal'], [60,'head-blink'], [80,'head-off']]);
		headMC.setTransforms({ 
			frame4:'translateX(38px) translateY(-3px) translateZ(0px) rotateZ(8.4deg)|0.4s',
			frame14:'translateX(38px) translateY(-3px) translateZ(0px) rotateZ(-7.3deg)|0.2s', 
			frame30:'translateZ(0px)|0.4s',
			frame39:'translateX(38px) translateY(-3px) translateZ(0px) rotateZ(8.4deg)|0.4s',
			frame47:'translateX(38px) translateY(-3px) translateZ(0px) rotateZ(-7.3deg)|0.2s',
			frame57:'translateZ(0px)|0.4s'});
		
		wing1MC.setTimeline([[0,'wing-closed'], [5,'wing-closed']]);
		wing1MC.setTransforms({
			frame4:'translateX(2px) translateZ(0px) rotateZ(-12deg)|0.4s', 
			frame14:'translateX(2px) translateZ(0px) rotateZ(-9deg)|0.4s', 
			frame30:'translateZ(0px)|0.2s',
			frame39:'translateX(2px) translateZ(0px) rotateZ(-12deg)|0.4s', 
			frame47:'translateX(2px) translateZ(0px) rotateZ(-9deg)|0.4s', 
			frame57:'translateZ(0px)|0.2s'});
		
		neckMC.setTransforms({
			frame4:'translateX(5px) translateY(2px) translateZ(0px) rotateZ(13.2deg)|0.4s', 
			frame30:'translateZ(0px)|0.4s',
			frame39:'translateX(5px) translateY(2px) translateZ(0px) rotateZ(13.2deg)|0.4s',
			frame57:'translateZ(0px)|0.4s'});
		
		bodyMC.setTransforms({
			frame4:'translateX(5px) translateY(2px) translateZ(0px) rotateZ(13.2deg)|0.4s', 
			frame30:'translateZ(0px)|0.4s',
			frame39:'translateX(5px) translateY(2px) translateZ(0px) rotateZ(13.2deg)|0.4s', 
			frame57:'translateZ(0px)|0.4s'});
		
		leg0MC.setTransforms({
			frame4:'translateX(3px) translateZ(0px) skewX(-3deg)|0.4s', 
			frame30:'translateZ(0px)|0.4s',
			frame39:'translateX(3px) translateZ(0px) skewX(-3deg)|0.4s', 
			frame57:'translateZ(0px)|0.4s'});
			
		leg1MC.setTransforms({
			frame4:'translateX(3px) translateZ(0px) skewX(-3deg)|0.4s', 
			frame30:'translateZ(0px)|0.4s',
			frame39:'translateX(3px) translateZ(0px) skewX(-3deg)|0.4s', 
			frame57:'translateZ(0px)|0.4s'});
		
		tailMC.setTransforms({
			frame4:'translateX(3px) translateY(4px) translateZ(0px) rotateZ(-6.8deg)|0.4s', 
			frame30:'translateZ(0px)|0.4s',
			frame39:'translateX(3px) translateY(4px) translateZ(0px) rotateZ(-6.8deg)|0.4s', 
			frame57:'translateZ(0px)|0.4s'});
			
		wing0MC.setTimeline([[0,'wing-closed'], [5,'wing-open'], [14,'wing-opened'], [31,'wing-close']]);
		wing0MC.setTransforms({
			frame4:'translate3d(25px,0px,0px) rotateZ(-6deg)|0.4s', 
			frame14:'translate3d(25px,0px,0px) rotateZ(25deg)|0.2s', 
			frame20:'translate3d(25px,0px,0px) rotateZ(-6deg)|0.2s', 
			frame30:'translate3d(0px,0px,0px) rotateZ(-106.5deg)|0.2s'});
	}

    p.reset = function () {
		clearTimeout(btnTimeout);
		clearTimeout(tukanTimeout);
		clearTimeout(animDelay);
		createjs.Ticker.setPaused(true);
		$('#btn-tukan').hide();
		if (currentSound) {
			currentSound.stop();
			currentSound = null;
		}
		if (currentBtnID > -1) {
			turnButton('off', currentBtnID);
		}
		$('.btn-audio').attr('class', 'btn-audio');
		currentBtnID = -1;
		audioPlayed = [0,0,0];
		setTukan(0);
		
		
		
		sounds.ok01.stop();
		sounds.ok02.stop();
		sounds.allok.stop();
		
	};
    p.loadState = function (obj) {};
    p.saveState = function () {
        return {};
    };

    wnd.InteractiveActivity = InteractiveActivity;

})(window);