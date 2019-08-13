//Изменение иконки при нажатии
var button = document.querySelector('.main-nav__toggle');
var opensrc = document.querySelector('.main-nav__toggle--btn').src;
var sidebar = document.querySelectorAll('.site-list__all');
var sideArr = Array.from(sidebar);

function changeIcon() {
    if (document.querySelector('.main-nav__toggle--btn').src == opensrc) {
        document.querySelector('.main-nav__toggle--btn').src = "image/icons/icon-menu-close.svg";
        for (var i = 0; i < sideArr.length; i++) {
            sideArr[i].classList.remove("site-list--display");
        }
    } else {
        document.querySelector('.main-nav__toggle--btn').src = "image/icons/icon-menu-open.svg";
        for (var i = 0; i < sideArr.length; i++) {
            sideArr[i].classList.add("site-list--display");
        }

    }
}
button.addEventListener('click', changeIcon);
//Изменение иконки при нажатии
