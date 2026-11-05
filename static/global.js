// ==========================================================================
// ANAHAT BY KANWAL - GLOBAL UTILITIES & COMPONENT LOADER
// ==========================================================================
// ==========================================================================
// ANAHAT BY KANWAL - GLOBAL UTILITIES & COMPONENT LOADER
// ==========================================================================

// --- Safe Global Path Resolution ---
if (typeof window.isInPages === 'undefined') {
  window.isInPages = window.location.pathname.includes('/pages/');
}

if (typeof window.pathToRoot === 'undefined') {
  window.pathToRoot = window.isInPages ? "../../" : "";
}
// --- 1. GLOBAL HAMBURGER MENU TOGGLE ---
document.addEventListener("click", function(e) {
  const hamburger = e.target.closest("#hamburgerToggle");
  const navMenu = document.getElementById("headerNav");
  
  if (hamburger && navMenu) {
    navMenu.classList.toggle("active");
    const icon = hamburger.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-bars", !navMenu.classList.contains("active"));
      icon.classList.toggle("fa-xmark", navMenu.classList.contains("active"));
    }
    return;
  }

  // Close menu on outside click
  if (navMenu && navMenu.classList.contains("active")) {
    const hamburgerBtn = document.getElementById("hamburgerToggle");
    if (!navMenu.contains(e.target) && hamburgerBtn && !hamburgerBtn.contains(e.target)) {
      navMenu.classList.remove("active");
      const icon = hamburgerBtn.querySelector("i");
      if (icon) {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
      }
    }
  }
});

// --- 2. COMPONENT LOADER & PATH RESOLUTION ---
const isInPages = window.location.pathname.includes('/pages/');
const pathToRoot = isInPages ? "../../" : "";

document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header-placeholder", pathToRoot + "componenets/header.html", () => {
    updateHeaderCartCount();
    if (typeof initGlobalSearch === "function") {
      initGlobalSearch();
    }
  });

  loadComponent("review-placeholder", pathToRoot + "componenets/review.html", () => {
    if (typeof initReviewCarousel === "function") {
      initReviewCarousel();
    }
  });

  loadComponent("footer-placeholder", pathToRoot + "componenets/footer.html");
});

function loadComponent(placeholderId, filePath, callback) {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) return;

  fetch(filePath)
    .then((response) => {
      if (!response.ok) throw new Error(`Failed to load ${filePath}`);
      return response.text();
    })
    .then((htmlData) => {
      placeholder.innerHTML = htmlData;
      if (typeof callback === "function") callback();
    })
    .catch((error) => console.error("Component loading error:", error));
}

// --- 3. CART MANAGEMENT & LOCAL STORAGE ---
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("anahat_cart")) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("anahat_cart", JSON.stringify(cart));
  updateHeaderCartCount();
}

function updateHeaderCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
  
  document.querySelectorAll("#cartCountBadge, .bag-count, .cart-counter").forEach(el => {
    el.textContent = totalItems;
    el.style.display = totalItems > 0 ? "inline-flex" : "none";
  });
}

function addToCart(product, quantity = 1) {
  let cart = getCart();
  const existingIndex = cart.findIndex(item => item.id === product.id && item.size === product.size);
  
  if (existingIndex > -1) {
    cart[existingIndex].quantity += parseInt(quantity);
  } else {
    cart.push({
      id: product.id,
      title: product.title || product.name,
      price: product.price,
      mainImage: product.mainImage || product.image || "",
      size: product.size || "Standard",
      quantity: parseInt(quantity),
      category: product.category || ""
    });
  }
  
  saveCart(cart);
}

// Direct Cart Redirect Trigger
document.addEventListener("DOMContentLoaded", () => {
  updateHeaderCartCount();
  
  document.addEventListener("click", (e) => {
    const cartTrigger = e.target.closest("#headerCartBtn, .cart-btn, .bag-icon, [data-action='open-cart']");
    if (cartTrigger) {
      e.preventDefault();
      window.location.href = "/pages/checkouts/checkout.html";
    }
  });
});

// --- 4. GLOBAL SEARCH FUNCTION ---
function initGlobalSearch() {
  const searchInput = document.getElementById("headerSearchInput");
  const searchBtn = document.getElementById("headerSearchBtn");

  if (!searchInput) return;

  const handleSearch = () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) return;

    const isCollectionPage = window.location.href.includes("collectionproduct.html");

    if (isCollectionPage) {
      if (typeof PRODUCTS_DATA !== "undefined") {
        const filtered = PRODUCTS_DATA.filter(p => 
          p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)
        );
        const grid = document.getElementById("productGrid");
        const emptyState = document.getElementById("emptyState");
        
        if (grid && typeof generateProductGridHTML === "function") {
          grid.innerHTML = filtered.length === 0 ? "" : generateProductGridHTML(filtered);
          if (emptyState) emptyState.hidden = filtered.length > 0;
        }
      }
    } else {
      window.location.href = `/pages/Collections/collectionproduct.html?search=${encodeURIComponent(query)}`;
    }
  };

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  });

  if (searchBtn) {
    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleSearch();
    });
  }
}

// --- 5. REVIEW CAROUSEL & FORM HANDLING ---
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initGlobalReviews, 400);
});

function initGlobalReviews() {
  const defaultReviews = [
    { name: "Pedro Santos", city: "GRANADA", rating: 5, comment: "Sin duda repetiríamos. Nos ha gustado lo bien equipada que estaba." },
    { name: "Maria Samper", city: "MADRID", rating: 4, comment: "We had a great time staying here. Arrival was seamless and location is great." },
    { name: "Ayesha Malik", city: "LAHORE", rating: 5, comment: "The quality of the silk embroidery on my dress exceeded my expectations! Elegant packaging." }
  ];

  function getStoredReviews() {
    try {
      const saved = localStorage.getItem("anahat_client_reviews");
      if (!saved) {
        localStorage.setItem("anahat_client_reviews", JSON.stringify(defaultReviews));
        return defaultReviews;
      }
      return JSON.parse(saved);
    } catch (e) {
      return defaultReviews;
    }
  }

  let reviews = getStoredReviews();
  let currentIndex = 0;
  let selectedRating = 5;

  const track = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const reviewForm = document.getElementById('reviewForm');
  const starContainer = document.getElementById('starInput');

  if (!track) return;

  function renderStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      html += `<span class="${i <= rating ? '' : 'star-empty'}">★</span>`;
    }
    return html;
  }

  if (starContainer && !starContainer.hasAttribute('data-bound')) {
    starContainer.setAttribute('data-bound', 'true');
    starContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.star-btn');
      if (!btn) return;
      selectedRating = parseInt(btn.dataset.rating, 10);
      starContainer.querySelectorAll('.star-btn').forEach((s) => {
        const val = parseInt(s.dataset.rating, 10);
        s.classList.toggle('active', val <= selectedRating);
      });
    });
  }

  function renderReviews() {
    reviews = getStoredReviews();
    track.innerHTML = reviews.map((rev, idx) => `
      <div class="review-card ${idx === currentIndex ? 'active' : ''}" data-index="${idx}" style="flex: 0 0 320px; max-width: 320px; background: #ffffff; border: 1px solid #deded1; border-radius: 6px; padding: 30px 24px; margin: 0 14px; text-align: center; position: relative; box-shadow: 0 12px 35px rgba(47, 57, 43, .09);">
        <div class="review-stars" style="font-size: 16px; color: #bd9561; margin-bottom: 14px; letter-spacing: 2px;">${renderStars(rev.rating)}</div>
        <p class="review-text" style="font: 400 13px/1.6 Georgia, serif; color: #252820; margin-bottom: 18px; font-style: italic;">"${rev.comment}"</p>
        <div class="review-author" style="font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #252820;">${rev.name} - <span style="color: #6c6e64; font-weight: 500;">${rev.city}</span></div>
      </div>
    `).join('');
    updateCarousel();
  }

  function updateCarousel() {
    const cards = track.querySelectorAll('.review-card');
    if (!cards.length) return;

    cards.forEach((card, idx) => card.classList.toggle('active', idx === currentIndex));

    const containerWidth = track.parentElement.offsetWidth;
    const activeCard = cards[currentIndex];
    if (activeCard) {
      const moveDistance = activeCard.offsetLeft - (containerWidth / 2) + (activeCard.offsetWidth / 2);
      track.style.transform = `translateX(${-moveDistance}px)`;
    }
  }

  if (nextBtn && !nextBtn.hasAttribute('data-bound')) {
    nextBtn.setAttribute('data-bound', 'true');
    nextBtn.addEventListener('click', () => { 
      currentIndex = (currentIndex + 1) % getStoredReviews().length; 
      updateCarousel(); 
    });
  }
  
  if (prevBtn && !prevBtn.hasAttribute('data-bound')) {
    prevBtn.setAttribute('data-bound', 'true');
    prevBtn.addEventListener('click', () => { 
      const len = getStoredReviews().length;
      currentIndex = (currentIndex - 1 + len) % len; 
      updateCarousel(); 
    });
  }

  if (reviewForm && !reviewForm.hasAttribute('data-bound')) {
    reviewForm.setAttribute('data-bound', 'true');
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameVal = document.getElementById('reviewerName').value.trim();
      const cityVal = document.getElementById('reviewerCity').value.trim().toUpperCase();
      const commentVal = document.getElementById('reviewerComment').value.trim();

      if (!nameVal || !cityVal || !commentVal) return;

      let currentReviews = getStoredReviews();
      currentReviews.unshift({ name: nameVal, city: cityVal, rating: selectedRating, comment: commentVal });

      try {
        localStorage.setItem("anahat_client_reviews", JSON.stringify(currentReviews));
      } catch (err) {
        console.error("Error saving review:", err);
      }

      currentIndex = 0;
      renderReviews();
      reviewForm.reset();
      selectedRating = 5;

      if (typeof showToast === "function") {
        showToast('Thank you! Your review is now published.');
      }
    });
  }

  renderReviews();
}

// --- 6. PERSISTENT CART BADGE FIXER & TOAST NOTIFICATION ---
function applyPersistentBadge() {
  try {
    const cart = JSON.parse(localStorage.getItem('anahat_cart') || '[]');
    const totalCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    
    const badge = document.getElementById('headerCartCount');
    if (badge) {
      badge.textContent = totalCount;
      badge.style.display = totalCount > 0 ? 'flex' : 'none';
      badge.style.visibility = 'visible';
      badge.style.opacity = '1';
    }
  } catch (e) {
    console.error("Badge fixer error:", e);
  }
}

window.addEventListener('DOMContentLoaded', applyPersistentBadge);
window.addEventListener('load', applyPersistentBadge);
setInterval(applyPersistentBadge, 500);

window.showToast = function(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  if (toast.hideTimer) clearTimeout(toast.hideTimer);

  toast.hideTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
};