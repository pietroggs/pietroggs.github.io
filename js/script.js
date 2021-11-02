// Solução Exportação de cursos Mói 11/20 by: pietroggsilva@gmail.com
// Config
var debug = true;
var timing = false;

// Code
var txt_infos;
var isLms = true;
var report_data = "";
const notFix = ["Main input", "Practice 1", "Practice 2", "Practice 4", "Practice 5", "English to take away"];

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
            insertLogo();
            //createReport();
            initListners();
        } else {
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

    // Update report
    // var reportListner = setInterval(function () {
    //     if (report_data != window.player.getLessonJSONReport()) {
    //         //createReport();
    //     }
    // }, 1000);

    // Pontuação
    var waitForComplet = setInterval(function () {
        try {
            if (window.player.getScore() == window.player.getScoreMax()) {
                log("Page is Done");
                script_scorm.complet();
                clearInterval(waitForComplet);
                if (!timing) {
                    script_scorm.end();
                }
            }
        } catch (error) {
            console.log("EL ERROR: " + error);
        }
    }, 1000);

    // Opens
    setTimeout(function () {
        data_scorm["opens"] += 1;
    }, 1000);

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
            } else {
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
    // CSS
    var logo_style = document.createElement('style');
    logo_style.type = 'text/css';
    logo_style.innerHTML = ".emp_copyright-button{cursor: default;} .emp_copyright-button *{cursor: default;} .quest_mag{margin-left: 68px; margin-top: 12px;} .quest_mag2{margin-left: 68px; margin-top: 2px;}";
    document.getElementsByTagName('head')[0].appendChild(logo_style);
}

var report = {};
const ignoreScreens = ['Content', 'Report', 'Credits'];

function createReport() {
    report_data = window.player.getLessonJSONReport();
    let obj = JSON.parse(report_data);
    let t_s = 0;
    let t_m = 0;
    Object.keys(obj.items).forEach((element, index) => {
        let x = obj.items[element];
        if (!ignoreScreens.includes(x.title)) {
            let co = "orange";
            let sc = 0;
            let ms = 0;
            let has = true;

            notFix.includes(x.title) ? sc = parseInt(x.result.done) : sc = parseInt(x.result.done + x.result.errors);
            ms = parseInt(x.result.todo);
            x.result.todo != 0 ? has = true : has = false;
            switch (x.title.substring(0, 4)) {
                case 'Lead':
                    co = 'orange';
                    break;
                case 'Main':
                    co = 'pink';
                    break;
                case 'Prac':
                    co = 'purple';
                    break;
                case 'Engl':
                    co = 'blue';
                    break;
            }

            report[x.title] = {
                "color": co,
                "score": sc,
                "maxScore": ms,
                "hasScore": has,
            }
            t_s += sc;
            t_m += ms;
        }
    });
    report["Total"] = {
        "color": "gray",
        "score": t_s,
        "maxScore": t_m,
        "hasScore": true
    }
    // console.log(report);
}

init();