(() => {
    startScreen();
    parent.showHud('6');
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

    for (var i = 1; i < objs.length; i++) {
        var pivt = 0.05;
        TweenMax.from(objs[i], 1, { autoAlpha: 0, top: '-=20%', ease: Back.easeOut.config(2), delay: (pivt * i) });
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

var boxes_arr = [];

var perc_array = [];
function startScreen() {
    perc_array = calcPerc();

    // Taking te biggest
    let max_perc = 0;
    perc_array.forEach(a_n => {
        if (a_n > max_perc) {
            max_perc = a_n;
        }
    });

    let i = 0;
    let top_arr = []
    perc_array.forEach(a_n => {
        if (a_n == max_perc) {
            top_arr.push(i);
        }
        i++;
    });

    console.log('Maiores' + [top_arr]);
    boxes_arr = [$('#categories_box01')[0], $('#categories_box02')[0], $('#categories_box03')[0], $('#categories_box04')[0]];
    console.log(boxes_arr);
    highTop(top_arr);
    textsChange(top_arr);
}

var box_target;
function textsChange(arr) {
    if (arr.length == 1) {
        box_target = document.querySelector('#txt_box_content01');
    }
    else {
        box_target = document.querySelector('#txt_box_content02');
    }
    box_target.className = '';

    let text_array = []
    arr.forEach(e => {
        switch (e) {
            case 0:
                text_array.push('Humanas');
                break;
            case 1:
                text_array.push('Linguagens');
                break;
            case 2:
                text_array.push('Matemática');
                break;
            case 3:
                if (arr.length < 3) {
                    text_array.push('Ciências da Natureza');
                }
                else {
                    text_array.push('Natureza');
                }
                break;
        }
    })

    console.log(text_array);
    switch (text_array.length) {
        case 1:
            box_target.querySelector('.titles').innerHTML = text_array[0];
            break;
        case 2:
            box_target.querySelector('.titles').innerHTML = `<span>${text_array[0]} e</span> ${text_array[1]}`;
            break;
        case 3:
            box_target.querySelector('.titles').innerHTML = `${text_array[0]}, ${text_array[1]} e ${text_array[2]}`;
            break;
        case 4:
            box_target.querySelector('.titles').innerHTML = `${text_array[0]}, ${text_array[1]}, ${text_array[2]} e ${text_array[3]}`;
            break;
    }
}

var icons_array = []
function highTop(arr) {
    icons_array = document.querySelectorAll('.dynamic_icons');
    console.log(icons_array);
    let x;
    if (arr.length == 1) {
        x = 0;
    }
    else {
        x = 1;
    }
    arr.forEach(c => {
        console.log(c, x);
        boxes_arr[c].querySelector('.hide').classList.remove('hide');
        boxes_arr[c].querySelector('.titles_boxes').style.cssText = 'color: #977FB8';
        boxes_arr[c].querySelector('.txt_boxes').style.cssText = 'color: #1D5A9F';

        icons_array[x].style.cssText = `background-image: url(../../img/final/icon0${(c + 1)}.svg);`;
        x++;
    });
}


// M0 N1 H2 L3
function calcPerc() {
    let calc_arrays = [0, 0, 0, 0];
    let n_arr = 0;
    parent.int_array.forEach(arr => {
        if (arr[0] != -1) {
            calc_arrays[0] += arr[0];
            calc_arrays[1] += arr[1];
            calc_arrays[2] += arr[2];
            calc_arrays[3] += arr[3];
            n_arr++;
        }
    });

    n_arr = n_arr * 4;

    calc_arrays[0] = parseInt((calc_arrays[0] / n_arr) * 100);
    calc_arrays[1] = parseInt((calc_arrays[1] / n_arr) * 100);
    calc_arrays[2] = parseInt((calc_arrays[2] / n_arr) * 100);
    calc_arrays[3] = parseInt((calc_arrays[3] / n_arr) * 100);
    // Organizando array
    let piv_n = calc_arrays[2];
    calc_arrays[2] = calc_arrays[0];
    calc_arrays[0] = piv_n;

    piv_n = calc_arrays[3];
    calc_arrays[3] = calc_arrays[1];
    calc_arrays[1] = piv_n;


    // Atribuindo perc
    let txt_arr = document.querySelectorAll('.txt_boxes');

    txt_arr[0].innerHTML = `${calc_arrays[0]}%`;
    txt_arr[1].innerHTML = `${calc_arrays[1]}%`;
    txt_arr[2].innerHTML = `${calc_arrays[2]}%`;
    txt_arr[3].innerHTML = `${calc_arrays[3]}%`;

    console.log('Result: ' + calc_arrays);
    return calc_arrays;
}