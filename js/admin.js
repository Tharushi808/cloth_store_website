/* =============================================
   LUXE THREADS - Admin Panel Logic
   ============================================= */

const AdminData = {
  getPendingReviews() {
    return [
      { id: 1, product: "Classic Oxford Button-Down", user: "Saman P.", email: "saman@email.com", rating: 5, text: "Excellent quality! The fabric is very comfortable and the stitching is perfect.", date: "2026-05-20", purchase: true },
      { id: 2, product: "Floral Midi Dress", user: "Nathasha W.", email: "nathasha@email.com", rating: 4, text: "Beautiful dress, colors are vibrant. Runs slightly small so size up.", date: "2026-05-21", purchase: true },
      { id: 3, product: "Oversized Graphic Hoodie", user: "Kasun M.", email: "kasun@email.com", rating: 3, text: "Decent quality but delivery took longer than expected.", date: "2026-05-22", purchase: true },
      { id: 4, product: "Signature Blazer", user: "Priya L.", email: "priya@email.com", rating: 5, text: "Stunning blazer. Everyone at the office was impressed. Will definitely reorder.", date: "2026-05-22", purchase: true }
    ];
  },
  getOrders() {
    const stored = JSON.parse(localStorage.getItem('luxe_orders') || '[]');
    const sample = [
      { id: 'LT10000001', date: '2026-05-18', customer: 'Amali F.', email: 'amali@email.com', total: 14350, status: 'delivered', items: 3, payment: 'visa' },
      { id: 'LT10000002', date: '2026-05-19', customer: 'Ruwan K.', email: 'ruwan@email.com', total: 6800, status: 'shipped', items: 1, payment: 'cod' },
      { id: 'LT10000003', date: '2026-05-20', customer: 'Dilini A.', email: 'dilini@email.com', total: 9000, status: 'processing', items: 2, payment: 'koko' },
      { id: 'LT10000004', date: '2026-05-21', customer: 'Nimal S.', email: 'nimal@email.com', total: 2800, status: 'processing', items: 1, payment: 'master' }
    ];
    return [...stored.map(o => ({ id: o.id, date: o.date?.slice(0,10), customer: 'Customer', email: '-', total: o.total, status: o.status, items: o.items?.length || 1, payment: o.payment })), ...sample];
  }
};

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
  initAdminNav();
  renderDashboard();
  renderProductsTable();
  renderPendingReviews();
  renderOrdersTable();
});

function checkAdminAuth() {
  const adminPass = localStorage.getItem('luxe_admin');
  if (!adminPass && !document.getElementById('admin-login-overlay')) return;
  if (!adminPass) {
    const overlay = document.getElementById('admin-login-overlay');
    if (overlay) overlay.style.display = 'flex';
    const form = document.getElementById('admin-login-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const pass = document.getElementById('admin-pass').value;
        if (pass === 'admin123') {
          localStorage.setItem('luxe_admin', 'authenticated');
          overlay.style.display = 'none';
          showToast('Welcome, Admin!', 'success');
        } else {
          showToast('Incorrect password. Try "admin123"', 'error');
        }
      });
    }
  }
}

function initAdminNav() {
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const section = item.dataset.section;
      document.querySelectorAll('.admin-section').forEach(s => s.classList.toggle('hidden', s.id !== `admin-${section}`));
      const h1 = document.querySelector('.admin-header h1');
      if (h1) h1.textContent = item.querySelector('span')?.textContent || 'Dashboard';
    });
  });
}

function renderDashboard() {
  const orders = AdminData.getOrders();
  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('stat-revenue', formatPrice(revenue));
  set('stat-orders', orders.length);
  set('stat-products', LuxeData.products.length);
  set('stat-reviews', AdminData.getPendingReviews().length);
}

function renderProductsTable() {
  const tbody = document.getElementById('products-tbody');
  if (!tbody) return;
  tbody.innerHTML = LuxeData.products.map(p => `
    <tr>
      <td><img src="${p.images[0]}" alt="${p.name}" onerror="this.src='https://placehold.co/44x54/e8e8e8/555?text=P'"></td>
      <td><strong>${p.name}</strong><br><span style="font-size:11px;color:var(--text-light)">${p.subcategory}</span></td>
      <td><span class="badge badge-${p.category === 'office' ? 'primary' : 'success'}">${p.category}</span></td>
      <td>${formatPrice(p.price)}</td>
      <td>${p.reviewCount}</td>
      <td><div class="stars" style="justify-content:flex-start">${renderStarsAdmin(p.rating)}</div></td>
      <td><span class="badge ${p.badge === 'new' ? 'badge-success' : p.badge === 'sale' ? 'badge-error' : 'badge-primary'}">${p.badge || 'none'}</span></td>
      <td>
        <div class="action-btns">
          <button class="action-btn edit" title="Edit Product" onclick="editProduct(${p.id})"><i class="fas fa-edit"></i></button>
          <button class="action-btn delete" title="Delete" onclick="deleteProduct(${p.id})"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderPendingReviews() {
  const tbody = document.getElementById('reviews-tbody');
  if (!tbody) return;
  const reviews = AdminData.getPendingReviews();
  if (reviews.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:32px;color:var(--text-light)">No pending reviews</td></tr>';
    return;
  }
  tbody.innerHTML = reviews.map(r => `
    <tr data-review="${r.id}">
      <td><strong>${r.user}</strong><br><span style="font-size:11px;color:var(--text-light)">${r.email}</span></td>
      <td>${r.product}</td>
      <td><div style="display:flex;gap:2px">${renderStarsAdmin(r.rating)}</div></td>
      <td style="max-width:200px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">"${r.text}"</td>
      <td>${r.date}</td>
      <td>
        <div class="action-btns">
          <button class="action-btn approve" title="Approve" onclick="approveReview(${r.id}, this)"><i class="fas fa-check"></i></button>
          <button class="action-btn delete" title="Reject" onclick="rejectReview(${r.id}, this)"><i class="fas fa-times"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderOrdersTable() {
  const tbody = document.getElementById('orders-tbody');
  if (!tbody) return;
  const orders = AdminData.getOrders();
  tbody.innerHTML = orders.slice(0, 20).map(o => `
    <tr>
      <td><strong>#${o.id}</strong></td>
      <td>${o.customer}<br><span style="font-size:11px;color:var(--text-light)">${o.email}</span></td>
      <td>${o.date?.slice(0,10) || '--'}</td>
      <td>${o.items} item(s)</td>
      <td><strong>${formatPrice(o.total)}</strong></td>
      <td><span style="text-transform:capitalize">${o.payment || '--'}</span></td>
      <td><span class="order-status ${o.status}">${o.status}</span></td>
      <td>
        <select onchange="updateOrderStatus('${o.id}', this.value)" style="padding:4px 8px;border:1px solid var(--border);border-radius:4px;font-size:12px">
          ${['processing','shipped','delivered','cancelled'].map(s => `<option value="${s}" ${s===o.status?'selected':''}>${s}</option>`).join('')}
        </select>
      </td>
    </tr>
  `).join('');
}

function approveReview(id, btn) {
  const row = btn.closest('tr');
  row?.remove();
  showToast('Review approved and published!', 'success');
}

function rejectReview(id, btn) {
  const row = btn.closest('tr');
  row?.remove();
  showToast('Review rejected and removed.', 'info');
}

function editProduct(id) {
  const p = LuxeData.products.find(pr => pr.id === id);
  if (!p) return;
  const body = document.getElementById('product-modal-body');
  if (!body) return;
  body.innerHTML = `
    <div class="form-grid">
      <div class="form-group"><label>Product Name</label><input type="text" value="${p.name}" id="edit-name"></div>
      <div class="form-group"><label>Category</label>
        <select id="edit-category"><option value="casual" ${p.category==='casual'?'selected':''}>Casual</option><option value="office" ${p.category==='office'?'selected':''}>Office</option></select>
      </div>
      <div class="form-group"><label>Price (Rs.)</label><input type="number" value="${p.price}" id="edit-price"></div>
      <div class="form-group"><label>Original Price (Rs.)</label><input type="number" value="${p.originalPrice}" id="edit-original"></div>
      <div class="form-group full"><label>Description</label><textarea id="edit-desc" rows="4">${p.description}</textarea></div>
      <div class="form-group"><label>Material</label><input type="text" value="${p.material}" id="edit-material"></div>
      <div class="form-group"><label>Badge</label>
        <select id="edit-badge"><option value="" ${!p.badge?'selected':''}>None</option><option value="new" ${p.badge==='new'?'selected':''}>New</option><option value="sale" ${p.badge==='sale'?'selected':''}>Sale</option><option value="hot" ${p.badge==='hot'?'selected':''}>Hot</option></select>
      </div>
    </div>`;
  openModal('product-edit-modal');
  document.getElementById('save-product-btn').onclick = () => {
    p.name = document.getElementById('edit-name').value;
    p.category = document.getElementById('edit-category').value;
    p.price = parseInt(document.getElementById('edit-price').value);
    p.description = document.getElementById('edit-desc').value;
    p.badge = document.getElementById('edit-badge').value;
    closeModal('product-edit-modal');
    renderProductsTable();
    showToast('Product updated successfully!', 'success');
  };
}

function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  const idx = LuxeData.products.findIndex(p => p.id === id);
  if (idx !== -1) { LuxeData.products.splice(idx, 1); renderProductsTable(); showToast('Product deleted.', 'info'); }
}

function updateOrderStatus(orderId, status) {
  const orders = JSON.parse(localStorage.getItem('luxe_orders') || '[]');
  const order = orders.find(o => o.id === orderId);
  if (order) { order.status = status; localStorage.setItem('luxe_orders', JSON.stringify(orders)); }
  showToast(`Order #${orderId} status updated to "${status}".`, 'success');
}

function renderStarsAdmin(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<i class="${i <= rating ? 'fas' : 'far'} fa-star" style="color:#f0b429;font-size:11px"></i>`;
  }
  return html;
}

function adminLogout() {
  localStorage.removeItem('luxe_admin');
  window.location.href = 'index.html';
}
