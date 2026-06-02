const darkModeBtn = document.getElementById("darkModeBtn");
const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

const cartBtn = document.getElementById("cartBtn");
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

const filterBtns = document.querySelectorAll(".filter-btn");
const menuCards = document.querySelectorAll(".menu-card");
const searchInput = document.getElementById("searchInput");

const modal = document.getElementById("menuModal");
const closeModal = document.getElementById("closeModal");
const modalName = document.getElementById("modalName");
const modalDesc = document.getElementById("modalDesc");
const modalPrice = document.getElementById("modalPrice");
const modalImage = document.getElementById("modalImage");
const modalAddBtn = document.getElementById("modalAddBtn");

const backToTop = document.getElementById("backToTop");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".section-target");
const reveals = document.querySelectorAll(".reveal");
const toast = document.getElementById("toast");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let selectedMenu = null;
let activeFilter = "semua";

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(number);
};

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  darkModeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    darkModeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    localStorage.setItem("theme", "light");
    darkModeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
});

menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("active");

  menuBtn.innerHTML = navMenu.classList.contains("active")
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

function filterMenu() {
  const keyword = searchInput.value.toLowerCase();

  menuCards.forEach(card => {
    const name = card.dataset.name.toLowerCase();
    const category = card.dataset.category;

    const matchSearch = name.includes(keyword);
    const matchFilter = activeFilter === "semua" || category.includes(activeFilter);

    if (matchSearch && matchFilter) {
      card.classList.remove("hide");
    } else {
      card.classList.add("hide");
    }
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(item => item.classList.remove("active"));
    btn.classList.add("active");

    activeFilter = btn.dataset.filter;
    filterMenu();
  });
});

searchInput.addEventListener("input", filterMenu);

menuCards.forEach(card => {
  const addBtn = card.querySelector(".add-cart");

  addBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    const item = {
      name: card.dataset.name,
      price: Number(card.dataset.price)
    };

    addToCart(item);
  });

  card.addEventListener("click", () => {
    selectedMenu = {
      name: card.dataset.name,
      price: Number(card.dataset.price),
      desc: card.dataset.desc,
      image: card.dataset.image
    };

    modalName.textContent = selectedMenu.name;
    modalDesc.textContent = selectedMenu.desc;
    modalPrice.textContent = formatRupiah(selectedMenu.price);
    modalImage.src = selectedMenu.image;
    modalImage.alt = selectedMenu.name;

    modal.classList.add("active");
  });
});

modalAddBtn.addEventListener("click", () => {
  if (selectedMenu) {
    addToCart(selectedMenu);
    modal.classList.remove("active");
  }
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("active");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});

function addToCart(item) {
  const existingItem = cart.find(cartItem => cartItem.name === item.name);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      name: item.name,
      price: item.price,
      qty: 1
    });
  }

  saveCart();
  renderCart();
  showToast(`${item.name} masuk cart`);
}

function increaseQty(index) {
  cart[index].qty += 1;
  saveCart();
  renderCart();
}

function decreaseQty(index) {
  if (cart[index].qty > 1) {
    cart[index].qty -= 1;
  } else {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
  showToast("Item dihapus");
}

function renderCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Cart masih kosong. Belum ada kopi, cuma harapan palsu.</p>";
  }

  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div>
        <h4>${item.name}</h4>
        <p>${formatRupiah(item.price)} x ${item.qty}</p>

        <div class="qty-control">
          <button onclick="decreaseQty(${index})">-</button>
          <span>${item.qty}</span>
          <button onclick="increaseQty(${index})">+</button>
        </div>
      </div>

      <button onclick="removeFromCart(${index})">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;

    cartItems.appendChild(div);
  });

  const totalItem = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCount.textContent = totalItem;
  cartTotal.textContent = formatRupiah(totalPrice);
}

cartBtn.addEventListener("click", () => {
  cartPanel.classList.add("active");
});

closeCart.addEventListener("click", () => {
  cartPanel.classList.remove("active");
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Cart masih kosong. Mau checkout udara?");
    return;
  }

  const list = cart
    .map((item, index) => `${index + 1}. ${item.name} x ${item.qty} - ${formatRupiah(item.price * item.qty)}`)
    .join("%0A");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const message = `Halo Kopi Senja, saya mau pesan:%0A%0A${list}%0A%0ATotal: ${formatRupiah(total)}`;
  const phone = "6285723673103";

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
});

window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 140;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });

  reveals.forEach(item => {
    const itemTop = item.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (itemTop < windowHeight - 90) {
      item.classList.add("show");
    }
  });
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

document.querySelector(".contact-form").addEventListener("submit", (e) => {
  e.preventDefault();
  showToast("Pesan berhasil dikirim. Simulasi doang, server belum lahir.");
  e.target.reset();
});

renderCart();
window.dispatchEvent(new Event("scroll"));