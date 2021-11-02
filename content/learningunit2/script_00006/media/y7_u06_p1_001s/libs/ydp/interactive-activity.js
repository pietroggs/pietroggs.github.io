(function (wnd) {

    var InteractiveActivity = function (api) {
        for (var i = 0; i < audios.length; i++) {
			api.initSound(audios[i].src, audios[i].onLoad, audios[i].onEnd, audios[i].onPause);
		}
		init();
    };

    var p = InteractiveActivity.prototype;
    var touchDevice = /ipad|iphone|android|windows phone|blackberry/i.test(navigator.userAgent.toLowerCase());
    var eDown = touchDevice ? 'touchstart' : 'mousedown';
    var eUp = touchDevice ? 'touchend' : 'mouseup';
    var eMove = touchDevice ? 'touchmove' : 'mousemove';
	
	var todo = [{id:0, good:true, done:false},
				{id:1, good:true, done:false},
				{id:2, good:true, done:false},
				{id:3, good:true, done:false},
				{id:4, good:true, done:false},
				{id:5, good:true, done:false},
				{id:6, good:false, done:false},
				{id:7, good:false, done:false},
				{id:8, good:false, done:false},
				{id:9, good:false, done:false},
				{id:10, good:false, done:false},
				{id:11, good:false, done:false}];
	var paths = [];
	var inpopup = [{id:0, done:false},
					{id:1, done:false},
					{id:2, done:false},
					{id:3, done:false},
					{id:4, done:false},
					{id:5, done:false}];
	var timeout;
	
	//---
	var onFinishCurrAudio = null;
	var innerDisrupt = false;
	var soundsPreloaded = 0;
	var soundsToPreload = 0;
	var sounds = {};
	var callbackOnLoad = {
		onSoundCreated: function (sound, src) {
			var sndID = _.findWhere(audios, {src: src}).id;
			sounds[sndID] = sound;
		}
	};
	var callbackOnEnd = {
		onEnd: function () {
			console.log('end');
			$('.button-audio').removeClass('button-audio-on');
			
			innerDisrupt = true;
			if(onFinishCurrAudio != null){
				onFinishCurrAudio();
			}
			setTimeout(function() {
				innerDisrupt = false;
			}, 10);
		}
	};
	var callbackOnPause = {
		onPause: function () {
			console.log('end2');
			if (innerDisrupt) {
				innerDisrupt = false;
				return;
			}
			if(soundsPreloaded < soundsToPreload){
				soundsPreloaded += 1;
				return;
			}
			if(audiosPreloaded){
				$('.button-audio').removeClass('button-audio-on');
			}
		}
	};
	var audios = [
				{id:'lector1', src: './sounds/rub_y7_u06_p1_002au.mp3', onLoad:callbackOnLoad, onEnd:callbackOnEnd, onPause:callbackOnPause},
				
				{id:'ok', src: './sounds/ok.mp3', onLoad:callbackOnLoad, onEnd:callbackOnEnd, onPause:callbackOnPause},
				{id:'wrong', src: './sounds/wrong.mp3', onLoad:callbackOnLoad, onEnd:callbackOnEnd, onPause:callbackOnPause},
				{id:'allok', src: './sounds/allOk.mp3', onLoad:callbackOnLoad, onEnd:callbackOnEnd, onPause:callbackOnPause}];
				
	var audiosPreloaded = false;
	//---
	
	p.resizeDiv = function(scale) {
		var scl = 'scale(' + scale + ')';
		$('.ia-container').find('.ia-incont').css({
			'transform': scl,
			'-webkit-transform': scl,
			'-moz-transform': scl,
			'-o-transform': scl,
			'transform-origin': '0 0',
			'-webkit-transform-origin': '0 0',
			'-moz-transform-origin': '0 0',
			'-o-transform-origin': '0 0'
		});
	}
	
    function init() {
		for(var i=0; i<6; i++){
			$('#button2-' + i).css({
				left: (195 + (i % 3) * 169) + 'px',
				top: (151 + Math.floor(i / 3) * 169) + 'px'
			});
		}
		
		localReset();
		
		$('.button-reset').on(eDown, function(e){
			e.preventDefault();
			preloadSounds();
			localReset();
			$('.button-reset').addClass('button-reset-on');
			
			$(document).on(eUp, function(e){
				e.preventDefault();
				$('.button-reset').removeClass('button-reset-on');
				$(document).off(eUp);
			});
		});
		
		$('.button-audio').on(eDown, function(e){
			e.preventDefault();
			preloadSounds();
			setAudio(null);
			if($(this).hasClass('button-audio-on')){
				$(this).removeClass('button-audio-on');
			}
			else{
				$(this).addClass('button-audio-on');
				setAudio(0);
			}
		});
		
		$('.button').on(eDown, function(e){
			e.preventDefault();
			preloadSounds();
			var id = parseInt($(this).attr('id').replace('button-', ''));
			test(id);
		});
		
		$('.button2').on(eDown, function(e){
			e.preventDefault();
			preloadSounds();
			var id = parseInt($(this).attr('id').replace('button2-', ''));
			test2(id);
		});
    }
	
	function test2(id){
		inpopup[id].done = !inpopup[id].done;
		if(inpopup[id].done){
			$('#button2-' + id).find('.tip2').show();
		}
		else{
			$('#button2-' + id).find('.tip2').hide();
		}
	}
	
	function test(id){
		if(todo[id].good){
			if(!todo[id].done){
				setAudio(1);
				todo[id].done = true;
				$('#button-' + id).find('.tip').show();
				$('#button-' + id).find('.icon').show();
				for(var i=0; i<todo.length; i++){
					if(todo[i].good && !todo[i].done){
						console.log(i, todo[i].good, todo[i].done);
						return;
					}
				}
				finish();
			}
			else{
				todo[id].done = false;
				$('#button-' + id).find('.tip').hide();
				$('#button-' + id).find('.icon').hide();
			}
		}
		else{
			setAudio(2);
		}
	}
	
	function finish() {
		setAudio(3);
		$('.allok').show();
		$('.button').css('pointer-events', 'none');
		if(timeout != null){
			clearTimeout(timeout);
		}
		timeout = setTimeout(function(){
			$('.popup').show();
		}, 2000);
	}
	
	function preloadSounds(){
		if(!audiosPreloaded){
			for(var i=0; i<audios.length; i++){
				setAudio(i);
				audios[i].snd.stop();
				soundsToPreload += 1;
			}
			audiosPreloaded = true;
		}
	}
		
	function setAudio(id, onFinish) {
		onFinishCurrAudio = onFinish;
		if(id == null){
			for(var i=0; i<audios.length; i++){
				if(audios[i].snd != null){
					audios[i].snd.stop();
					audios[i].snd = null;
				}
			}
		}
		else{
			audios[id].snd = sounds[audios[id].id];
			audios[id].snd.play();
		}
	}
	
	function mixArray(arr) {
		var tmp = arr.slice();
		var newArr = [];
		while(tmp.length > 0){
			var rnd = Math.floor(Math.random() * tmp.length);
			newArr.push(tmp[rnd]);
			tmp.splice(rnd, 1);
		}
		return newArr;
	}
	
	function localReset() {
		$('.button-start').removeClass('button-start-on');
		$('.allok').hide();
		$('.button').css('pointer-events', 'auto');
		$('.tip').hide();
		$('.tip2').hide();
		$('.popup').hide();
		$('.icon').hide();
		$('.button-audio').removeClass('button-audio-on');
		setAudio(null);
		for(var i=0; i<todo.length; i++){
			todo[i].done = false;
		}
		for(i=0; i<inpopup.length; i++){
			inpopup[i].done = false;
		}
		paths = mixArray([0,1,2,3,4,5,6,7,8,9,10,11]);
		for(i=0; i<paths.length; i++){
			$('#button-' + paths[i]).css({
				left: (120 + (i % 6) * 109) + 'px',
				top: (121 + Math.floor(i / 6) * 109) + 'px'
			});
		}
		if(timeout != null){
			clearTimeout(timeout);
		}
	}
	
    p.reset = function() {
		
    };

    p.loadState = function (obj) {
		var alldone = true;
		$('.button').css('pointer-events', 'auto');
		for(var i=0; i<todo.length; i++){
			todo[i].done = obj['done' + i];
			if(todo[i].done){
				$('#button-' + i).find('.tip').show();
				$('#button-' + i).find('.icon').show();
			}
			else if(todo[i].good){
				alldone = false;
			}
		}
		for(i=0; i<inpopup.length; i++){
			inpopup[i].done = obj['inpopup' + i];
			if(inpopup[i].done){
				$('#button2-' + i).find('.tip2').show();
			}
		}
		for(i=0; i<paths.length; i++){
			paths[i] = obj['paths' + i];
			$('#button-' + paths[i]).css({
				left: (120 + (i % 6) * 109) + 'px',
				top: (121 + Math.floor(i / 6) * 109) + 'px'
			});
		}
		if(alldone){
			finish();
			setAudio(null);
			$('.popup').show();
		}
		if(timeout != null){
			clearTimeout(timeout);
		}
    };

    p.saveState = function () {
        var obj = {};
		for(var i=0; i<todo.length; i++){
			obj['done' + i] = todo[i].done;
		}
		for(i=0; i<paths.length; i++){
			obj['paths' + i] = paths[i];
		}
		for(i=0; i<inpopup.length; i++){
			obj['inpopup' + i] = inpopup[i].done;
		}
        return obj;
    };

    wnd.InteractiveActivity = InteractiveActivity;

})(window);