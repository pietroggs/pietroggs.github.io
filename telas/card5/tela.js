(() => {
    parent.showHud('5');
    changeIndexName();
    // Anim
    let target_card = document.querySelector('.card');
    var objs = []
    var objs_fs = [target_card];
    do {
        let piv_obj = objs_fs.shift();
        if (piv_obj.children.length > 0) {
            let piv_list = [].slice.call(piv_obj.children);
            piv_list.forEach(element => {
                objs_fs.push(element);
            });
        }
        objs.push(piv_obj);
    } while (objs_fs.length > 0);

    for (var i = 1; i < objs.length; i++) {
        var pivt = 0.05;
        if (objs[i].className == 'icons_boxes') {
            TweenMax.from(objs[i], 1, { autoAlpha: 0, top: '+=30%', ease: Back.easeOut.config(2), delay: (pivt * i), onComplete: enableHover(objs[i]) });
        }
        else {
            TweenMax.from(objs[i], 1, { autoAlpha: 0, top: '-=15%', ease: Back.easeOut.config(2), delay: (pivt * i) });
        }
    }
    setTimeout(() => {
        document.querySelector('.card').removeChild(document.querySelector('.pop_lock'));
    }, 3500);
})();

let counter_anim = 0;
function enableHover(e) {
    setTimeout(() => {
        e.style.cssText = '';
        e.classList.add('boxes_transition');
    }, 3500);

}

function changeIndexName() {
    document.querySelector('#txt1').innerHTML = `Interação ${parent.int_card}`
}

let current_obj = [null, null, null, null];
let current_int = [-1, -1, -1, -1];
function selectScore(obj, roll, numb) {
    if (current_obj[roll] != null) {
        current_obj[roll].style.cssText = '';
    }
    current_int[roll] = numb;
    current_obj[roll] = obj;

    let hovering = null;
    switch (numb) {
        case 0: hovering = 'background-image: url(../../img/avaliacao/icon_face_01_hover.svg);'
            call_face_anim(1);
            break;
        case 1: hovering = 'background-image: url(../../img/avaliacao/icon_face_02_hover.svg);'
            call_face_anim(2);
            break;
        case 2: hovering = 'background-image: url(../../img/avaliacao/icon_face_03_hover.svg);'
            call_face_anim(3);
            break;
        case 3: hovering = 'background-image: url(../../img/avaliacao/icon_face_04_hover.svg);'
            call_face_anim(4);
            break;
        case 4: hovering = 'background-image: url(../../img/avaliacao/icon_face_05_hover.svg);'
            call_face_anim(5);
            break;
    }
    obj.style.cssText = `top: 63%; ${hovering}`;
    enableSend();
}

var send_enabled = false;
function enableSend() {
    if (!send_enabled) {
        let can_go = true;
        current_int.forEach(e => {
            if (e == -1) {
                can_go = false;
            }
        });

        if (!can_go) {
            return;
        }

        send_enabled = true;
        let btn_target = document.querySelector('#btn_bt_1');
        btn_target.classList.remove('hide');
        TweenMax.from(btn_target, 1, { autoAlpha: 0, top: '+=30%', ease: Back.easeOut.config(2) });
    }
}

function sendInt() {
    parent.int_array[(parent.int_card - 1)] = current_int;
    console.log(parent.int_array);
    createPop();
}

function call_face_anim(index) {
    var face_anim = document.querySelector('#face_anim0'+ [index]);
    face_anim.className = '';
    TweenMax.fromTo(face_anim, .5, { autoAlpha: 1, scale: 1 }, { autoAlpha: 0, scale: 3, onComplete: () => { face_anim.className = 'hide' } });
}

function createPop() {
    parent.hideHud();
    document.querySelector('.card').style.cssText = "filter: blur(3px)";
    // Basico do pop
    create('', 'body', 'pop_lock', 'pop_lock');
    create('', '#pop_lock', 'pop_mask', 'pop_mask');

    create('', '#pop_lock', 'pop_box1', 'divImg');
    create('', '#pop_lock', 'pop_box2', 'divImg');
    create('', '#pop_box2', 'pop_ico', 'divImg');
    let p1 = create('', '#pop_box2', 'pop_p1', 'divImg');
    p1.innerText = 'Interesses registrados!';
    let p2 = create('', '#pop_box2', 'pop_p2', 'divImg');
    p2.innerText = 'Que tal mais informações que podem auxiliar na construção do seu Projeto de Vida?';

    let pop_btn = create('', '#pop_box2', 'pop_btn', 'divImg');
    let pop_btn_p = create('p', '#pop_btn', 'pop_btn_p');
    pop_btn_p.innerText = 'Vamos lá!';
    create('', '#pop_btn', 'pop_btn_div', 'divImg');
    pop_btn.onclick = function () {
        document.querySelector('.card').style.cssText = "";
        parent.showHud();
        document.querySelector('body').removeChild(document.querySelector("#pop_lock"));
        parent.cardChange('3');
    }

    let pop_btn2 = create('', '#pop_box2', 'pop_btn2', 'divImg');
    let pop_btn2_p = create('p', '#pop_btn2', 'pop_btn2_p');
    pop_btn2_p.innerText = 'Hoje não';
    create('', '#pop_btn2', 'pop_btn2_div', 'divImg');
    pop_btn2.onclick = function () {
        document.querySelector('.card').style.cssText = "";
        parent.showHud();
        document.querySelector('body').removeChild(document.querySelector("#pop_lock"));
        parent.cardChange('6');
    }

    // ANIM
    let target_card = document.querySelector('#pop_lock');
    var objs = []
    var objs_fs = [target_card];
    do {
        let piv_obj = objs_fs.shift();
        if (piv_obj.children.length > 0) {
            let piv_list = [].slice.call(piv_obj.children);
            piv_list.forEach(element => {
                objs_fs.push(element);
            });
        }
        objs.push(piv_obj);
    } while (objs_fs.length > 0);

    for (var i = 1; i < objs.length; i++) {
        var pivt = 0.05;
        TweenMax.from(objs[i], 1, { autoAlpha: 0, left: '-=15%', ease: Back.easeOut.config(2), delay: (pivt * i) });
    }
}