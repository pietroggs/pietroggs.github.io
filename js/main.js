var card = 0;
var container;
var body;
var isMobile = false;

// Scale Config
var container_width = 1366;
var container_height = 769;
// Em % (ex: 10%)
var margin = 10;

// Debug
var cardDebug = false;


function init() {
    log("Init main.js");
    createContainer(initCourse);
    // Aqui vai o preloader
}

//#region Container

function createContainer(callback) {
    body = document.querySelector('body');
    // Container
    container = document.querySelector('#container');
    container.style.width = (`${container_width}px`);
    container.style.height = (`${container_height}px`);
    // Listener
    calcScale();
    return callback();
}

function closeContainer() {
    setScorm();
    body.removeChild(container);
    var quitText = create('p', 'body', 'quitText');
    quitText.innerHTML = "Agora você pode fechar o navegador com segurança.";
    TweenMax.from(quitText, 1, { opacity: 0, top: "60%" });
}
//#endregion

function initCourse() {
    log("Iniciando Curso");
    // Chamando Primeiro Card
    // insertCard(card);
    create('', 'body', 'turn', 'divImg');
}

//#region Config

// Scale
var initScale = true;

function calcScale() {
    mobileAndTabletCheck();
    if (initScale) {
        initScale = false;
        setTimeout(function () {
            window.addEventListener("resize", function () {
                calcScale();
            });
            window.addEventListener("orientationchange", function () {
                calcScale();
            });
        }, 500);
    }
    // DEBUG
    document.querySelector('#scale1').innerHTML = `Window: W:${window.innerWidth} H:${window.innerHeight}`;
    document.querySelector('#scale2').innerHTML = `Screen: W:${screen.width} H:${screen.height}`;

    // Screen é pra mobile
    // Windows é pra desktop
    let pivWidth;
    let pivHeight;

    // if (isMobile) {
    //     pivWidth = screen.width / container_width;
    //     pivHeight = screen.height / container_height;
    // }
    // else {
    //     pivWidth = window.innerWidth / container_width;
    //     pivHeight = window.innerHeight / container_height;
    // }

        pivWidth = window.innerWidth / container_width;
        pivHeight = window.innerHeight / container_height;

    pivWidth = pivWidth.toFixed(3);
    pivHeight = pivHeight.toFixed(3);

    console.log(`Calc Scale: Width - ${pivWidth} | Height ${pivHeight}`);

    let pivScale = pivHeight > pivWidth ? pivWidth : pivHeight;
    pivScale = pivScale - (margin / 100);

    try {
        container.style.transform = (`translate(-50%, -50%) scale(${pivScale})`);
        container.style.top = '50%';
        container.style.left = '50%';
    } catch (err) {

    }
    setInterval(calcScale, 500);
}

//#endregion

//--------------------------------------------------------------------CARD SYSTEM--------------------------------------------------------------------

////#region card
var multlock = true;
function cardChange(arg_card) {
    if (multlock) {
        multlock = false;
        try {
            var atCard = document.querySelector('.card');
            container.removeChild(atCard);
        } catch (e) {
            // log(`Não há cards no container Card[${card}]`);
        }
        card = arg_card;
        insertCard(card);
    }
}
//#endregion

// Checar mobile avançado

function mobileAndTabletCheck() {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    isMobile = check;
    return check;
};

this.init();