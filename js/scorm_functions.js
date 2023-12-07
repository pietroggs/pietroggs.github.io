const ScormOBJ = {
    scormAPIDebug: true,
    isConnected: false,
    hasScore: true,

    data: {
        location: 0,
        score: 0,
        status: "incomplete"
    },

    init: function () {

        lms.debug.isActive = this.scormAPIDebug;
        this.isConnected = lms.SCORM.init();

        if (this.isConnected) {
            console.log("<<< Conectado ao LMS. >>>");
            lms.SCORM.set("cmi.core.lesson_status", "incomplete");

            if (this.hasScore) {
                lms.SCORM.set("cmi.core.score.min", "0");
                lms.SCORM.set("cmi.core.score.max", "100");
            }

            lms.SCORM.save();
        } else {
            console.log("<<< Conexão LOCAL. >>>");
        }
    },

    // SETTERS
    setLocation: function (loc) {
        if (this.isConnected) lms.SCORM.save();
    },

    setScore: function (score) {
        if (this.isConnected) {
            lms.SCORM.set("cmi.core.score.raw", score.toString());
            lms.SCORM.save();
        }
    },

    setStatus: function (status) {
        if (this.isConnected) {
            lms.SCORM.set("cmi.core.lesson_status", status);
            lms.SCORM.save();
        }
    },

    // when = 1: quit and close the window
    callQuit: function (when) {
        if (this.isConnected) {
            if (when == 0) {
                lms.SCORM.quit();
            } else {
                lms.SCORM.quit();

                // close window
                var ua = window.navigator.userAgent;
                var msie = ua.indexOf("MSIE");

                if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
                    window.open('', '_self', '');
                    window.close();
                } else {
                    var tab0 = window.open(window.location, "_self");
                    var tab1 = window.open(window.location, "_top");
                    var tab2 = window.open("", "_self");
                    tab0.close();
                    tab1.close();
                    tab2.close();
                }
            }
        }
    },

    // GETTERS
    getCurrentInfo: function () {
        if (this.isConnected) {
            console.log("*******************************");

            if (this.hasScore) {
                console.log("Min score >>> ", lms.SCORM.get("cmi.core.score.min"));
                console.log("Max score >>> ", lms.SCORM.get("cmi.core.score.max"));
                console.log("Score >>> ", lms.SCORM.get("cmi.core.score.raw"));
            }

            console.log("Status >>> ", lms.SCORM.get("cmi.core.lesson_status"));
            console.log("*******************************");

        } else {
            console.log("Conexão LOCAL [SEM INFO].");
        }
    }
}

// MENU E SCORM
var menu_top = $('nav').offset().top;
const menu = document.querySelector("nav");
var menu_li = document.querySelectorAll(".menu li");

function getOffset(el) {
    el = document.querySelector(`${el}`);
    const rect = el.getBoundingClientRect();
    const rect_menu = menu.getBoundingClientRect();

    return {
        top: parseInt((rect.top + window.scrollY) - rect_menu.height)
    };
}

function createEffectMenu(scroll) {
    for (let i = 0; i < menu_li.length; i++) {
        menu_li[i].style.cssText = 'border-bottom: 0.5vw solid transparent;'

        if (scroll >= getOffset('#card_02').top && scroll < getOffset('#card_03').top) {
            menu_li[0].style.cssText = 'border-bottom: 0.5vw solid #461e5f;'
        }
        else if (scroll >= getOffset('#card_03').top && scroll < getOffset('#card_04').top) {
            menu_li[1].style.cssText = 'border-bottom: 0.5vw solid #461e5f;'
        }
        else if (scroll >= getOffset('#card_04').top && scroll < getOffset('#card_05').top) {
            menu_li[2].style.cssText = 'border-bottom: 0.5vw solid #461e5f;'
        }
        else if (scroll >= getOffset('#card_05').top && scroll < getOffset('#card_06').top) {
            menu_li[3].style.cssText = 'border-bottom: 0.5vw solid #461e5f;'
        }
        else if (scroll >= getOffset('#card_06').top && scroll < getOffset('#footer').top) {
            menu_li[4].style.cssText = 'border-bottom: 0.5vw solid #461e5f;'
        }
    }
}

var isMobile = false;
window.addEventListener("scroll", () => {
    let scroll = parseInt(this.scrollY);
    createEffectMenu(scroll)
    isMobile = mobileAndTabletCheck()

    if ($(window).scrollTop() > menu_top) {
        menu.style.cssText = 'position: fixed; top: 0; bottom: unset;'
    }
    else {
        menu.style.cssText = 'position: absolute; bottom: 0; top: unset;'
    }

    // SCORM
    if ($(window).scrollTop() + $(window).height() > $(document).height() - 500) {
        if (lms.SCORM.get("cmi.core.lesson_status") != "completed") {
            window.onscroll = function () { }

            ScormOBJ.setScore(100);
            ScormOBJ.setStatus("completed");
            ScormOBJ.getCurrentInfo();
        }
    }
});