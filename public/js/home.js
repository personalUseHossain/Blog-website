const menu = document.querySelector('.navbar-ul');
const hamburgerIcon = document.querySelector('.fa-bars-staggered');
console.log(menu, hamburgerIcon)


hamburgerIcon.addEventListener('click', () => {
    checkhamburger(hamburgerIcon);
})

function checkhamburger(icon) {
    if (icon.classList.contains('fa-bars-staggered')) {
        icon.classList.replace('fa-bars-staggered', 'fa-xmark')
        menu.classList.add('togglemenu');
    } else {
        icon.classList.replace('fa-xmark', 'fa-bars-staggered')
        menu.classList.remove('togglemenu');
    }
}



