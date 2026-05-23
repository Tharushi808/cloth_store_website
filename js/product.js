/* =============================================
   LUXE THREADS - Product Detail Page Logic
   ============================================= */

let currentProduct = null;
let selectedSize = null;
let selectedColor = null;
let selectedQty = 1;
let activeGalleryIdx = 0;

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id')) || 1;
  currentProduct = LuxeData.products.find(p => p.id === id) || LuxeData.products[0];
  renderProduct();
  renderRelated();
  initReviewForm();
  updateBreadcrumb();
});

function renderProduct() {
  const p = currentProduct;

  document.title = `${p.name} — Luxe Threads`;

  // Gallery
  renderGallery(p.images);

  // Basic info
  setText('product-category', p.subcategory);
  setText('product-name', p.name);
  setText('product-price-current', formatPrice(p.price));
  if (p.discount) {
    setText('product-price-original', formatPrice(p.originalPrice));
    setText('product-discount-badge', `-${p.discount}%`);
  } else {
    const origEl = document.getElementById('product-price-original');
    if (origEl) origEl.style.display = 'none';
    const discEl = document.getElementById('product-discount-badge');
    if (discEl) discEl.style.display = 'none';
  }
  setText('product-description', p.description);
  setText('product-material', p.material);
  setText('product-care', p.care);

  // Rating
  const ratingEl = document.getElementById('product-rating-stars');
  if (ratingEl) ratingEl.innerHTML = renderStars(p.rating);
  setText('product-rating-num', p.rating.toFixed(1));
  setText('product-review-link', `${p.reviewCount} reviews`);

  // Sizes
  const sizesEl = document.getElementById('size-options');
  if (sizesEl) {
    sizesEl.innerHTML = p.sizes.map(s => `
      <button class="size-btn ${p.outOfStock.includes(s) ? 'out-of-stock' : ''}" data-size="${s}"
        ${p.outOfStock.includes(s) ? 'disabled title="Out of stock"' : ''}>${s}</button>
    `).join('');
    selectedSize = p.sizes.find(s => !p.outOfStock.includes(s));
    sizesEl.querySelectorAll('.size-btn').forEach(btn => {
      if (btn.dataset.size === selectedSize) btn.classList.add('active');
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        sizesEl.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedSize = btn.dataset.size;
      });
    });
  }

  // Colors
  const colorsEl = document.getElementById('color-options');
  if (colorsEl) {
    colorsEl.innerHTML = p.colors.map(c => `
      <button class="color-option-btn" style="background:${c.code};${c.code === '#FFFFFF' ? 'border:2px solid #ddd' : ''}"
        data-color="${c.name}" title="${c.name}"></button>
    `).join('');
    selectedColor = p.colors[0]?.name;
    colorsEl.querySelectorAll('.color-option-btn').forEach(btn => {
      if (btn.dataset.color === selectedColor) btn.classList.add('active');
      btn.addEventListener('click', () => {
        colorsEl.querySelectorAll('.color-option-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedColor = btn.dataset.color;
        setText('selected-color-name', selectedColor);
      });
    });
    setText('selected-color-name', selectedColor || '');
  }

  // Qty
  initQtySelector();

  // Buttons
  initActionButtons(p);

  // Tabs
  initTabs();

  // Size chart
  renderSizeChart(p);

  // Reviews
  renderReviews(p);

  // Wishlist state
  const wl = Wishlist.has(p.id);
  const wishBtn = document.getElementById('wishlist-btn');
  if (wishBtn) {
    wishBtn.classList.toggle('wishlisted', wl);
    wishBtn.innerHTML = `<i class="fa${wl ? 's' : 'r'} fa-heart"></i> ${wl ? 'Wishlisted' : 'Wishlist'}`;
  }

  // Try-on link
  const tryonBtn = document.getElementById('tryon-btn');
  if (tryonBtn) tryonBtn.href = `virtual-tryon.html?id=${p.id}`;
}

function renderGallery(images) {
  const main = document.getElementById('gallery-main-img');
  const thumbsEl = document.getElementById('gallery-thumbs');
  if (!main || !thumbsEl) return;

  main.src = images[0];
  main.onerror = () => main.src = 'https://placehold.co/600x800/e8e8e8/555?text=Product';

  thumbsEl.innerHTML = images.map((img, i) => `
    <div class="gallery-thumb ${i === 0 ? 'active' : ''}" onclick="setGalleryImage(${i})">
      <img src="${img}" alt="View ${i + 1}" onerror="this.src='https://placehold.co/150x200/e8e8e8/555?text=View'">
    </div>
  `).join('');
}

window.setGalleryImage = function(idx) {
  activeGalleryIdx = idx;
  const main = document.getElementById('gallery-main-img');
  if (main) { main.src = currentProduct.images[idx]; }
  document.querySelectorAll('.gallery-thumb').forEach((t, i) => t.classList.toggle('active', i === idx));
};

function initQtySelector() {
  const dec = document.getElementById('qty-dec');
  const inc = document.getElementById('qty-inc');
  const inp = document.getElementById('qty-input');
  if (!dec || !inc || !inp) return;
  inp.value = selectedQty;
  dec.addEventListener('click', () => { if (selectedQty > 1) { selectedQty--; inp.value = selectedQty; } });
  inc.addEventListener('click', () => { if (selectedQty < 10) { selectedQty++; inp.value = selectedQty; } });
  inp.addEventListener('change', () => { selectedQty = Math.min(10, Math.max(1, parseInt(inp.value) || 1)); inp.value = selectedQty; });
}

function initActionButtons(p) {
  const addBtn = document.getElementById('add-to-cart-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      if (!selectedSize) { showToast('Please select a size first.', 'warning', 'Select Size'); return; }
      Cart.add(p, selectedSize, selectedColor, selectedQty);
    });
  }

  const buyBtn = document.getElementById('buy-now-btn');
  if (buyBtn) {
    buyBtn.addEventListener('click', () => {
      if (!selectedSize) { showToast('Please select a size first.', 'warning', 'Select Size'); return; }
      Cart.add(p, selectedSize, selectedColor, selectedQty);
      window.location.href = 'cart.html';
    });
  }

  const wishBtn = document.getElementById('wishlist-btn');
  if (wishBtn) {
    wishBtn.addEventListener('click', () => {
      const added = Wishlist.toggle(p.id);
      wishBtn.classList.toggle('wishlisted', added);
      wishBtn.innerHTML = `<i class="fa${added ? 's' : 'r'} fa-heart"></i> ${added ? 'Wishlisted' : 'Wishlist'}`;
    });
  }
}

function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const target = document.getElementById(`tab-${btn.dataset.tab}`);
      if (target) target.classList.add('active');
    });
  });
}

function renderSizeChart(p) {
  const chartEl = document.getElementById('size-chart-table');
  if (!chartEl) return;
  const isTops = !['Trousers', 'Jeans', 'Skirts'].includes(p.subcategory);
  const chart = isTops ? LuxeData.sizeChart.tops : LuxeData.sizeChart.bottoms;
  chartEl.innerHTML = `
    <table>
      <thead><tr>${chart.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
      <tbody>${chart.rows.map(row => `<tr class="${selectedSize === row[0] ? 'highlighted' : ''}"><td>${row.join('</td><td>')}</td></tr>`).join('')}</tbody>
    </table>`;
}

function renderReviews(p) {
  const container = document.getElementById('reviews-list');
  if (!container) return;

  const reviewsToShow = p.reviews || [];

  const el = document.getElementById('review-big-rating');
  if (el) el.textContent = p.rating.toFixed(1);
  const starsEl = document.getElementById('review-summary-stars');
  if (starsEl) starsEl.innerHTML = renderStars(p.rating);
  const countEl = document.getElementById('review-count-text');
  if (countEl) countEl.textContent = `Based on ${p.reviewCount} reviews`;

  renderReviewBars(p);

  if (reviewsToShow.length === 0) {
    container.innerHTML = `<p style="color:var(--text-light);text-align:center;padding:32px">No reviews yet. Be the first to review this product!</p>`;
    return;
  }

  container.innerHTML = reviewsToShow.map(r => `
    <div class="review-item">
      <div class="review-header">
        <div class="reviewer-info">
          <div class="reviewer-avatar">${r.user.charAt(0).toUpperCase()}</div>
          <div>
            <div class="reviewer-name">${r.user}</div>
            <div class="reviewer-date">${new Date(r.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
          ${renderStars(r.rating)}
          ${r.verified ? `<span class="verified-badge"><i class="fas fa-check-circle"></i> Verified Purchase</span>` : ''}
        </div>
      </div>
      <p class="review-text">"${r.text}"</p>
      <div class="review-helpful">
        <span>Was this helpful?</span>
        <button onclick="this.textContent='Thanks!'">Yes (${r.helpful})</button>
        <button>No</button>
      </div>
    </div>
  `).join('');
}

function renderReviewBars(p) {
  const bars = document.getElementById('review-bars');
  if (!bars) return;
  const dist = [92, 75, 45, 20, 8];
  bars.innerHTML = [5,4,3,2,1].map((star, i) => `
    <div class="review-bar-row">
      <span>${star} star</span>
      <div class="review-bar"><div class="review-bar-fill" style="width:${dist[i]}%"></div></div>
      <span>${dist[i]}%</span>
    </div>
  `).join('');
}

function initReviewForm() {
  const form = document.getElementById('review-form');
  if (!form) return;
  let selectedRating = 0;
  document.querySelectorAll('.star-rating-input i').forEach((star, idx) => {
    star.addEventListener('click', () => {
      selectedRating = idx + 1;
      document.querySelectorAll('.star-rating-input i').forEach((s, i) => {
        s.classList.toggle('active', i < selectedRating);
        s.className = i < selectedRating ? 'fas fa-star active' : 'far fa-star';
      });
    });
    star.addEventListener('mouseenter', () => {
      document.querySelectorAll('.star-rating-input i').forEach((s, i) => {
        s.className = i <= idx ? 'fas fa-star' : 'far fa-star';
      });
    });
    star.addEventListener('mouseleave', () => {
      document.querySelectorAll('.star-rating-input i').forEach((s, i) => {
        s.className = i < selectedRating ? 'fas fa-star active' : 'far fa-star';
      });
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!Auth.isLoggedIn()) { showToast('Please sign in to submit a review.', 'warning', 'Sign in Required'); return; }
    if (selectedRating === 0) { showToast('Please select a rating.', 'warning'); return; }
    showToast('Your review has been submitted for admin approval. Thank you!', 'success', 'Review Submitted');
    form.reset();
    document.querySelectorAll('.star-rating-input i').forEach(s => s.className = 'far fa-star');
    selectedRating = 0;
  });
}

function renderRelated() {
  const container = document.getElementById('related-products');
  if (!container || !currentProduct) return;
  const related = LuxeData.products
    .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category)
    .slice(0, 4);
  container.innerHTML = related.map(p => `
    <div class="product-card">
      <div class="product-card-img">
        <a href="product.html?id=${p.id}"><img src="${p.images[0]}" alt="${p.name}" onerror="this.src='https://placehold.co/300x400/e8e8e8/555?text=Product'"></a>
        ${p.badge ? `<div class="product-card-badges"><span class="product-badge ${p.badge}">${p.badge.toUpperCase()}</span></div>` : ''}
      </div>
      <div class="product-card-info">
        <div class="product-card-category">${p.subcategory}</div>
        <a href="product.html?id=${p.id}" class="product-card-name">${p.name}</a>
        <div class="product-card-price">
          <span class="price-current">${formatPrice(p.price)}</span>
          ${p.discount ? `<span class="price-original">${formatPrice(p.originalPrice)}</span>` : ''}
        </div>
        <div class="product-card-rating">${renderStars(p.rating)}<span class="rating-count">(${p.reviewCount})</span></div>
      </div>
      <div class="product-card-footer">
        <a href="product.html?id=${p.id}" class="btn btn-primary btn-full"><i class="fas fa-eye"></i> View Product</a>
      </div>
    </div>
  `).join('');
}

function updateBreadcrumb() {
  if (!currentProduct) return;
  const el = document.getElementById('breadcrumb-product');
  if (el) el.textContent = currentProduct.name;
  const catEl = document.getElementById('breadcrumb-category');
  if (catEl) { catEl.textContent = currentProduct.category === 'casual' ? 'Casual Wear' : 'Office Wear'; catEl.href = `shop.html?category=${currentProduct.category}`; }
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
