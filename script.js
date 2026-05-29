// ========== YOUR MENU — EDIT THIS ==========
const menuItems = [
  {
    id: 1,
    name: "TRAY S",
    subtitle: "5 ROLLS · 1 SALAD",
    price: 65.00,
    perLabel: "PER TRAY",
    pieces: 50,
    includes: [
      { icon: "🍣", title: "2 Classic Rolls", detail: "California · Philadelphia · Spicy Tuna · Spicy Krab · Shrimp Tempura · Avocado" },
      { icon: "🔥", title: "3 Maki Crunch Rolls", detail: "Selection of our special rolls" },
      { icon: "🥗", title: "1 Salad", detail: "Neptune or Kani Salad" }
    ],
    badge: "+ Save vs individual order — Perfect for 3–4 people",
    image: "images/tray-s.jpg"
  },
  {
    id: 2,
    name: "TRAY M",
    subtitle: "7 ROLLS · 1 SALAD",
    price: 95.00,
    perLabel: "PER TRAY",
    pieces: 70,
    includes: [
      { icon: "🍣", title: "3 Classic Rolls", detail: "California · Philadelphia · Spicy Tuna · Spicy Krab · Shrimp Tempura · Avocado" },
      { icon: "🔥", title: "4 Maki Crunch Rolls", detail: "Selection of our special rolls" },
      { icon: "🥗", title: "1 Salad", detail: "Neptune or Kani Salad" }
    ],
    badge: "+ Save vs individual order — Perfect for 5–6 people",
    image: "images/tray-m.jpg"
  },
  {
    id: 3,
    name: "TRAY XL",
    subtitle: "10 ROLLS · 2 SALADS",
    price: 140.00,
    perLabel: "PER TRAY",
    pieces: 100,
    includes: [
      { icon: "🍣", title: "5 Classic Rolls", detail: "California · Philadelphia · Spicy Tuna · Spicy Krab · Shrimp Tempura · Avocado" },
      { icon: "🔥", title: "5 Maki Crunch Rolls", detail: "Selection of our special rolls" },
      { icon: "🥗", title: "2 Salads", detail: "Neptune · Kani Salad" }
    ],
    badge: "+ Save vs individual order — Perfect for 8–10 people",
    image: "images/tray-xl.jpg"
  }
  // Add more items here in the same format
];
// ===========================================

let cart = [];

// Render menu
const grid = document.getElementById("menu-grid");
const html = menuItems.map(item => `
  <div class="menu-card">
    <div class="menu-card-top">
      <div class="menu-card-title-block">
        <h3 class="menu-card-name">${item.name}</h3>
        <p class="menu-card-subtitle">${item.subtitle}</p>
      </div>
      <div class="menu-card-price-block">
        <span class="price"><sup>$</sup>${item.price.toFixed(0)}</span>
        <span class="per-label">${item.perLabel}</span>
      </div>
    </div>

    <div class="menu-card-pieces">
      <span class="pieces-count">${item.pieces}</span>
      <span class="pieces-label">PIECES<br>TOTAL</span>
    </div>

    <ul class="menu-card-includes">
      ${item.includes.map(row => `
        <li class="include-row">
          <span class="include-icon">${row.icon}</span>
          <span class="include-text">
            <strong>${row.title}</strong>
            <span class="include-detail">${row.detail}</span>
          </span>
        </li>`).join('')}
    </ul>

    <div class="menu-card-footer">
      <span class="menu-badge">${item.badge}</span>
      <button onclick="addToCart(${item.id})" class="add-btn">Order</button>
    </div>
  </div>`).join('');
grid.innerHTML = html;

// Cart logic
function addToCart(id) {
  const item = menuItems.find(i => i.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCart();
  openCart();
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cart-total");

  cartCount.textContent = cart.reduce((sum, i) => sum + i.qty, 0);
  cartTotal.textContent = cart.reduce((sum, i) => sum + i.price * i.qty, 0).toFixed(2);

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span>${item.name} x${item.qty}</span>
      <span>$${(item.price * item.qty).toFixed(2)}</span>
      <button onclick="removeFromCart(${item.id})">✕</button>
    </div>`).join('');
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCart();
}

function openCart() {
  document.getElementById("cart-sidebar").classList.remove("cart-hidden");
}

document.getElementById("cart-btn").addEventListener("click", openCart);
document.getElementById("close-cart").addEventListener("click", () => {
  document.getElementById("cart-sidebar").classList.add("cart-hidden");
});

// Checkout
document.getElementById("checkout-btn").addEventListener("click", async () => {
  const name = document.getElementById("customer-name").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();

  if (!name || !phone) {
    alert("Please enter your name and phone number.");
    return;
  }
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const res = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cart, name, phone, total })
  });

  const data = await res.json();
  if (data.url) {
    window.location.href = data.url;
  } else {
    alert("Payment error. Please try again.");
  }
});