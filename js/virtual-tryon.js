/* =============================================
   LUXE THREADS - Virtual Try-On (Canvas)
   ============================================= */

let userPhoto = null;
let clothingImg = null;
let canvas, ctx;
let overlay = { x: 0, y: 0, w: 200, h: 300, opacity: 0.85 };
let isDragging = false;
let isResizing = false;
let dragStart = { x: 0, y: 0 };
let resizeStart = { w: 0, h: 0, mx: 0, my: 0 };
let selectedProductId = null;
const HANDLE_SIZE = 10;

document.addEventListener('DOMContentLoaded', () => {
  canvas = document.getElementById('tryon-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));
  if (id) {
    selectedProductId = id;
    selectClothing(id);
  }

  renderClothingGrid();
  initUploadArea();
  initCameraOption();
  initCanvasEvents();
  initToolbar();
});

function renderClothingGrid() {
  const grid = document.getElementById('clothing-grid');
  if (!grid) return;
  grid.innerHTML = LuxeData.products.slice(0, 8).map(p => `
    <div class="clothing-thumb ${selectedProductId === p.id ? 'active' : ''}" onclick="selectClothing(${p.id})" title="${p.name}">
      <img src="${p.images[0]}" alt="${p.name}" onerror="this.src='https://placehold.co/120x160/e8e8e8/555?text=${encodeURIComponent(p.name.split(' ')[0])}'">
    </div>
  `).join('');
}

function selectClothing(id) {
  selectedProductId = id;
  document.querySelectorAll('.clothing-thumb').forEach((el, idx) => {
    el.classList.toggle('active', LuxeData.products[idx]?.id === id);
  });
  const product = LuxeData.products.find(p => p.id === id);
  if (!product) return;
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    clothingImg = img;
    if (userPhoto) {
      centerOverlay();
      render();
    }
    showToast(`Selected: ${product.name}`, 'info');
  };
  img.onerror = () => {
    createPlaceholderClothing(product.name, product.colors[0]?.code || '#c9a84c');
  };
  img.src = product.images[0];
  const nameEl = document.getElementById('selected-item-name');
  if (nameEl) nameEl.textContent = product.name;
}

function createPlaceholderClothing(name, color) {
  const offCanvas = document.createElement('canvas');
  offCanvas.width = 200; offCanvas.height = 280;
  const offCtx = offCanvas.getContext('2d');
  offCtx.fillStyle = color;
  offCtx.fillRect(20, 0, 160, 200);
  offCtx.fillRect(0, 30, 20, 120);
  offCtx.fillRect(180, 30, 20, 120);
  offCtx.fillStyle = 'rgba(255,255,255,0.3)';
  offCtx.font = 'bold 14px Poppins,sans-serif';
  offCtx.textAlign = 'center';
  offCtx.fillText(name.slice(0, 12), 100, 100);
  const tempImg = new Image();
  tempImg.src = offCanvas.toDataURL();
  tempImg.onload = () => {
    clothingImg = tempImg;
    if (userPhoto) { centerOverlay(); render(); }
  };
}

function initUploadArea() {
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('photo-upload');
  if (!uploadArea || !fileInput) return;

  uploadArea.addEventListener('click', () => fileInput.click());
  uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.classList.add('dragover'); });
  uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));
  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault(); uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) loadUserPhoto(file);
  });
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) loadUserPhoto(file);
  });
}

function loadUserPhoto(file) {
  const reader = new FileReader();
  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      userPhoto = img;
      const maxW = Math.min(600, img.width);
      const scale = maxW / img.width;
      canvas.width = maxW;
      canvas.height = img.height * scale;
      centerOverlay();
      render();
      document.getElementById('tryon-placeholder')?.remove();
      document.getElementById('download-btn')?.removeAttribute('disabled');
      document.getElementById('reset-btn')?.removeAttribute('disabled');
      showToast('Photo loaded! Now select a clothing item to try on.', 'success');
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(file);
}

function initCameraOption() {
  const cameraBtn = document.getElementById('camera-btn');
  if (!cameraBtn) return;
  cameraBtn.addEventListener('click', async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream; video.autoplay = true;
      const modal = document.createElement('div');
      modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px';
      const captureBtn = document.createElement('button');
      captureBtn.textContent = '📸 Capture Photo';
      captureBtn.className = 'btn btn-accent btn-lg';
      captureBtn.onclick = () => {
        const temp = document.createElement('canvas');
        temp.width = video.videoWidth; temp.height = video.videoHeight;
        temp.getContext('2d').drawImage(video, 0, 0);
        const img = new Image();
        img.onload = () => {
          userPhoto = img;
          canvas.width = Math.min(600, img.width);
          canvas.height = img.height * (canvas.width / img.width);
          centerOverlay(); render();
          document.getElementById('download-btn')?.removeAttribute('disabled');
          showToast('Photo captured!', 'success');
        };
        img.src = temp.toDataURL();
        stream.getTracks().forEach(t => t.stop());
        modal.remove();
      };
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '✕ Close Camera';
      closeBtn.className = 'btn btn-outline-accent';
      closeBtn.onclick = () => { stream.getTracks().forEach(t => t.stop()); modal.remove(); };
      modal.append(video, captureBtn, closeBtn);
      document.body.appendChild(modal);
    } catch (err) {
      showToast('Could not access camera. Please upload a photo instead.', 'error');
    }
  });
}

function centerOverlay() {
  if (!canvas || !clothingImg) {
    overlay.x = canvas.width / 2 - 100;
    overlay.y = canvas.height * 0.15;
    overlay.w = 200;
    overlay.h = 300;
    return;
  }
  const aspectRatio = clothingImg.height / clothingImg.width;
  overlay.w = Math.round(canvas.width * 0.38);
  overlay.h = Math.round(overlay.w * aspectRatio);
  overlay.x = Math.round((canvas.width - overlay.w) / 2);
  overlay.y = Math.round(canvas.height * 0.12);
}

function initCanvasEvents() {
  if (!canvas) return;

  canvas.addEventListener('mousedown', (e) => {
    const pos = getCanvasPos(e);
    const handle = getResizeHandle();
    if (Math.abs(pos.x - handle.x) <= HANDLE_SIZE && Math.abs(pos.y - handle.y) <= HANDLE_SIZE) {
      isResizing = true;
      resizeStart = { w: overlay.w, h: overlay.h, mx: pos.x, my: pos.y };
    } else if (isInOverlay(pos)) {
      isDragging = true;
      dragStart = { x: pos.x - overlay.x, y: pos.y - overlay.y };
      canvas.style.cursor = 'grabbing';
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    const pos = getCanvasPos(e);
    if (isDragging) {
      overlay.x = pos.x - dragStart.x;
      overlay.y = pos.y - dragStart.y;
      render();
    } else if (isResizing) {
      const dx = pos.x - resizeStart.mx;
      overlay.w = Math.max(60, resizeStart.w + dx);
      overlay.h = Math.max(80, Math.round(overlay.w * (clothingImg ? clothingImg.height / clothingImg.width : 1.5)));
      render();
    } else {
      const handle = getResizeHandle();
      if (Math.abs(pos.x - handle.x) <= HANDLE_SIZE && Math.abs(pos.y - handle.y) <= HANDLE_SIZE) {
        canvas.style.cursor = 'nwse-resize';
      } else if (isInOverlay(pos)) {
        canvas.style.cursor = 'grab';
      } else {
        canvas.style.cursor = 'default';
      }
    }
  });

  const stopAction = () => { isDragging = false; isResizing = false; canvas.style.cursor = 'default'; };
  canvas.addEventListener('mouseup', stopAction);
  canvas.addEventListener('mouseleave', stopAction);

  canvas.addEventListener('touchstart', (e) => { e.preventDefault(); const t = e.touches[0]; const me = { clientX: t.clientX, clientY: t.clientY }; canvas.dispatchEvent(new MouseEvent('mousedown', me)); }, { passive: false });
  canvas.addEventListener('touchmove', (e) => { e.preventDefault(); const t = e.touches[0]; canvas.dispatchEvent(new MouseEvent('mousemove', { clientX: t.clientX, clientY: t.clientY })); }, { passive: false });
  canvas.addEventListener('touchend', stopAction);
}

function initToolbar() {
  const opacitySlider = document.getElementById('opacity-slider');
  if (opacitySlider) {
    opacitySlider.value = overlay.opacity * 100;
    opacitySlider.addEventListener('input', () => { overlay.opacity = parseInt(opacitySlider.value) / 100; render(); });
  }
  const downloadBtn = document.getElementById('download-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      if (!userPhoto) { showToast('Please upload a photo first.', 'warning'); return; }
      renderClean();
      setTimeout(() => {
        const link = document.createElement('a');
        link.download = 'my-luxe-outfit.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        render();
        showToast('Outfit saved!', 'success');
      }, 50);
    });
  }
  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      overlay.x = canvas.width / 2 - 100;
      overlay.y = Math.round(canvas.height * 0.12);
      centerOverlay();
      render();
      showToast('Position reset.', 'info');
    });
  }
  const removePhotoBtn = document.getElementById('remove-photo-btn');
  if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', () => {
      userPhoto = null;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const ph = document.getElementById('canvas-placeholder');
      if (ph) ph.style.display = 'flex';
      showToast('Photo removed.', 'info');
    });
  }
}

function render() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (userPhoto) {
    ctx.drawImage(userPhoto, 0, 0, canvas.width, canvas.height);
  }

  if (clothingImg && userPhoto) {
    ctx.globalAlpha = overlay.opacity;
    ctx.drawImage(clothingImg, overlay.x, overlay.y, overlay.w, overlay.h);
    ctx.globalAlpha = 1;

    ctx.strokeStyle = 'rgba(201,168,76,0.9)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(overlay.x, overlay.y, overlay.w, overlay.h);
    ctx.setLineDash([]);

    const handle = getResizeHandle();
    ctx.fillStyle = 'rgba(201,168,76,1)';
    ctx.fillRect(handle.x - HANDLE_SIZE/2, handle.y - HANDLE_SIZE/2, HANDLE_SIZE, HANDLE_SIZE);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(handle.x - HANDLE_SIZE/2, handle.y - HANDLE_SIZE/2, HANDLE_SIZE, HANDLE_SIZE);

    ctx.fillStyle = 'rgba(201,168,76,0.9)';
    ctx.font = 'bold 11px Poppins,sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('↕↔ Drag to move  ↘ Corner to resize', overlay.x, overlay.y - 8);
  }
}

function renderClean() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (userPhoto) ctx.drawImage(userPhoto, 0, 0, canvas.width, canvas.height);
  if (clothingImg && userPhoto) {
    ctx.globalAlpha = overlay.opacity;
    ctx.drawImage(clothingImg, overlay.x, overlay.y, overlay.w, overlay.h);
    ctx.globalAlpha = 1;
  }
}

function getResizeHandle() {
  return { x: overlay.x + overlay.w, y: overlay.y + overlay.h };
}

function isInOverlay(pos) {
  return pos.x > overlay.x && pos.x < overlay.x + overlay.w && pos.y > overlay.y && pos.y < overlay.y + overlay.h;
}

function getCanvasPos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) * (canvas.width / rect.width),
    y: (e.clientY - rect.top) * (canvas.height / rect.height)
  };
}
