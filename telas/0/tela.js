function initTela() {
    create('', cardAt, 'bg', 'divImg');

    var piv_video = create('video', cardAt, 'video_aula');
    piv_video.setAttribute("src", "assets/video/video.mp4");
    piv_video.setAttribute("controls", "true");

    var btn1 = create('btn', cardAt, 'btn1', 'button');
    btn1.onclick = function () {
        createPdf('assets/pdf/lorem-ipsum.pdf');
    }

    var btn2 = create('btn', cardAt, 'btn2', 'button');
    btn2.onclick = function () {
        createPodcast("assets/audio/color.mp3");
    }
}

function createPdf(ref) {
    // Basico do pop
    create('', cardAt, 'pop_lock', 'pop_lock');
    create('', '#pop_lock', 'pop_mask', 'pop_mask');
    // Criando Png
    // let pdf_target = create('', '#pop_lock', 'pdf_target');
    let piv_pdf = document.createElement('embed');
    piv_pdf.src = ref;
    piv_pdf.type = "application/pdf";
    piv_pdf.title = "quack";
    document.querySelector('#pop_lock').appendChild(piv_pdf);
    // Criando Bottões
    let close_btn = create('', '#pop_lock', 'close_btn', 'divImg');
    close_btn.onclick = function () {
        document.querySelector(cardAt).removeChild(document.querySelector("#pop_lock"));
    }
}

function createPodcast(ref) {
    // Basico do pop
    create('', cardAt, 'pop_lock', 'pop_lock');
    create('', '#pop_lock', 'pop_mask', 'pop_mask');
    // Criando Png
    let piv_audio = document.createElement("audio");
    piv_audio.src = ref;
    piv_audio.controls = true;
    piv_audio.volume = 0.5;
    document.querySelector('#pop_lock').appendChild(piv_audio);
    piv_audio.play();
    // Criando Img
    create('', '#pop_lock', 'podcast_img', 'divImg');
    // Criando Bottões
    let close_btn = create('', '#pop_lock', 'close_btn_podcast', 'divImg');
    close_btn.onclick = function () {
        document.querySelector(cardAt).removeChild(document.querySelector("#pop_lock"));
    }
}