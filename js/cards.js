const card = {
    goTo: (card) => {
        $('html,body').animate({ scrollTop: ($(`${card}`).offset().top) }, 'slow');
    }
}