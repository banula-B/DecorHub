// Initialize empty cart if none exists
if (!localStorage.getItem("cart")) {
    localStorage.setItem("cart", JSON.stringify([]));
}

document.addEventListener("DOMContentLoaded", () => {
    updateAuthUI();
    updateCartCount();

    // Only load products if we are on the main index page
    if (document.getElementById("products")) {
        loadProducts();
    }
});

function updateAuthUI() {
    const user = JSON.parse(localStorage.getItem("user"));
    const authLinks = document.getElementById("auth-links");
    const adminControls = document.getElementById("admin-controls");

    if (user) {
        // User is logged in
        authLinks.innerHTML = `
            <a href="profile.html" class="nav-link" style="color: var(--text-main); font-weight: 600;"><i class="fa-solid fa-user"></i> ${user.name}</a>
            <button onclick="logout()" class="btn btn-secondary btn-sm" style="padding: 0.5rem 1rem;"><i class="fa-solid fa-right-from-bracket"></i> Logout</button>
        `;

        // Show admin controls if user is admin
        if ((user.role === "ADMIN" || user.role === "admin") && adminControls) {
            adminControls.classList.remove("hidden");
        }
    } else {
        // Not logged in
        authLinks.innerHTML = `
            <a href="login.html" class="nav-link">Login</a>
            <a href="signup.html" class="btn btn-primary" style="padding: 0.5rem 1rem;">Sign Up</a>
        `;
    }
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

function loadProducts() {
    const productsContainer = document.getElementById("products");
    const loader = document.getElementById("products-loader");

    fetch("http://localhost:8080/products")
        .then(response => {
            if (!response.ok) {
                // If API is down, show mock robust data for aesthetics verification
                return mockProducts();
            }
            return response.json();
        })
        .then(products => {
            loader.classList.add("hidden");
            productsContainer.classList.remove("hidden");

            if (products.length === 0) {
                productsContainer.innerHTML = `<div class="w-full text-center" style="grid-column: 1 / -1;"><p>No products available right now.</p></div>`;
                return;
            }

            productsContainer.innerHTML = ''; // Clear container

            products.forEach(product => {
                const productDiv = document.createElement("div");
                productDiv.className = "product";

                // Generate a random gradient background for the image placeholder for variety
                const hue = Math.floor(product.id * 137.5) % 360;
                const gradient = `linear-gradient(135deg, hsl(${hue}, 20%, 20%), hsl(${hue + 30}, 30%, 30%))`;

                // Map product ID to random font-awesome icons for visual flair
                const icons = ['couch', 'lightbulb', 'leaf', 'bed', 'chair', 'mug-hot', 'star'];
                const icon = icons[product.id % icons.length] || 'box';

                productDiv.innerHTML = `
                ${product.imageUrl ?
                        `<img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 1rem; margin-bottom: 1.5rem;">` :
                        `<div class="product-image-placeholder" style="background: ${gradient}">
                         <i class="fa-solid fa-${icon}" style="color: rgba(255,255,255,0.5)"></i>
                    </div>`
                    }
                <h3>${product.name}</h3>
                <p class="description">${product.description || "Premium quality home decor to elevate your living space."}</p>
                <div class="price-row">
                    <span class="price">$${parseFloat(product.price).toFixed(2)}</span>
                    <button class="btn btn-primary" style="padding: 0.5rem 1rem; border-radius: 0.75rem;" onclick="addToCart(${product.id}, '${product.name.replace(/'/g, "\\'")}', ${product.price}, '${product.imageUrl ? product.imageUrl.replace(/'/g, "\\'") : ''}')">
                        <i class="fa-solid fa-plus"></i> Add
                    </button>
                </div>
                `;

                productsContainer.appendChild(productDiv);
            });
        })
        .catch(err => {
            console.error("Error fetching products:", err);
            loader.innerHTML = `<p class="text-accent"><i class="fa-solid fa-triangle-exclamation"></i> Failed to load collection. Make sure backend is running.</p>`;
        });
}

// Fallback mock data if server isn't running
function mockProducts() {
    return Promise.resolve([
        { id: 1, name: "Velvet Accent Chair", description: "Luxurious emerald green velvet chair with brass legs.", price: 299.99 },
        { id: 2, name: "Geometric Gold Mirror", description: "Modern wall mirror with asymmetrical gold framing.", price: 145.00 },
        { id: 3, name: "Ceramic Table Lamp", description: "Matte white handcrafted ceramic lamp with warm LED bulb.", price: 85.50 },
        { id: 4, name: "Abstract Canvas Art", description: "Large 36x48 canvas painting with ocean hues.", price: 210.00 },
        { id: 5, name: "Woven Floor Basket", description: "Sustainable seagrass basket for plants or throw blankets.", price: 45.00 },
        { id: 6, name: "Marble Coffee Table", description: "Solid carrera marble top with matte black steel base.", price: 450.00 }
    ]);
}

function addToCart(id, name, price, imageUrl = null) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        showToast("Please login to add items to cart", "warning");
        setTimeout(() => { window.location.href = "login.html"; }, 1500);
        return;
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if item exists
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, imageUrl, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    showToast(`Added ${name} to cart`, "success");
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const countElement = document.getElementById("cart-count");
    if (countElement) {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        countElement.innerText = total;
    }
}

// Custom Toast notification system
function showToast(message, type = "success") {
    // Create container if it doesn't exist
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';

    const icon = type === "success" ? "fa-circle-check" : "fa-triangle-exclamation";
    const color = type === "success" ? "var(--secondary)" : "var(--accent)";

    toast.style.borderLeftColor = color;
    toast.innerHTML = `
        <i class="fa-solid ${icon}" style="color: ${color}; font-size: 1.25rem;"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Remove after 3 seconds with fade animation
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 3000);
}