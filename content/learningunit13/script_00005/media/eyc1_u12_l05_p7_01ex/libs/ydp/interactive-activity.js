(function (wnd) {

	var InteractiveActivity = function (api) {
		init();
	};

	var p = InteractiveActivity.prototype;
	var touchDevice = /ipad|ipod|iphone|android|webos|windows phone|blackberry/i.test(navigator.userAgent.toLowerCase());
	var eDown = touchDevice ? 'touchstart' : 'mousedown';

	var currentBtnID = -1;
	var tukanState = 0;
	var audioPlayed = [0, 0, 0];
	var btnTimeout, tukanTimeout, animDelay;
	var headMC, wing0MC, wing1MC, neckMC, bodyMC, leg0MC, leg1MC, tailMC;
	var currentFrame;
	var previousFrame = -1;
	var totalFrames = [0, 150, 150, 90];

	function init() {
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

		setTukan(2);
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
		$('#btn' + id).find('.sound-waves').css('display', (mode === 'off' ? 'none' : 'block'));
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
			animDelay = setTimeout(function () {
				createjs.Ticker.setPaused(false);
			}, 250);
		} else if (phase === 2) {
			setAnimation2();
			animDelay = setTimeout(function () {
				createjs.Ticker.setPaused(false);
			}, 250);
			$('#btn-tukan').show();
		} else if (phase === 3) {
			setAnimation3();
			animDelay = setTimeout(function () {
				createjs.Ticker.setPaused(false);
			}, 250);
		}
	}

	function clearAnimation() {
		headMC.setTimeline([[0, 'head-init']]);
		headMC.setTransforms({
			frame0: 'translateZ(0px)|0.01s'
		});
		headMC.reset();
		wing1MC.setTimeline([[0, 'wing-closed']]);
		wing1MC.setTransforms({
			frame0: 'translateZ(0px)|0.01s'
		});
		wing1MC.reset();
		neckMC.setTransforms({
			frame0: 'translateZ(0px)|0.01s'
		});
		neckMC.reset();
		bodyMC.setTransforms({
			frame0: 'translateZ(0px)|0.01s'
		});
		bodyMC.reset();
		leg0MC.setTransforms({
			frame0: 'translateZ(0px)|0.01s'
		});
		leg0MC.reset();
		leg1MC.setTransforms({
			frame0: 'translateZ(0px)|0.01s'
		});
		leg1MC.reset();
		tailMC.setTransforms({
			frame0: 'translateZ(0px)|0.01s'
		});
		tailMC.reset();
		wing1MC.setTimeline([[0, 'wing-closed']]);
		wing0MC.setTransforms({
			frame0:'translate3d(0px,0px,0px) rotateZ(-106.5deg)|0.01s'
		});
		wing0MC.reset();
	}

	function setAnimation1() {
		headMC.setTimeline([[0, 'head-on'], [3, 'head-blink'], [12, 'head-mouth'], [30, 'head-normal'], [60, 'head-blink'], [70, 'head-normal'], [90, 'head-blink'], [110, 'head-off']]);
		headMC.setTransforms({
			frame0: 'translateZ(0px)|0.2s',
			frame15: 'translateX(-4px) translateY(1px) translateZ(0px) rotateZ(2.2deg)|0.2s',
			frame30: 'translateZ(0px)|0.2s'
		});

		wing1MC.setTimeline([[0, 'wing-closed'], [10, 'wing-closed']]);
		wing1MC.setTransforms({
			frame0: 'translateZ(0px)|0.2s',
			frame15: 'translateX(-2px) translateZ(0px) rotateZ(-17deg)|0.2s',
			frame30: 'translateZ(0px)|0.2s'
		});

		neckMC.setTransforms({
			frame0: 'translateZ(0px)|0.1s',
			frame15: 'translateZ(0px) rotateZ(-2deg)|0.2s',
			frame30: 'translateZ(0px)|0.2s'
		});

		bodyMC.setTransforms({
			frame0: 'translateZ(0px)|0.1s',
			frame15: 'translateX(-1px) translateZ(0px)|0.2s',
			frame30: 'translateZ(0px)|0.2s'
		});

		leg0MC.setTransforms({
			frame0: 'translateZ(0px)|0.1s',
			frame15: 'translateX(-2px) translateZ(0px) skewX(1.1deg)|0.2s',
			frame30: 'translateZ(0px)|0.2s'
		});

		leg1MC.setTransforms({
			frame0: 'translateZ(0px)|0.1s',
			frame15: 'translateX(-2px) translateZ(0px) skewX(1.1deg)|0.2s',
			frame30: 'translateZ(0px)|0.2s'
		});

		tailMC.setTransforms({
			frame0: 'translateZ(0px)|0.1s',
			frame15: 'translateX(-2px) translateZ(0px) rotateZ(-4.7deg)|0.2s',
			frame30: 'translateZ(0px)|0.2s'
		});

		wing0MC.setTimeline([[0, 'wing-closed'], [10, 'wing-closed']]);
		wing0MC.setTransforms({
			frame0:'translate3d(0px,0px,0px) rotateZ(-106.5deg)|0.1s'
		});
	}

	function setAnimation2() {
		headMC.setTimeline([[0, 'head-on'], [7, 'head-blink'], [12, 'head-smile'], [29, 'head-normal'], [60, 'head-blink'], [70, 'head-normal'], [90, 'head-blink'], [110, 'head-off']]);
		headMC.setTransforms({
			frame0: 'translateX(38px) translateY(-3px) translateZ(0px) rotateZ(-7.3deg)|0.2s',
			frame24: 'translateZ(0px)|0.4s'
		});

		wing1MC.setTimeline([[0, 'wing-closed'], [5, 'wing-open'], [14, 'wing-opened'], [24, 'wing-close']]);
		wing1MC.setTransforms({
			frame0: 'translateX(5px) translateZ(0px) rotateZ(-30deg)|0.2s',
			frame24: 'translateZ(0px)|0.4s'
		});

		neckMC.setTransforms({
			frame0: 'translateX(6px) translateY(1px) translateZ(0px) rotateZ(13.2deg)|0.2s',
			frame24: 'translateZ(0px)|0.4s'
		});

		bodyMC.setTransforms({
			frame0: 'translateX(6px) translateY(1px) translateZ(0px) rotateZ(13.2deg)|0.2s',
			frame24: 'translateZ(0px)|0.4s'
		});

		leg0MC.setTransforms({
			frame0: 'translateX(3px) translateZ(0px) skewX(-3deg)|0.9s',
			frame24: 'translateZ(0px)|0.4s'
		});

		leg1MC.setTransforms({
			frame0: 'translateX(3px) translateZ(0px) skewX(-3deg)|0.9s',
			frame24: 'translateZ(0px)|0.4s'
		});

		tailMC.setTransforms({
			frame0: 'translateZ(0px)|0.1s',
			frame6: 'translateX(3px) translateY(4px) translateZ(0px) rotateZ(-6.8deg)|0.2s',
			frame24: 'translateZ(0px)|0.4s'
		});

		wing0MC.setTimeline([[0, 'wing-closed'], [7, 'wing-open'], [16, 'wing-opened'], [24, 'wing-close']]);
		wing0MC.setTransforms({
			frame0:'translate3d(25px,0px,0px) rotateZ(25deg)|0.2s',
			frame24:'translate3d(0px,0px,0px) rotateZ(-106.5deg)|0.4s'
		});
	}

	function setAnimation3() {
		headMC.setTimeline([[0, 'head-on'], [9, 'head-smile'], [30, 'head-normal'], [40, 'head-blink'], [50, 'head-normal'], [60, 'head-blink'], [80, 'head-off']]);
		headMC.setTransforms({
			frame4: 'translateX(38px) translateY(-3px) translateZ(0px) rotateZ(8.4deg)|0.4s',
			frame14: 'translateX(38px) translateY(-3px) translateZ(0px) rotateZ(-7.3deg)|0.2s',
			frame30: 'translateZ(0px)|0.4s',
			frame39: 'translateX(38px) translateY(-3px) translateZ(0px) rotateZ(8.4deg)|0.4s',
			frame47: 'translateX(38px) translateY(-3px) translateZ(0px) rotateZ(-7.3deg)|0.2s',
			frame57: 'translateZ(0px)|0.4s'
		});

		wing1MC.setTimeline([[0, 'wing-closed'], [5, 'wing-closed']]);
		wing1MC.setTransforms({
			frame4: 'translateX(2px) translateZ(0px) rotateZ(-12deg)|0.4s',
			frame14: 'translateX(2px) translateZ(0px) rotateZ(-9deg)|0.4s',
			frame30: 'translateZ(0px)|0.2s',
			frame39: 'translateX(2px) translateZ(0px) rotateZ(-12deg)|0.4s',
			frame47: 'translateX(2px) translateZ(0px) rotateZ(-9deg)|0.4s',
			frame57: 'translateZ(0px)|0.2s'
		});

		neckMC.setTransforms({
			frame4: 'translateX(5px) translateY(2px) translateZ(0px) rotateZ(13.2deg)|0.4s',
			frame30: 'translateZ(0px)|0.4s',
			frame39: 'translateX(5px) translateY(2px) translateZ(0px) rotateZ(13.2deg)|0.4s',
			frame57: 'translateZ(0px)|0.4s'
		});

		bodyMC.setTransforms({
			frame4: 'translateX(5px) translateY(2px) translateZ(0px) rotateZ(13.2deg)|0.4s',
			frame30: 'translateZ(0px)|0.4s',
			frame39: 'translateX(5px) translateY(2px) translateZ(0px) rotateZ(13.2deg)|0.4s',
			frame57: 'translateZ(0px)|0.4s'
		});

		leg0MC.setTransforms({
			frame4: 'translateX(3px) translateZ(0px) skewX(-3deg)|0.4s',
			frame30: 'translateZ(0px)|0.4s',
			frame39: 'translateX(3px) translateZ(0px) skewX(-3deg)|0.4s',
			frame57: 'translateZ(0px)|0.4s'
		});

		leg1MC.setTransforms({
			frame4: 'translateX(3px) translateZ(0px) skewX(-3deg)|0.4s',
			frame30: 'translateZ(0px)|0.4s',
			frame39: 'translateX(3px) translateZ(0px) skewX(-3deg)|0.4s',
			frame57: 'translateZ(0px)|0.4s'
		});

		tailMC.setTransforms({
			frame4: 'translateX(3px) translateY(4px) translateZ(0px) rotateZ(-6.8deg)|0.4s',
			frame30: 'translateZ(0px)|0.4s',
			frame39: 'translateX(3px) translateY(4px) translateZ(0px) rotateZ(-6.8deg)|0.4s',
			frame57: 'translateZ(0px)|0.4s'
		});

		wing0MC.setTimeline([[0, 'wing-closed'], [5, 'wing-open'], [14, 'wing-opened'], [31, 'wing-close']]);
		wing0MC.setTransforms({
			frame4:'translate3d(25px,0px,0px) rotateZ(-6deg)|0.4s', 
			frame14:'translate3d(25px,0px,0px) rotateZ(25deg)|0.2s', 
			frame20:'translate3d(25px,0px,0px) rotateZ(-6deg)|0.2s', 
			frame30:'translate3d(0px,0px,0px) rotateZ(-106.5deg)|0.2s'
		});
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
		audioPlayed = [0, 0, 0];
		setTukan(0);
	};
	p.loadState = function (obj) {};
	p.saveState = function () {
		return {};
	};

	wnd.InteractiveActivity = InteractiveActivity;

})(window);