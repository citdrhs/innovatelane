let dropdown = document.getElementById("menu-dropdown");
let navlist = document.getElementById("navigation__list");

dropdown.addEventListener("click", (e) => {
    navlist.classList.toggle("open")
})

const addBtn = document.getElementById("add-post-btn");
const popup = document.getElementById("popup");
const closeBtn = document.getElementById("close-popup");
const postForm = document. getElementById("post-form");
const postGrid = document.getElementById("post-grid");

// Open popup
addBtn.addEventListener("click", () => {
    popup.classList.remove("hidden");
});

// Close popup
closeBtn. addEventListener("click", () => {
    popup.classList.add("hidden");
});

// Get time ago string
function getTimeAgo(date) {
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return "just now";
}

// Generate avatar with initials
function getAvatar(name) {
    const initials = name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    return initials;
}

// Get random avatar color
function getAvatarColor() {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Submit a post
postForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const description = document.getElementById("description").value;
    const contact = document.getElementById("contact").value;
    const link = document.getElementById("link").value;
    const imageInput = document.getElementById("image");
    
    let imageURL = "";
    if (imageInput.files && imageInput.files[0]) {
        imageURL = URL.createObjectURL(imageInput.files[0]);
    }

    const card = document.createElement("div");
    card.classList.add("post-card");
    
    const avatarColor = getAvatarColor();
    const avatar = getAvatar(author);
    const timestamp = getTimeAgo(new Date());
    
    card.innerHTML = `
        <div class="post-header">
            <div class="post-avatar" style="background-color: ${avatarColor}">${avatar}</div>
            <div class="post-user-info">
                <p class="post-author">${author}</p>
                <p class="post-time">${timestamp}</p>
            </div>
        </div>
        ${imageURL ? `<img src="${imageURL}" class="post-image" alt="${title}">` : ""}
        <h3 class="post-title">${title}</h3>
        <p class="post-description">${description}</p>
        ${link ? `<a href="${link}" target="_blank" class="post-link">View Project →</a>` : ""}
        ${contact ? `<p class="post-contact">Contact: ${contact}</p>` : ""}
        <div class="post-footer">
            <button class="post-like-btn" data-likes="0">❤️</button>
            <span class="post-like-count">0</span>
        </div>
    `;

    // Add like functionality
    const likeBtn = card.querySelector(".post-like-btn");
    const likeCount = card.querySelector(".post-like-count");
    let likes = 0;

    likeBtn.addEventListener("click", () => {
        if (likeBtn.classList.contains("liked")) {
            likeBtn.classList.remove("liked");
            likes--;
        } else {
            likeBtn.classList.add("liked");
            likes++;
        }
        likeCount.textContent = likes;
    });

    postGrid.insertBefore(card, postGrid. firstChild);

    postForm.reset();
    popup.classList.add("hidden");
});