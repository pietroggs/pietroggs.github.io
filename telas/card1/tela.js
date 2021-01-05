var int_done = false;

(() => {
    let tl_1 = new TimelineMax();

    tl_1
        .from($('#img02')[0], 1, { autoAlpha: 0 }, 0)
        .from($('.img_titles')[0], 1.5, { autoAlpha: 0, left: '-=25%', ease: Back.easeOut.config(2) }, 0)
        .from($('.img_titles')[1], 1.5, { autoAlpha: 0, left: '+=25%', ease: Back.easeOut.config(2) }, 0)
        .from($('.img_titles')[2], 1.5, { autoAlpha: 0, left: '-=20%', ease: Back.easeOut.config(2) }, 0)
        .from($('#img01')[0], 1, { autoAlpha: 0, top: '13%', left: '85%', ease: Power1.easeOut }, .5)
        .from($('#img04')[0], 1, { autoAlpha: 0, top: '88%', left: '13%', ease: Power1.easeOut }, .5)
        .from($('#img03')[0], 1, { autoAlpha: 0, left: '2%', ease: Power1.easeOut }, .5)
        .from($('#img05')[0], 1, { autoAlpha: 0, top: '+=4%', ease: Back.easeOut.config(2) }, .75)
        .from($('#img06')[0], 1, { autoAlpha: 0, left: '+=4%', ease: Back.easeOut.config(2) }, 1)
        .from($('#img07')[0], 1, { autoAlpha: 0, left: '-=1%', ease: Back.easeOut.config(2) }, 1)
        .from($('#btn_bt_1')[0], 1.5, { autoAlpha: 0, left: '-=1%', rotation: 15, ease: Back.easeOut.config(3) }, 1.25)

})();