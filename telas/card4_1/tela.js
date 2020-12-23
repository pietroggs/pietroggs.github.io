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

    // console.log(objs);
    for (var i = 1; i < objs.length; i++) {
        var pivt = 0.1;
        TweenMax.from(objs[i], 1, { autoAlpha: 0, top: '+=10%', left: '-=2%', ease: Back.easeOut.config(2), delay: (pivt * i) });
    }
})()