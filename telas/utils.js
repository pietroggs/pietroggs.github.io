parent.showHud();
var card4_n = parseInt(document.querySelector('body').className);
parent.int_card = card4_n;

function createPdf() {
    $('video')[0].pause();
    parent.hideHud();
    // Basico do pop
    create('', 'body', 'pop_lock', 'pop_lock');
    create('', '#pop_lock', 'pop_mask', 'pop_mask');
    // Criando pdf
    parent.iframeCreatePdf(`../../web/viewer.html?file=../assets/pdf/FTD_PIF_E${card4_n}.pdf`);
    // Criando Bottões
    let close_btn = create('', '#pop_lock', 'close_btn_pdf', 'divImg');
    close_btn.onclick = function () {
        parent.showHud();
        document.querySelector('body').removeChild(document.querySelector("#pop_lock"));
    }
}

function createPodcast(t1_t = '29%', t1_l = '37%') {
    $('video')[0].pause();
    parent.hideHud();
    document.querySelector('.card').style.cssText = "filter: blur(3px)";
    // Basico do pop
    create('', 'body', 'pop_lock', 'pop_lock');
    create('', '#pop_lock', 'pop_mask', 'pop_mask');
    // Criando Png
    let piv_audio = document.createElement("audio");
    piv_audio.src = `Episodio0${card4_n}.mp3`;
    piv_audio.controls = true;
    piv_audio.volume = 0.5;
    document.querySelector('#pop_lock').appendChild(piv_audio);
    piv_audio.play();
    // Criando Img
    create('', '#pop_lock', 'podcast_img', 'divImg');

    // Anim titulo
    let t1 = $('#txt_title_name')[0];
    let t2 = $('#title_txt')[0];
    var t1_pos = [t1.style.left, t1.style.top];
    var t2_pos = [t2.style.left, t2.style.top];
    t1.style.zIndex = '11';
    t1.style.color = '#fff';
    t2.style.zIndex = '11';
    TweenMax.to(t1, 1, { top: t1_t, left: t1_l, ease: Back.easeOut.config(1) });
    TweenMax.to(t2, 1, { top: '35%', left: '39%', ease: Back.easeOut.config(1) });

    // Criando Bottões
    let close_btn = create('', '#pop_lock', 'close_btn_podcast', 'divImg');
    close_btn.onclick = function () {
        document.querySelector('.card').style.cssText = "";
        parent.showHud();
        t1.style.zIndex = '2';
        t1.style.color = '#2063AC';
        t2.style.zIndex = '2';
        TweenMax.to(t1, 1, { top: t1_pos[1], left: t1_pos[0], ease: Back.easeOut.config(1) });
        TweenMax.to(t2, 1, { top: t2_pos[1], left: t2_pos[0], ease: Back.easeOut.config(1) });

        document.querySelector('body').removeChild(document.querySelector("#pop_lock"));
    }
}