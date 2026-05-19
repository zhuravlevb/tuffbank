function openMenu() {
    document.querySelector('.menu').classList.add('open');
    document.querySelector('.overlay').classList.add('open');
    document.querySelector('.burger').classList.add('open');
}

function closeMenu() {
    document.querySelector('.menu').classList.remove('open');
    document.querySelector('.overlay').classList.remove('open');
    document.querySelector('.burger').classList.remove('open');
}
