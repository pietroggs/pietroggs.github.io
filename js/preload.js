var text_perc;
var preload_images;
let init_preload, end_preload;

function startPreloader() {
    init_preload = Date.now();
    log("Init Preloader ");
    preload_images = create('', '#container', 'preload_images');
    preload();
}

var alt_count = 0;

function preload() {
    for (i = 0; i < preload_list.length; i++) {
        try {
            let piv_img = document.createElement('img');
            piv_img.src = preload_list[i];
            piv_img.width = 1;
            piv_img.height = 1;
            piv_img.alt = "pImage" + alt_count;
            piv_img.onload = function () {
                readyImg(piv_img);
            }
            alt_count++;
            preload_images.appendChild(piv_img);
        } catch (error) {}
    }
    end_preload = Date.now();
    text_perc = document.querySelector('iframe').contentWindow.document.querySelector('span');
    // setTimeout(checkCanInit, 1000);
}

var count_perc = 0;

function readyImg(element) {
    count_perc++;
    let perc = `${Math.ceil((100/alt_count) * count_perc)}%`;
    text_perc.innerText = perc;
    if (count_perc == alt_count) {
        console.log('100%');
        console.log(IsImageOk(element));
        setTimeout(function () {
            parent.cardChange('1'), 1000
        });
    }
}

// var tick_canInit = 0

// function checkCanInit() {
//     let canInit = IsImageOk(document.querySelector("#last_img_preload"));
//     if (canInit || tick_canInit == 20) {
//         log("End Preloader in: " + (end_preload - init_preload) + "ms");
//         console.log("Ultima imagem já está pronta");
//         document.querySelector("#container").removeChild(preload_content);
//         initCourse();
//     } else {
//         tick_canInit++;
//         console.log("Ultima imagem não está pronta, aguardando...");
//         setTimeout(checkCanInit, 1000);
//     }
// }

// External check loaded image
function IsImageOk(img) {
    if (!img.complete) {
        return false;
    }
    if (img.naturalWidth === 0) {
        return false;
    }
    return true;
}


var preload_list = ["img/btn_back_bg.svg", "img/btn_back_bg2.svg", "img/btn_back_bg_hover.svg", "img/btn_back_ico.svg", "img/btn_back_ico_hover.svg", "img/btn_home_bg.svg", "img/btn_home_bg2.svg", "img/btn_home_bg_hover.svg", "img/btn_home_ico.svg", "img/btn_home_ico_hover.svg", "img/close.svg", "img/seta_amarela.svg", "img/seta_azul.svg", "img/seta_roxa.svg", "img/avaliacao/bt_bg.svg", "img/avaliacao/bt_bg_hover.svg", "img/avaliacao/fundo.svg", "img/avaliacao/icon01.svg", "img/avaliacao/icon02.svg", "img/avaliacao/icon03.svg", "img/avaliacao/icon04.svg", "img/avaliacao/icon_face_01.svg", "img/avaliacao/icon_face_01_hover.svg", "img/avaliacao/icon_face_02.svg", "img/avaliacao/icon_face_02_hover.svg", "img/avaliacao/icon_face_03.svg", "img/avaliacao/icon_face_03_hover.svg", "img/avaliacao/icon_face_04.svg", "img/avaliacao/icon_face_04_hover.svg", "img/avaliacao/icon_face_05.svg", "img/avaliacao/icon_face_05_hover.svg", "img/avaliacao/img01.svg", "img/avaliacao/img02.svg", "img/avaliacao/img03.svg", "img/avaliacao/img04.svg", "img/capa/bg.svg", "img/capa/bt_bg.svg", "img/capa/bt_bg_hover.svg", "img/capa/img01.svg", "img/capa/img02.svg", "img/capa/img03.svg", "img/capa/img04.svg", "img/capa/img05.svg", "img/capa/img06.svg", "img/capa/img07.svg", "img/capa/img_txt01.svg", "img/capa/img_txt02.svg", "img/capa/img_txt03.svg", "img/interacoes/bg.svg", "img/interacoes/bt1_bg.svg", "img/interacoes/bt1_bg_roxo.svg", "img/interacoes/btn_bt_bg.svg", "img/interacoes/btn_bt_bg2.svg", "img/interacoes/bt_box.svg", "img/interacoes/ereader.svg", "img/interacoes/podcast.svg", "img/interacoes/txt2_box.svg", "img/interacoes/txt2_like.svg", "img/interacoes/txt2_like2.svg", "img/final/bg.svg", "img/final/box_grande_categorias.svg", "img/final/box_pequeno_categorias.svg", "img/final/bt_download.svg", "img/final/icon01.svg", "img/final/icon02.svg", "img/final/icon03.svg", "img/final/icon04.svg", "img/final/img01.svg", "img/final/img02.svg", "img/final/img03.svg", "img/final/img04.svg", "img/final/img05.svg", "img/final/img06.svg", "img/introducao/bg.svg", "img/introducao/bt_bg.svg", "img/introducao/bt_bg_hover.svg", "img/introducao/img01.svg", "img/introducao/img02.svg", "img/introducao/img03.svg", "img/introducao/img04.svg", "img/introducao/img05.svg", "img/introducao/img06.svg", "img/introducao/img07.svg", "img/menu/bg.svg", "img/menu/bt_bg.svg", "img/menu/bt_bg01.svg", "img/menu/bt_bg01_hover.svg", "img/menu/bt_bg02.svg", "img/menu/bt_bg02_hover.svg", "img/menu/bt_bg03.svg", "img/menu/bt_bg03_hover.svg", "img/menu/bt_bg04.svg", "img/menu/bt_bg04_hover.svg", "img/menu/bt_bg05.svg", "img/menu/bt_bg05_hover.svg", "img/menu/bt_bg06.svg", "img/menu/bt_bg06_hover.svg", "img/menu/bt_bg07.svg", "img/menu/bt_bg07_hover.svg", "img/menu/bt_bg08.svg", "img/menu/bt_bg08_hover.svg", "img/menu/bt_bg09.svg", "img/menu/bt_bg09_hover.svg", "img/menu/bt_bg_hover.svg", "img/menu/check.svg", "img/menu/icon01.svg", "img/menu/img01.svg", "img/menu/img02.svg", "img/menu/img03.svg", "img/menu/img04.svg", "img/menu/img05.svg", "img/menu/img06.svg", "img/menu/img07.svg", "img/menu/pin.svg", "img/menu/pin_boxes.svg", "web/images/annotation-check.svg", "web/images/annotation-comment.svg", "web/images/annotation-help.svg", "web/images/annotation-insert.svg", "web/images/annotation-key.svg", "web/images/annotation-newparagraph.svg", "web/images/annotation-noicon.svg", "web/images/annotation-note.svg", "web/images/annotation-paragraph.svg", "img/interacoes/1/title_bg.svg", "img/interacoes/1/txt_bg1.svg", "img/interacoes/1/txt_bg2.svg", "img/interacoes/2/title_bg.svg", "img/interacoes/3/title_bg.svg", "img/interacoes/3/txt_bg1.svg", "img/interacoes/3/txt_bg2.svg", "img/interacoes/4/title_bg.svg", "img/interacoes/4/txt_bg1.svg", "img/interacoes/4/txt_bg2.svg", "img/interacoes/5/txt_bg1.svg", "img/interacoes/5/txt_bg2.svg", "img/interacoes/6/title_bg.svg", "img/interacoes/6/txt_bg1.svg", "img/interacoes/6/txt_bg2.svg", "img/interacoes/7/title_bg.svg", "img/interacoes/7/txt_bg1.svg", "img/interacoes/7/txt_bg2.svg", "img/interacoes/8/title_bg.svg", "img/interacoes/9/title_bg.svg", "img/interacoes/9/txt_bg1.svg", "img/interacoes/9/txt_bg2.svg", "telas/card3/pop/box-azul.svg", "telas/card3/pop/box-bco.svg", "telas/card3/pop/bt-amarelo.svg", "telas/card3/pop/oops.svg", "telas/card5/pop/box_azul.svg", "telas/card5/pop/box_branco.svg", "telas/card5/pop/btn1.svg", "telas/card5/pop/btn2.svg", "telas/card5/pop/face.svg"];