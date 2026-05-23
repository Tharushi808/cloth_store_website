/* =============================================
   LUXE THREADS - Core / Shared JS
   ============================================= */

// ---- TOAST ----
function showToast(msg, type = 'success', title = '') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas ${icons[type] || icons.success} toast-icon"></i><div class="toast-msg">${title ? `<strong>${title}</strong>` : ''}${msg}</div>`;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 400); }, 3500);
}

// ---- CART MANAGEMENT ----
const Cart = {
  get() { return JSON.parse(localStorage.getItem('luxe_cart') || '[]'); },
  save(items) { localStorage.setItem('luxe_cart', JSON.stringify(items)); this.updateCount(); },
  updateCount() {
    const items = this.get();
    const count = items.reduce((sum, i) => sum + i.qty, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  },
  add(product, size, color, qty = 1) {
    const items = this.get();
    const key = `${product.id}-${size}-${color}`;
    const existing = items.find(i => i.key === key);
    if (existing) { existing.qty += qty; }
    else { items.push({ key, id: product.id, name: product.name, price: product.price, image: product.images[0], size, color, qty, category: product.category }); }
    this.save(items);
    showToast(`<strong>${product.name}</strong> added to cart!`, 'success', '');
  },
  remove(key) {
    const items = this.get().filter(i => i.key !== key);
    this.save(items);
  },
  update(key, qty) {
    const items = this.get();
    const item = items.find(i => i.key === key);
    if (item) { if (qty <= 0) { return this.remove(key); } item.qty = qty; }
    this.save(items);
  },
  clear() { localStorage.removeItem('luxe_cart'); this.updateCount(); },
  getTotal() { return this.get().reduce((sum, i) => sum + (i.price * i.qty), 0); },
  getCount() { return this.get().reduce((sum, i) => sum + i.qty, 0); }
};

// ---- WISHLIST MANAGEMENT ----
const Wishlist = {
  get() { return JSON.parse(localStorage.getItem('luxe_wishlist') || '[]'); },
  save(ids) { localStorage.setItem('luxe_wishlist', JSON.stringify(ids)); this.updateCount(); },
  updateCount() {
    const count = this.get().length;
    document.querySelectorAll('.wishlist-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  },
  toggle(id) {
    const ids = this.get();
    const idx = ids.indexOf(id);
    if (idx === -1) { ids.push(id); showToast('Added to wishlist!', 'success'); }
    else { ids.splice(idx, 1); showToast('Removed from wishlist', 'info'); }
    this.save(ids);
    return idx === -1;
  },
  has(id) { return this.get().includes(id); }
};

// ---- USER AUTH STATE ----
const Auth = {
  get() { return JSON.parse(localStorage.getItem('luxe_user') || 'null'); },
  save(user) { localStorage.setItem('luxe_user', JSON.stringify(user)); },
  logout() { localStorage.removeItem('luxe_user'); window.location.href = 'account.html'; },
  isLoggedIn() { return this.get() !== null; },
  updateUI() {
    const user = this.get();
    const loggedIn = !!user;
    document.querySelectorAll('.nav-account-btn').forEach(btn => {
      if (loggedIn) { btn.title = user.name || 'My Account'; btn.style.color = 'var(--accent)'; }
    });
  }
};

// ---- NAVIGATION ----
function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 20));
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = mobileMenu.classList.contains('open') ? 'rotate(45deg) translate(5px, 5px)' : '';
      spans[1].style.opacity = mobileMenu.classList.contains('open') ? '0' : '1';
      spans[2].style.transform = mobileMenu.classList.contains('open') ? 'rotate(-45deg) translate(5px, -5px)' : '';
    });
  }
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) link.classList.add('active');
  });
  Cart.updateCount();
  Wishlist.updateCount();
  Auth.updateUI();
}

// ---- MODAL ----
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) { e.target.classList.remove('open'); document.body.style.overflow = ''; }
  if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
    const overlay = e.target.closest('.modal-overlay');
    if (overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
  }
});

// ---- COUNTDOWN TIMER ----
function startCountdown(hours = 18, mins = 45, secs = 30) {
  let total = hours * 3600 + mins * 60 + secs;
  function tick() {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const pad = n => String(n).padStart(2, '0');
    const el = document.querySelector('.promo-timer');
    if (!el) return;
    el.innerHTML = `
      <div class="timer-box"><div class="num">${pad(h)}</div><div class="lbl">HRS</div></div>
      <div class="timer-box"><div class="num">${pad(m)}</div><div class="lbl">MIN</div></div>
      <div class="timer-box"><div class="num">${pad(s)}</div><div class="lbl">SEC</div></div>`;
    if (total > 0) { total--; setTimeout(tick, 1000); }
  }
  tick();
}

// ---- SEARCH ----
function initSearch() {
  const form = document.querySelector('.nav-search');
  if (!form) return;
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const q = form.querySelector('input').value.trim();
      if (q) window.location.href = `shop.html?q=${encodeURIComponent(q)}`;
    }
  });
}

// ---- FORMAT PRICE ----
function formatPrice(n) { return `Rs. ${n.toLocaleString()}`; }

// ---- RENDER STARS ----
function renderStars(rating, size = '') {
  let html = '<div class="stars">';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) html += `<i class="fas fa-star${size}"></i>`;
    else if (i - 0.5 <= rating) html += `<i class="fas fa-star-half-alt${size}"></i>`;
    else html += `<i class="far fa-star${size}"></i>`;
  }
  return html + '</div>';
}

// ---- PAGE LOADER ----
function hideLoader() {
  const loader = document.querySelector('.page-loader');
  if (loader) { loader.classList.add('hidden'); setTimeout(() => loader.remove(), 600); }
}

// ---- ANIMATE ON SCROLL ----
function initScrollAnimations() {
  const els = document.querySelectorAll('[data-animate]');
  if (!els.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animated'); observer.unobserve(e.target); } });
  }, { threshold: 0.15 });
  els.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(20px)'; el.style.transition = 'all 0.5s ease'; observer.observe(el); });
  const style = document.createElement('style');
  style.textContent = '.animated { opacity: 1 !important; transform: none !important; }';
  document.head.appendChild(style);
}

// ---- INIT ON DOM READY ----
document.addEventListener('DOMContentLoaded', () => {
  hideLoader();
  initNav();
  initSearch();
  initScrollAnimations();
  startCountdown(18, 45, 30);
});
