var int_done = false;

(() => {
    parent.showHud();
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

        if (objs[i].id == 'img01') {
            TweenMax.from(objs[i], 1, { autoAlpha: 0, top: '-=15%', left: '-=15%', ease: Back.easeOut.config(1), delay: (pivt * i) });
        }
        else if (objs[i].className == 'divImg imgs_pin') {
            TweenMax.from(objs[i], 1, { autoAlpha: 0, top: '-=30%', ease: Back.easeOut.config(2), delay: (pivt * i) });
        }
        else {
            TweenMax.from(objs[i], 1, { autoAlpha: 0, top: '+=15%', ease: Back.easeOut.config(2), delay: (pivt * i) });
        }
    }

    int_done = checkInt();
})();

function createPin(target) {
    let pins_array = document.querySelectorAll('.pin_boxes');
    let pin_piv = document.createElement('div');
    pin_piv.className = 'divImg';
    pins_array[target].appendChild(pin_piv);
}

function checkInt() {
    let array_check = parent.int_array;
    let checkds = [];
    let i = 0;
    array_check.forEach(element => {
        if (element[0] != -1) {
            checkds.push(i)
            createPin(i);
        }
        i++;
    });
    if (checkds.length > 0) {
        return true;
    }
    else {
        return false;
    }
}

function goInt() {
    if (int_done) {
        parent.cardChange('6');
    }
    else {
        createPop();
    }
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
    p1.innerText = 'Oops!';
    let p2 = create('', '#pop_box2', 'pop_p2', 'divImg');
    p2.innerText = 'Para ter essas informações, você precisa passar por pelo menos uma interação.';
    let pop_btn = create('', '#pop_box2', 'pop_btn', 'divImg');
    let pop_btn_p = create('p', '#pop_btn', 'pop_btn_p');
    pop_btn_p.innerText = 'Ok, entendi';
    let pop_btn_div = create('', '#pop_btn', 'pop_btn_div', 'divImg');

    pop_btn.onclick = function () {
        document.querySelector('.card').style.cssText = "";
        parent.showHud();
        document.querySelector('body').removeChild(document.querySelector("#pop_lock"));
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