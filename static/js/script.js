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
const popupTitle = document.getElementById("popup-title");
const submitBtn = document.getElementById("submit-btn");

let editingPostId = null;

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

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Load posts from localStorage
function loadPosts() {
    const posts = JSON.parse(localStorage. getItem('innovateLanePosts')) || [];
    postGrid.innerHTML = '';
    posts.reverse().forEach(post => {
        renderPost(post);
    });
}

// Save posts to localStorage
function savePosts(posts) {
    localStorage.setItem('innovateLanePosts', JSON.stringify(posts));
}

// Render a single post
function renderPost(post) {
    const card = document.createElement("div");
    card.classList.add("post-card");
    card.id = `post-${post.id}`;
    
    const avatar = getAvatar(post.author);
    const timestamp = getTimeAgo(new Date(post.createdAt));
    
    card.innerHTML = `
        <div class="post-header">
            <div class="post-header-left">
                <div class="post-avatar" style="background-color: ${post.avatarColor}">${avatar}</div>
                <div class="post-user-info">
                    <p class="post-author">${post.author}</p>
                    <p class="post-time">${timestamp}</p>
                </div>
            </div>
            <div class="post-menu">
                <button class="post-menu-btn" data-post-id="${post.id}">⋮</button>
                <div class="post-menu-dropdown">
                    <button class="edit-btn" data-post-id="${post.id}">Edit</button>
                    <button class="delete-btn delete" data-post-id="${post. id}">Delete</button>
                </div>
            </div>
        </div>
        ${post.imageURL ? `<img src="${post.imageURL}" class="post-image" alt="${post.title}">` : ""}
        <h3 class="post-title">${post.title}</h3>
        <p class="post-description">${post.description}</p>
        ${post.link ?  `<a href="${post.link}" target="_blank" class="post-link">View Project →</a>` : ""}
        ${post.contact ? `<p class="post-contact">Contact: ${post.contact}</p>` : ""}
        <div class="post-footer">
            <button class="post-like-btn" data-post-id="${post.id}">❤️</button>
            <span class="post-like-count">${post.likes}</span>
        </div>
    `;

    // Menu toggle
    const menuBtn = card.querySelector(".post-menu-btn");
    const dropdown = card.querySelector(".post-menu-dropdown");
    
    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("show");
    });

    document.addEventListener("click", () => {
        dropdown.classList.remove("show");
    });

    // Edit button
    const editBtn = card.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => {
        editPost(post.id);
        dropdown.classList.remove("show");
    });

    // Delete button
    const deleteBtn = card.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
        deletePost(post.id);
        dropdown.classList.remove("show");
    });

    // Like button
    const likeBtn = card.querySelector(".post-like-btn");
    const likeCount = card.querySelector(".post-like-count");

    likeBtn.addEventListener("click", () => {
        const posts = JSON.parse(localStorage.getItem('innovateLanePosts')) || [];
        const postIndex = posts.findIndex(p => p.id === post.id);
        if (postIndex !== -1) {
            if (likeBtn.classList.contains("liked")) {
                likeBtn.classList.remove("liked");
                posts[postIndex].likes--;
            } else {
                likeBtn.classList.add("liked");
                posts[postIndex].likes++;
            }
            likeCount.textContent = posts[postIndex].likes;
            savePosts(posts);
        }
    });

    // Set liked state if already liked
    if (post.likes > 0) {
        likeBtn.classList.add("liked");
    }

    postGrid. appendChild(card);
}

// Edit post
function editPost(postId) {
    const posts = JSON.parse(localStorage.getItem('innovateLanePosts')) || [];
    const post = posts.find(p => p. id === postId);
    
    if (!post) return;

    // Fill form with post data
    document.getElementById("title").value = post.title;
    document.getElementById("author").value = post.author;
    document.getElementById("description").value = post.description;
    document.getElementById("link").value = post.link || "";
    document.getElementById("contact").value = post.contact || "";

    // Update UI
    editingPostId = postId;
    popupTitle.textContent = "Edit Post";
    submitBtn.textContent = "Update";
    popup.classList.remove("hidden");
}

// Delete post
function deletePost(postId) {
    if (confirm("Are you sure you want to delete this post?")) {
        let posts = JSON.parse(localStorage. getItem('innovateLanePosts')) || [];
        posts = posts.filter(p => p. id !== postId);
        savePosts(posts);
        loadPosts();
    }
}

// Open popup
addBtn.addEventListener("click", () => {
    editingPostId = null;
    popupTitle.textContent = "Create a Post";
    submitBtn.textContent = "Post";
    postForm.reset();
    popup.classList.remove("hidden");
});

// Close popup
closeBtn.addEventListener("click", () => {
    popup.classList.add("hidden");
    editingPostId = null;
});

// Close popup when clicking outside
popup.addEventListener("click", (e) => {
    if (e. target === popup) {
        popup.classList.add("hidden");
        editingPostId = null;
    }
});

// Submit form (create or update)
postForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const description = document. getElementById("description").value;
    const contact = document.getElementById("contact").value;
    const link = document. getElementById("link").value;
    const imageInput = document.getElementById("image");
    
    let posts = JSON.parse(localStorage.getItem('innovateLanePosts')) || [];
    
    if (editingPostId) {
        // Update existing post
        const postIndex = posts.findIndex(p => p.id === editingPostId);
        if (postIndex !== -1) {
            posts[postIndex]. title = title;
            posts[postIndex].author = author;
            posts[postIndex].description = description;
            posts[postIndex].contact = contact;
            posts[postIndex].link = link;
            
            // Only update image if a new one was selected
            if (imageInput.files && imageInput.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    posts[postIndex].imageURL = e.target.result;
                    savePosts(posts);
                    loadPosts();
                };
                reader.readAsDataURL(imageInput.files[0]);
            } else {
                savePosts(posts);
                loadPosts();
            }
        }
    } else {
        // Create new post
        const newPost = {
            id: generateId(),
            title,
            author,
            description,
            contact,
            link,
            avatarColor: getAvatarColor(),
            createdAt: new Date().toISOString(),
            likes: 0,
            imageURL: ""
        };

        if (imageInput.files && imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                newPost. imageURL = e.target.result;
                posts.unshift(newPost);
                savePosts(posts);
                loadPosts();
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            posts.unshift(newPost);
            savePosts(posts);
            loadPosts();
        }
    }

    postForm.reset();
    popup.classList.add("hidden");
    editingPostId = null;
});

// Load posts on page load
loadPosts();