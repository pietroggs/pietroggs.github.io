async function init() {
  await calcScale();
}

//#region game
var pos_x = [20, 35, 50, 65, 80];
var last_pos = 0;
var cicle_counter = 0;
const game = {
  tela: null,
  interval: null,
  spwan: 0,
  cicle: 8,
  dif: 8,
  speed: 50,
  running: true,
  init: (e) => {
    game.running = true;
    playAudio("./sounds/hit.wav", 0.5);
    e.style.display = "none";
    if (game.tela == null) {
      game.tela = document.querySelector("main");
    }
    game.interval = setInterval(() => {
      //Aumenta dificuldade
      if (game.spwan == 5 && game.speed < 150) {
        game.spwan = 0;
        game.speed += 25;
        console.log("speed", game.speed);
      } else if (game.spwan == 5 && game.dif > 2) {
        game.spwan = 0;
        game.dif -= 1;
        console.log("dif", game.dif);
      }
      //Spawn
      game.cicle--;
      if (game.cicle == 0) {
        game.cicle = game.dif;
        game.spawnTarget(game.speed);
      }
    }, 250);
  },

  spawnTarget: (speed) => {
    game.spwan++;
    //set
    let tg = document.createElement("img");
    tg.src = "./img/celular.png";
    tg.className = "target pointer";
    tg.style.top = "15%";
    tg.draggable = false;
    if (pos_x.length == 0) {
      pos_x = [20, 35, 50, 65, 80];
    }
    let tg_left = pos_x.splice(randomNumber(0, pos_x.length - 1), 1);
    if (tg_left == last_pos)
      tg_left = pos_x.splice(randomNumber(0, pos_x.length - 1), 1);
    last_pos = tg_left;
    tg.style.left = `${tg_left}%`;

    //move
    let sp = 200 - speed;
    anim.fadeIn(tg, 0.5);
    let down_int = setInterval(() => {
      // console.log(tg.style.top)
      if (parseInt(tg.style.top) < 90) {
        tg.style.top = `${parseInt(tg.style.top) + 1}% `;
      } else {
        anim.sizeDown(tg);
        game.blockTarget(tg, down_int);
        header.hit();
      }
    }, sp);

    //click
    tg.onclick = (tg) => {
      game.blockTarget(tg.target, down_int);
      anim.fadeOut(tg.target);
      header.pontuar();
    };

    //input
    game.tela.appendChild(tg);
  },

  blockTarget: (e, int) => {
    e.onclick = null;
    e.classList.remove("pointer");
    int != null ? clearInterval(int) : null;
    setTimeout(() => {
      game.tela.removeChild(e);
    }, 500);
  },
};
//#endregion

//#region Header
const header = {
  vidas: 5,
  pontos: 0,
  pontos_html: null,
  vidas_html: null,
  block: null,
  pontuar: () => {
    if (header.pontos_html == null) {
      header.pontos_html = document.querySelector(".pontos");
    }
    header.pontos += 10;
    header.pontos_html.innerText = header.pontos;
    playAudio("./sounds/hit.wav", 0.3);
  },
  hit: () => {
    if (header.vidas_html == null) {
      header.vidas_html = document.querySelector(".lifes");
    }
    header.vidas--;
    if (header.vidas <= 0) {
      if (header.block == null) {
        header.block = document.querySelector(".block");
      }
      if (game.running) playAudio("./sounds/end.wav", 0.5);
      game.running = false;
      clearInterval(game.interval);
      document.querySelector(
        ".block-p2"
      ).innerHTML = `Pontos: <br /><br /> ${header.pontos}`;
      header.block.style.display = "block";
    }
    if (game.running){
        header.vidas_html.innerText = header.vidas;
        playAudio("./sounds/fail.wav", 0.5); 
    } 
  },
  restart: () => {
    header.pontos = 0;
    header.pontos_html.innerText = header.pontos;
    header.vidas = 5;
    header.vidas_html.innerText = header.vidas;
    game.cicle = 8;
    game.dif = 8;
    game.speed = 50;
    header.block.style.display = "none";
  },
};

//#endregion

//#region Animação
const anim = {
  fadeOut: (e) => {
    gsap.to(e, { autoAlpha: 0, duration: 0.5 });
  },
  fadeIn: (e, time) => {
    gsap.from(e, { autoAlpha: 0, duration: time });
  },
  sizeDown: (e) => {
    gsap.to(e, { scale: 0.5, autoAlpha: 0, duration: 0.5 });
  },
};
//#endregion
