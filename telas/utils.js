function createPdf() {
    // Basico do pop
    create('', '.card', 'pop_lock', 'pop_lock');
    create('', '#pop_lock', 'pop_mask', 'pop_mask');
    // Criando Png
    // let pdf_target = create('', '#pop_lock', 'pdf_target');
    let piv_pdf = document.createElement('iframe');
    piv_pdf.src = `https://docs.google.com/viewer?url=:${window.location.href}/lorem-ipsum.pdf&embedded=true`;
    piv_pdf.frameBorder = '0';
    piv_pdf.width = '100%';
    piv_pdf.height = '100%';
    document.querySelector('#pop_lock').appendChild(piv_pdf);
    // Criando Bottões
    let close_btn = create('', '#pop_lock', 'close_btn', 'divImg');
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