/* =============================================
   LUXE THREADS - Shop Page Logic
   ============================================= */

let allProducts = [...LuxeData.products];
let filteredProducts = [...allProducts];
let currentPage = 1;
const perPage = 8;
let viewMode = 'grid';

const state = {
  categories: [],
  subcategories: [],
  sizes: [],
  colors: [],
  priceMin: 0,
  priceMax: 20000,
  sort: 'featured',
  search: ''
};

document.addEventListener('DOMContentLoaded', () => {
  readURLParams();
  bindFilters();
  bindSort();
  bindViewToggle();
  applyFilters();
});

function readURLParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('q')) { state.search = params.get('q'); const si = document.getElementById('search-input'); if (si) si.value = state.search; }
  if (params.get('category')) { state.categories = [params.get('category')]; }
}

function bindFilters() {
  document.querySelectorAll('.filter-category').forEach(cb => {
    cb.addEventListener('change', () => {
      const val = cb.value;
      if (cb.checked) { if (!state.categories.includes(val)) state.categories.push(val); }
      else { state.categories = state.categories.filter(c => c !== val); }
      applyFilters();
    });
  });
  document.querySelectorAll('.filter-size').forEach(cb => {
    cb.addEventListener('change', () => {
      const val = cb.value;
      if (cb.checked) { if (!state.sizes.includes(val)) state.sizes.push(val); }
      else { state.sizes = state.sizes.filter(s => s !== val); }
      applyFilters();
    });
  });
  document.querySelectorAll('.filter-color').forEach(cb => {
    cb.addEventListener('change', () => {
      const val = cb.value;
      if (cb.checked) { if (!state.colors.includes(val)) state.colors.push(val); }
      else { state.colors = state.colors.filter(c => c !== val); }
      applyFilters();
    });
  });
  const priceRange = document.getElementById('price-range');
  if (priceRange) {
    priceRange.addEventListener('input', () => {
      state.priceMax = parseInt(priceRange.value);
      document.getElementById('price-max-display').textContent = formatPrice(state.priceMax);
      applyFilters();
    });
  }
  const searchInput = document.getElementById('search-input');
  if (searchInput) { searchInput.addEventListener('input', () => { state.search = searchInput.value; applyFilters(); }); }
  const clearAllBtn = document.getElementById('clear-filters');
  if (clearAllBtn) { clearAllBtn.addEventListener('click', clearAllFilters); }
  const mobileFilerBtn = document.getElementById('mobile-filter-btn');
  const sidebar = document.querySelector('.shop-sidebar');
  if (mobileFilerBtn && sidebar) {
    mobileFilerBtn.addEventListener('click', () => sidebar.classList.toggle('mobile-open'));
  }
}

function bindSort() {
  const sortEl = document.getElementById('sort-select');
  if (sortEl) {
    sortEl.addEventListener('change', () => { state.sort = sortEl.value; applyFilters(); });
  }
}

function bindViewToggle() {
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      viewMode = btn.dataset.view;
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const grid = document.getElementById('products-grid');
      if (grid) { grid.classList.toggle('list-view', viewMode === 'list'); }
    });
  });
}

function applyFilters() {
  filteredProducts = allProducts.filter(p => {
    if (state.categories.length && !state.categories.includes(p.category)) return false;
    if (state.sizes.length && !state.sizes.some(s => p.sizes.includes(s))) return false;
    if (state.colors.length && !state.colors.some(c => p.colors.some(pc => pc.name === c))) return false;
    if (p.price < state.priceMin || p.price > state.priceMax) return false;
    if (state.search) {
      const q = state.search.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q) && !p.subcategory.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  filteredProducts.sort((a, b) => {
    switch (state.sort) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'newest': return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      case 'discount': return b.discount - a.discount;
      default: return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    }
  });

  currentPage = 1;
  renderProducts();
  renderPagination();
  updateResultCount();
  updateActiveFilters();
}

function clearAllFilters() {
  state.categories = []; state.sizes = []; state.colors = [];
  state.priceMin = 0; state.priceMax = 20000; state.search = '';
  document.querySelectorAll('.filter-category, .filter-size, .filter-color').forEach(cb => cb.checked = false);
  const priceRange = document.getElementById('price-range'); if (priceRange) priceRange.value = 20000;
  const searchInput = document.getElementById('search-input'); if (searchInput) searchInput.value = '';
  applyFilters();
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  const start = (currentPage - 1) * perPage;
  const page = filteredProducts.slice(start, start + perPage);

  if (page.length === 0) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1;padding:60px 20px;text-align:center">
      <i class="far fa-sad-tear" style="font-size:48px;color:var(--border);display:block;margin-bottom:16px"></i>
      <h3>No products found</h3><p style="color:var(--text-light);margin-top:8px">Try adjusting your filters or search term.</p>
      <button class="btn btn-outline mt-3" onclick="clearAllFilters()">Clear All Filters</button>
    </div>`;
    return;
  }

  grid.innerHTML = page.map(p => productCardHTML(p)).join('');
  initCardInteractions();
}

function productCardHTML(p) {
  const inWishlist = Wishlist.has(p.id);
  return `
  <div class="product-card" data-id="${p.id}">
    <div class="product-card-img">
      <a href="product.html?id=${p.id}">
        <img src="${p.images[0]}" alt="${p.name}" loading="lazy" onerror="this.src='https://placehold.co/300x400/e8e8e8/555?text=Product'">
      </a>
      <div class="product-card-badges">
        ${p.badge ? `<span class="product-badge ${p.badge}">${p.badge === 'hot' ? '🔥 Hot' : p.badge.toUpperCase()}</span>` : ''}
      </div>
      <div class="product-card-actions">
        <button class="wishlist-btn ${inWishlist ? 'wishlisted' : ''}" data-id="${p.id}" title="${inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}">
          <i class="fa${inWishlist ? 's' : 'r'} fa-heart"></i>
        </button>
        <button class="quickview-btn" data-id="${p.id}" title="Quick View"><i class="fas fa-eye"></i></button>
        <a href="virtual-tryon.html?id=${p.id}" title="Virtual Try-On" style="width:36px;height:36px;background:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:var(--shadow-sm);color:var(--text-dark);transition:var(--transition)">
          <i class="fas fa-camera"></i>
        </a>
      </div>
    </div>
    <div class="product-card-info">
      <div class="product-card-category">${p.subcategory}</div>
      <a href="product.html?id=${p.id}" class="product-card-name">${p.name}</a>
      <div class="product-card-price">
        <span class="price-current">${formatPrice(p.price)}</span>
        ${p.discount ? `<span class="price-original">${formatPrice(p.originalPrice)}</span><span class="price-discount">-${p.discount}%</span>` : ''}
      </div>
      <div class="product-card-rating">
        ${renderStars(p.rating)}
        <span class="rating-count">(${p.reviewCount})</span>
      </div>
      <div class="product-card-colors">
        ${p.colors.slice(0,4).map(c => `<span class="color-dot" style="background:${c.code};${c.code==='#FFFFFF'?'border:1px solid #ddd':''}" title="${c.name}"></span>`).join('')}
      </div>
    </div>
    <div class="product-card-footer">
      <button class="btn btn-primary add-to-cart-btn" data-id="${p.id}">
        <i class="fas fa-shopping-bag"></i> Add to Cart
      </button>
    </div>
  </div>`;
}

function initCardInteractions() {
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const added = Wishlist.toggle(id);
      btn.classList.toggle('wishlisted', added);
      btn.innerHTML = `<i class="fa${added ? 's' : 'r'} fa-heart"></i>`;
    });
  });
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const product = LuxeData.products.find(p => p.id === id);
      if (!product) return;
      const size = product.sizes.find(s => !product.outOfStock.includes(s)) || product.sizes[0];
      const color = product.colors[0]?.name || '';
      Cart.add(product, size, color);
    });
  });
  document.querySelectorAll('.quickview-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      openQuickView(id);
    });
  });
}

function openQuickView(id) {
  const product = LuxeData.products.find(p => p.id === id);
  if (!product) return;
  const body = document.getElementById('quickview-body');
  if (!body) return;
  body.innerHTML = `
    <div class="quickview-grid">
      <div class="quickview-img"><img src="${product.images[0]}" alt="${product.name}" onerror="this.src='https://placehold.co/300x400/e8e8e8/555?text=Product'"></div>
      <div>
        <p class="product-category-tag">${product.subcategory}</p>
        <h2 style="font-size:20px;font-weight:800;margin:8px 0 12px">${product.name}</h2>
        <div class="product-rating-row">${renderStars(product.rating)}<span class="rating-num">${product.rating}</span><span style="font-size:13px;color:var(--text-light)">(${product.reviewCount} reviews)</span></div>
        <div class="product-price-row">
          <span class="price-current">${formatPrice(product.price)}</span>
          ${product.discount ? `<span class="price-original">${formatPrice(product.originalPrice)}</span><span class="price-discount">-${product.discount}%</span>` : ''}
        </div>
        <p style="font-size:13px;color:var(--text-medium);margin-bottom:16px">${product.description.substring(0,150)}...</p>
        <div style="margin-bottom:16px">
          <div class="option-label">Size</div>
          <div class="size-options" id="qv-sizes">
            ${product.sizes.map(s => `<button class="size-btn${product.outOfStock.includes(s)?' out-of-stock':''}" data-size="${s}">${s}</button>`).join('')}
          </div>
        </div>
        <div style="margin-bottom:20px">
          <div class="option-label">Color</div>
          <div class="color-options">
            ${product.colors.map(c => `<button class="color-option-btn" style="background:${c.code};${c.code==='#FFFFFF'?'border:2px solid #ddd':''}" title="${c.name}" data-color="${c.name}"></button>`).join('')}
          </div>
        </div>
        <div class="flex" style="gap:10px;flex-wrap:wrap">
          <a href="product.html?id=${product.id}" class="btn btn-outline" style="flex:1;justify-content:center">View Details</a>
          <button class="btn btn-primary" style="flex:1;justify-content:center" onclick="quickAddToCart(${product.id})">
            <i class="fas fa-shopping-bag"></i> Add to Cart
          </button>
        </div>
      </div>
    </div>`;
  initQuickViewSelections(product);
  openModal('quickview-modal');
}

function initQuickViewSelections(product) {
  let selectedSize = product.sizes.find(s => !product.outOfStock.includes(s));
  let selectedColor = product.colors[0]?.name;
  document.querySelectorAll('#qv-sizes .size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('out-of-stock')) return;
      document.querySelectorAll('#qv-sizes .size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); selectedSize = btn.dataset.size;
    });
    if (btn.dataset.size === selectedSize) btn.classList.add('active');
  });
  document.querySelectorAll('.quickview-grid .color-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.quickview-grid .color-option-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active'); selectedColor = btn.dataset.color;
    });
    if (btn.dataset.color === selectedColor) btn.classList.add('active');
  });
  window.quickAddToCart = (id) => {
    const p = LuxeData.products.find(pr => pr.id === id);
    Cart.add(p, selectedSize, selectedColor);
    closeModal('quickview-modal');
  };
}

function renderPagination() {
  const el = document.getElementById('pagination');
  if (!el) return;
  const totalPages = Math.ceil(filteredProducts.length / perPage);
  if (totalPages <= 1) { el.innerHTML = ''; return; }
  let html = '';
  if (currentPage > 1) html += `<button onclick="goToPage(${currentPage - 1})"><i class="fas fa-chevron-left"></i></button>`;
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      html += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      html += `<button disabled>...</button>`;
    }
  }
  if (currentPage < totalPages) html += `<button onclick="goToPage(${currentPage + 1})"><i class="fas fa-chevron-right"></i></button>`;
  el.innerHTML = html;
}

function goToPage(page) {
  currentPage = page;
  renderProducts();
  renderPagination();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateResultCount() {
  const el = document.getElementById('result-count');
  if (el) el.innerHTML = `Showing <strong>${Math.min(filteredProducts.length, perPage)}</strong> of <strong>${filteredProducts.length}</strong> results`;
}

function updateActiveFilters() {
  const container = document.getElementById('active-filters');
  if (!container) return;
  const tags = [];
  state.categories.forEach(c => tags.push({ label: c, key: 'category', val: c }));
  state.sizes.forEach(s => tags.push({ label: `Size: ${s}`, key: 'size', val: s }));
  state.colors.forEach(c => tags.push({ label: `Color: ${c}`, key: 'color', val: c }));
  if (state.search) tags.push({ label: `"${state.search}"`, key: 'search', val: state.search });
  container.innerHTML = tags.map(t => `
    <span class="filter-tag">${t.label}<button onclick="removeFilter('${t.key}','${t.val}')"><i class="fas fa-times"></i></button></span>
  `).join('') + (tags.length ? `<button class="btn btn-sm btn-outline" onclick="clearAllFilters()" style="padding:4px 12px;font-size:11px">Clear All</button>` : '');
}

function removeFilter(key, val) {
  if (key === 'category') state.categories = state.categories.filter(c => c !== val);
  else if (key === 'size') state.sizes = state.sizes.filter(s => s !== val);
  else if (key === 'color') state.colors = state.colors.filter(c => c !== val);
  else if (key === 'search') { state.search = ''; const si = document.getElementById('search-input'); if (si) si.value = ''; }
  applyFilters();
}
