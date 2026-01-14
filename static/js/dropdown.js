let dropdown = document.getElementById("menu-dropdown");
let navlist = document.getElementById("navigation__list");

const tab1 = document.getElementById("tab1")

dropdown.addEventListener("click", (e) => {
    navlist.classList.toggle("open")
})