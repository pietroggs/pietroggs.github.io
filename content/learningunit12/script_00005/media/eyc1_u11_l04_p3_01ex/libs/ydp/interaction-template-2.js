var api, cont, iframe, initW, initH, ratio, resizeFactor, offsetLeft, offsetTop;

window.init = function (empiriaAPI) {

    var empiriaObject = {};

    cont = $('.ia-container');

    iframe = _.find($('iframe', parent.document), function (item) {
        return item.src.indexOf(assetName) !== -1;
    });

    initW = parseInt($(cont).css('max-width'));

    initH = parseInt($(cont).css('max-height'));

    ratio = initH / initW;

    resizeFactor = 1;

    $(window).on('resize', function () {
        onResize();
    });

    $(window).on('unload', function () {
        $(window).off('resize');
    });

    onResize();

    var ea = new ExternalActivity(empiriaAPI);

    empiriaObject.setStateOnExternal = function (status) {
        ea.loadState(status);
    };

    empiriaObject.getStateFromExternal = function () {
        return ea.saveState();
    };

    empiriaObject.reset = function () {
		_errors = 0;
        _done = 0;
        ea.reset();
    };

    empiriaObject.lock = function () {
        ea.lock(true);
    };

    empiriaObject.unlock = function () {
        ea.lock(false);
    };
	
	empiriaObject.showCorrectAnswers = function () {
		ea.showAnswers(true);
	};
	
	empiriaObject.hideCorrectAnswers = function () {
		ea.showAnswers(false);
	};
	
	empiriaObject.markCorrectAnswers = function () {
		ea.markCorrect(true);
	};
	
	empiriaObject.unmarkCorrectAnswers = function () {
		ea.markCorrect(false);
	};
	
	empiriaObject.markWrongAnswers = function () {
		ea.markWrong(true);
	};
	
	empiriaObject.unmarkWrongAnswers = function () {
		ea.markWrong(false);
	};
	
	api = empiriaAPI;

    return empiriaObject;
};

fireChangeEvent = function () {
    var status = {
        done: _done,
        errors: _errors
    };
    api.onResultChange(status);
};

function onResize() {
    var contWidth = $(cont).width();
    var contHeight = contWidth * ratio;
    $(cont).css({'height': contHeight + 'px'});
    $(iframe).css({'height': contHeight + 'px'});
    resizeFactor = contWidth / initW;
    offsetLeft = $(cont).offset().left + $(iframe).offset().left;
    offsetTop = $(cont).offset().top + $(iframe).offset().top;
	resizeDiv($(cont).find('.in-cont'), resizeFactor);
}

function resizeDiv(div, scale) {
	var scl = 'scale(' + scale + ')';
	$(div).css({
		'transform': scl,
		'-webkit-transform': scl,
		'-moz-transform': scl,
		'-o-transform': scl
	});
}