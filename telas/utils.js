function createPdf() {
    // Basico do pop
    create('', '.card', 'pop_lock', 'pop_lock');
    create('', '#pop_lock', 'pop_mask', 'pop_mask');
    // Criando pdf
    parent.iframeCreatePdf("../../web/viewer.html?file=../assets/pdf/lorem-ipsum.pdf");
    // Criando Bottões
    let close_btn = create('', '#pop_lock', 'close_btn_pdf', 'divImg');
    close_btn.onclick = function () {
        document.querySelector('.card').removeChild(document.querySelector("#pop_lock"));
    }
}

function createPodcast() {
    // Basico do pop
    create('', '.card', 'pop_lock', 'pop_lock');
    create('', '#pop_lock', 'pop_mask', 'pop_mask');
    // Criando Png
    let piv_audio = document.createElement("audio");
    piv_audio.src = `color.mp3`;
    piv_audio.controls = true;
    piv_audio.volume = 0.5;
    document.querySelector('#pop_lock').appendChild(piv_audio);
    // piv_audio.play();
    // Criando Img
    create('', '#pop_lock', 'podcast_img', 'divImg');
    // Criando Bottões
    let close_btn = create('', '#pop_lock', 'close_btn_podcast', 'divImg');
    close_btn.onclick = function () {
        document.querySelector('.card').removeChild(document.querySelector("#pop_lock"));
    }
}