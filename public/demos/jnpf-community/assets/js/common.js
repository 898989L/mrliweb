/* ============================================
   公共脚本
   ============================================ */

// ==================== Toast 提示 ====================
function showToast(message, duration = 2000) {
  const old = document.querySelector('.toast');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), duration);
}

// ==================== 弹窗 ====================
function showModal({ title, content, confirmText = '确定', cancelText = '取消', onConfirm, onCancel }) {
  const old = document.querySelector('.modal-mask');
  if (old) old.remove();

  const mask = document.createElement('div');
  mask.className = 'modal-mask';
  mask.innerHTML = `
    <div class="modal">
      ${title ? `<div class="modal-header">${title}</div>` : ''}
      ${content ? `<div class="modal-body">${content}</div>` : ''}
      <div class="modal-footer">
        ${cancelText ? `<button class="btn" data-action="cancel">${cancelText}</button>` : ''}
        <button class="btn btn-primary" data-action="confirm">${confirmText}</button>
      </div>
    </div>
  `;
  document.body.appendChild(mask);

  const close = () => mask.remove();

  mask.addEventListener('click', e => {
    if (e.target === mask) {
      close();
      onCancel && onCancel();
    }
  });

  const cancelBtn = mask.querySelector('[data-action="cancel"]');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      close();
      onCancel && onCancel();
    });
  }

  mask.querySelector('[data-action="confirm"]').addEventListener('click', () => {
    close();
    onConfirm && onConfirm();
  });
}

// ==================== Tab 高亮 ====================
function highlightCurrentTab() {
  const path = location.pathname.split('/').pop();
  const map = {
    'index.html': 0,
    'profile.html': 1
  };
  const tabs = document.querySelectorAll('.tab-bar .tab-item');
  const idx = map[path];
  if (idx !== undefined && tabs[idx]) {
    tabs.forEach(t => t.classList.remove('active'));
    tabs[idx].classList.add('active');
  }
}

// ==================== Tab 切换 ====================
function bindTabs(containerSelector, onChange) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.querySelectorAll('.tab-item').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      onChange && onChange(tab.dataset.value);
    });
  });
}

// ==================== 多选/单选 ====================
function bindCheckboxGroup(containerSelector, onChange) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.querySelectorAll('.checkbox').forEach(box => {
    box.addEventListener('click', () => {
      box.classList.toggle('active');
      if (onChange) {
        const values = Array.from(container.querySelectorAll('.checkbox.active'))
          .map(el => el.dataset.value);
        onChange(values);
      }
    });
  });
}

// ==================== 表单校验 ====================
function validatePhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone);
}

function validateIdCard(id) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(id);
}

// ==================== 模拟加载数据 ====================
function mockLoad(delay = 800) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

// ==================== 预览模式切换 ====================
function setupPreviewToggle() {
  const btn = document.createElement('div');
  btn.className = 'preview-toggle';
  btn.innerHTML = '📱';
  btn.title = '点击切换：手机框 / 全屏';
  document.body.appendChild(btn);

  btn.addEventListener('click', () => {
    document.body.classList.toggle('fullscreen');
    btn.innerHTML = document.body.classList.contains('fullscreen') ? '🔲' : '📱';
    try {
      localStorage.setItem('previewMode', document.body.classList.contains('fullscreen') ? 'fullscreen' : 'phone');
    } catch (e) {}
  });

  try {
    if (localStorage.getItem('previewMode') === 'fullscreen') {
      document.body.classList.add('fullscreen');
      btn.innerHTML = '🔲';
    }
  } catch (e) {}
}

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
  highlightCurrentTab();
  setupPreviewToggle();
});
