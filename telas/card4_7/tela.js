(() => {
    let target_card = document.querySelector('.card');
    var objs = [$('#txt_title_name')[0], $('#title_txt')[0]]
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
        var pivt = 0.1;
        TweenMax.from(objs[i], 1, { autoAlpha: 0, top: '+=10%', left: '-=2%', ease: Back.easeOut.config(2), delay: (pivt * i) });
    }

    let anim_like = false;

    $('#btn1').hover(over, out)
    function over() {
        TweenMax.to($('#txt2_like'), 0.5, { top: '511px', left: '196px', rotation: -15, ease: Back.easeOut.config(1) });
        TweenMax.to($('#txt2_like2'), 0.5, { top: '584px', left: '197px', rotation: -15, ease: Back.easeOut.config(1) });
    }
    function out() {
        TweenMax.to($('#txt2_like'), 0.5, { top: '521px', left: '186px', rotation: 0, ease: Back.easeOut.config(1) });
        TweenMax.to($('#txt2_like2'), 0.5, { top: '574px', left: '207px', rotation: 0, ease: Back.easeOut.config(1) });
    }
})()