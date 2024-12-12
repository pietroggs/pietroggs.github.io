let currentPin = 1;
const totalPins = 10;

// Array of specific widths for each popup
const popupWidths = [2, 4];

const createPopup = (pinNumber) => {
    const main = document.querySelector('main');
    main.style.overflow = 'hidden';

    const mask = document.createElement('div');
    mask.className = 'mask';

    const holder = document.createElement('div');
    holder.className = 'holder';
    mask.appendChild(holder);

    const popup = document.createElement('img');
    popup.src = `assets/pop${pinNumber}.png`;
    popupWidths.indexOf(pinNumber) !== -1 ? popup.className = 'big' : false;
    holder.appendChild(popup);
    // Close button
    const exitFunc = ()=>{
        // Animate out
        gsap.to(popup, {
            duration: 0.4,
            y: 100,
            opacity: 0,
            ease: "power2.in",
            onComplete: () => {
                main.style.overflow = 'hidden';
                mask.remove();
                popup.style.cssText = '';
            }
        });
    }
    const exit = document.createElement('div');
    exit.className = 'exit';
    exit.onclick = exitFunc
    holder.appendChild(exit);

    main.appendChild(mask);

    // Initial state
    gsap.set(popup, {
        y: 100,
        opacity: 0
    });

    // Animate in
    gsap.to(popup, {
        duration: 0.5,
        y: 0,
        opacity: 1,
        ease: "back.out(1.2)"
    });
}


const initPins = () => {
    const pins = document.querySelectorAll('.pins img');

    // Add initial float animation to first pin
    document.querySelector(`#id${currentPin}`).classList.add('float-animation');

    pins.forEach(pin => {
        pin.style.cursor = 'pointer';
        const pinNumber = parseInt(pin.id.replace('id', ''));

        pin.addEventListener('click', () => {
            if (pinNumber <= currentPin) {
                createPopup(pinNumber);
                pin.style.filter = 'grayscale(100%)';
                pin.style.opacity = '.7';

                // Remove float animation from current pin
                pin.classList.remove('float-animation');

                if (pinNumber === currentPin && currentPin < totalPins) {
                    currentPin++;
                    // Add float animation to next pin
                    const nextPin = document.querySelector(`#id${currentPin}`);
                    if (nextPin) {
                        nextPin.classList.add('float-animation');
                    }
                }

                if (pinNumber === totalPins && currentPin === totalPins) {
                    sco.complete();
                    console.log('All pins completed!');
                }
            }
        });
    });
}

//fullscreen, não fui eu que fiz, se der pau reclamar com a Aline
var fsButton = document.querySelector('.clickfull');

// #region FULLSCREEN!
document.fullscreenEnabled =
    document.fullscreenEnabled ||
    document.mozFullScreenEnabled ||
    document.documentElement.webkitRequestFullScreen;

function requestFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
    }
}

fsButton.addEventListener('click', (e) => {
    if (screenfull.isEnabled) {
        screenfull.toggle();

        if (!screenfull.isFullscreen) {
            e.target.classList.add("active");
        } else {
            e.target.classList.remove("active");
        }
    }
});
// #endregion

// #region IOS Detection
function iOS() {
    return [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
    ].includes(navigator.platform)
        // iPad on iOS 13 detection
        || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

!!iOS() ? fsButton.style.display = 'none' : fsButton.style.display = 'block';
// #endregion
const init = () => {
    console.log('%cInit', 'color: blue');
    sco.init();
    initPins();
}

init();
