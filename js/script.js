let dropdown = document.getElementById("menu-dropdown");
let navlist = document.getElementById("navigation__list");


dropdown.addEventListener("click", (e) => {
    navlist.classList.toggle("open")
})

const addBtn = document.getElementById("add-post-btn");
const popup = document.getElementById("popup");
const closeBtn = document.getElementById("close-popup");
const postForm = document.getElementById("post-form");
const postGrid = document.getElementById("post-grid");

// Open popup
addBtn.addEventListener("click", () => {
    popup.classList.remove("hidden");
});

// Close popup
closeBtn.addEventListener("click", () => {
    popup.classList.add("hidden");
});

// Submit a post
postForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const link = document.getElementById("link").value;

    const card = document.createElement("div");
    card.classList.add("post-card");
    card.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
        ${link ? `<a href="${link}" target="_blank">View Project</a>` : ""}
    `;

    postGrid.appendChild(card);

    postForm.reset();
    popup.classList.add("hidden");
});

postForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const link = document.getElementById("link").value;
    const imageInput = document.getElementById("image");
    
    let imageURL = "";
    
    if (imageInput.files && imageInput.files[0]) {
    imageURL = URL.createObjectURL(imageInput.files[0]);
    }
    
    const card = document.createElement("div");
    card.classList.add("post-card");
    
    card.innerHTML = `
    ${imageURL ? `<img src="${imageURL}" class="post-image">` : ""}
    <h3>${title}</h3>
    <p>${description}</p>
    ${link ? `<a href="${link}" target="_blank">View Project</a>` : ""}
    `;
    
    postGrid.appendChild(card);
    
    postForm.reset();
    popup.classList.add("hidden");
    });