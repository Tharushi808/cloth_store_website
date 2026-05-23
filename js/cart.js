/* =============================================
   LUXE THREADS - Cart Page Logic
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  initPromoCode();
});

function renderCart() {
  const items = Cart.get();
  const container = document.getElementById('cart-items');
  const emptyState = document.getElementById('cart-empty');
  const cartTable = document.getElementById('cart-table');
  const summary = document.getElementById('cart-summary-panel');

  if (!container) return;

  if (items.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    if (cartTable) cartTable.style.display = 'none';
    if (summary) summary.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (cartTable) cartTable.style.display = 'block';
  if (summary) summary.style.display = 'block';

  container.innerHTML = items.map(item => `
    <div class="cart-item" data-key="${item.key}">
      <div class="cart-item-product">
        <a href="product.html?id=${item.id}" class="cart-item-img">
          <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/80x100/e8e8e8/555?text=Item'">
        </a>
        <div class="cart-item-details">
          <a href="product.html?id=${item.id}" class="cart-item-name">${item.name}</a>
          <div class="cart-item-variant">
            ${item.size ? `Size: <strong>${item.size}</strong>` : ''}
            ${item.color ? ` &nbsp;|&nbsp; Color: <strong>${item.color}</strong>` : ''}
          </div>
        </div>
      </div>
      <div class="cart-item-price">${formatPrice(item.price)}</div>
      <div class="cart-item-qty-col">
        <div class="cart-item-qty">
          <button onclick="updateQty('${item.key}', ${item.qty - 1})"><i class="fas fa-minus"></i></button>
          <input type="number" value="${item.qty}" min="1" max="10" onchange="updateQty('${item.key}', parseInt(this.value))">
          <button onclick="updateQty('${item.key}', ${item.qty + 1})"><i class="fas fa-plus"></i></button>
        </div>
      </div>
      <div class="cart-item-total">${formatPrice(item.price * item.qty)}</div>
      <button class="cart-item-remove" onclick="removeItem('${item.key}')" title="Remove item">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `).join('');

  updateSummary();
}

function updateQty(key, qty) {
  Cart.update(key, qty);
  renderCart();
}

function removeItem(key) {
  Cart.remove(key);
  renderCart();
  showToast('Item removed from cart', 'info');
}

let promoDiscount = 0;

const promoCodes = {
  'LUXE20': 20, 'WELCOME10': 10, 'OFFICE15': 15, 'CASUAL25': 25
};

function initPromoCode() {
  const btn = document.getElementById('apply-promo');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const input = document.getElementById('promo-code');
    const code = input.value.trim().toUpperCase();
    if (promoCodes[code]) {
      promoDiscount = promoCodes[code];
      showToast(`Promo code applied! You save ${promoDiscount}%.`, 'success', 'Code Applied');
      updateSummary();
      input.style.borderColor = 'var(--success)';
    } else {
      showToast('Invalid promo code. Try LUXE20 for 20% off!', 'error', 'Invalid Code');
      input.style.borderColor = 'var(--error)';
    }
  });
}

function updateSummary() {
  const items = Cart.get();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = subtotal >= 5000 ? 0 : 350;
  const discount = Math.round(subtotal * promoDiscount / 100);
  const total = subtotal - discount + shipping;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('summary-subtotal', formatPrice(subtotal));
  set('summary-shipping', shipping === 0 ? 'FREE' : formatPrice(shipping));
  set('summary-discount', discount > 0 ? `-${formatPrice(discount)}` : formatPrice(0));
  set('summary-total', formatPrice(total));
  set('summary-count', `${items.reduce((s, i) => s + i.qty, 0)} items`);

  const discountRow = document.getElementById('discount-row');
  if (discountRow) discountRow.style.display = discount > 0 ? 'flex' : 'none';

  const freeShipMsg = document.getElementById('free-ship-msg');
  if (freeShipMsg && subtotal < 5000) {
    freeShipMsg.textContent = `Add ${formatPrice(5000 - subtotal)} more for FREE shipping!`;
    freeShipMsg.style.display = 'block';
  } else if (freeShipMsg) {
    freeShipMsg.textContent = 'You qualify for FREE shipping!';
    freeShipMsg.style.color = 'var(--success)';
  }

  localStorage.setItem('luxe_cart_summary', JSON.stringify({ subtotal, shipping, discount, total, promoDiscount }));
}
