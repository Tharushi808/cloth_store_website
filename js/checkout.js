/* =============================================
   LUXE THREADS - Checkout Logic
   ============================================= */

let currentStep = 1;
let selectedPayment = 'cod';
let selectedDelivery = 'standard';
let selectedInstallment = null;

document.addEventListener('DOMContentLoaded', () => {
  renderCheckoutItems();
  initPaymentMethods();
  initDeliveryOptions();
  initFormNavigation();
  initFormValidation();
});

function renderCheckoutItems() {
  const items = Cart.get();
  const container = document.getElementById('checkout-items');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = '<p style="color:var(--text-light);text-align:center;padding:16px">Your cart is empty.</p>';
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="checkout-order-item">
      <div class="checkout-item-img">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='https://placehold.co/56x70/e8e8e8/555?text=Item'">
        <span class="qty-badge">${item.qty}</span>
      </div>
      <div class="checkout-item-info">
        <div class="name">${item.name}</div>
        <div class="variant">${item.size} / ${item.color}</div>
      </div>
      <div class="checkout-item-price">${formatPrice(item.price * item.qty)}</div>
    </div>
  `).join('');

  updateCheckoutTotals();
}

function updateCheckoutTotals() {
  const saved = JSON.parse(localStorage.getItem('luxe_cart_summary') || 'null');
  const items = Cart.get();
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = saved ? saved.discount : 0;

  const delivery = LuxeData.deliveryOptions.find(d => d.id === selectedDelivery);
  let shipping = 0;
  if (delivery) {
    if (delivery.free_above && subtotal >= delivery.free_above) shipping = 0;
    else shipping = delivery.price;
  }

  const total = subtotal - discount + shipping;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('co-subtotal', formatPrice(subtotal));
  set('co-shipping', shipping === 0 ? 'FREE' : formatPrice(shipping));
  set('co-discount', discount > 0 ? `-${formatPrice(discount)}` : '--');
  set('co-total', formatPrice(total));
}

function initDeliveryOptions() {
  document.querySelectorAll('.delivery-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.delivery-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      selectedDelivery = opt.dataset.delivery;
      updateCheckoutTotals();
    });
  });
}

function initPaymentMethods() {
  document.querySelectorAll('.payment-method').forEach(method => {
    const radio = method.querySelector('input[type="radio"]');
    const clickable = method.querySelector('.payment-method-header');
    const activate = () => {
      document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
      method.classList.add('active');
      selectedPayment = method.dataset.payment;
      if (radio) radio.checked = true;
    };
    if (clickable) clickable.addEventListener('click', activate);
    if (radio) radio.addEventListener('change', activate);
  });
  document.querySelectorAll('.installment-plan').forEach(plan => {
    plan.addEventListener('click', () => {
      document.querySelectorAll('.installment-plan').forEach(p => p.classList.remove('active'));
      plan.classList.add('active');
      selectedInstallment = plan.dataset.months;
    });
  });
}

function initFormNavigation() {
  const nextBtns = document.querySelectorAll('.next-step-btn');
  const backBtns = document.querySelectorAll('.back-step-btn');
  nextBtns.forEach(btn => btn.addEventListener('click', () => nextStep()));
  backBtns.forEach(btn => btn.addEventListener('click', () => prevStep()));
  const placeOrderBtn = document.getElementById('place-order-btn');
  if (placeOrderBtn) placeOrderBtn.addEventListener('click', placeOrder);
}

function nextStep() {
  if (currentStep === 1 && !validateShipping()) return;
  currentStep++;
  updateStepUI();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep() {
  if (currentStep > 1) { currentStep--; updateStepUI(); }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepUI() {
  document.querySelectorAll('.checkout-section[data-step]').forEach(section => {
    section.style.display = parseInt(section.dataset.step) === currentStep ? 'block' : 'none';
  });
  document.querySelectorAll('.checkout-step').forEach((step, i) => {
    const stepNum = i + 1;
    step.classList.toggle('active', stepNum === currentStep);
    step.classList.toggle('done', stepNum < currentStep);
    const circle = step.querySelector('.step-circle');
    if (circle) circle.innerHTML = stepNum < currentStep ? '<i class="fas fa-check"></i>' : stepNum;
  });
  document.querySelectorAll('.step-divider').forEach((div, i) => {
    div.classList.toggle('done', i + 1 < currentStep);
  });
}

function validateShipping() {
  const required = ['ship-first', 'ship-last', 'ship-address', 'ship-city', 'ship-phone'];
  let valid = true;
  required.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (!el.value.trim()) {
      el.style.borderColor = 'var(--error)';
      valid = false;
    } else {
      el.style.borderColor = 'var(--border)';
    }
  });
  if (!valid) showToast('Please fill in all required shipping fields.', 'error', 'Missing Fields');
  return valid;
}

function initFormValidation() {
  ['ship-first','ship-last','ship-address','ship-city','ship-phone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => { if (el.value.trim()) el.style.borderColor = 'var(--border)'; });
  });
  const cardNum = document.getElementById('card-number');
  if (cardNum) {
    cardNum.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 16);
      e.target.value = val.replace(/(.{4})/g, '$1 ').trim();
    });
  }
  const expiry = document.getElementById('card-expiry');
  if (expiry) {
    expiry.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (val.length > 2) val = val.slice(0,2) + '/' + val.slice(2);
      e.target.value = val;
    });
  }
  const cvv = document.getElementById('card-cvv');
  if (cvv) cvv.addEventListener('input', (e) => { e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4); });
}

function placeOrder() {
  if (!['cod'].includes(selectedPayment)) {
    const cardNum = document.getElementById('card-number');
    const expiry = document.getElementById('card-expiry');
    const cvv = document.getElementById('card-cvv');
    const name = document.getElementById('card-name');
    if (!selectedPayment.startsWith('koko') && !selectedPayment.startsWith('mintpay')) {
      if (cardNum && !cardNum.value.replace(/\s/g,'').match(/^\d{16}$/)) {
        showToast('Please enter a valid 16-digit card number.', 'error', 'Invalid Card');
        return;
      }
    }
  }
  const btn = document.getElementById('place-order-btn');
  if (btn) { btn.textContent = 'Processing...'; btn.disabled = true; }
  setTimeout(() => {
    const orderNum = 'LT' + Date.now().toString().slice(-8);
    const orders = JSON.parse(localStorage.getItem('luxe_orders') || '[]');
    orders.push({
      id: orderNum, date: new Date().toISOString(),
      items: Cart.get(), payment: selectedPayment,
      total: Cart.getTotal(), status: 'processing'
    });
    localStorage.setItem('luxe_orders', JSON.stringify(orders));
    Cart.clear();
    document.getElementById('order-number').textContent = `#${orderNum}`;
    currentStep = 4;
    updateStepUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 1800);
}
