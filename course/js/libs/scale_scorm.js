var isMobile = false;

// Scale Config
var screenFix = document.querySelector("body");
var container_width = 1920;
var container_height = 1080;
// Em % (ex: 10%)
var margin = 0;

// Scale
var initScale = false;
var can_scale = true;

var resize_list;
var orient_list;

function calcScale() {
  if (!can_scale) {
    window.removeEventListener("resize", resize_list);
    window.removeEventListener("orientationchange", orient_list);
    return console.log("Não pode escalar");
  }
//   mobileAndTabletCheck();
  if (initScale) {
    initScale = false;
    setTimeout(function () {
      window.addEventListener(
        "resize",
        (resize_list = function () {
          calcScale();
        })
      );
      window.addEventListener(
        "orientationchange",
        (orient_list = function () {
          calcScale();
        })
      );
    }, 500);
  }

  let pivWidth;
  let pivHeight;

  pivWidth = screenFix.clientWidth / container_width;
  pivHeight = screenFix.clientHeight / container_height;

  pivWidth = pivWidth.toFixed(3);
  pivHeight = pivHeight.toFixed(3);

  let pivScale = pivHeight > pivWidth ? pivWidth : pivHeight;
  pivScale = pivScale - margin / 100;
  console.log(`Scale PH ${pivHeight} PW ${pivWidth}`);
  try {
    $('main').css(
      "transform",
      `translate(-50%, -50%) scale(${pivScale})`
    );
    $('main').css("top", "50%");
    $('main').css("left", "50%");
  } catch (err) {
    console.log("Scale Fail =>\n", err);
  }
}

const sco = {
    isLMS: true,

    init: function () {
        window.addEventListener("beforeunload", function (e) {
            lms.SCORM.quit();
        });

        console.log("Script_Scorm: init");

        try {
            sco.isLMS = lms.SCORM.init();
            if (sco.isLMS) {
                lms.SCORM.set('cmi.core.score.min', '0');
                lms.SCORM.set('cmi.core.score.max', '100');

                lms.SCORM.set('cmi.core.lesson_status', 'incomplete');

                lms.SCORM.save();
            } else {
                console.log("Script_Scorm: Fora da plataforma");
            }
        } catch (err) {
            console.log("Script_Scorm: Fail to init => \n", err);
        }
    },

    complet: function () {
        if (!sco.isLMS) {
            return;
        }
        console.log("Script_Scorm: complet");

        lms.SCORM.set('cmi.core.lesson_status', 'completed');
        lms.SCORM.set('cmi.core.score.raw', '100');
        lms.SCORM.save();
        lms.SCORM.quit();
    }
}