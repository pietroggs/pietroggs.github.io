var int_done = false;

(() => {
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
        var pivt = .1;

        if (objs[i].id == 'title_bg01') {
            TweenMax.from(objs[i], 1.5, { autoAlpha: 0, top: '-=50%', ease: Back.easeOut.config(2), delay: (pivt * i) });
        }
        else if (objs[i].id == 'txt1') {
            TweenMax.from(objs[i], 1.5, { autoAlpha: 0, top: '+=25%', left: '-=5%', ease: Back.easeOut.config(2), delay: (pivt * i) });
        }
        else if (objs[i].id == 'txt2') {
            TweenMax.from(objs[i], 1, { autoAlpha: 0, top: '+=25%', left: '-=5%', ease: Back.easeOut.config(1), delay: (pivt * i) });
        }
        else if (objs[i].id == 'txt3') {
            TweenMax.from(objs[i], 1, { autoAlpha: 0, top: '+=25%', left: '-=5%', ease: Back.easeOut.config(1), delay: (pivt * i) });
        }
        else if (objs[i].id == 'txt4') {
            TweenMax.from(objs[i], 1, { autoAlpha: 0, top: '+=25%', left: '-=5%', ease: Back.easeOut.config(1), delay: (pivt * i) });
        }
        else if (objs[i].id == 'img04') {
            TweenMax.from(objs[i], 1, { autoAlpha: 0 });
            TweenMax.to(objs[i], 1, { left: '+=2%', ease: Power1.easeInOut, delay: (pivt * i) });
        }
        else if (objs[i].id == 'btn_bt_1') {
            TweenMax.from(objs[i], 1.5, { autoAlpha: 0, left: '-=1%', rotation: 15, ease: Back.easeOut.config(3), delay: 3 })
        }
        else {
            TweenMax.from(objs[i], 1, { autoAlpha: 0, top: '+=15%', ease: Back.easeOut.config(2), delay: (pivt * i) });
        }
    }
})();