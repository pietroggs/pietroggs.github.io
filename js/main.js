var card = 0;
var container;
var body;

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
    container = create('', 'body', 'container');
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
    insertCard(card);
    create('', 'body', 'turn', 'divImg');
}

//#region Config

// Scale
var initScale = true;

function calcScale() {
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
    let margin = 0.05;

    if (isMobile) {
        pivWidth = screen.width / 1920;
        pivHeight = screen.height / 1080;
    }
    else {
        pivWidth = window.innerWidth / 1920;
        pivHeight = window.innerHeight / 1080;
    }
    var pivScale;
    if (pivWidth > pivHeight) {
        pivScale = pivHeight;
    } else {
        pivScale = pivWidth;
    }
    pivScale = (pivScale * (1 - margin));
    pivScale = pivScale.toFixed(3);
    try {
        var cont = document.querySelector("#container");
        cont.style.setProperty('transform', 'translate(-50%, -50%) scale(' + pivScale + ')');
        cont.style.setProperty('top', '50%');
        cont.style.setProperty('left', '50%');
    } catch (err) {

    }
}

//#endregion

//--------------------------------------------------------------------CARD SYSTEM--------------------------------------------------------------------

////#region card
var cardAt;
var cardName;
var tl;

function insertCard(numero) {
    tl = new TimelineMax();
    log("Insert Card: " + numero);
    cardName = 'card' + numero;
    create('', '', cardName, 'card');
    cardAt = "#" + cardName;
    loadCss(numero);
    var telaJs = loadJs(numero);
}

// Carregamento dinamico
var head = document.getElementsByTagName('head')[0];

function loadCss(numero) {
    var cssPivo = document.querySelector('#cardCss');
    if (cssPivo != null) {
        head.removeChild(cssPivo);
    }

    var link = document.createElement('link');
    link.id = 'cardCss';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'telas/' + numero + '/tela.css';
    link.media = 'all';
    head.appendChild(link);
}

function loadJs(numero) {
    var jsPivo = document.querySelector('#cardJs');
    if (jsPivo != null) {
        head.removeChild(jsPivo);
    }
    var script = document.createElement('script');
    script.onload = function () {
        initTela();
    };
    script.src = 'telas/' + numero + '/tela.js';
    script.id = 'cardJs';
    head.appendChild(script);
}

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

this.init();