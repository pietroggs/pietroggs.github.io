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