var txt_load;
var preload_content;
var preload_images;
let init_preload, end_preload;

function startPreloader() {
    init_preload = Date.now();
    log("Init Preloader ");
    preload_content = create('', '#container', 'preload_content');
    let anim_preload = create('', '#preload_content', 'anim_preload', 'lds-grid');
    anim_preload.innerHTML = "<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>";
    txt_load = create('p', '#preload_content', 'txt_load');
    txt_load.innerText = "Carregando";
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
            if (i == (preload_list.length - 1)) {
                console.log("A ultima é: " + alt_count);
                piv_img.id = "last_img_preload";
            }
            alt_count++;
            preload_images.appendChild(piv_img);
        } catch (error) { }
    }
    end_preload = Date.now();
    setTimeout(checkCanInit, 1000);
}

var tick_canInit = 0
function checkCanInit() {
    let canInit = IsImageOk(document.querySelector("#last_img_preload"));
    if (canInit || tick_canInit == 20) {
        log("End Preloader in: " + (end_preload - init_preload) + "ms");
        console.log("Ultima imagem já está pronta");
        document.querySelector("#container").removeChild(preload_content);
        initCourse();
    }
    else {
        tick_canInit++;
        console.log("Ultima imagem não está pronta, aguardando...");
        setTimeout(checkCanInit, 1000);
    }
}

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


var preload_list = ["img/ajuda.png", "img/ajuda_btn.png", "img/avan.png", "img/fechar.png", "img/logo.png", "img/topo.png", "img/voltar.png", "telas/0/img/botao.png", "telas/0/img/fundo.png", "telas/0/img/personagem.png", "telas/0/img/txt.png", "telas/1/img/base_1.png", "telas/1/img/etapa1.png", "telas/1/img/etapa2.png", "telas/1/img/txt.png", "telas/10/img/balao1.png", "telas/10/img/balao2.png", "telas/10/img/bg.png", "telas/10/img/img1.png", "telas/10/img/perso.png", "telas/10/img/txt1.png", "telas/11/img/balao1.png", "telas/11/img/bg.png", "telas/11/img/perso.png", "telas/11/img/txt1.png", "telas/12/img/bg.png", "telas/12/img/box1.png", "telas/12/img/pop1.png", "telas/12/img/txt.png", "telas/13/img/balao1.png", "telas/13/img/balao2.png", "telas/13/img/bg.png", "telas/13/img/perso.png", "telas/13/img/txt1.png", "telas/14/img/bg.png", "telas/14/img/box1.png", "telas/14/img/icons.png", "telas/14/img/img1.png", "telas/14/img/pop1.png", "telas/14/img/pop2.png", "telas/14/img/pop2_1.png", "telas/14/img/pop5.png", "telas/14/img/pop7.png", "telas/14/img/pop8.png", "telas/15/img/balao1.png", "telas/15/img/balao2.png", "telas/15/img/bg.png", "telas/15/img/perso.png", "telas/15/img/SLA.png", "telas/15/img/slabtn.png", "telas/15/img/txt1.png", "telas/16/img/bg.png", "telas/16/img/person.png", "telas/16/img/txt1.png", "telas/16/img/txt2.png", "telas/16/img/txts.png", "telas/17/img/bg.png", "telas/17/img/person.png", "telas/17/img/txt1.png", "telas/17/img/txt2.png", "telas/17/img/txts.png", "telas/18/img/bfit.png", "telas/18/img/bg.png", "telas/18/img/earfit.png", "telas/18/img/person.png", "telas/18/img/txt1.png", "telas/18/img/txt2.png", "telas/18/img/txts.png", "telas/19/img/bg.png", "telas/19/img/person.png", "telas/19/img/txt1.png", "telas/2/img/bg.png", "telas/2/img/person.png", "telas/2/img/tela2.png", "telas/2/img/txt2.png", "telas/2/img/txts.png", "telas/20/img/balao1.png", "telas/20/img/balao2.png", "telas/20/img/bg.png", "telas/20/img/perso.png", "telas/20/img/txt1.png", "telas/21/img/balao1.png", "telas/21/img/balao2.png", "telas/21/img/bg.png", "telas/21/img/box.png", "telas/21/img/tela2.png", "telas/21/img/txt1.png", "telas/22/img/balao1.png", "telas/22/img/balao2.png", "telas/22/img/bg.png", "telas/22/img/perso.png", "telas/22/img/txt1.png", "telas/23/img/bg.png", "telas/23/img/conf.png", "telas/23/img/feedback_n.png", "telas/23/img/feedback_p.png", "telas/23/img/interface.png", "telas/23/img/perso.png", "telas/23/img/positivo.png", "telas/23/img/txt1.png", "telas/24/img/balao1.png", "telas/24/img/balao2.png", "telas/24/img/balao3.png", "telas/24/img/balao4.png", "telas/24/img/balao5.png", "telas/24/img/bg.png", "telas/24/img/perso.png", "telas/24/img/perso2.png", "telas/24/img/txt1.png", "telas/25/img/fundo.png", "telas/25/img/personagem.png", "telas/25/img/txt.png", "telas/3/img/acoes.png", "telas/3/img/bg.png", "telas/3/img/card.png", "telas/3/img/comport.png", "telas/3/img/equip.png", "telas/3/img/leis.png", "telas/3/img/parti.png", "telas/3/img/Polygon 1.png", "telas/3/img/Rounded Rectangle 1 copy 2.png", "telas/3/img/Rounded Rectangle 1 copy 3.png", "telas/3/img/Rounded Rectangle 1.png", "telas/3/img/txt.png", "telas/4/img/bg.png", "telas/4/img/box1Text.png", "telas/4/img/box2.png", "telas/4/img/box2Text.png", "telas/4/img/box3.png", "telas/4/img/box3Text.png", "telas/4/img/box_1.png", "telas/4/img/txt.png", "telas/5/img/bg.png", "telas/5/img/txts.png", "telas/6/img/bg.png", "telas/6/img/botao.png", "telas/6/img/bt_ipt.png", "telas/6/img/fechar.png", "telas/6/img/missao.png", "telas/6/img/person_1.png", "telas/6/img/person_2.png", "telas/6/img/pop1.png", "telas/6/img/pop2.png", "telas/6/img/pop3.png", "telas/6/img/tela6.png", "telas/6/img/txt1.png", "telas/6/img/txt2.png", "telas/6/img/txt3.png", "telas/6/img/txts.png", "telas/6/img/valores.png", "telas/6/img/visao.png", "telas/7/img/balao1.png", "telas/7/img/balao2.png", "telas/7/img/bg.png", "telas/7/img/perso.png", "telas/7/img/txt1.png", "telas/8/img/balao1.png", "telas/8/img/balao2.png", "telas/8/img/balao3.png", "telas/8/img/balao4.png", "telas/8/img/balao5.png", "telas/8/img/balao6.png", "telas/8/img/bg.png", "telas/8/img/btn_av.png", "telas/8/img/btn_vt.png", "telas/8/img/item_1.png", "telas/8/img/item_2.png", "telas/8/img/item_3.png", "telas/8/img/item_4.png", "telas/8/img/item_5.png", "telas/8/img/perso_1.png", "telas/8/img/piramide.png", "telas/8/img/pop1.png", "telas/8/img/pop2.png", "telas/8/img/pop3.png", "telas/8/img/pop4.png", "telas/8/img/pop5.png", "telas/8/img/tela6.png", "telas/8/img/txt1.png", "telas/8/img/txt2.png", "telas/9/img/avanca.png", "telas/9/img/bg.png", "telas/9/img/box1.png", "telas/9/img/pop1.png", "telas/9/img/txt.png", "telas/14/img/pop3/fehcar.png", "telas/14/img/pop3/pop3.png", "telas/14/img/pop3/txt3_1.png", "telas/14/img/pop3/txt3_2.png", "telas/14/img/pop3/txt3_3.png", "telas/14/img/pop6/pop6.png", "telas/14/img/pop6/txt6_1.png", "telas/14/img/pop6/txt6_2.png", "telas/6/img/pop/base_pop.png", "telas/6/img/pop/bg_pop.png", "telas/6/img/pop/fechar.png", "telas/6/img/pop/icone_importante.png", "telas/6/img/pop/Pop_importante.png", "telas/6/img/pop/txt_imp.png", "telas/6/img/pop/txt_pop.png", "telas/9/img/A/avanca.png", "telas/9/img/A/bg.png", "telas/9/img/A/box1.png", "telas/9/img/A/pop2.png", "telas/9/img/A/txt.png", "telas/9/img/B/avanca.png", "telas/9/img/B/bg.png", "telas/9/img/B/box1.png", "telas/9/img/B/pop1.png", "telas/9/img/B/txt1.png", "telas/9/img/C/box1.png", "telas/9/img/C/pop1.png", "telas/9/img/D/box1.png", "telas/9/img/D/btnImp.png", "telas/9/img/D/pop1.png", "telas/9/img/D/pop_bg.png", "telas/9/img/D/pop_bgdt.png", "telas/9/img/D/pop_btnFecha.png", "telas/9/img/D/pop_txt1.png", "telas/9/img/D/pop_txt2.png", "telas/9/img/F/bg.png", "telas/9/img/F/blue_spot.png", "telas/9/img/F/box1.png", "telas/9/img/F/btn_ds.png", "telas/9/img/F/canhaodeluz.png", "telas/9/img/F/pop1.png", "telas/9/img/F/pop_bg.png", "telas/9/img/F/redzone.png", "telas/9/img/H/box1.png", "telas/9/img/H/pop1.png", "telas/14/img/pop4/pop4.png", "telas/14/img/pop4/txt4_1.png", "telas/14/img/pop4/txt4_2.png", "telas/9/img/I/bg.png", "telas/9/img/I/box1.png", "telas/9/img/I/btnImp.png", "telas/9/img/I/pop1.png", "telas/9/img/I/pop_bg.png", "telas/9/img/I/pop_dip.png", "telas/9/img/I/pop_fispq.png", "telas/9/img/I/pop_imp.png"];