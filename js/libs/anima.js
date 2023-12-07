// @ Desenvolvido por Rene M. Bertoni® v2.0

var animateOnScroll = true;
var defaultDuration = 1;

const easeTypes = ['Linear', 'Elastic', 'Back', 'Bounce', 'Circ', 'Cubic', 'Expo', 'Sine', 'Quad', 'Quint', 'Quart', 'Strong', 'Power'];

var animatedElementsList = Array.prototype.slice.call(document.querySelectorAll("[data-anima-in]"));

// Scroll Variables
var canAnimateIN = [];
var canAnimateOUT = [];

// Timeline Variables
var animaTl = new TimelineMax();
var onReverse = false;
var previewElementDuration;

// Default Settings Ease Effects 
Elastic.easeIn.config(1, 0.5);
Elastic.easeOut.config(1, 0.5);
Elastic.easeInOut.config(1, 0.5);
Back.easeIn.config(1.7);
Back.easeOut.config(1.7);
Back.easeInOut.config(1.7);

// Ativa a animação pelo scroll do mouse e Chama a função Action UMA vez ao carregar a página
if (animateOnScroll) {
    window.onload = function () { setTimeout(Action, 500) };
    window.addEventListener('scroll', Action);
    window.onresize = Action;
}

// Ação ativada pelo scroll
function Action() {
    for (let i = 0; i < animatedElementsList.length; i++) {

        if (isOnScreenTopBased(animatedElementsList[i]) && (canAnimateIN[i] || canAnimateIN[i] == undefined)) {
            StartAnimation(animatedElementsList[i], 'in');
            canAnimateIN[i] = false;
        }
        else if (!isOnScreenTopBased(animatedElementsList[i]) && (canAnimateOUT[i] || canAnimateOUT[i] == undefined)) {
            StartAnimation(animatedElementsList[i], 'out');
            canAnimateOUT[i] = false;
            canAnimateIN[i] = true;
        }
    }
}

// Função Principal - parâmetros(elemento, tipo 'in' ou 'out')
function StartAnimation(_element, _type) {
    let animationParameters;
    let typeMovement;

    animationParameters = VerifyAnimationsExists(_element, _type);

    if (animationParameters != null) {
        animationParameters[0] == null || animationParameters[0] == "" ? animationParameters[0] = 'noAnimation' : null;
        animationParameters[1] == null || animationParameters[1] == "" ? animationParameters[1] = 'no-ease' : null;
        animationParameters[2] == null || animationParameters[2] == "" ? animationParameters[2] = defaultDuration : animationParameters[2] = parseFloat(animationParameters[2]);

        animationParameters[0][0] != 'r' ? typeMovement = 'translate' : typeMovement = 'rotate';

        if (typeMovement == 'translate') {
            TranslateAnimation(_type, _element, animationParameters);
        }
        else {
            RotationAnimation(_element, animationParameters);
        }
    }
}

function SettingTimeline(_element, _previewElementDuration) {
    let animationParameters;
    let typeMovement;


    animationParameters = VerifyAnimationsExists(_element, 'in');

    if (animationParameters != null) {
        animationParameters[0] == null || animationParameters[0] == "" ? animationParameters[0] = 'noAnimation' : null;
        animationParameters[1] == null || animationParameters[1] == "" ? animationParameters[1] = 'no-ease' : null;
        animationParameters[2] == null || animationParameters[2] == "" ? animationParameters[2] = defaultDuration : animationParameters[2] = parseFloat(animationParameters[2]);

        animationParameters[0][0] != 'r' ? typeMovement = 'translate' : typeMovement = 'rotate';

        SettingTimelineAnimation(typeMovement, _element, animationParameters, _previewElementDuration);
    }
}

// Animação de Translação
function SettingTimelineAnimation(_type, _element, _animationParameters, _previewElementDuration) {
    let config = FindConfig(_animationParameters[0]);

    if (_previewElementDuration != 0) _previewElementDuration /= 2;

    try {
        if (_type == 'translate') {
            animaTl.add(TweenMax.fromTo(_element, _animationParameters[2], { opacity: config.startOpacity, xPercent: config.startXPercent, yPercent: config.startYPercent, scale: config.startScale, ease: EaseDefiny(_animationParameters[1]) },
                { opacity: config.endOpacity, xPercent: config.endXPercent, yPercent: config.endYPercent, scale: config.endScale, ease: EaseDefiny(_animationParameters[1]) }), "-=" + _previewElementDuration);

            previewElementDuration = _animationParameters[2];

        }
        else {
            let defaultRepeat = 0;

            if (_animationParameters[3] == null) {
                _animationParameters[3] = defaultRepeat;
            }
            else if (_animationParameters[3] == 'infinity') {
                _animationParameters[3] = -1;
            }
            else {
                _animationParameters[3] = parseFloat(_animationParameters[3]);
            }

            let newNameAngle = _animationParameters[0].split("w");

            newNameAngle[0] = newNameAngle[0] + 'w';
            newNameAngle[1] = parseFloat(newNameAngle[1]);

            // Inverte a rotação
            newNameAngle[0].length > 8 ? newNameAngle[1] = newNameAngle[1] * (-1) : null;

            animaTl.add(TweenMax.fromTo(_element, _animationParameters[2], { rotation: 0, repeat: _animationParameters[3], }, { rotation: newNameAngle[1], repeat: _animationParameters[3], ease: EaseDefiny(_animationParameters[1]) }), "-=" + _previewElementDuration);

            previewElementDuration = _animationParameters[2];
        }
    }
    catch (e) {
        console.log('Não existe uma configuração para a animação que foi definida no elemento, verifique se o nome da animação está correto');
    }
}

// Inicia uma timeline
function StartTimeline(_list) {
    previewElementDuration = 0;

    if (_list == undefined || _list == null) _list = animatedElementsList;

    animaTl = new TimelineMax({
        onComplete: function () {
            OnTimelineEnd();
        }, onReverseComplete: function () {
            OnReverseTimelineEnd();
        }
    });

    for (i = 0; i < _list.length; i++) {
        SettingTimeline(_list[i], previewElementDuration);
    }
}

// Inicia a execução da timeline de trás para a frente
function StartReverseTimeline() {
    animaTl.reverse();
}

// Inicia a Timeline
function PlayTimeline() {
    if (!onReverse) {
        animaTl.play();
    } else {
        animaTl.reverse();
    }
}
// Pausa a Timeline
function PauseTimeline() {
    animaTl.pause();
}

function OnTimelineEnd() {
    onReverse = true;
    console.log("ADICIONE AQUI O CÓDIGO PARA RODAR QUANDO A TIMELINE TERMINAR");
}

function OnReverseTimelineEnd() {
    onReverse = false;
    console.log("ADICIONE AQUI O CÓDIGO PARA RODAR QUANDO A TIMELINE REVERSA TERMINAR");
}

// Função que identifica a duração da animação definida pelo usuário
// function GetTimeFromAnimation(_animation, _type)
// {
//     try
//     {
//         let definedAttribute = _animation.getAttribute("data-anima-" + _type).split("-");


//         if(definedAttribute.length < 3)
//         {
//             return 1000;
//         }
//         else
//         {
//             return (definedAttribute[2] * 1000);
//         }
//     }catch(e)
//     {
//         console.log("O elemento não tem animação de saída");
//     }
// }

// Função que verifica se o elemento está sendo visualizado
function isOnScreenTopBased(element) {
    let yPosition = (window.pageYOffset + (element.getBoundingClientRect().top + element.clientHeight / 2)) - window.innerHeight;
    yPosition = parseInt(yPosition.toFixed(0));

    let scroll = window.pageYOffset;

    let result = scroll >= yPosition ? true : false;

    return result;
};

function FindIndex(el) {

    for (let i = 0; i < animatedElementsList.length; i++) {
        if (animatedElementsList[i] == el) {
            return i;
        }
    }
    return -1;
}

// -- CONFIGURAÇÕES DAS ANIMAÇÕES --

// Animação de Translação
function TranslateAnimation(_type, _element, _animationParameters) {
    let config = FindConfig(_animationParameters[0]);

    try {
        if (_type == 'in') {

            TweenMax.fromTo(_element, _animationParameters[2], { opacity: config.startOpacity, xPercent: config.startXPercent, yPercent: config.startYPercent, scale: config.startScale, ease: EaseDefiny(_animationParameters[1]) },
                {
                    opacity: config.endOpacity, xPercent: config.endXPercent, yPercent: config.endYPercent, scale: config.endScale, ease: EaseDefiny(_animationParameters[1]), onComplete: function () {
                        canAnimateOUT[FindIndex(_element)] = true;
                    }
                });
        }
        else {
            TweenMax.fromTo(_element, _animationParameters[2], { opacity: config.endOpacity, xPercent: config.endXPercent, yPercent: config.endYPercent, scale: config.endScale, ease: EaseDefiny(_animationParameters[1]) },
                {
                    opacity: config.startOpacity, xPercent: (config.startXPercent * (-1)), yPercent: (config.startYPercent * (-1)), scale: ZoomConvert(config.startScale), ease: EaseDefiny(_animationParameters[1]), onComplete: function () {
                        canAnimateIN[FindIndex(_element)] = true;
                    }
                });
        }
    }
    catch (e) {
        console.log('Não existe uma configuração para a animação que foi definida no elemento, verifique se o nome da animação está correto');
    }
}

// Animação de rotação
function RotationAnimation(_element, _animationParameters) {

    let defaultRepeat = 0;

    if (_animationParameters[3] == null) {
        _animationParameters[3] = defaultRepeat;
    }
    else if (_animationParameters[3] == 'infinity') {
        _animationParameters[3] = -1;
    }
    else {
        _animationParameters[3] = parseFloat(_animationParameters[3]);
    }

    let newNameAngle = _animationParameters[0].split("w");

    newNameAngle[0] = newNameAngle[0] + 'w';
    newNameAngle[1] = parseFloat(newNameAngle[1]);

    // Inverte a rotação
    newNameAngle[0].length > 8 ? newNameAngle[1] = newNameAngle[1] * (-1) : null;

    TweenMax.fromTo(_element, _animationParameters[2], { rotation: 0, repeat: _animationParameters[3], }, { rotation: newNameAngle[1], repeat: _animationParameters[3], ease: EaseDefiny(_animationParameters[1]) });
}

// Função que busca o objeto para obter as configurações da animação de acordo com o nome
function FindConfig(_animationName) {
    for (let i = 0; i < animations.length; i++) {
        if (animations[i].name == _animationName) {
            return animations[i];
            break
        }
    }
}

// Função que monta uma string para definir o Ease de acordo com o nome declarado
function EaseDefiny(_ease) {
    let splitedEaseName = _ease.split(/[A-Z]/);

    // Definindo In / Out
    try {
        if (splitedEaseName.length == 3) {
            splitedEaseName[1] = "InOut";
        }
        else if (splitedEaseName[1].length == 1) {
            splitedEaseName[1] = "In";
        }
        else {
            splitedEaseName[1] = "Out";
        }
    }
    catch (e) {
        console.log('Não existe nenhum Ease com o nome definido no elemento');
        splitedEaseName[1] = "None";
    }

    // Padronizando primeira palavra
    splitedEaseName[0] = capitalizeFirstLetter(splitedEaseName[0]);

    splitedEaseName[0] = EaseFinder(splitedEaseName[0]);

    return splitedEaseName[0] + ".ease" + splitedEaseName[1];
}

function EaseFinder(_ease) {
    let easeFound = false;

    for (let i = 0; i < easeTypes.length; i++) {
        if (_ease == easeTypes[i]) {
            easeFound = true;
            break;
        }
    }
    if (easeFound) {
        return _ease;
    }
    else {
        return 'Linear';
    }
}

// Função que deixa a primeira letra da string em Uppercase
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Função que verifica se alguma animação foi adicionada oa elemento
function VerifyAnimationsExists(_element, _type) {
    if (_type == 'in') {
        try {
            return _element.getAttribute("data-anima-in").split("-");
        }
        catch (e) {
            console.log('o Elemento não tem uma animação de entrada definida.');
        }
    }
    else if (_type == 'out') {
        try {
            return _element.getAttribute("data-anima-out").split("-");
        }
        catch (e) {
            console.log('o Elemento não tem uma animação de saída definida.');
        }
    }
    else {
        console.log('O Elemento não tem animação');
        return null;
    }
}

// Função que inverte o tipo de zoom para ajustar a saída do elemento
function ZoomConvert(_endScale) {
    let endValue = 1;

    if (_endScale == 0) {
        endValue = 1.5;
    }
    else if (_endScale > 1) {
        endValue = 0;
    }
    return endValue;
}

// Configurações das animações
var animations = [
    {
        name: 'fade',
        startOpacity: 0,
        endOpacity: 1,
        startXPercent: 0,
        endXPercent: 0,
        startYPercent: 0,
        endYPercent: 0,
        startScale: 1,
        endScale: 1
    },
    {
        name: 'fadeRight',
        startOpacity: 0,
        endOpacity: 1,
        startXPercent: -100,
        endXPercent: 0,
        startYPercent: 0,
        endYPercent: 0,
        startScale: 1,
        endScale: 1
    },
    {
        name: 'fadeLeft',
        startOpacity: 0,
        endOpacity: 1,
        startXPercent: +100,
        endXPercent: 0,
        startYPercent: 0,
        endYPercent: 0,
        startScale: 1,
        endScale: 1
    },
    {
        name: 'fadeUp',
        startOpacity: 0,
        endOpacity: 1,
        startXPercent: 0,
        endXPercent: 0,
        startYPercent: +50,
        endYPercent: 0,
        startScale: 1,
        endScale: 1
    },
    {
        name: 'fadeDown',
        startOpacity: 0,
        endOpacity: 1,
        startXPercent: 0,
        endXPercent: 0,
        startYPercent: -50,
        endYPercent: 0,
        startScale: 1,
        endScale: 1
    },
    {
        name: 'zoomIn',
        startOpacity: 0,
        endOpacity: 1,
        startXPercent: 0,
        endXPercent: 0,
        startYPercent: 0,
        endYPercent: 0,
        startScale: 0,
        endScale: 1
    },
    {
        name: 'zoomOut',
        startOpacity: 0,
        endOpacity: 1,
        startXPercent: 0,
        endXPercent: 0,
        startYPercent: 0,
        endYPercent: 0,
        startScale: 1.5,
        endScale: 1
    },
    {
        name: 'noAnimation',
        startOpacity: 0,
        endOpacity: 1,
        startXPercent: 0,
        endXPercent: 0,
        startYPercent: 0,
        endYPercent: 0,
        startScale: 1,
        endScale: 1
    }
];