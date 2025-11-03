let dropdown = document.getElementById("menu-dropdown");
let navlist = document.getElementById("navigation__list");


dropdown.addEventListener("click", (e) => {
    navlist.classList.toggle("open")
})