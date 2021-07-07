// Solução Exportação de cursos Mói 11/20 by: pietroggsilva@gmail.com
// Config
var debug = true;
var timing = false;

// Code
var txt_infos;
var isLms = true;

function init() {
    // Wait
    var waitForLoad = setInterval(function () {
        txt_infos = document.querySelectorAll('.qp-info-text');
        if (txt_infos.length) {
            log('Page Is Ready');
            try {
                script_scorm.init();
            } catch (error) {
                log("Page is not in Scorm Platform");
                isLms = false;
            }
            clearInterval(waitForLoad);
            initListners();
            insertLogo();
        }
        else {
            return;
        }
    }, 500)

}

function initListners() {

    // Unload Prevent
    window.onbeforeunload = function () {
        script_scorm.end();
    };

    // Get Scorm
    script_scorm.getSuspend();

    // Close Btn
    // var close_btn = document.querySelector('.home-button-main');
    // close_btn.onclick = function () {
    //     script_scorm.end();
    //     window.close();
    // }
    // close_btn.style.cssText = "display:none;";

    // Pontuação
    var waitForComplet = setInterval(function () {
        if (window.player.getScore() == window.player.getScoreMax()) {
            log("Page is Done");
            script_scorm.complet();
            clearInterval(waitForComplet);
            if (!timing) {
                script_scorm.end();
            }
        }
    }, 500);

    // Opens
    setTimeout(function () { data_scorm["opens"] += 1; }, 1000);

    // Time
    var countTimePass = setInterval(function () {
        data_scorm["seconds"] += 15;
        var sessionTime = formatScormTime(Math.round(data_scorm["seconds"]));
        script_scorm.setSupend(sessionTime);
    }, 15000);
}

var susp = null;

var data_scorm = {
    opens: 0,
    seconds: 0,
}

var script_scorm = {
    init: function () {
        if (!isLms) {
            return;
        }
        log("Script_Scorm: init");
        window.parent.API.LMSInitialize('');
        window.parent.API.LMSSetValue('cmi.core.score.min', '0');
        window.parent.API.LMSSetValue('cmi.core.score.max', '100');
        window.parent.API.LMSCommit('');
    },

    complet: function () {
        if (!isLms) {
            return;
        }
        log("Script_Scorm: complet");
        window.parent.API.LMSSetValue('cmi.core.lesson_status', 'completed');
        window.parent.API.LMSSetValue('cmi.core.score.raw', '100');
        window.parent.API.LMSCommit('');
    },

    getSuspend: function () {
        if (!isLms) {
            return;
        }
        log("Script_Scorm: getSuspend");
        try {
            susp = window.parent.API.LMSGetValue('cmi.suspend_data');
            log("Get Suspend_Data: " + [susp]);
            if (susp != "" && susp != null) {
                susp = susp.split(";");
                data_scorm["opens"] += parseInt(susp[0]);
                data_scorm["seconds"] += parseInt(susp[1]);
            }
            else {
                susp = null;
                log('No susp Avaible');
            }
        } catch (err) {

        }
    },

    setSupend: function (timeArg) {
        if (!isLms) {
            return;
        }
        log("Script_Scorm: setSupend");
        if (timing) {
            window.parent.API.LMSSetValue("cmi.core.session_time", timeArg);
        }
        var pivSusp = data_scorm["opens"] + ";" + data_scorm["seconds"];
        pivSusp = pivSusp.toString();
        window.parent.API.LMSSetValue("cmi.suspend_data", pivSusp);
        window.parent.API.LMSCommit('');
    },

    end: function () {
        if (!isLms) {
            return;
        }
        log("Script_Scorm: end");
        try {
            window.parent.API.LMSCommit('');
            window.parent.API.LMSFinish('');
            clearInterval(countTimePass);
            isLms = false;
        } catch (err) {
            log("Scorm já encerrado");
            isLms = false;
        }
    }
}

function log(text) {
    if (debug) {
        console.log('%c' + '>>>' + text + '<<<', 'color:#0080ff;font-weight: bold;');
    }
}

function insertLogo() {
    var target_div = document.querySelector('.lesson-mainfooter');
    target_div.style.overflow = "visible";
    var svg_logo = document.createElement('div');
    svg_logo.id = 'svg_logo';

    // CSS
    var logo_style = document.createElement('style');
    logo_style.type = 'text/css';
    logo_style.innerHTML = '#svg_logo {display: inline-block;background: url(img/standfor-logo.svg) no-repeat center center transparent;background-size: 100px 100px;width: 100px;height: 100px;position: absolute;bottom: 0px;right: 15px;}';
    document.getElementsByTagName('head')[0].appendChild(logo_style);

    target_div.appendChild(svg_logo);
}


init();