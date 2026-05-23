/* =============================================
   LUXE THREADS - Account / Auth Logic
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  const user = Auth.get();
  if (user && document.getElementById('account-panel')) {
    showAccountPanel(user);
  } else if (document.getElementById('auth-panel')) {
    showAuthPanel();
  }
  initAuthTabs();
  initAuthForms();
});

function initAuthTabs() {
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.querySelectorAll('.auth-form-content').forEach(f => f.classList.toggle('hidden', f.id !== `${target}-form`));
    });
  });
}

function initAuthForms() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value;
      const pass = document.getElementById('login-pass')?.value;
      if (!email || !pass) { showToast('Please fill in all fields.', 'error'); return; }
      const btn = loginForm.querySelector('button[type="submit"]');
      if (btn) { btn.textContent = 'Signing in...'; btn.disabled = true; }
      setTimeout(() => {
        const user = { email, name: email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, c => c.toUpperCase()), joined: new Date().toISOString() };
        Auth.save(user);
        showToast(`Welcome back, ${user.name}!`, 'success');
        setTimeout(() => location.reload(), 800);
      }, 1000);
    });
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name')?.value;
      const email = document.getElementById('reg-email')?.value;
      const pass = document.getElementById('reg-pass')?.value;
      const confirm = document.getElementById('reg-confirm')?.value;
      if (!name || !email || !pass) { showToast('Please fill in all fields.', 'error'); return; }
      if (pass !== confirm) { showToast('Passwords do not match.', 'error'); return; }
      if (pass.length < 8) { showToast('Password must be at least 8 characters.', 'error'); return; }
      const btn = registerForm.querySelector('button[type="submit"]');
      if (btn) { btn.textContent = 'Creating account...'; btn.disabled = true; }
      setTimeout(() => {
        const user = { email, name, joined: new Date().toISOString() };
        Auth.save(user);
        showToast(`Account created! Welcome, ${name}!`, 'success');
        setTimeout(() => location.reload(), 800);
      }, 1200);
    });
  }
}

function showAccountPanel(user) {
  const panel = document.getElementById('account-panel');
  const authPanel = document.getElementById('auth-panel');
  if (panel) panel.style.display = 'grid';
  if (authPanel) authPanel.style.display = 'none';

  const nameEl = document.querySelector('.account-name');
  const emailEl = document.querySelector('.account-email');
  const avatarEl = document.querySelector('.avatar-img');
  if (nameEl) nameEl.textContent = user.name;
  if (emailEl) emailEl.textContent = user.email;
  if (avatarEl) avatarEl.textContent = user.name.charAt(0).toUpperCase();

  initAccountNav();
  renderOrders();
  renderWishlist();
  initProfileForm(user);
}

function initAccountNav() {
  document.querySelectorAll('.account-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.account-nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const section = item.dataset.section;
      document.querySelectorAll('.account-section').forEach(s => s.classList.toggle('hidden', s.id !== `section-${section}`));
    });
  });
  document.querySelector('.account-nav-item')?.classList.add('active');
  document.querySelector('.account-section')?.classList.remove('hidden');
}

function renderOrders() {
  const container = document.getElementById('orders-list');
  if (!container) return;
  const orders = JSON.parse(localStorage.getItem('luxe_orders') || '[]');
  if (orders.length === 0) {
    container.innerHTML = `<div class="empty-state"><i class="fas fa-box-open"></i><h3>No orders yet</h3><p>Your orders will appear here after you make a purchase.</p><a href="shop.html" class="btn btn-primary mt-2">Start Shopping</a></div>`;
    return;
  }
  container.innerHTML = orders.reverse().map(order => `
    <div class="order-card">
      <div class="order-card-header">
        <div>
          <div class="order-id">#${order.id}</div>
          <div style="font-size:12px;color:var(--text-light)">${new Date(order.date).toLocaleDateString('en-US', {year:'numeric',month:'long',day:'numeric'})}</div>
        </div>
        <span class="order-status ${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
      </div>
      <div class="order-card-body">
        ${order.items.map(item => `<div style="display:flex;gap:12px;align-items:center;margin-bottom:8px">
          <img src="${item.image}" style="width:44px;height:54px;object-fit:cover;border-radius:4px" onerror="this.src='https://placehold.co/44x54/e8e8e8/555?text=Item'">
          <div><div style="font-size:13px;font-weight:600">${item.name}</div><div style="font-size:11px;color:var(--text-light)">${item.size} / ${item.color} × ${item.qty}</div></div>
          <div style="margin-left:auto;font-size:13px;font-weight:700">${formatPrice(item.price * item.qty)}</div>
        </div>`).join('')}
        <div style="border-top:1px solid var(--border);padding-top:12px;margin-top:4px;display:flex;justify-content:space-between;font-size:14px;font-weight:700">
          <span>Total</span><span>${formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function renderWishlist() {
  const container = document.getElementById('wishlist-grid');
  if (!container) return;
  const ids = Wishlist.get();
  if (ids.length === 0) {
    container.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="far fa-heart"></i><h3>Your wishlist is empty</h3><p>Save items you love to buy later.</p><a href="shop.html" class="btn btn-primary mt-2">Browse Products</a></div>`;
    return;
  }
  const products = LuxeData.products.filter(p => ids.includes(p.id));
  container.innerHTML = products.map(p => `
    <div class="product-card">
      <div class="product-card-img">
        <a href="product.html?id=${p.id}"><img src="${p.images[0]}" alt="${p.name}" onerror="this.src='https://placehold.co/300x400/e8e8e8/555?text=Product'"></a>
      </div>
      <div class="product-card-info">
        <div class="product-card-name">${p.name}</div>
        <div class="product-card-price"><span class="price-current">${formatPrice(p.price)}</span></div>
      </div>
      <div class="product-card-footer" style="display:flex;gap:8px;padding:0 16px 16px">
        <a href="product.html?id=${p.id}" class="btn btn-primary" style="flex:1;justify-content:center;font-size:12px;padding:8px"><i class="fas fa-shopping-bag"></i> Add to Cart</a>
        <button class="btn btn-outline" style="padding:8px 12px" onclick="removeFromWishlist(${p.id},this.closest('.product-card'))"><i class="fas fa-times"></i></button>
      </div>
    </div>
  `).join('');
}

function removeFromWishlist(id, card) {
  Wishlist.toggle(id);
  card?.remove();
  const container = document.getElementById('wishlist-grid');
  if (container && container.querySelectorAll('.product-card').length === 0) renderWishlist();
}

function initProfileForm(user) {
  const form = document.getElementById('profile-form');
  if (!form) return;
  document.getElementById('profile-name').value = user.name || '';
  document.getElementById('profile-email').value = user.email || '';
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const updated = { ...user, name: document.getElementById('profile-name').value, email: document.getElementById('profile-email').value };
    Auth.save(updated);
    showToast('Profile updated successfully!', 'success');
  });
}

function showAuthPanel() {
  const panel = document.getElementById('account-panel');
  const authPanel = document.getElementById('auth-panel');
  if (panel) panel.style.display = 'none';
  if (authPanel) authPanel.style.display = 'block';
}

function logout() {
  Auth.logout();
  showToast('Logged out successfully.', 'info');
  setTimeout(() => location.reload(), 600);
}
