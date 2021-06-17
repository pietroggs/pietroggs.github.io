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
  var eUp = touchDevice ? 'touchend' : 'mouseup';

  var initCallback = {
    onSoundCreated: function (sound, src) {
      var sndID = _.findWhere(manifest, { src: src }).id;
      sounds[sndID] = sound;
    }
  };
  var endCallback = {
    onEnd: function () {

    }
  };
  var pauseCallback = {
    onPause: function () {

    }
  }

  var sounds = {};
  var currentSound, innerDisrupt, playing, soundsFired = 0, soundsToFire = 0;
  var gameState = 'STOP';
  var nextQuestionID;
  var shuffled;
  var currentItem;
  var gamePaused;
  var done = 0, todo = 0;
  var pressed, time, elapsed, fallTime = 25000;
  var secondItem = -1;
  var elTemp;
  var answer = "none";
  var gameStarted = false;

  var elHalfW = 400 / 2;
  var elHalfH = 400 / 2;
  var distanceBeetweenElements = 450;
  var errors = 0;
  var done = 0;

  function init() {
    todo = conf.length;
    drawQuestions();
    currentItem = shuffled.shift();
    $('#playBtn').on(eDown, function (e) {
      e.preventDefault();
      if (done < todo) {
        $('#playBtn').hide();
        $('#blenda').hide();
        if (gameState === 'STOP' || gameState === 'RELOAD' || gamePaused) {
          if (gameStarted == false) {
            startGame();
            gameStarted = true;
          } else {
            gamePaused = false;
            playCurrentSound();
            updateGame();
          }
        }
      }
    });

    if (!touchDevice) {
      $('#area').hide();
      $('.elem').on(eDown, function (e) {
        e.preventDefault();
        pressed = true;
        var el = $(this)
        if (el.hasClass('anim-good') || el.hasClass('anim-wrong'))
          return;
        check(el);
      }).on(eUp, function (e) {
        e.preventDefault();
        pressed = false;
      });
    } else {
      $('#area').on(eDown, function (e) {
        e.preventDefault();
        if ((gameState === 'PLAY' || gameState === 'RELOAD') && !gamePaused) { // poprawka
          var x = (touchDevice) ? e.originalEvent.touches[0].pageX : e.pageX;
          var y = (touchDevice) ? e.originalEvent.touches[0].pageY : e.pageY;
          var xx = (x - contLeft) / resizeFactor;
          var yy = (y - contTop) / resizeFactor;
          if (pressed) {
            return;
          }
          pressed = true;
          elapsed = Date.now() - time;
          for (var i = 0; i < 2; i++) {
            var el = $('#el' + i);
            if (el.hasClass('anim-good') || el.hasClass('anim-wrong'))
              continue;

            var elX = (i * distanceBeetweenElements) + elHalfW;
            var elY = ((elapsed / fallTime) * 800) - elHalfH;

            if (Math.abs(xx - elX) < elHalfW && Math.abs(yy - elY) < elHalfH) {
              check(el);
              break;
            }
          }
        }
      }).on(eUp, function (e) {
        e.preventDefault();
        pressed = false;
      });
    }
  }

  /*function onRelease(e) {
    e.preventDefault();
    $('#resetBtn').removeClass('button-pressed');
    $(document).off(eUp);
    $(parent.document).off(eUp);
  }*/

  function drawQuestions() {
    shuffled = conf.slice();
    for (var i = 0; i < shuffled.length; i++) {
      var img0 = shuffled[i].arr[0];
      secondItem = shuffled[i].snd.slice(-1);
      shuffled[i].arr.push(getImage(img0));
    }
    shuffled = _.shuffle(shuffled);
  }

  function startGame() {
    gameState = 'PLAY';
    updateGame(gamePaused);
    if (gamePaused) {
      gamePaused = false;
      //pauseGame(false);
    }
    playCurrentSound();
  }

  function updateGame(wasPaused) {

    var elems = _.shuffle(['el0', 'el1']);
    var imgs = currentItem.arr;
    for (var i = 0; i < elems.length; i++) {

      var el = $('#' + elems[i]);
      el.find('img').remove();
      if (!wasPaused)
        el.removeClass('anim-good').removeClass('anim-wrong');
      if (!el.find('img').length)
        el.prepend('<img class="hidden" src="' + imgs[i] + '" width="400" height="400"/>');
      el.attr('data-ok', !i ? 'true' : 'false');
      //el.attr('data-pressed', 'false');

      if (wasPaused) {
        if (!el.hasClass('anim-good') && !el.hasClass('anim-wrong')) {
          addAnimation(el, 'anim', 'auto');
        }
      } else {
        addAnimation(el, 'anim', 'auto');
      }

      if (!i) {
        PrefixedEvent(el.get(0), "AnimationIteration", onAnimLoop, 'remove');
        PrefixedEvent(el.get(0), "AnimationIteration", onAnimLoop, 'add');
        PrefixedEvent(el.get(0), "AnimationStart", onAnimStart, 'remove');
        PrefixedEvent(el.get(0), "AnimationStart", onAnimStart, 'add');

      }
    }
  }

  function addAnimation(el, cls, pos) {
    if (pos === 'auto')
      el.removeAttr('style');
    setTimeout(function () {
      if (pos !== 'auto') {
        elapsed = Date.now() - time;

        var ctop = ((elapsed / fallTime) * 800) - 340;

        el.css('top', ctop + 'px');
      }
      if (cls !== 'anim')
        el.removeClass('anim');

      el.addClass(cls);
      el.removeClass('anim-paused');
      el.find('img').removeClass('hidden');
    }, 10);
  }

  function pauseGame(isPaused) {
    for (var i = 0; i < 2; i++) {
      var el = $('#el' + i);
      if (isPaused) {
        el.find('img').remove();
        el.removeClass('anim').removeAttr('style');
        PrefixedEvent(el.get(0), "AnimationIteration", onAnimLoop, 'remove');
        PrefixedEvent(el.get(0), "AnimationStart", onAnimStart, 'remove');
      }
    }
    gamePaused = isPaused;
    if (gamePaused) {
      if (done < todo) {
        $('#playBtn').show();
      }
      $('#blenda').show();
    }
  }

  function stopGame() {
    clearTimeout(nextQuestionID);
    stopSound();
    //$('#welldone').hide();
    //$('.cup-ok').removeClass('cup-ok');
    for (var i = 0; i < 2; i++) {
      var el = $('#el' + i);
      el.find('img').removeClass('hidden');
      el.find('img').remove();
      el.removeClass('anim-good').removeClass('anim-wrong');
      el.removeClass('anim').removeClass('anim-paused').removeAttr('style');
      PrefixedEvent(el.get(0), "AnimationIteration", onAnimLoop, 'remove');
      PrefixedEvent(el.get(0), "AnimationStart", onAnimStart, 'remove');
    }
    done = 0;
    drawQuestions();
    currentItem = shuffled.shift();
  }

  function onAnimStart() {
    time = Date.now();
  }

  function onAnimLoop() {
    if (answer == "bad") {
      playCurrentSound();
      time = Date.now();
    } else {
      pauseGame(true);
    }
  }

  function playCurrentSound() {
    if (!gamePaused) {
      playing = true;
      currentSound = sounds[currentItem.snd];
      /*setTimeout(function () {
        innerDisrupt = false;
      }, 10);*/
      currentSound.play();
    }
  }

  function stopSound() {
    if (currentSound) {
      playing = false;
      //innerDisrupt = true;
      currentSound.stop();
      currentSound = null;
    }
  }

  function check(el) {
    if (el.attr('data-ok') === 'true') {
      answer = "good";
      //var cup = $('.cup').get(done);
      //$(cup).addClass('cup-ok');
      done++;
      errors = 0;
      if (done === todo) {
        stopSound();
        sounds.ALLOK.play();

        gameState = 'OVER';
        playFeedback2();
        /*
        nextQuestionID = setTimeout(function() {
        	$('#welldone').show();
        }, 2000);
        */
      } else {
        stopSound();
        sounds.GOOD.play();

        currentItem = shuffled.shift();
        /*
        nextQuestionID = setTimeout(function() {
        	//playCurrentSound();
        	//updateGame();
				
        }, 2500);
        */
        playFeedback2();
      }
      playFeedback(el, true);
      pauseGame(true);
      //console.log('pause');
    } else {
      answer = "bad";
      sounds.BAD.play();
      //playCurrentSound();
      errors++;
      playFeedback(el, false);
      playFeedback2();
    }
  }

  function playFeedback2() {
    _done = done;
    _errors = errors;
    fireChangeEvent();
  }

  function playFeedback(elPressed, isOK) {
    if (isOK) {
      for (var i = 0; i < 2; i++) {
        var el = $('#el' + i);
        PrefixedEvent(el.get(0), "AnimationIteration", onAnimLoop, 'remove');
        PrefixedEvent(el.get(0), "AnimationStart", onAnimStart, 'remove');
        if (parseInt(elPressed.attr('id').slice(-1)) === i) {
          el.addClass('anim-paused');
          //addAnimation(el, 'anim-good');
          addAnimation(el, 'anim-wrong');
          //el.attr('data-pressed', 'true');
        } else if (!el.hasClass('anim-wrong')) {
          el.addClass('anim-paused');
          addAnimation(el, 'anim-wrong');
          elTemp = el;
        }
      }
    } else {
      elPressed.addClass('anim-paused');
      addAnimation(elPressed, 'anim-wrong');
    }
  }

  function getImage(img0) {
    var img1;
    do {
      //img1 = _.sample(conf).arr[0];
      img1 = conf2[secondItem].arr[0];
    } while (img1 === img0)
    return img1;
  }

  function PrefixedEvent(element, type, callback, action) {
    var pfx = ["webkit", "moz", "MS", "o", ""];
    for (var p = 0; p < pfx.length; p++) {
      if (!pfx[p]) type = type.toLowerCase();
      if (action === 'add') {
        element.addEventListener(pfx[p] + type, callback, false);
      } else {
        element.removeEventListener(pfx[p] + type, callback, false);
      }
    }
  }

  p.reset = function () {
	$('.elem').show(); // poprawka
    gameState = 'STOP';
    $('#playBtn').show();
    $('#blenda').show();
    //$('#resetBtn').addClass('button-pressed');
    stopGame();
    //$(document).on(eUp, onRelease);
    //$(parent.document).on(eUp, onRelease);
    //$('#el0').attr('data-pressed', 'false');
    //$('#el1').attr('data-pressed', 'false');
    answer = "none";
    gameStarted = false;
  };
  p.loadState = function (obj) {
    done = obj.done;
    errors = obj.errors;
    gameState = obj.gameState;
    if (done || gameState !== 'STOP') {
      shuffled = obj.shuffled;
      currentItem = obj.currentItem;
      answer = obj.answer;
      gameStarted = obj.gameStarted;


      /*
      for(var i=0;i<done;i++) {
      	var cup = $('.cup').get(i);
      	$(cup).addClass('cup-ok');
      }
      */
      if (done === todo) {
        $('#playBtn').hide();
        $('#blenda').hide();
		$('.elem').hide(); // poprawka
        //$('#welldone').show();
      } else {
        gameState = 'RELOAD';
      }
    }
  };
  p.saveState = function () {
    clearTimeout(nextQuestionID);
    stopSound();
    return {
      gameState: gameState,
      done: done,
      errors: errors,
      shuffled: shuffled,
      currentItem: currentItem,
      answer: answer,
      gameStarted: gameStarted
    };
  };

  wnd.ExternalActivity = ExternalActivity;

})(window);