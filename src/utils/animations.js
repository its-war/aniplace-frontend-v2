import anime from 'animejs/lib/anime.es.js';

function useFadeIn(el, done) {
    anime({
        targets: el,
        opacity: [0, 1],
        easing: 'easeInOutSine',
        complete: done,
    })
}

function useFadeOut(el, done) {
    anime({
        targets: el,
        opacity: [1, 0],
        easing: 'easeInOutSine',
        complete: done,
    })
}

export {
    useFadeIn,
    useFadeOut
}