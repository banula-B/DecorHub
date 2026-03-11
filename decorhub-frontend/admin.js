// Admin functionality for CRUD operations

// Guard clause for admin access
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || (user.role !== "ADMIN" && user.role !== "admin")) {
        document.body.innerHTML = `
            <div class="container text-center mt-8">
                <i class="fa-solid fa-shield-halved fa-4x mb-4" style="color: var(--accent)"></i>
                <h1>Access Denied</h1>
                <p class="mb-6">You must have admin privileges to view this page.</p>
                <a href="index.html" class="btn btn-primary">Return Home</a>
            </div>
        `;
        return;
    }

    loadAdminProducts();
    loadAdminOrders();

    document.getElementById("productForm").addEventListener("submit", function (e) {
        e.preventDefault();
        saveProduct();
    });
});

let mockDb = []; // Used as fallback if API unavailable

function loadAdminProducts() {
    const tbody = document.getElementById("admin-product-list");

    fetch("http://localhost:8080/products")
        .then(response => {
            if (!response.ok) {
                // If we already loaded mock DB once, return that state
                if (mockDb.length > 0) return Promise.resolve(mockDb);
                return mockProducts().then(data => { mockDb = data; return mockDb; });
            }
            return response.json();
        })
        .then(products => {
            if (products.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center py-8 text-muted">No products found in the database. Use 'Add Product' to start.</td>
                    </tr>
                `;
                return;
            }

            let html = "";
            products.forEach(p => {
                // Determine icon based on mock logic
                const icons = ['couch', 'lightbulb', 'leaf', 'bed', 'chair', 'mug-hot', 'star'];
                const icon = icons[p.id % icons.length] || 'box';
                const hue = Math.floor(p.id * 137.5) % 360;

                html += `
                <tr style="border-bottom: 1px solid var(--border-light); transition: background var(--transition-fast);">
                    <td style="padding: 1.5rem; color: var(--text-muted);">#${p.id}</td>
                    <td style="padding: 1.5rem;">
                        <div class="flex items-center gap-4">
                            ${p.imageUrl ?
                        `<img src="${p.imageUrl}" alt="${p.name}" style="width: 48px; height: 48px; border-radius: 0.5rem; object-fit: cover;">` :
                        `<div style="width: 48px; height: 48px; border-radius: 0.5rem; background: linear-gradient(135deg, hsl(${hue}, 20%, 20%), hsl(${hue + 30}, 30%, 30%)); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                                    <i class="fa-solid fa-${icon}" style="color: rgba(255,255,255,0.8)"></i>
                                </div>`
                    }
                            <div>
                                <div style="font-weight: 600; font-size: 1.1rem; color: var(--text-main);">${p.name}</div>
                                <div class="text-muted" style="font-size: 0.85rem; max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                    ${p.description || "N/A"}
                                </div>
                            </div>
                        </div>
                    </td>
                    <td style="padding: 1.5rem; font-weight: 600; color: var(--secondary);">$${parseFloat(p.price).toFixed(2)}</td>
                    <td style="padding: 1.5rem; text-align: right;">
                        <div class="flex gap-2 justify-end">
                            <button onclick='openModal("edit", ${JSON.stringify(p).replace(/'/g, "&#39;")})' class="btn btn-secondary" style="padding: 0.5rem;" title="Edit Product">
                                <i class="fa-solid fa-pen-to-square"></i> Edit
                            </button>
                            <button onclick="deleteProduct(${p.id})" class="btn btn-danger" style="padding: 0.5rem; background: rgba(244, 63, 94, 0.2); border: 1px solid rgba(244, 63, 94, 0.5); color: var(--accent);" title="Delete Product">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </td>
                </tr>
                `;
            });

            // Add hover effect via JS since inline styles are hard to nest
            tbody.innerHTML = html;
            const rows = tbody.querySelectorAll('tr');
            rows.forEach(r => {
                r.addEventListener('mouseenter', () => r.style.background = 'rgba(255,255,255,0.03)');
                r.addEventListener('mouseleave', () => r.style.background = 'transparent');
            });
        })
        .catch(err => {
            console.error("Admin Load Error:", err);
            tbody.innerHTML = `<tr><td colspan="4" class="text-center py-8 text-accent">Failed to connect to backend service.</td></tr>`;
        });
}

// Modal handling
function openModal(mode, data = null) {
    const modal = document.getElementById("productModal");
    const title = document.getElementById("modalTitle");
    const form = document.getElementById("productForm");

    // Reset styling
    modal.classList.remove("hidden");
    modal.style.display = "flex"; // Override any hidden class constraints

    if (mode === 'addModal') {
        title.innerHTML = '<i class="fa-solid fa-square-plus" style="color: var(--secondary)"></i> Add New Product';
        form.reset();
        document.getElementById("prod-id").value = "";
    } else {
        title.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color: var(--primary)"></i> Edit Product';
        document.getElementById("prod-id").value = data.id;
        document.getElementById("prod-name").value = data.name;
        document.getElementById("prod-price").value = data.price;
        document.getElementById("prod-desc").value = data.description;
        document.getElementById("prod-image").value = data.imageUrl || "";
    }
}

function closeModal() {
    document.getElementById("productModal").style.display = "none";
}

// Create & Update
function saveProduct() {
    const btn = document.getElementById("saveProdBtn");
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Saving...';

    const id = document.getElementById("prod-id").value;
    const isEdit = id !== "";

    const payload = {
        name: document.getElementById("prod-name").value.trim(),
        price: parseFloat(document.getElementById("prod-price").value),
        description: document.getElementById("prod-desc").value.trim(),
        imageUrl: document.getElementById("prod-image").value.trim()
    };

    const url = isEdit ? `http://localhost:8080/products/${id}` : "http://localhost:8080/products";
    const method = isEdit ? "PUT" : "POST";

    fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
        .then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    throw new Error(text || `HTTP ${res.status}`);
                });
            }
            return res.text().then(text => text ? JSON.parse(text) : {});
        })
        .then(() => {
            showToast(isEdit ? "Product updated successfully" : "Product added successfully");
            closeModal();
            loadAdminProducts(); // Refresh list
        })
        .catch(err => {
            console.error("DEBUG ERR:", err);
            let displayMsg = err.message;
            // Try to parse Spring Boot JSON error to get the actual reason
            try {
                const parsed = JSON.parse(err.message);
                if (parsed.message) {
                    displayMsg = parsed.message;
                } else if (parsed.error) {
                    displayMsg = parsed.error;
                } else if (parsed.status) {
                    displayMsg = "HTTP Status: " + parsed.status;
                }
            } catch (e) {
                // Not JSON, use raw err.message
            }

            // Limit to 120 chars so it doesn't break the toast UI
            if (displayMsg.length > 120) displayMsg = displayMsg.substring(0, 120) + '...';

            showToast("Server rejected: " + displayMsg, "error");
        })
        .finally(() => {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Product';
        });
}

// Delete
function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

    // Optional: show quick loading toast
    showToast("Deleting product...", "warning");

    fetch(`http://localhost:8080/products/${id}`, {
        method: "DELETE"
    })
        .then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    throw new Error(text || `HTTP ${res.status}`);
                });
            }
            // Spring Boot DELETE often returns empty body
            return res.text().then(text => text ? JSON.parse(text) : {});
        })
        .then(() => {
            showToast("Product deleted permanently.", "success");
            loadAdminProducts();
        })
        .catch(err => {
            console.error("DEBUG ERR:", err);
            let displayMsg = err.message;
            try {
                const parsed = JSON.parse(err.message);
                if (parsed.message) displayMsg = parsed.message;
                else if (parsed.error) displayMsg = parsed.error;
            } catch (e) { }
            showToast("Failed to delete product: " + displayMsg.substring(0, 100), "error");
        });
}

// ================= ORDERS LOGIC =================

function loadAdminOrders() {
    const tbody = document.getElementById("admin-order-list");

    fetch("http://localhost:8080/orders")
        .then(res => res.ok ? res.json() : Promise.reject(res))
        .then(orders => {
            if (orders.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-muted">No orders placed yet.</td></tr>`;
                return;
            }

            // Sort orders logically (newest first assuming higher ID is newer)
            orders.sort((a, b) => b.id - a.id);

            let html = "";
            orders.forEach(o => {
                // Formatting Date
                const d = new Date(o.createdAt);
                const dateStr = d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                // Color coding statuses
                let statusColor = "var(--text-main)";
                if (o.status === "PLACED") statusColor = "#3b82f6"; // Blue
                else if (o.status === "PACKED") statusColor = "#f59e0b"; // Orange
                else if (o.status === "HANDED_OVER") statusColor = "#8b5cf6"; // Purple
                else if (o.status === "DELIVERED") statusColor = "#10b981"; // Green
                else if (o.status === "CANCELLED") statusColor = "var(--accent)"; // Red

                html += `
                <tr style="border-bottom: 1px solid var(--border-light); transition: background 0.2s;">
                    <td style="padding: 1rem;">#${o.id}</td>
                    <td style="padding: 1rem;">
                        <div style="font-weight: 600;">${o.customerName || "Guest"}</div>
                        <div style="font-size: 0.85rem; color: var(--text-muted);">${o.customerEmail || "N/A"}</div>
                    </td>
                    <td style="padding: 1rem; color: var(--text-muted);">${dateStr}</td>
                    <td style="padding: 1rem; font-weight: 600;">$${parseFloat(o.totalAmount || 0).toFixed(2)}</td>
                    <td style="padding: 1rem; font-weight: 600; color: ${statusColor};">
                        ${o.status}
                    </td>
                    <td style="padding: 1rem; text-align: right;">
                        <select onchange="updateOrderStatus(${o.id}, this.value)"
                                style="padding: 0.35rem 0.6rem; display: inline-block; width: auto;
                                       background: #1e2028; color: #FDFBF7;
                                       border: 1px solid rgba(207,166,97,0.4); border-radius: 0.5rem;
                                       font-size: 0.85rem; font-family: inherit; cursor: pointer;
                                       outline: none; appearance: auto;">
                            <option value="PLACED"      style="background:#1e2028; color:#3b82f6;" ${o.status === 'PLACED' ? 'selected' : ''}>📋 PLACED</option>
                            <option value="PACKED"      style="background:#1e2028; color:#f59e0b;" ${o.status === 'PACKED' ? 'selected' : ''}>📦 PACKED</option>
                            <option value="HANDED_OVER" style="background:#1e2028; color:#8b5cf6;" ${o.status === 'HANDED_OVER' ? 'selected' : ''}>🚚 HANDED OVER</option>
                            <option value="DELIVERED"   style="background:#1e2028; color:#10b981;" ${o.status === 'DELIVERED' ? 'selected' : ''}>✅ DELIVERED</option>
                            <option value="CANCELLED"   style="background:#1e2028; color:#ef4444;" ${o.status === 'CANCELLED' ? 'selected' : ''}>❌ CANCELLED</option>
                        </select>
                    </td>
                </tr>
                `;
            });
            tbody.innerHTML = html;
        })
        .catch(err => {
            console.error("Orders Load Error:", err);
            tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-accent">Failed to load orders.</td></tr>`;
        });
}

function updateOrderStatus(orderId, newStatus) {
    showToast("Updating status...", "warning");

    fetch(`http://localhost:8080/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
    })
        .then(res => {
            if (!res.ok) throw new Error("Status update failed");
            return res.json();
        })
        .then(updatedOrder => {
            showToast(`Order #${updatedOrder.id} is now ${updatedOrder.status}`, "success");
            loadAdminOrders(); // Refresh colors
        })
        .catch(err => {
            console.error(err);
            showToast("Failed to update status", "error");
            loadAdminOrders(); // Revert dropdown
        });
}
