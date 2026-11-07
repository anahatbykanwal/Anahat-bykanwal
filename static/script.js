// ==========================================================================
// ANAHAT BY KANWAL - CATALOG, COLLECTIONS & PRODUCT DETAIL MANAGER
// ==========================================================================

// Automatically initialize product detail page if container exists
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("productDetailViewApp")) {
    initProductDetailPage();
  }
  if (document.getElementById("productGrid") && document.getElementById("heroTitle")) {
    renderIndexBestsellers();
  }
  if (document.getElementById("categoryChips")) {
    initCollectionsGallery();
  }
});

// --- 1. PRODUCT CATALOG DATABASE ---
const PRODUCTS_DATA = [
  {
    id: "anahat-001",
    title: "Hand Paint Dresses",
    category: "Hand Paint Dresses",
    season: "Spring/Summer",
    price: 18500,
    rating: 5.0,
    
    badge: "Bestseller",
    featured: true,
    mainImage: "/static/assets/images/collections/hand painted dress/plum hand paint dress/modal shoot.jpg",
    galleryImages: [
      "/static/assets/images/collections/hand painted dress/plum hand paint dress/modal shoot.jpg",
      "/static/assets/images/collections/hand painted dress/plum hand paint dress/closeup.jpg"
    ],
    description: "Hand-painted organic silk ensemble with silver hand-embellishments. Inspired by the resilience of the lotus flower blooming independently.",
    fabric: "Pure Organic Silk",
    sizes: ["S", "M", "L", "XL"]
    
  },
  {
    id: "anahat-002",
    title: "Hand-Painted Floral Stole",
    category: "Hijabs & Stoles",
    season: "Signature Edition",
    price: 1000,
    rating: 4.9,
    badge: "Artisan",
    featured: true,
    mainImage: "/static/assets/images/collections/purple stole/modal shoot.jpg",
    galleryImages: [
      "/static/assets/images/collections/purple stole/modal shoot.jpg",
      "/static/assets/images/collections/purple stole/stole shoot.jpeg",
      "/static/assets/images/collections/purple stole/Purple Stole.jpeg",
      "/static/assets/images/collections/purple stole/wooden shoot purple stole.jpg"
    ],
    description: "Custom hand-painted floral motifs on lightweight sheer fabric with delicate finished edges.",
    fabric: "Pure Chiffon / Georgette",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "anahat-003",
    title: "Minimalist Linen Abaya",
    category: "Abayas",
    season: "Spring/Summer",
    price: 7000,
    rating: 4.8,
    badge: "New",
    featured: true,
    mainImage: "/static/assets/images/collections/abaya/sky abaya/abaya.jpeg",
    galleryImages: [
      "/static/assets/images/collections/abaya/sky abaya/abaya.jpeg",
      "/static/assets/images/collections/abaya/sky abaya/sky-abaya back.jpeg",
      "/static/assets/images/collections/abaya/sky abaya/sky-abaya flare.jpeg",
      "/static/assets/images/collections/abaya/sky abaya/sky-abaya side.jpeg"
    ],
    description: "Relaxed silhouette abaya featuring subtle embroidery along the sleeves and premium breathable weave.",
    fabric: "Breathable Linen Blend",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "anahat-004",
    title: "Gold Leaf Quran Calligraphy",
    category: "Calligraphy & Decor",
    season: "Signature Edition",
    price: 10000,
    rating: 5.0,
    badge: "Handmade",
    featured: true,
    mainImage: "/static/assets/images/collections/calligraphy/parents dua/calligraphy - Copy.jpg",
    galleryImages: [
      "/static/assets/images/collections/calligraphy/parents dua/calligraphy - Copy.jpg",
      "/static/assets/images/collections/calligraphy/parents dua/gold foil close up texture.jpg",
      "/static/assets/images/collections/calligraphy/parents dua/Gemini_Generated_Image_liglizliglizligl.jpg"
    ],
    description: "Original hand-written arabic calligraphy accented with genuine gold leaf on custom wooden framed canvas.",
    fabric: "Canvas & Wood Frame",
    sizes: ["8x10 inches", "12x16 inches", "16x20 inches"]
  },
  {
    id: "anahat-005",
    title: "Velvet Cap Shawal",
    category: "Winter Cap Shawal",
    season: "Autumn/Winter",
    price: 8000,
    rating: 4.7,
    badge: "Limited",
    featured: false,
    mainImage: "/static/assets/images/collections/cap shawal/black velvet/Modal shoot.jpeg",
    galleryImages: [
      "/static/assets/images/collections/cap shawal/black velvet/Modal shoot.jpeg",
      "/static/assets/images/collections/cap shawal/black velvet/Side psoe.jpeg",
      "/static/assets/images/collections/cap shawal/black velvet/Closeup.jpeg"
    ],
    description: "Contemporary velvet capshawal crafted with subtle hand painted embellishment along the neckline.",
    fabric: "Velvet",
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "anahat-006",
    title: "Handcrafted Pipe Cleaner Bouquet",
    category: "Art & Craft",
    season: "Signature Edition",
    price: 8000,
    rating: 4.9,
    badge: "Artisan",
    featured: false,
    mainImage: "/static/assets/images/collections/bouquet/prrple pipe cleaning bouquet/modal shoot.jpg",
    galleryImages: [
      "/static/assets/images/collections/bouquet/prrple pipe cleaning bouquet/modal shoot.jpg",
      "/static/assets/images/collections/bouquet/prrple pipe cleaning bouquet/product back shoot.jpg",
      "/static/assets/images/collections/bouquet/prrple pipe cleaning bouquet/closeup.jpg",
      "/static/assets/images/collections/bouquet/prrple pipe cleaning bouquet/close shot.jpg"
    ],
    description: "Add a touch of timeless charm to your space or gift a piece of everlasting art with our Handmade Purple Pipe Cleaner Bouquet.",
    sizes: ["8x10 inches", "12x16 inches", "16x20 inches"]
  }
];

// --- 2. INDEX PAGE BESTSELLERS LOGIC ---
function renderIndexBestsellers() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  const bestsellers = PRODUCTS_DATA.filter((p) => p.featured);
  grid.innerHTML = generateProductGridHTML(bestsellers);
}

// --- 3. COLLECTIONS GALLERY LOGIC ---
let activeCategory = "All";
let activeSeason = "All";
let activeSort = "featured";

function initCollectionsGallery() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get("search");
  const categoryParam = urlParams.get("category");

  if (categoryParam) {
    activeCategory = categoryParam;
    updateActiveChipUI(categoryParam);
  }

  if (searchQuery) {
    const searchInput = document.getElementById("headerSearchInput");
    if (searchInput) searchInput.value = searchQuery;
  }

  const chipsContainer = document.getElementById("categoryChips");
  if (chipsContainer) {
    chipsContainer.addEventListener("click", (e) => {
      const chip = e.target.closest(".filter-chip");
      if (!chip) return;

      document.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activeCategory = chip.getAttribute("data-category");
      filterAndRenderProducts();
    });
  }

  const seasonSelect = document.getElementById("seasonSelect");
  if (seasonSelect) {
    seasonSelect.addEventListener("change", (e) => {
      activeSeason = e.target.value;
      filterAndRenderProducts();
    });
  }

  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      activeSort = e.target.value;
      filterAndRenderProducts();
    });
  }

  filterAndRenderProducts();
}

function updateActiveChipUI(catName) {
  document.querySelectorAll(".filter-chip").forEach((c) => {
    if (c.getAttribute("data-category") === catName) {
      c.classList.add("active");
    } else {
      c.classList.remove("active");
    }
  });
}

function filterAndRenderProducts() {
  const grid = document.getElementById("productGrid");
  const emptyState = document.getElementById("emptyState");
  if (!grid) return;

  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get("search");

  let filtered = [...PRODUCTS_DATA];

  if (searchQuery) {
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (activeCategory !== "All") {
    filtered = filtered.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());
  }

  if (activeSeason !== "All") {
    filtered = filtered.filter((p) => p.season.toLowerCase() === activeSeason.toLowerCase());
  }

  if (activeSort === "price-low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (activeSort === "price-high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (activeSort === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  if (filtered.length === 0) {
    grid.innerHTML = "";
    if (emptyState) emptyState.hidden = false;
  } else {
    if (emptyState) emptyState.hidden = true;
    grid.innerHTML = generateProductGridHTML(filtered);
  }
}

// --- 4. PRODUCT GRID HTML GENERATOR ---
function generateProductGridHTML(products) {
  return products
    .map(
      (product) => `
    <div class="product-card" data-id="${product.id}">
      <div class="product-image-wrap" onclick="navigateToProduct('${product.id}')">
        <img src="${product.mainImage}" alt="${product.title}" loading="lazy" />
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
      </div>

      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3 class="product-title" onclick="navigateToProduct('${product.id}')">${product.title}</h3>
        <p class="product-price">Rs. ${product.price.toLocaleString()}</p>
        
        <div class="product-card-actions">
          <button type="button" class="btn-card btn-add-bag" onclick="handleCardAddToCart('${product.id}')">
            <i class="fa-solid fa-bag-shopping"></i> Add to Bag
          </button>
          <button type="button" class="btn-card btn-buy-now" onclick="handleCardBuyNow('${product.id}')">
            Buy Now 
          </button>
        </div>
      </div>
    </div>
  `
    )
    .join("");
}

function navigateToProduct(id) {
  window.location.href = `/pages/Collections/product.html?product_id=${id}`;
}

function handleCardAddToCart(id) {
  const item = PRODUCTS_DATA.find((p) => p.id === id);
  if (item && typeof addToCart === "function") {
    addToCart({ 
      id: item.id, 
      title: item.title, 
      price: item.price, 
      image: item.mainImage, 
      size: item.sizes ? item.sizes[0] : "Standard" 
    }, 1);

    if (typeof showToast === "function") {
      showToast("Item added to bag successfully!");
    }
  }
}

function handleCardBuyNow(id) {
  handleCardAddToCart(id);
  window.location.href = "/pages/checkouts/checkout.html";
}

// --- 5. PRODUCT DETAIL PAGE CONTROLLER ---
let currentSelectedSize = "S";
let currentQuantity = 1;

function initProductDetailPage() {
  const appContainer = document.getElementById("productDetailViewApp");
  if (!appContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("product_id") || "anahat-001";

  const product = PRODUCTS_DATA.find((p) => p.id === productId) || PRODUCTS_DATA[0];
  
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
  currentSelectedSize = hasSizes ? product.sizes[0] : "Standard";
  currentQuantity = 1;

  let relatedProducts = PRODUCTS_DATA.filter(p => p.id !== product.id);
  const galleryImages = product.galleryImages || [product.mainImage];

  appContainer.innerHTML = `
    <div class="product-detail-wrapper">
      <a href="/pages/Collections/collectionproduct.html" class="back-link">← Back to Collections</a>
      
      <div class="product-detail-grid">
        <!-- Left: Gallery Side -->
        <div class="product-gallery-container">
          <div class="main-image-wrap">
            <img id="detailMainImg" src="${product.mainImage}" alt="${product.title}" />
          </div>
          <div class="thumbnail-rail">
            ${galleryImages.map((imgUrl, idx) => `
              <img src="${imgUrl}" class="thumb-item ${idx === 0 ? 'active' : ''}" onclick="switchDetailImage('${imgUrl}', this)" alt="Thumbnail" />
            `).join("")}
          </div>
        </div>

        <!-- Right: Details & Action Side -->
        <div class="product-details-info">
          <span class="detail-category">${product.category}</span>
          <h1 class="detail-title" style="font-size: 22px; margin-bottom: 8px;">${product.title}</h1>
          <p class="detail-price">Rs. ${product.price.toLocaleString()}</p>
          
          ${hasSizes ? `
            <div class="detail-section">
              <div class="size-guide-row">
                <span class="section-label">Select Size:</span>
                <button type="button" onclick="openSizeGuideModal()" class="size-guide-btn">Size Guide 📏</button>
              </div>
              <div class="size-buttons-wrap" id="sizeButtonsContainer">
                ${product.sizes.map((sz, idx) => `
                  <button type="button" class="detail-size-btn ${idx === 0 ? "active" : ""}" onclick="selectDetailSize(this, '${sz}')">${sz}</button>
                `).join("")}
              </div>
            </div>
          ` : ''}

          <div class="detail-section">
            <span class="section-label">Quantity:</span>
            <div class="quantity-selector-wrap">
              <button onclick="adjustDetailQty(-1)" class="qty-btn">-</button>
              <span id="detailQtyVal" class="qty-value">1</span>
              <button onclick="adjustDetailQty(1)" class="qty-btn">+</button>
            </div>
          </div>

          <div class="detail-action-buttons" style="margin-bottom: 24px;">
            <button type="button" onclick="submitDetailAddBag('${product.id}')" class="btn-detail-bag">
              <i class="fa-solid fa-bag-shopping"></i> Add to Bag
            </button>
            <button type="button" onclick="submitDetailBuyNow('${product.id}')" class="btn-detail-buynow">
              Buy Now →
            </button>
          </div>

          <p class="detail-desc" style="margin-bottom: 14px;">${product.description}</p>
          <p class="detail-fabric"><strong>Fabric &amp; Craft:</strong> ${product.fabric || 'Handcrafted Excellence'}</p>
        </div>
      </div>
      
      ${relatedProducts.length > 0 ? `
        <div class="related-products-section" style="margin-top: 60px;">
          <h3 class="related-title" style="text-align: center; margin-bottom: 24px;">You May Also Like</h3>
          <div class="product-grid">
            ${generateProductGridHTML(relatedProducts)}
          </div>
          
          <div style="margin: 40px auto 0 auto; text-align: center; width: fit-content;">
            <a href="/pages/Collections/collectionproduct.html" style="
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              padding: 12px 28px;
              background-color: var(--sage);
              color: #fffdf8;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.08em;
              border-radius: var(--radius);
              text-decoration: none;
              box-shadow: var(--shadow);
              transition: background-color 0.2s ease, transform 0.2s ease;
            ">View All →</a>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

// --- 6. INTERACTION HELPERS ---
function switchDetailImage(imgUrl, thumbElement) {
  const mainImg = document.getElementById("detailMainImg");
  if (!mainImg) return;

  let finalUrl = imgUrl;
  const isInsidePages = window.location.pathname.includes('/pages/');
  
  if (isInsidePages) {
    if (imgUrl.startsWith("static/")) {
      finalUrl = "../../" + imgUrl;
    } else if (imgUrl.startsWith("/static/")) {
      finalUrl = "../../" + imgUrl.slice(1);
    }
  }

  mainImg.src = finalUrl;

  document.querySelectorAll(".thumb-item").forEach(t => t.classList.remove("active"));
  if (thumbElement) {
    thumbElement.classList.add("active");
  }
}

function selectDetailSize(btn, sz) {
  currentSelectedSize = sz; 
  
  document.querySelectorAll(".detail-size-btn").forEach(b => {
    b.style.borderColor = "var(--line)";
    b.style.background = "white";
    b.style.color = "var(--ink)";
  });
  
  btn.style.borderColor = "var(--sage)";
  btn.style.background = "var(--sage)";
  btn.style.color = "white";
  
  console.log("Size Updated To:", currentSelectedSize);
}

function adjustDetailQty(delta) {
  currentQuantity += delta;
  if (currentQuantity < 1) currentQuantity = 1;
  const qtyEl = document.getElementById("detailQtyVal");
  if (qtyEl) qtyEl.textContent = currentQuantity;
}

function submitDetailAddBag(productId) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (product) {
    if (typeof addToCart === "function") {
      addToCart({
        id: product.id,
        name: product.title,
        title: product.title,
        price: product.price,
        image: product.mainImage,
        size: currentSelectedSize || "Standard"
      }, currentQuantity);
    }
    
    if (typeof showToast === "function") {
      showToast("Item added to bag successfully!");
    }
  }
}

function submitDetailBuyNow(productId) {
  submitDetailAddBag(productId);
  window.location.href = "/pages/checkouts/checkout.html";
}

function openSizeGuideModal() {
  const modal = document.getElementById("sizeGuideModal");
  if (modal) {
    modal.style.display = "flex";
  } else {
    alert("Size Guide:\nSmall: Bust 36\", Length 42\"\nMedium: Bust 40\", Length 44\"\nLarge: Bust 44\", Length 45\"\nX-Large: Bust 48\", Length 46\"");
  }
}

function closeSizeGuideModal() {
  const modal = document.getElementById("sizeGuideModal");
  if (modal) modal.style.display = "none";
}