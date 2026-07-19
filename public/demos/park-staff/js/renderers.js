/* ============================================
 * 智慧园区员工端 · 二级页 + 路由 + 交互
 * ============================================ */

/* ---------- 状态扩展(由 app.js 在 init 时合并) ---------- */
/* state.subPage, state.subPageParams, state.pageStack */

/* ---------- 页面渲染器注册表 ---------- */
const PAGE_RENDERERS = {};

/* ============================================
 * 工具: Toast / Action Sheet
 * ============================================ */

function sheetContainer() {
  /* 弹层应被约束在手机屏幕内,而不是覆盖整个浏览器窗口 */
  return document.querySelector('.phone-screen') || document.body;
}

function showToast(msg) {
  const old = document.querySelector('.toast');
  if (old) old.remove();
  const div = document.createElement('div');
  div.className = 'toast';
  div.textContent = msg;
  sheetContainer().appendChild(div);
  setTimeout(() => div.remove(), 1800);
}

function openActionSheet({ title, items, onPick }) {
  const old = document.querySelector('.action-sheet');
  if (old) old.remove();
  const sheet = document.createElement('div');
  sheet.className = 'action-sheet';
  sheet.innerHTML = `
    <div class="action-sheet-mask" data-sheet-close></div>
    <div class="action-sheet-panel">
      <div class="action-sheet-title">${title || '请选择'}</div>
      <div class="action-sheet-list">
        ${items.map((it, i) => `
          <div class="action-sheet-item ${it.cls || ''}" data-sheet-pick="${i}">${it.label}</div>
        `).join('')}
        <div class="action-sheet-item cancel" data-sheet-close>取消</div>
      </div>
    </div>
  `;
  sheetContainer().appendChild(sheet);
  sheet.addEventListener('click', (e) => {
    if (e.target.dataset.sheetClose !== undefined) { sheet.remove(); return; }
    const idx = e.target.dataset.sheetPick;
    if (idx !== undefined) {
      const picked = items[+idx];
      sheet.remove();
      onPick && onPick(picked);
    }
  });
}

/* ---------- 年月下拉弹层(utility-dashboard 月份切换) ---------- */
function openMonthPicker({ months, current, onPick }) {
  const old = document.querySelector('.util-month-popup');
  if (old) old.remove();
  /* 按年分组 */
  const grouped = {};
  months.forEach(m => {
    const y = m.month.slice(0, 4);
    if (!grouped[y]) grouped[y] = [];
    grouped[y].push(m);
  });
  const yearKeys = Object.keys(grouped).sort();
  const sections = yearKeys.map(y => `
    <div class="util-month-popup-section">
      <div class="util-month-popup-year">${y} 年</div>
      <div class="util-month-popup-grid">
        ${grouped[y].map(m => {
          const mm = parseInt(m.month.slice(5), 10);
          const active = m.month === current;
          return `<button type="button" class="util-month-popup-item ${active ? 'active' : ''}" data-month-pick="${m.month}">${mm} 月</button>`;
        }).join('')}
      </div>
    </div>
  `).join('');
  const popup = document.createElement('div');
  popup.className = 'util-month-popup';
  popup.innerHTML = `
    <div class="util-month-popup-mask" data-month-close></div>
    <div class="util-month-popup-panel">
      <div class="util-month-popup-header">
        <div class="util-month-popup-title">选择月份</div>
        <div class="util-month-popup-x" data-month-close>×</div>
      </div>
      <div class="util-month-popup-body">${sections}</div>
    </div>
  `;
  sheetContainer().appendChild(popup);
  popup.addEventListener('click', (e) => {
    if (e.target.dataset.monthClose !== undefined) { popup.remove(); return; }
    const pick = e.target.dataset.monthPick;
    if (pick) { popup.remove(); onPick && onPick(pick); }
  });
}

function confirmAction(message) {
  return new Promise((resolve) => {
    const old = document.querySelector('.action-sheet');
    if (old) old.remove();
    const sheet = document.createElement('div');
    sheet.className = 'action-sheet';
    sheet.innerHTML = `
      <div class="action-sheet-mask" data-cancel></div>
      <div class="action-sheet-panel">
        <div class="action-sheet-title" style="margin-top:6px;">${message}</div>
        <div class="action-sheet-list">
          <div class="action-sheet-item danger" data-ok>确定</div>
          <div class="action-sheet-item cancel" data-cancel>取消</div>
        </div>
      </div>
    `;
    sheetContainer().appendChild(sheet);
    sheet.addEventListener('click', (e) => {
      const ok = e.target.dataset.ok !== undefined;
      sheet.remove();
      resolve(ok);
    });
  });
}

function promptText({ title, placeholder, defaultValue = '' }) {
  return new Promise((resolve) => {
    const old = document.querySelector('.action-sheet');
    if (old) old.remove();
    const sheet = document.createElement('div');
    sheet.className = 'action-sheet';
    sheet.innerHTML = `
      <div class="action-sheet-mask" data-cancel></div>
      <div class="action-sheet-panel">
        <div class="action-sheet-title">${title || '请输入'}</div>
        <div style="padding: 0 0 12px;">
          <textarea class="form-textarea" data-input placeholder="${placeholder || ''}" style="min-height: 80px;">${defaultValue}</textarea>
        </div>
        <div class="action-sheet-list">
          <div class="action-sheet-item" data-ok style="background:var(--c-primary);color:#fff;">确定</div>
          <div class="action-sheet-item cancel" data-cancel>取消</div>
        </div>
      </div>
    `;
    sheetContainer().appendChild(sheet);
    sheet.addEventListener('click', (e) => {
      if (e.target.dataset.cancel !== undefined) { sheet.remove(); resolve(null); return; }
      if (e.target.dataset.ok !== undefined) {
        const val = sheet.querySelector('[data-input]').value.trim();
        sheet.remove();
        resolve(val);
      }
    });
  });
}

/* ---------- 录收款弹层(自定义金额弹层,跟催缴弹层风格一致) ---------- */
function openRecordSheet({ bill, onConfirm }) {
  const old = document.querySelector('.action-sheet');
  if (old) old.remove();
  const sheet = document.createElement('div');
  sheet.className = 'action-sheet';
  const owed = bill.owed || 0;
  const half = Math.round(owed / 2);
  const quickAmounts = [owed, half, 5000, 10000].filter((v, i, arr) => v > 0 && arr.indexOf(v) === i);
  sheet.innerHTML = `
    <div class="action-sheet-mask" data-cancel></div>
    <div class="action-sheet-panel">
      <div class="action-sheet-title">录收款</div>
      <div class="record-sheet-bill">
        <div class="record-sheet-bill-name">${bill.company} · ${bill.type}</div>
        <div class="record-sheet-bill-meta">账期 ${bill.period} · 应收 ¥${bill.shouldPay.toLocaleString()}</div>
        <div class="record-sheet-bill-row">
          <span>已收 <b style="color:var(--c-success);">¥${bill.paid.toLocaleString()}</b></span>
          <span>待收 <b style="color:var(--c-danger);">¥${owed.toLocaleString()}</b></span>
        </div>
      </div>
      <div class="record-sheet-amounts">
        ${quickAmounts.map((v, i) => `
          <div class="record-sheet-chip" data-amount="${v}">
            <b>¥${v.toLocaleString()}</b>
            <span>${i === 0 ? '全部' : i === 1 ? '一半' : i === 2 ? '¥5,000' : '¥10,000'}</span>
          </div>
        `).join('')}
      </div>
      <div class="record-sheet-custom">
        <div class="record-sheet-custom-label">自定义金额</div>
        <div class="record-sheet-custom-input">
          <span class="record-sheet-custom-prefix">¥</span>
          <input type="number" inputmode="decimal" data-input placeholder="0.00" min="0" max="${owed}" value="${owed}" />
        </div>
      </div>
      <div class="action-sheet-list">
        <div class="action-sheet-item" data-ok style="background:var(--c-primary);color:#fff;font-weight:600;">确认收款</div>
        <div class="action-sheet-item cancel" data-cancel>取消</div>
      </div>
    </div>
  `;
  sheetContainer().appendChild(sheet);
  const input = sheet.querySelector('[data-input]');
  sheet.querySelectorAll('[data-amount]').forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.amount;
      sheet.querySelectorAll('[data-amount]').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
  sheet.addEventListener('click', (e) => {
    if (e.target.dataset.cancel !== undefined) { sheet.remove(); return; }
    if (e.target.dataset.ok !== undefined) {
      const amt = parseFloat(input.value);
      if (!amt || amt <= 0) { showToast('请输入有效金额'); return; }
      sheet.remove();
      onConfirm(amt);
    }
  });
}

/* ---------- PDF 合同预览(全屏弹层,模拟多页 A4) ---------- */
function openContractPdf({ contract }) {
  const old = document.querySelector('.pdf-viewer');
  if (old) old.remove();
  const wrap = document.createElement('div');
  wrap.className = 'pdf-viewer';
  const c = contract;
  const pagesHtml = Array.from({ length: c.pdf.pages }, (_, i) => i + 1).map(p => buildPdfPage(c, p)).join('');
  wrap.innerHTML = `
    <div class="pdf-viewer-mask" data-close></div>
    <div class="pdf-viewer-panel">
      <div class="pdf-viewer-head">
        <button class="pdf-viewer-close" data-close>×</button>
        <div class="pdf-viewer-name">${c.pdf.fileName}</div>
        <div class="pdf-viewer-pages">${c.pdf.pages} 页</div>
      </div>
      <div class="pdf-viewer-scroll">
        ${pagesHtml}
      </div>
    </div>
  `;
  sheetContainer().appendChild(wrap);
  wrap.addEventListener('click', (e) => {
    if (e.target.dataset.close !== undefined) { wrap.remove(); }
  });
}

function buildPdfPage(c, pageNum) {
  const isFirst = pageNum === 1;
  const isLast = pageNum === c.pdf.pages;
  return `
    <div class="pdf-page">
      <div class="pdf-page-header">合同编号 ${c.code}</div>
      ${isFirst ? `
        <h1 class="pdf-page-title">${c.type}</h1>
        <div class="pdf-page-parties">
          <div class="pdf-page-party">
            <div class="pdf-page-party-label">甲方(出租方)</div>
            <div class="pdf-page-party-name">智慧科技园</div>
          </div>
          <div class="pdf-page-party">
            <div class="pdf-page-party-label">乙方(承租方)</div>
            <div class="pdf-page-party-name">${c.company}</div>
          </div>
        </div>
        <div class="pdf-page-clause">
          <b>第一条 租赁标的</b>
          甲方将位于 ${c.building} 建筑面积约 ${c.area} ㎡的厂房/办公场地(以下简称"该物业")出租给乙方使用。
        </div>
        <div class="pdf-page-clause">
          <b>第二条 租赁期限</b>
          本合同租赁期自 <u>${c.startDate}</u> 起至 <u>${c.endDate}</u> 止,共计 ${Math.round((new Date(c.endDate) - new Date(c.startDate)) / 86400000 / 30)} 个月。
        </div>
        <div class="pdf-page-clause">
          <b>第三条 租金及支付</b>
          租金总额为人民币 <b>¥${c.amount.toLocaleString()}</b>(大写:捌拾陆万元整),付款方式为 <u>${c.payment}</u>。
        </div>
      ` : ''}
      ${pageNum === 2 ? `
        <div class="pdf-page-clause">
          <b>第四条 押金</b>
          乙方应于本合同签订之日起 3 个工作日内向甲方支付押金,押金金额相当于两个月租金。租赁期满且乙方无违约行为的,甲方应在 30 日内无息退还押金。
        </div>
        <div class="pdf-page-clause">
          <b>第五条 水电费及其他费用</b>
          乙方使用该物业产生的水费、电费、燃气费、通讯费、网络费、物业管理费等费用均由乙方自行承担,按月据实结算。
        </div>
        <div class="pdf-page-clause">
          <b>第六条 装修与改造</b>
          乙方如需对该物业进行装修或改造,应事先取得甲方的书面同意。装修及改造费用由乙方自行承担,租赁期满不得拆除或损坏固定装修。
        </div>
        <div class="pdf-page-clause">
          <b>第七条 转租与转让</b>
          未经甲方书面同意,乙方不得将该物业全部或部分转租、转借、转让给第三方,亦不得以任何形式与第三方合作使用。
        </div>
      ` : ''}
      ${pageNum === 3 ? `
        <div class="pdf-page-clause">
          <b>第八条 维修与保养</b>
          乙方应合理使用该物业及其设施,发现损坏应及时通知甲方。因乙方使用不当或人为损坏造成的维修费用,由乙方承担。
        </div>
        <div class="pdf-page-clause">
          <b>第九条 违约责任</b>
          任一方违反本合同约定,守约方有权要求违约方承担违约责任,包括但不限于赔偿因此造成的直接和间接损失。
        </div>
        <div class="pdf-page-clause">
          <b>第十条 合同解除与终止</b>
          (一) 因不可抗力致使合同无法履行的,双方互不承担违约责任;<br/>
          (二) 乙方逾期支付租金超过 30 日的,甲方有权单方解除合同;<br/>
          (三) 合同期满,乙方应在 7 日内将该物业交还甲方。
        </div>
        <div class="pdf-page-clause">
          <b>第十一条 争议解决</b>
          本合同在履行过程中发生的争议,由双方协商解决;协商不成的,提交标的物所在地有管辖权的人民法院诉讼解决。
        </div>
      ` : ''}
      ${isLast ? `
        <div class="pdf-page-clause">
          <b>第十二条 其他约定</b>
          本合同未尽事宜,双方可另行签订补充协议,补充协议与本合同具有同等法律效力。
        </div>
        <div class="pdf-page-sign">
          <div class="pdf-page-sign-block">
            <div class="pdf-page-sign-label">甲方(盖章)</div>
            <div class="pdf-page-sign-line">智慧科技园有限公司</div>
            <div class="pdf-page-sign-line">法定代表人:__________</div>
            <div class="pdf-page-sign-date">日期:____年____月____日</div>
          </div>
          <div class="pdf-page-sign-block">
            <div class="pdf-page-sign-label">乙方(签字)</div>
            <div class="pdf-page-sign-line">${c.company}</div>
            <div class="pdf-page-sign-line">代表人:${c.signer}</div>
            <div class="pdf-page-sign-date">日期:____年____月____日</div>
          </div>
        </div>
      ` : `
        <div class="pdf-page-footer-stub">本合同共 ${c.pdf.pages} 页 · 本页为第 ${pageNum} 页</div>
      `}
      <div class="pdf-page-foot">— 第 ${pageNum} 页 / 共 ${c.pdf.pages} 页 —</div>
    </div>
  `;
}

/* ============================================
 * 子页通用: 头部 sub-bar + 内容
 * ============================================ */

function subPageShell(title, content, rightHtml = '', backHref = null) {
  return `
    <div class="sub-bar">
      <button class="sub-back" data-back data-back-href="${backHref || ''}" aria-label="返回">‹</button>
      <div class="sub-title">${title}</div>
      <div class="sub-right">${rightHtml}</div>
    </div>
    ${content}
  `;
}

function emptyState(text) {
  return `<div class="empty-state"><div class="empty-state-icon">○</div><div class="empty-state-text">${text}</div></div>`;
}

/* ============================================
 * 路由: navigate / back
 * ============================================ */

function navigate(pageId, params = {}) {
  if (!PAGE_RENDERERS[pageId]) {
    showToast(`页面 ${pageId} 未实现`);
    return;
  }
  /* 权限校验: 运营专员 readonlyModules 不可写 */
  const role = ROLES[state.roleId];
  if (role.readonlyModules && role.readonlyModules.length) {
    const writePages = ['workorder-create', 'form-new', 'meeting-book', 'form-leave', 'form-expense', 'form-seal'];
    if (writePages.includes(pageId)) {
      showToast('运营专员无操作权限');
      return;
    }
  }
  /* 真实跳转: 拼 URL 跳到对应 HTML */
  const qs = new URLSearchParams(params).toString();
  window.location.href = `${pageId}.html${qs ? '?' + qs : ''}`;
}

function back(fallbackHref) {
  if (fallbackHref) {
    window.location.href = fallbackHref;
  } else if (document.referrer && document.referrer !== window.location.href) {
    window.history.back();
  } else {
    window.location.href = 'home.html';
  }
}

function renderContent() {
  if (state.subPage) {
    const fn = PAGE_RENDERERS[state.subPage];
    const html = fn ? fn(state.subPageParams) : '';
    const el = document.getElementById('content');
    if (el) el.innerHTML = html;
  }
}

/* ============================================
 * 工具: 获取 RUNTIME-aware 工单/合同/单据
 * ============================================ */

function getWorkorder(id) {
  return WORKORDERS.find(w => w.id === id);
}

function getContract(id) {
  return CONTRACTS.find(c => c.id === id);
}

function getForm(id) {
  return FORMS.find(f => f.id === id);
}

function getInspection(id) {
  return INSPECTIONS.find(i => i.id === id);
}

function getCompany(id) {
  return COMPANIES.find(c => c.id === id);
}

function getBill(id) {
  return BILLS.find(b => b.id === id);
}

function getMeeting(id) {
  return MEETINGS.find(m => m.id === id);
}

function getWOStatus(id) {
  return RUNTIME.workorderOverrides[id] || null;
}

function getCtStatus(id) {
  return RUNTIME.contractOverrides[id] || null;
}

function getFormStatus(id) {
  return RUNTIME.formOverrides[id] || null;
}

/* ============================================
 * M03 巡检
 * ============================================ */

PAGE_RENDERERS['inspection-list'] = (params) => {
  const filter = params.filter || 'all';
  const list = INSPECTIONS.filter(i => {
    if (filter === 'all') return true;
    if (filter === 'pending') return i.status === 'pending';
    if (filter === 'done') return i.status === 'done';
    if (filter === 'overdue') return i.status === 'overdue';
    return true;
  });

  const content = `
    <div class="filter-bar">
      ${[['all','全部'],['pending','待执行'],['overdue','已逾期'],['done','已完成']]
        .map(([k, l]) => `<button class="filter-item ${filter === k ? 'active' : ''}" data-page="inspection-list" data-params='{"filter":"${k}"}'>${l}</button>`).join('')}
    </div>
    <div class="list-summary">共 ${list.length} 条任务</div>
    <div class="list-page">
      ${list.length === 0 ? emptyState('暂无该类任务') : list.map(i => `
        <div class="list-card" data-page="inspection-detail" data-params='{"id":"${i.id}"}'>
          <div class="list-card-header">
            <div class="list-card-title">
              <span class="list-card-title-text">${i.type} · ${i.location}</span>
            </div>
            <span class="list-card-status s-${i.status === 'overdue' ? 'overdue' : i.status === 'done' ? 'done' : 'inprogress'}">${i.status === 'overdue' ? '已逾期' : i.status === 'done' ? '已完成' : '待执行'}</span>
          </div>
          <div class="list-card-meta">
            <span>${i.code}</span><span>${i.planTime}</span><span>${i.points} 项</span>
          </div>
          <div class="list-card-row">巡检人: ${i.inspector} ${i.abnormalCount != null ? `· 异常 ${i.abnormalCount} 项` : ''}</div>
        </div>
      `).join('')}
    </div>
  `;
  return subPageShell('巡检任务', content, `<button class="sub-action" data-page="inspection-create">+ 新建</button>`);
};

PAGE_RENDERERS['inspection-detail'] = (params) => {
  const t = getInspection(params.id);
  if (!t) return subPageShell('任务详情', emptyState('任务不存在'));
  const wo = t.status === 'overdue' ? `<span class="list-card-status s-overdue">已逾期</span>` : t.status === 'done' ? `<span class="list-card-status s-done">已完成</span>` : `<span class="list-card-status s-inprogress">待执行</span>`;
  const actionBtn = t.status === 'done' ? '' : `<button class="btn btn-primary btn-block" data-page="inspection-execute" data-params='{"id":"${t.id}"}'>开始执行 / 录入结果</button>`;

  const content = `
    <div class="detail-hero">
      <div class="detail-hero-title">${t.type} · ${t.location}</div>
      <div class="detail-hero-meta">${t.code} · 计划 ${t.planTime}</div>
      ${wo}
    </div>
    <div class="detail-section">
      <div class="detail-section-title">基本信息</div>
      <div class="detail-row"><div class="detail-label">巡检人</div><div class="detail-value">${t.inspector}</div></div>
      <div class="detail-row"><div class="detail-label">巡检项数</div><div class="detail-value">${t.points} 项</div></div>
      <div class="detail-row"><div class="detail-label">完成情况</div><div class="detail-value">${t.doneCount}/${t.points} ${t.abnormalCount ? `· 异常 ${t.abnormalCount}` : ''}</div></div>
    </div>
    ${t.items.length ? `
      <div class="detail-section">
        <div class="detail-section-title">检查项</div>
        ${t.items.map((it, idx) => `
          <div class="detail-row"><div class="detail-label">${idx + 1}. ${it.name}</div><div class="detail-value">${it.need.join(' / ')}</div></div>
        `).join('')}
      </div>
    ` : ''}
    <div style="height: 76px"></div>
    <div class="footer-actions">${actionBtn}</div>
  `;
  return subPageShell('巡检任务详情', content);
};

PAGE_RENDERERS['inspection-execute'] = (params) => {
  const t = getInspection(params.id);
  if (!t) return subPageShell('执行巡检', emptyState('任务不存在'));
  const results = RUNTIME.inspectionItemResults[t.id] || {};

  const content = `
    <div class="simple-hero">
      <div class="simple-hero-title">${t.type} · ${t.location}</div>
      <div class="simple-hero-value">${t.items.length} 项检查</div>
    </div>
    <div class="form-section-title">逐项录入</div>
    ${t.items.map((it, idx) => {
      const r = results[idx] || {};
      return `
        <div class="check-item ${r.result === 'normal' ? 'done' : r.result === 'abnormal' ? 'abnormal' : ''}" data-insp-item="${idx}">
          <div class="check-item-head">
            <div class="check-item-name">${idx + 1}. ${it.name}</div>
            <div class="check-item-need">${it.need.join(' / ')}</div>
          </div>
          <div class="check-result-row">
            <div class="result-chip ${r.result === 'normal' ? 'active normal' : ''}" data-insp-result="${idx}|normal">正常</div>
            <div class="result-chip ${r.result === 'abnormal' ? 'active abnormal' : ''}" data-insp-result="${idx}|abnormal">异常</div>
          </div>
          ${it.need.includes('照片') ? `
            <div class="check-result-row">
              <div class="form-upload-slot ${r.photo ? 'filled' : ''}" data-insp-photo="${idx}">${r.photo ? '已上传' : '+'}</div>
            </div>
          ` : ''}
          <textarea class="form-textarea" data-insp-remark="${idx}" placeholder="备注(选填)" style="min-height: 48px; font-size: var(--fs-sm);">${r.remark || ''}</textarea>
        </div>
      `;
    }).join('')}
    <div style="padding: 12px;">
      <button class="btn btn-primary btn-block" data-insp-submit="${t.id}">提交巡检结果</button>
    </div>
    <div style="height: 16px"></div>
  `;
  return subPageShell('执行巡检', content);
};

PAGE_RENDERERS['inspection-create'] = (params) => {
  const content = `
    <div class="form-page">
      <div class="form-section-title">基本信息</div>
      <div class="form-card">
        <div class="form-row">
          <div class="form-label required">巡检类型</div>
          <div class="form-control">
            <div class="form-chip-group">
              <div class="form-chip active">日常安全</div>
              <div class="form-chip">维保</div>
              <div class="form-chip">保安</div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-label required">巡检位置</div>
          <div class="form-control"><input class="form-input" placeholder="如: B 栋 3 层" /></div>
        </div>
        <div class="form-row">
          <div class="form-label required">计划时间</div>
          <div class="form-control"><input class="form-input" placeholder="2026-06-04 10:00" /></div>
        </div>
        <div class="form-row column">
          <div class="form-label">备注</div>
          <div class="form-control"><textarea class="form-textarea" placeholder="选填"></textarea></div>
        </div>
      </div>
      <div style="padding: 12px;">
        <button class="btn btn-primary btn-block" data-insp-create-submit>提交创建</button>
      </div>
    </div>
  `;
  return subPageShell('新建巡检', content);
};

/* ============================================
 * M03-3 巡检结果查看(经理/运营专员)
 * 维度: 日/周/月;指标: 完成率/异常数/按人排名/按区域汇总
 * ============================================ */

PAGE_RENDERERS['inspection-summary'] = (params) => {
  const role = ROLES[state.roleId];
  if (role.id !== 'manager' && role.id !== 'operator') {
    return subPageShell('巡检结果', `<div class="coming-soon"><div class="coming-soon-icon">🔒</div><div class="coming-soon-text">仅经理/运营专员可查看巡检结果汇总</div></div>`);
  }

  const range = params.range || 'day';
  const dayMs = 86400000;
  const now = new Date('2026-06-03T12:00:00');
  const ranges = {
    day:  { label: '今日', start: new Date('2026-06-03T00:00:00') },
    week: { label: '本周', start: new Date(now.getTime() - 6 * dayMs) },
    month:{ label: '本月', start: new Date('2026-06-01T00:00:00') }
  };
  const cur = ranges[range];

  const inRange = INSPECTIONS.filter(i => new Date(i.planTime) >= cur.start);
  const total = inRange.length;
  const done = inRange.filter(i => i.status === 'done');
  const doneCount = done.length;
  const totalPoints = inRange.reduce((s, i) => s + i.points, 0);
  const donePoints = inRange.reduce((s, i) => s + (i.doneCount || 0), 0);
  const abnormalCount = inRange.reduce((s, i) => s + (i.abnormalCount || 0), 0);
  const completeRate = total ? Math.round(doneCount / total * 100) : 0;

  /* 按巡检员聚合 */
  const byInspector = {};
  inRange.forEach(i => {
    if (!byInspector[i.inspector]) byInspector[i.inspector] = { total: 0, done: 0, abnormal: 0 };
    byInspector[i.inspector].total++;
    if (i.status === 'done') byInspector[i.inspector].done++;
    byInspector[i.inspector].abnormal += (i.abnormalCount || 0);
  });
  const rank = Object.entries(byInspector)
    .map(([name, v]) => ({ name, ...v, rate: v.total ? Math.round(v.done / v.total * 100) : 0 }))
    .sort((a, b) => b.done - a.done || a.abnormal - b.abnormal);

  /* 按区域聚合(楼栋首字) */
  const byArea = {};
  inRange.forEach(i => {
    const area = (i.location.match(/[A-Z]\s*栋/) || [''])[0] || '其他';
    if (!byArea[area]) byArea[area] = { total: 0, done: 0, abnormal: 0 };
    byArea[area].total++;
    if (i.status === 'done') byArea[area].done++;
    byArea[area].abnormal += (i.abnormalCount || 0);
  });

  const content = `
    <div class="filter-bar">
      ${[['day','今日'],['week','本周'],['month','本月']]
        .map(([k, l]) => `<button class="filter-item ${range === k ? 'active' : ''}" data-page="inspection-summary" data-params='{"range":"${k}"}'>${l}</button>`).join('')}
    </div>

    <div class="big-stat-card">
      <div class="big-stat-label">${cur.label}巡检完成率</div>
      <div class="big-stat-value">${completeRate}<span class="big-stat-unit">%</span></div>
      <div class="big-stat-delta">${doneCount}/${total} 任务 · 累计 ${donePoints}/${totalPoints} 项 · 异常 ${abnormalCount}</div>
    </div>

    <div class="mini-stat-row">
      <div class="mini-stat">
        <div class="mini-stat-value success">${doneCount}</div>
        <div class="mini-stat-label">已完成</div>
      </div>
      <div class="mini-stat">
        <div class="mini-stat-value warning">${total - doneCount}</div>
        <div class="mini-stat-label">未完成</div>
      </div>
      <div class="mini-stat">
        <div class="mini-stat-value danger">${abnormalCount}</div>
        <div class="mini-stat-label">异常项</div>
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section-title">按巡检员排名</div>
      ${rank.length === 0 ? `<div style="color:var(--c-text-tip); text-align:center; padding:12px;">暂无数据</div>` : rank.map((r, i) => `
        <div class="list-card" style="margin-bottom:6px;" data-page="inspection-list">
          <div class="list-card-header">
            <div class="list-card-title"><span class="list-card-title-text">${i + 1}. ${r.name}</span></div>
            <span class="list-card-status ${r.abnormal > 0 ? 's-待派单' : 's-已关单'}">${r.rate}%</span>
          </div>
          <div class="list-card-row">完成 ${r.done}/${r.total} 任务 · 异常 ${r.abnormal} 项</div>
          <div class="progress" style="margin-top:6px;"><div class="progress-fill ${r.abnormal > 2 ? 'danger' : r.abnormal > 0 ? 'warning' : 'success'}" style="width:${r.rate}%;"></div></div>
        </div>
      `).join('')}
    </div>

    <div class="detail-section">
      <div class="detail-section-title">按区域汇总</div>
      ${Object.keys(byArea).length === 0 ? `<div style="color:var(--c-text-tip); text-align:center; padding:12px;">暂无数据</div>` : Object.entries(byArea).map(([area, v]) => {
        const rate = v.total ? Math.round(v.done / v.total * 100) : 0;
        return `
          <div style="padding:8px 0; border-bottom:1px solid var(--c-line-soft);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <div style="font-weight:600; color:var(--c-text);">${area || '其他'}</div>
              <div style="font-size:var(--fs-sm); color:var(--c-text-sub);">完成 ${v.done}/${v.total} · 异常 ${v.abnormal}</div>
            </div>
            <div class="progress"><div class="progress-fill ${v.abnormal > 0 ? 'warning' : 'success'}" style="width:${rate}%;"></div></div>
          </div>
        `;
      }).join('')}
    </div>

    <div class="detail-section">
      <div class="detail-section-title">${cur.label}巡检记录</div>
      ${inRange.length === 0 ? emptyState('该时段暂无巡检记录') : inRange.map(i => `
        <div class="list-card" data-page="inspection-detail" data-params='{"id":"${i.id}"}'>
          <div class="list-card-header">
            <div class="list-card-title"><span class="list-card-title-text">${i.type} · ${i.location}</span></div>
            <span class="list-card-status s-${i.status === 'overdue' ? 'overdue' : i.status === 'done' ? 'done' : 'inprogress'}">${i.status === 'overdue' ? '已逾期' : i.status === 'done' ? '已完成' : '待执行'}</span>
          </div>
          <div class="list-card-meta">
            <span>${i.code}</span><span>${i.planTime.split(' ')[1] || i.planTime}</span><span>${i.inspector}</span>
          </div>
          ${i.abnormalCount ? `<div class="list-card-row" style="color:var(--c-danger);">异常 ${i.abnormalCount} 项</div>` : ''}
        </div>
      `).join('')}
    </div>
    <div style="height: 16px"></div>
  `;
  return subPageShell('巡检结果', content);
};

/* ============================================
 * M04 报修工单
 * ============================================ */

PAGE_RENDERERS['workorder-list'] = (params) => {
  const filter = params.filter || 'all';
  const list = WORKORDERS.filter(w => {
    const cur = getWOStatus(w.id) || w.status;
    if (filter === 'all') return true;
    if (filter === 'pending') return cur === '待派单' || cur === '待接单';
    if (filter === 'progress') return cur === '处理中';
    if (filter === 'done') return cur === '已关单';
    return true;
  });

  const content = `
    <div class="filter-bar">
      ${[['all','全部'],['pending','待处理'],['progress','处理中'],['done','已关单']]
        .map(([k, l]) => `<button class="filter-item ${filter === k ? 'active' : ''}" data-page="workorder-list" data-params='{"filter":"${k}"}'>${l}</button>`).join('')}
    </div>
    <div class="list-summary">共 ${list.length} 单</div>
    <div class="list-page">
      ${list.length === 0 ? emptyState('暂无该类工单') : list.map(w => {
        const cur = getWOStatus(w.id) || w.status;
        const urgent = w.urgent === 'high' ? '<span class="urgent-tag urgent-high">紧急</span>' : w.urgent === 'mid' ? '<span class="urgent-tag urgent-mid">中</span>' : '';
        return `
          <div class="list-card" data-page="workorder-detail" data-params='{"id":"${w.id}"}'>
            <div class="list-card-header">
              <div class="list-card-title">${urgent}<span class="list-card-title-text">${w.type} · ${w.company}</span></div>
              <span class="list-card-status s-${cur}">${cur}</span>
            </div>
            <div class="list-card-meta">
              <span>${w.code}</span><span>${w.location}</span><span>${w.createTime.split(' ')[1] || w.createTime}</span>
            </div>
            <div class="list-card-row">${w.desc}</div>
            <div class="list-card-footer">
              <span>${w.assignee ? '处理人: ' + w.assignee : '尚未派单'}</span>
              <span>${w.slaRemain}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  return subPageShell('报修工单', content, `<button class="sub-action" data-page="workorder-create">+ 报修</button>`);
};

PAGE_RENDERERS['workorder-detail'] = (params) => {
  const w = getWorkorder(params.id);
  if (!w) return subPageShell('工单详情', emptyState('工单不存在'));
  const cur = getWOStatus(w.id) || w.status;
  const role = ROLES[state.roleId];

  /* 根据状态 + 角色计算可执行操作 */
  const actions = [];
  const isAssignee = w.assignee && w.assignee.includes(ROLES[state.roleId].user);
  const isReadonly = role.readonlyModules && role.readonlyModules.includes('M04');

  if (!isReadonly) {
    if (cur === '待派单' && (state.roleId === 'manager' || state.roleId === 'operator')) {
      actions.push({ label: '派单', act: 'assign', cls: 'btn-primary' });
    }
    if (cur === '待接单' && (isAssignee || state.roleId === 'inspector' || state.roleId === 'staff')) {
      actions.push({ label: '接单', act: 'accept', cls: 'btn-primary' });
    }
    if (cur === '处理中' && isAssignee) {
      actions.push({ label: '完成处理', act: 'finish', cls: 'btn-primary' });
      actions.push({ label: '转单', act: 'transfer', cls: 'btn-default' });
    }
    if (cur === '处理中' && state.roleId !== 'staff') {
      actions.push({ label: '催办', act: 'urge', cls: 'btn-default' });
    }
    if (cur === '已关单' && w.rating == null && state.roleId !== 'staff') {
      /* 业主侧回访才打分,这里模拟 */
    }
  }

  const footer = actions.length ? `<div class="footer-actions">${actions.map(a => `<button class="btn ${a.cls}" data-wo-action="${a.act}" data-wo-id="${w.id}">${a.label}</button>`).join('')}</div>` : '';

  const content = `
    <div class="detail-hero">
      <div class="detail-hero-status">${w.urgent === 'high' ? '紧急' : w.urgent === 'mid' ? '中' : '一般'}</div>
      <div class="detail-hero-title">${w.type} · ${w.company}</div>
      <div class="detail-hero-meta">${w.code} · 创建于 ${w.createTime}</div>
      <div style="margin-top:10px;"><span class="list-card-status s-${cur}">${cur}</span></div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">报修信息</div>
      <div class="detail-row"><div class="detail-label">报修人</div><div class="detail-value">${w.reporter} ${w.phone !== '内部' ? '· ' + w.phone : ''}</div></div>
      <div class="detail-row"><div class="detail-label">位置</div><div class="detail-value">${w.location}</div></div>
      <div class="detail-row"><div class="detail-label">来源</div><div class="detail-value">${w.source === 'tenant' ? '租户报修' : '巡检异常'}</div></div>
      <div class="detail-row"><div class="detail-label">SLA</div><div class="detail-value">${w.slaRemain}</div></div>
      <div class="detail-row"><div class="detail-label">处理人</div><div class="detail-value">${w.assignee || '尚未派单'}</div></div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">问题描述</div>
      <div class="detail-text">${w.desc}</div>
      ${w.photos ? `<div style="margin-top:10px; font-size: var(--fs-sm); color: var(--c-primary);">📷 ${w.photos} 张现场照片</div>` : ''}
    </div>
    <div class="detail-section">
      <div class="detail-section-title">处理流水</div>
      <div class="timeline">
        ${w.history.map(h => `
          <div class="timeline-item done">
            <div class="timeline-time">${h.time}</div>
            <div class="timeline-title">${h.actor} · ${h.action}</div>
            <div class="timeline-desc">${h.desc || ''}</div>
          </div>
        `).join('')}
      </div>
    </div>
    ${w.rating ? `
      <div class="detail-section">
        <div class="detail-section-title">回访评价</div>
        <div class="detail-text">${'★'.repeat(w.rating)}${'☆'.repeat(5 - w.rating)} · 处理及时</div>
      </div>
    ` : ''}
    <div style="height: 76px"></div>
    ${footer}
  `;
  return subPageShell('工单详情', content);
};

PAGE_RENDERERS['workorder-create'] = (params) => {
  const role = ROLES[state.roleId];
  const companies = state.roleId === 'staff' ? ['本部门'] : COMPANIES.slice(0, 4);
  const content = `
    <div class="form-page">
      <div class="form-section-title">报修信息</div>
      <div class="form-card">
        <div class="form-row">
          <div class="form-label required">报修单位</div>
          <div class="form-control">
            <div class="form-chip-group">
              ${companies.map((c, i) => `<div class="form-chip ${i === 0 ? 'active' : ''}">${typeof c === 'string' ? c : c.name}</div>`).join('')}
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-label required">位置</div>
          <div class="form-control"><input class="form-input" placeholder="如: A 栋 5 层 502" /></div>
        </div>
        <div class="form-row">
          <div class="form-label required">类型</div>
          <div class="form-control">
            <div class="form-chip-group">
              <div class="form-chip active">空调</div><div class="form-chip">水电</div><div class="form-chip">门窗</div><div class="form-chip">弱电</div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-label">紧急度</div>
          <div class="form-control">
            <div class="form-chip-group">
              <div class="form-chip">一般</div><div class="form-chip active">中</div><div class="form-chip">紧急</div>
            </div>
          </div>
        </div>
        <div class="form-row column">
          <div class="form-label required">问题描述</div>
          <div class="form-control"><textarea class="form-textarea" placeholder="请详细描述故障现象、影响范围..."></textarea></div>
        </div>
        <div class="form-row column">
          <div class="form-label">现场照片</div>
          <div class="form-control">
            <div class="form-uploader">
              <div class="form-upload-slot">+</div>
              <div class="form-upload-slot">+</div>
            </div>
          </div>
        </div>
      </div>
      <div style="padding: 12px;">
        <button class="btn btn-primary btn-block" data-wo-create-submit>提交工单</button>
      </div>
    </div>
  `;
  return subPageShell('新建工单', content);
};

/* ============================================
 * M05 费用
 * ============================================ */

PAGE_RENDERERS['fee-dashboard'] = (params) => {
  const selMonth = params.month || (FEE.monthly[FEE.monthly.length - 1].month);
  const isCurrent = selMonth === FEE.monthly[FEE.monthly.length - 1].month;
  const monthRec = FEE.monthly.find(m => m.month === selMonth) || FEE.monthly[FEE.monthly.length - 1];
  const totalShould = monthRec.shouldPay;
  const totalPaid = monthRec.paid;
  const totalOwed = monthRec.owed;
  const rate = totalShould > 0 ? Math.round(totalPaid / totalShould * 100) : 0;
  const triggerLabel = `${selMonth.slice(0, 4)} 年 ${parseInt(selMonth.slice(5), 10)} 月`;

  /* 各企业汇总(仅本月有 BILLS 细数据,历史月按总额占比缩放) */
  let companyList = [];
  if (isCurrent) {
    const map = {};
    BILLS.forEach(b => {
      if (!map[b.companyId]) map[b.companyId] = {
        companyId: b.companyId, name: b.company,
        shouldPay: 0, paid: 0, owed: 0
      };
      const acc = map[b.companyId];
      acc.shouldPay += b.shouldPay;
      acc.paid += b.paid;
      acc.owed += b.owed;
    });
    companyList = Object.values(map);
  }

  /* 缴费情况 filter(全部/欠费/已结清) */
  const feeFilter = params.filter || 'all';

  const content = `
    <button class="util-month-trigger" id="monthPickerTrigger" type="button">
      <span class="util-month-trigger-text">${triggerLabel}</span>
      <span class="util-month-trigger-caret">▾</span>
    </button>

    <div class="fee-balance-card">
      <div class="fee-balance-title">${isCurrent ? '本月' : selMonth} 应收${isCurrent ? ' · ' + companyList.length + ' 家企业' : ''}</div>
      <div class="fee-balance-total">¥${totalShould.toLocaleString()}</div>
      <div class="fee-balance-grid">
        <div class="fee-balance-col">
          <div class="fee-balance-col-label">已收</div>
          <div class="fee-balance-col-val success">¥${totalPaid.toLocaleString()}</div>
          <div class="fee-balance-col-rate">${rate}%</div>
        </div>
        <div class="fee-balance-col">
          <div class="fee-balance-col-label">待收</div>
          <div class="fee-balance-col-val ${totalOwed > 0 ? 'danger' : ''}">¥${totalOwed.toLocaleString()}</div>
          <div class="fee-balance-col-rate">${100 - rate}%</div>
        </div>
        <div class="fee-balance-col">
          <div class="fee-balance-col-label">收缴率</div>
          <div class="fee-balance-col-val">${rate}<span class="fee-balance-col-unit">%</span></div>
          <div class="fee-balance-col-rate">${rate >= 80 ? '良好' : rate >= 70 ? '正常' : '待提升'}</div>
        </div>
      </div>
    </div>

    ${isCurrent ? `
      <div class="page-section">
        <div class="section-header">
          <div class="section-title">各企业缴费情况</div>
          <span class="section-more" data-page="fee-dunning-list">催缴记录 ›</span>
        </div>
        <div class="filter-bar" style="position: static; padding: 0 0 8px; background: transparent; box-shadow: none;">
          ${[['all','全部'],['owed','欠费'],['paid','已结清']]
            .map(([k, l]) => `<button class="filter-item ${feeFilter === k ? 'active' : ''}" data-page="fee-dashboard" data-params='{"filter":"${k}","month":"${selMonth}"}'>${l}</button>`).join('')}
        </div>
        ${(() => {
          const list = companyList.filter(c => {
            if (feeFilter === 'owed') return c.owed > 0;
            if (feeFilter === 'paid') return c.owed === 0;
            return true;
          });
          if (list.length === 0) {
            return `<div style="background:#fff; border-radius:var(--r-md); padding: 32px 14px; box-shadow: var(--sh-sm); text-align: center; color: var(--c-text-sub); font-size: var(--fs-sm);">该筛选下暂无企业</div>`;
          }
          return `
            <div style="background:#fff; border-radius:var(--r-md); padding:0 14px; box-shadow: var(--sh-sm);">
              ${list.map(c => {
                const cpRate = c.shouldPay > 0 ? Math.round(c.paid / c.shouldPay * 100) : 0;
                const isPaid = c.owed === 0;
                const isPartial = !isPaid && c.paid > 0;
                const status = isPaid ? 'paid' : isPartial ? 'partial' : 'owed';
                const tag = isPaid ? '已结清' : isPartial ? '部分缴' : '欠费';
                const barColor = isPaid ? 'var(--c-success)' : isPartial ? 'var(--c-warning)' : 'var(--c-danger)';
                return `
                  <div class="fee-company-card" data-page="fee-bill-detail" data-params='{"id":"b04"}'>
                    <div class="fee-company-header">
                      <span class="fee-company-name">${c.name}</span>
                      <span class="fee-company-tag ${status}">${tag}</span>
                    </div>
                    <div class="fee-company-amount">
                      <span>应交 <b>¥${c.shouldPay.toLocaleString()}</b></span>
                      <span style="color:var(--c-success);">已交 <b>¥${c.paid.toLocaleString()}</b></span>
                    </div>
                    <div class="fee-company-progress">
                      <div class="fee-company-bar" style="width: ${cpRate}%; background: ${barColor};"></div>
                    </div>
                    <div class="fee-company-foot">
                      <span style="color: var(--c-text-sub);">收缴率 ${cpRate}%</span>
                      ${!isPaid ? `<span style="color: ${isPartial ? 'var(--c-warning)' : 'var(--c-danger)'}; font-weight: 600;">欠 ¥${c.owed.toLocaleString()}</span>` : '<span style="color: var(--c-success);">✓ 已结清</span>'}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `;
        })()}
      </div>
    ` : `
      <div style="margin: 12px 12px 0; padding: 16px; background: #fff; border-radius: var(--r-md); box-shadow: var(--sh-sm); text-align: center; color: var(--c-text-sub); font-size: var(--fs-sm);">
        ${selMonth} 月仅展示汇总数据<br>
        <span style="font-size: 11px;">历史月份的各企业明细请到"分析"页查看</span>
      </div>
    `}

    <div style="height: 16px"></div>
  `;
  return subPageShell('费用中心', content, `<button class="sub-action" data-page="fee-analysis">分析</button>`);
};

PAGE_RENDERERS['fee-analysis'] = (params) => {
  /* 月份切换(默认本月 2026-06) */
  const selMonth = params.month || (FEE.monthly[FEE.monthly.length - 1].month);
  const isCurrent = selMonth === FEE.monthly[FEE.monthly.length - 1].month;
  const monthRec = FEE.monthly.find(m => m.month === selMonth) || FEE.monthly[FEE.monthly.length - 1];

  /* 当月用 BILLS 细数据,历史月按总额等比缩放 */
  let totalShould, totalPaid, totalOwed, typeList, companyList;
  if (isCurrent) {
    totalShould = BILLS.reduce((s, b) => s + b.shouldPay, 0);
    totalPaid = BILLS.reduce((s, b) => s + b.paid, 0);
    totalOwed = BILLS.reduce((s, b) => s + b.owed, 0);
    const byType = {};
    BILLS.forEach(b => {
      if (!byType[b.type]) byType[b.type] = { type: b.type, shouldPay: 0, paid: 0, owed: 0, count: 0 };
      const acc = byType[b.type];
      acc.shouldPay += b.shouldPay;
      acc.paid += b.paid;
      acc.owed += b.owed;
      acc.count += 1;
    });
    typeList = Object.values(byType).sort((a, b) => b.shouldPay - a.shouldPay);
    const perCompany = {};
    BILLS.forEach(b => {
      if (!perCompany[b.companyId]) perCompany[b.companyId] = {
        companyId: b.companyId, name: b.company,
        shouldPay: 0, paid: 0, owed: 0
      };
      const acc = perCompany[b.companyId];
      acc.shouldPay += b.shouldPay;
      acc.paid += b.paid;
      acc.owed += b.owed;
    });
    companyList = Object.values(perCompany).sort((a, b) => b.shouldPay - a.shouldPay);
  } else {
    totalShould = monthRec.shouldPay;
    totalPaid = monthRec.paid;
    totalOwed = monthRec.owed;
    const cur = FEE.monthly[FEE.monthly.length - 1];
    const ratio = cur.shouldPay > 0 ? monthRec.shouldPay / cur.shouldPay : 0;
    const paidRatio = cur.paid > 0 ? monthRec.paid / cur.paid : 0;
    /* 按类型:沿用当前月的类型权重(物业费/房租/其他) */
    const curByType = {};
    BILLS.forEach(b => {
      if (!curByType[b.type]) curByType[b.type] = 0;
      curByType[b.type] += b.shouldPay;
    });
    const totalCur = Object.values(curByType).reduce((s, v) => s + v, 0);
    typeList = Object.entries(curByType).map(([type, v]) => ({
      type,
      shouldPay: Math.round(v * ratio),
      paid: Math.round(v * paidRatio),
      owed: Math.round(v * (ratio - paidRatio)),
      count: 0
    })).sort((a, b) => b.shouldPay - a.shouldPay);
    /* 按企业:沿用当前月的企业权重,仅用公司名(company-detail 不依赖细化 amount) */
    const curPerCo = {};
    BILLS.forEach(b => {
      if (!curPerCo[b.companyId]) curPerCo[b.companyId] = {
        companyId: b.companyId, name: b.company,
        shouldPay: 0, paid: 0, owed: 0
      };
      curPerCo[b.companyId].shouldPay += b.shouldPay;
    });
    const totalCo = Object.values(curPerCo).reduce((s, v) => s + v.shouldPay, 0);
    companyList = Object.values(curPerCo).map(c => ({
      ...c,
      shouldPay: Math.round(c.shouldPay * ratio),
      paid: Math.round(c.shouldPay * paidRatio),
      owed: Math.round(c.shouldPay * (ratio - paidRatio))
    })).sort((a, b) => b.shouldPay - a.shouldPay);
  }
  const rate = totalShould > 0 ? Math.round(totalPaid / totalShould * 100) : 0;
  const typeColorMap = { '物业费': '#1e6fbb', '房租': '#c47800', '其他': '#10b981' };
  const typeMax = Math.max(...typeList.map(t => t.shouldPay), 1);
  const companyMax = Math.max(...companyList.map(c => c.shouldPay), 1);

  /* ===== 3 个图表数据准备 ===== */
  /* donut 工具:输入数组 [{value,color}], 输出 SVG 弧段 */
  const buildDonut = (segments, size = 120) => {
    const total = segments.reduce((s, x) => s + x.value, 0) || 1;
    const cx = size / 2, cy = size / 2;
    const r = (size - 24) / 2;
    const c = 2 * Math.PI * r;
    let offset = 0;
    const arcs = segments.filter(s => s.value > 0).map(s => {
      const len = (s.value / total) * c;
      const dash = `${len} ${c - len}`;
      const out = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="18" stroke-dasharray="${dash}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})" />`;
      offset += len;
      return out;
    }).join('');
    return `<svg class="fee-donut" viewBox="0 0 ${size} ${size}">${arcs}<text x="${cx}" y="${cy - 4}" text-anchor="middle" class="fee-donut-pct">${Math.round((segments.filter(s => s.value > 0).reduce((s, x) => s + (x.value / total) * (x.label === 'paid' ? 1 : 0), 0)) * 100)}%</text><text x="${cx}" y="${cy + 14}" text-anchor="middle" class="fee-donut-cap">收缴</text></svg>`;
  };
  /* 已收/待收 环形图 */
  const paidSegs = [
    { value: totalPaid, color: 'var(--c-success)', label: 'paid' },
    { value: totalOwed, color: 'var(--c-danger)', label: 'owed' }
  ];
  const paidDonut = buildDonut(paidSegs);
  /* 费用类型 环形图 */
  const typeSegs = typeList.map(t => ({
    value: t.shouldPay,
    color: typeColorMap[t.type] || 'var(--c-primary)',
    label: t.type
  }));
  const typeDonut = buildDonut(typeSegs);

  const content = `
    <div class="fee-stat-card">
      <div class="fee-stat-card-label">${isCurrent ? '本月' : selMonth} 收缴率</div>
      <div class="fee-stat-card-value">${rate}<span class="fee-stat-card-unit">%</span></div>
      <div class="fee-stat-card-bar">
        <div class="fee-stat-card-bar-fill" style="width: ${rate}%;"></div>
      </div>
      <div class="fee-stat-card-meta">
        已收 <b style="color:var(--c-success);">¥${totalPaid.toLocaleString()}</b> ·
        待收 <b style="color:var(--c-danger);">¥${totalOwed.toLocaleString()}</b> ·
        应收 <b>¥${totalShould.toLocaleString()}</b>
      </div>
    </div>

    <!-- 已收 / 待收 环形图 -->
    <div class="page-section">
      <div class="section-header">
        <div class="section-title">已收 / 待收 占比</div>
        <span class="section-more">${isCurrent ? '本月' : selMonth}</span>
      </div>
      <div class="fee-chart-card">
        <div class="fee-chart-row">
          <div class="fee-chart-donut-wrap">${paidDonut}</div>
          <div class="fee-chart-legend-stack">
            <div class="fee-chart-legend-item">
              <span class="fee-type-dot" style="background: var(--c-success);"></span>
              <span class="fee-chart-legend-label">已收</span>
              <span class="fee-chart-legend-val">¥${totalPaid.toLocaleString()}</span>
              <span class="fee-chart-legend-pct">${rate}%</span>
            </div>
            <div class="fee-chart-legend-item">
              <span class="fee-type-dot" style="background: var(--c-danger);"></span>
              <span class="fee-chart-legend-label">待收</span>
              <span class="fee-chart-legend-val">¥${totalOwed.toLocaleString()}</span>
              <span class="fee-chart-legend-pct">${100 - rate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 费用类型 环形图 -->
    <div class="page-section">
      <div class="section-header">
        <div class="section-title">费用类型占比</div>
        <span class="section-more">按应收金额</span>
      </div>
      <div class="fee-chart-card">
        <div class="fee-chart-row">
          <div class="fee-chart-donut-wrap">${typeDonut}</div>
          <div class="fee-chart-legend-stack">
            ${typeList.map(t => {
              const color = typeColorMap[t.type] || 'var(--c-primary)';
              const pct = Math.round(t.shouldPay / totalShould * 100);
              return `
                <div class="fee-chart-legend-item">
                  <span class="fee-type-dot" style="background: ${color};"></span>
                  <span class="fee-chart-legend-label">${t.type}</span>
                  <span class="fee-chart-legend-val">¥${t.shouldPay.toLocaleString()}</span>
                  <span class="fee-chart-legend-pct">${pct}%</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- 各企业收缴率 横向条形图 -->
    <div class="page-section">
      <div class="section-header">
        <div class="section-title">各企业收缴率</div>
        <span class="section-more">${isCurrent ? '本月' : selMonth}</span>
      </div>
      <div class="fee-chart-card" style="padding: 14px 14px 8px;">
        ${companyList.map((c, i) => {
          const cpRate = c.shouldPay > 0 ? Math.round(c.paid / c.shouldPay * 100) : 0;
          const isPaid = c.owed === 0;
          const isPartial = !isPaid && c.paid > 0;
          const barColor = isPaid ? 'var(--c-success)' : isPartial ? 'var(--c-warning)' : 'var(--c-danger)';
          const rateTag = isPaid ? 'paid' : isPartial ? 'partial' : 'owed';
          const rateText = isPaid ? '已结清' : isPartial ? '部分缴' : '欠费';
          return `
            <div class="fee-rate-row" data-page="fee-bill-detail" data-params='{"id":"b04"}'>
              <span class="fee-rate-rank">${i + 1}</span>
              <div class="fee-rate-body">
                <div class="fee-rate-head">
                  <span class="fee-rate-name">${c.name}</span>
                  <span class="fee-rate-tag ${rateTag}">${rateText}</span>
                </div>
                <div class="fee-rate-bar-track">
                  <div class="fee-rate-bar" style="width: ${cpRate}%; background: ${barColor};"></div>
                </div>
                <div class="fee-rate-foot">
                  <span style="color: var(--c-text-sub);">${cpRate}% · 应交 ¥${c.shouldPay.toLocaleString()}</span>
                  <span style="color: ${isPaid ? 'var(--c-success)' : barColor}; font-weight: 600;">
                    ${isPaid ? '✓ 已结清' : '欠 ¥' + c.owed.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div style="height: 16px"></div>
  `;
  return subPageShell('费用分析', content);
};

/* ---------- 园区整体分析(财务/经理 可见,今年水电 + 费用累计) ---------- */
PAGE_RENDERERS['park-analysis'] = (params) => {
  /* 今年(2026 年)累计,跨 1-6 月 */
  const currentYear = new Date().getFullYear();
  const yearMonths = FEE.monthly.filter(m => parseInt(m.month.slice(0, 4), 10) === currentYear);
  const yearUtilMonths = UTILITY.monthly.filter(m => parseInt(m.month.slice(0, 4), 10) === currentYear);
  const yearMonthCount = yearMonths.length;

  /* 费用累计 */
  const feeShould = yearMonths.reduce((s, m) => s + m.shouldPay, 0);
  const feePaid = yearMonths.reduce((s, m) => s + m.paid, 0);
  const feeOwed = yearMonths.reduce((s, m) => s + m.owed, 0);
  const feeRate = feeShould > 0 ? Math.round(feePaid / feeShould * 100) : 0;
  const feeShouldAvg = Math.round(feeShould / yearMonthCount);
  const feeOwedAvg = Math.round(feeOwed / yearMonthCount);

  /* 水电累计 */
  const utilWater = yearUtilMonths.reduce((s, m) => s + m.water, 0);
  const utilElec = yearUtilMonths.reduce((s, m) => s + m.electric, 0);
  const utilPrepaid = yearUtilMonths.reduce((s, m) => s + m.prepaid, 0);
  const utilWaterFee = Math.round(utilWater * UTILITY_WATER_PRICE);
  const utilElecFee = Math.round(utilElec * UTILITY_ELEC_PRICE);
  const utilTotalFee = utilWaterFee + utilElecFee;
  const utilWaterAvg = Math.round(utilWater / yearMonthCount);
  const utilElecAvg = Math.round(utilElec / yearMonthCount);

  /* 今年 6 月趋势(只展示今年) */
  const utilTrend = yearUtilMonths.map(m => ({
    month: m.month,
    water: m.water,
    electric: m.electric
  }));
  const utilMax = Math.max(...utilTrend.map(t => Math.max(t.water, t.electric)), 1);

  const feeTrend = yearMonths.map(m => ({
    month: m.month,
    paid: m.paid,
    owed: m.owed
  }));
  const feeMax = Math.max(...feeTrend.map(t => t.paid + t.owed), 1);

  const content = `
    <!-- 快捷入口(顶部) -->
    <div class="park-analysis-quick">
      <div class="park-analysis-quick-item" data-page="utility-dashboard">
        <div class="park-analysis-quick-icon" style="background: rgba(78, 182, 229, 0.12); color: #4eb6e5;">水</div>
        <div class="park-analysis-quick-label">水电总览</div>
      </div>
      <div class="park-analysis-quick-item" data-page="fee-dashboard">
        <div class="park-analysis-quick-icon" style="background: var(--c-primary-soft); color: var(--c-primary);">费</div>
        <div class="park-analysis-quick-label">费用中心</div>
      </div>
    </div>

    <!-- 总览 -->
    <div class="page-section">
      <div class="section-header">
        <div class="section-title">${currentYear} 年园区整体</div>
        <span class="section-more">截至 ${FEE.monthly[FEE.monthly.length - 1].month}</span>
      </div>
      <div class="park-analysis-card">
        <div class="park-analysis-grid-2">
          <div class="park-analysis-stat">
            <div class="park-analysis-stat-label">水+电用量</div>
            <div class="park-analysis-stat-value">${(utilWater + utilElec).toLocaleString()}</div>
            <div class="park-analysis-stat-meta">水 ${utilWater.toLocaleString()} 吨 · 电 ${utilElec.toLocaleString()} 度</div>
          </div>
          <div class="park-analysis-stat">
            <div class="park-analysis-stat-label">费用应收</div>
            <div class="park-analysis-stat-value">¥${feeShould.toLocaleString()}</div>
            <div class="park-analysis-stat-meta">收缴率 ${feeRate}%</div>
          </div>
        </div>
        <div class="park-analysis-total">
          <div class="park-analysis-total-row">
            <span>水电费用合计</span>
            <b>¥${utilTotalFee.toLocaleString()}</b>
          </div>
          <div class="park-analysis-total-sub">水 ¥${utilWaterFee.toLocaleString()} · 电 ¥${utilElecFee.toLocaleString()}</div>
        </div>
      </div>
    </div>

    <!-- 水电分布 -->
    <div class="page-section">
      <div class="section-header">
        <div class="section-title">水电</div>
        <span class="section-more">${currentYear} 年累计</span>
      </div>
      <div class="park-analysis-card">
        <div class="park-analysis-grid-2">
          <div class="park-analysis-stat">
            <div class="park-analysis-stat-label">用水量</div>
            <div class="park-analysis-stat-value">
              ${utilWater.toLocaleString()}<span class="park-analysis-stat-unit">吨</span>
            </div>
            <div class="park-analysis-stat-meta">月均 ${utilWaterAvg.toLocaleString()} 吨 · 水费 ¥${utilWaterFee.toLocaleString()}</div>
          </div>
          <div class="park-analysis-stat">
            <div class="park-analysis-stat-label">用电量</div>
            <div class="park-analysis-stat-value">
              ${utilElec.toLocaleString()}<span class="park-analysis-stat-unit">度</span>
            </div>
            <div class="park-analysis-stat-meta">月均 ${utilElecAvg.toLocaleString()} 度 · 电费 ¥${utilElecFee.toLocaleString()}</div>
          </div>
        </div>
        <div class="park-analysis-section-sub">今年 1-${yearMonthCount} 月用量趋势</div>
        <div class="park-analysis-trend">
          ${utilTrend.map(t => {
            const wPct = (t.water / utilMax) * 100;
            const ePct = (t.electric / utilMax) * 100;
            return `
              <div class="park-analysis-trend-col sel">
                <div class="park-analysis-trend-bars">
                  <div class="park-analysis-bar water" style="height: ${wPct}%;"></div>
                  <div class="park-analysis-bar elec" style="height: ${ePct}%;"></div>
                </div>
                <div class="park-analysis-trend-label">${t.month.slice(5)}</div>
              </div>
            `;
          }).join('')}
        </div>
        <div class="park-analysis-legend">
          <span class="park-analysis-legend-item"><i class="park-analysis-dot water"></i>用水</span>
          <span class="park-analysis-legend-item"><i class="park-analysis-dot elec"></i>用电</span>
        </div>
      </div>
    </div>

    <!-- 费用看板 -->
    <div class="page-section">
      <div class="section-header">
        <div class="section-title">费用</div>
        <span class="section-more">${currentYear} 年累计</span>
      </div>
      <div class="park-analysis-card">
        <div class="park-analysis-grid-3">
          <div class="park-analysis-stat">
            <div class="park-analysis-stat-label">应收</div>
            <div class="park-analysis-stat-value">¥${feeShould.toLocaleString()}</div>
            <div class="park-analysis-stat-meta">月均 ¥${feeShouldAvg.toLocaleString()}</div>
          </div>
          <div class="park-analysis-stat">
            <div class="park-analysis-stat-label">已收</div>
            <div class="park-analysis-stat-value success">¥${feePaid.toLocaleString()}</div>
            <div class="park-analysis-stat-meta">${feeRate}%</div>
          </div>
          <div class="park-analysis-stat">
            <div class="park-analysis-stat-label">待收</div>
            <div class="park-analysis-stat-value danger">¥${feeOwed.toLocaleString()}</div>
            <div class="park-analysis-stat-meta">月均 ¥${feeOwedAvg.toLocaleString()}</div>
          </div>
        </div>
        <div class="park-analysis-section-sub">今年 1-${yearMonthCount} 月已收 / 待收</div>
        <div class="park-analysis-trend">
          ${feeTrend.map(t => {
            const total = t.paid + t.owed;
            const paidPct = total > 0 ? (t.paid / feeMax) * 100 : 0;
            const owedPct = total > 0 ? (t.owed / feeMax) * 100 : 0;
            return `
              <div class="park-analysis-trend-col sel">
                <div class="park-analysis-trend-bars">
                  <div class="park-analysis-bar paid" style="height: ${paidPct}%;"></div>
                  <div class="park-analysis-bar owed" style="height: ${owedPct}%;"></div>
                </div>
                <div class="park-analysis-trend-label">${t.month.slice(5)}</div>
              </div>
            `;
          }).join('')}
        </div>
        <div class="park-analysis-legend">
          <span class="park-analysis-legend-item"><i class="park-analysis-dot paid"></i>已收</span>
          <span class="park-analysis-legend-item"><i class="park-analysis-dot owed"></i>待收</span>
        </div>
      </div>
    </div>

    <!-- 关键指标(本年累计 + 月均) -->
    <div class="page-section">
      <div class="section-header">
        <div class="section-title">关键指标</div>
        <span class="section-more">${currentYear} 年</span>
      </div>
      <div class="park-analysis-card">
        <div class="park-analysis-kpi-row">
          <span class="park-analysis-kpi-label">月均应收</span>
          <span class="park-analysis-kpi-value">¥${feeShouldAvg.toLocaleString()}</span>
        </div>
        <div class="park-analysis-kpi-row">
          <span class="park-analysis-kpi-label">年累计收缴率</span>
          <span class="park-analysis-kpi-value">${feeRate}%</span>
        </div>
        <div class="park-analysis-kpi-row">
          <span class="park-analysis-kpi-label">月均水+电用量</span>
          <span class="park-analysis-kpi-value">${(utilWaterAvg + utilElecAvg).toLocaleString()}</span>
        </div>
        <div class="park-analysis-kpi-row">
          <span class="park-analysis-kpi-label">预缴流水</span>
          <span class="park-analysis-kpi-value">¥${utilPrepaid.toLocaleString()}</span>
        </div>
      </div>
    </div>

    <div style="height: 16px"></div>
  `;
  return subPageShell('园区整体分析', content);
};

/* ---------- 统一待办页(todo-center):按 todo.page 自动分组 ---------- */
const TODO_TAB_META = {
  'inspection-list':   { icon: '巡', label: '巡检' },
  'workorder-list':    { icon: '工', label: '工单' },
  'fee-dunning-list':  { icon: '欠', label: '催缴' },
  'fee-bill-list':     { icon: '票', label: '开票' },
  'contract-list':     { icon: '合', label: '合同' },
  'contract-renewal':  { icon: '续', label: '续约' },
  'meeting-list':      { icon: '会', label: '会议' },
  'company-list':      { icon: '企', label: '企业' },
  'form-list':         { icon: '审', label: '审批' }
};

PAGE_RENDERERS['todo-center'] = (params) => {
  const role = ROLES[state.roleId];
  const todos = (role.todos || []).filter(t => t.page);
  const total = todos.length;

  /* 按 page+params 分组(同一目标页合并) */
  const groups = [];
  todos.forEach(t => {
    const key = t.page + '|' + JSON.stringify(t.params || {});
    let g = groups.find(x => x.key === key);
    if (!g) {
      g = { key, page: t.page, params: t.params, items: [] };
      groups.push(g);
    }
    g.items.push(t);
  });

  /* 当前 tab:URL ?tab=0/1/... */
  const idx = parseInt(params.tab || '0', 10);
  const active = groups[idx] || groups[0];

  const content = `
    <div class="todo-center-head">
      <div class="todo-center-title">共 ${total} 项待办</div>
      <div class="todo-center-sub">按类型分组 · 点击直达处理页</div>
    </div>
    <div class="todo-center-tabs">
      ${groups.map((g, i) => {
        const meta = TODO_TAB_META[g.page] || { icon: '·', label: g.page };
        const activeCls = i === idx ? ' active' : '';
        return `<div class="todo-center-tab${activeCls}" data-page="todo-center" data-params='{"tab":${i}}'>
          <span class="todo-center-tab-icon">${meta.icon}</span>
          <span class="todo-center-tab-label">${meta.label}</span>
          <span class="todo-center-tab-count">${g.items.length}</span>
        </div>`;
      }).join('')}
    </div>
    <div class="todo-center-list">
      ${active ? `<div class="todo-list">${active.items.map(t => {
        const tp = ` data-page="${t.page}" data-params='${JSON.stringify(t.params || {})}'`;
        return `
          <div class="todo-item"${tp}>
            <div class="todo-icon ${t.cls || ''}">${t.icon}</div>
            <div class="todo-text">
              <div class="todo-title">${t.title}</div>
              <div class="todo-desc">${t.desc}</div>
            </div>
            <span class="todo-status ${t.status}">${t.status}</span>
          </div>
        `;
      }).join('')}</div>` : emptyState('暂无待办')}
    </div>
    <div style="height: 16px"></div>
  `;
  return subPageShell('待办', content);
};

PAGE_RENDERERS['fee-bill-list'] = (params) => {
  const filter = params.filter || 'all';

  const list = BILLS.filter(b => {
    if (filter === 'all') return true;
    if (filter === 'owed') return b.owed > 0;
    if (filter === 'paid') return b.owed === 0;
    return true;
  });

  const content = `
    <div class="filter-bar">
      ${[['all','全部'],['owed','欠费'],['paid','已结清']]
        .map(([k, l]) => `<button class="filter-item ${filter === k ? 'active' : ''}" data-page="fee-bill-list" data-params='{"filter":"${k}"}'>${l}</button>`).join('')}
    </div>
    <div class="list-summary">共 ${list.length} 单</div>
    <div class="list-page">
      ${list.length === 0 ? emptyState('暂无账单') : list.map(b => `
        <div class="list-card" data-page="fee-bill-detail" data-params='{"id":"${b.id}"}'>
          <div class="list-card-header">
            <div class="list-card-title"><span class="list-card-title-text">${b.company} · ${b.type}</span></div>
            <span class="list-card-status s-${b.status}">${b.status}</span>
          </div>
          <div class="list-card-meta">
            <span>账期 ${b.period}</span><span>应收 ¥${b.shouldPay.toLocaleString()}</span>
          </div>
          ${b.owed > 0 ? `<div class="list-card-row" style="color: var(--c-danger);">欠 ¥${b.owed.toLocaleString()}</div>` : `<div class="list-card-row">已结清</div>`}
        </div>
      `).join('')}
    </div>
  `;
  return subPageShell('账单明细', content);
};

PAGE_RENDERERS['fee-bill-detail'] = (params) => {
  const b = getBill(params.id);
  if (!b) return subPageShell('账单详情', emptyState('账单不存在'));
  const role = ROLES[state.roleId];
  const isFinance = state.roleId === 'finance';
  const isReadonly = role.readonlyModules && role.readonlyModules.includes('M05');

  const actions = [];
  if (b.owed > 0 && !isReadonly) {
    actions.push({ label: '催缴', act: 'dunning', cls: 'btn-primary' });
    if (isFinance) actions.push({ label: '录收款', act: 'record', cls: 'btn-default' });
  }

  const footer = actions.length ? `<div class="footer-actions">${actions.map(a => `<button class="btn ${a.cls}" data-fee-action="${a.act}" data-fee-id="${b.id}">${a.label}</button>`).join('')}</div>` : '';

  const content = `
    <div class="detail-hero">
      <div class="detail-hero-status">${b.status}</div>
      <div class="detail-hero-title">${b.company} · ${b.type}</div>
      <div class="detail-hero-meta">账期 ${b.period}</div>
      <div style="margin-top:12px; font-size: var(--fs-3xl); font-weight:700;">¥${b.shouldPay.toLocaleString()}</div>
      <div style="font-size:var(--fs-xs); opacity:0.85;">应收金额</div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">账目明细</div>
      <div class="detail-row"><div class="detail-label">应收</div><div class="detail-value">¥${b.shouldPay.toLocaleString()}</div></div>
      <div class="detail-row"><div class="detail-label">已收</div><div class="detail-value" style="color: var(--c-success);">¥${b.paid.toLocaleString()}</div></div>
      <div class="detail-row"><div class="detail-label">未收</div><div class="detail-value" style="color: ${b.owed > 0 ? 'var(--c-danger)' : 'var(--c-text-sub)'};">¥${b.owed.toLocaleString()}</div></div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">催缴记录</div>
      ${DUNNING_LOGS.filter(d => d.companyId === b.companyId).length === 0
        ? `<div class="empty-state" style="padding: 20px;"><div class="empty-state-text">暂无催缴记录</div></div>`
        : DUNNING_LOGS.filter(d => d.companyId === b.companyId).map(d => `
          <div class="card-row" style="cursor:default;">
            <div class="card-row-icon" style="background:${d.method === '电话' ? '#e6f1fa' : '#fef3e6'};color:${d.method === '电话' ? 'var(--c-info)' : 'var(--c-warning)'};">${d.method === '电话' ? '话' : '信'}</div>
            <div class="card-row-body">
              <div class="card-row-title">${d.method} · ${d.response}</div>
              <div class="card-row-desc">${d.operator} · ${d.time}</div>
            </div>
            <span class="list-card-status s-${d.status}">${d.status}</span>
          </div>
        `).join('')
      }
    </div>
    <div style="height: 76px"></div>
    ${footer}
  `;
  return subPageShell('账单详情', content);
};

PAGE_RENDERERS['fee-dunning-list'] = (params) => {
  const all = [...RUNTIME.newDunningLogs, ...DUNNING_LOGS].sort((a, b) => b.time.localeCompare(a.time));
  const content = `
    <div class="list-page">
      ${all.length === 0 ? emptyState('暂无催缴记录') : all.map(d => `
        <div class="list-card" style="cursor:default;">
          <div class="list-card-header">
            <div class="list-card-title">
              <span class="list-card-title-text">${d.method} · ${d.company}</span>
            </div>
            <span class="list-card-status s-${d.status}">${d.status}</span>
          </div>
          <div class="list-card-meta">
            <span>${d.time}</span><span>${d.operator}</span>
          </div>
          <div class="list-card-row">回复: ${d.response}</div>
        </div>
      `).join('')}
    </div>
  `;
  return subPageShell('催缴流水', content);
};

/* ============================================
 * M06 水电
 * ============================================ */

/* ---------- M06 工具:按月份取数(基础月是当前月,即 monthly 数组最后一条) ---------- */
const UTILITY_WATER_PRICE = 4, UTILITY_ELEC_PRICE = 0.75;
function utilCurrentMonth() {
  return UTILITY.monthly[UTILITY.monthly.length - 1].month;
}
function utilMonthRecord(monthStr) {
  return UTILITY.monthly.find(m => m.month === monthStr) || UTILITY.monthly[UTILITY.monthly.length - 1];
}
/* 按月份取企业用量(以当前月为基准,按水/电总量比例缩放) */
function utilCompaniesForMonth(monthStr) {
  const cur = utilMonthRecord(utilCurrentMonth());
  const sel = utilMonthRecord(monthStr);
  const wScale = cur.water > 0 ? sel.water / cur.water : 1;
  const eScale = cur.electric > 0 ? sel.electric / cur.electric : 1;
  return UTILITY.byCompany.map(c => ({
    ...c,
    water: Math.round(c.water * wScale),
    electric: Math.round(c.electric * eScale),
    waterFee: Math.round(c.waterFee * wScale),
    elecFee: Math.round(c.elecFee * eScale)
  }));
}
/* 按月份取园区汇总水/电用量 */
function utilSummaryForMonth(monthStr) {
  const sel = utilMonthRecord(monthStr);
  return { water: sel.water, electric: sel.electric, prepaid: sel.prepaid };
}

PAGE_RENDERERS['utility-dashboard'] = (params) => {
  const u = UTILITY;
  const selMonth = params.month || utilCurrentMonth();
  const isCurrent = selMonth === utilCurrentMonth();
  const monthRec = utilMonthRecord(selMonth);

  /* 单价(基于 byCompany 反推:水 4 元/吨,电 0.75 元/度) */
  const totalPrepaid = u.byCompany.reduce((s, c) => s + c.prepaidBalance, 0);

  /* 按月取水/电用量 + 预缴 */
  const monthWater = monthRec.water;
  const monthElec = monthRec.electric;
  const monthWaterFee = Math.round(monthWater * UTILITY_WATER_PRICE);
  const monthElecFee = Math.round(monthElec * UTILITY_ELEC_PRICE);
  const monthPrepaid = monthRec.prepaid;
  /* 按水/电费用占比拆分预缴 */
  const totalFee = monthWaterFee + monthElecFee;
  const waterRatio = totalFee > 0 ? monthWaterFee / totalFee : 0.5;
  const monthPrepaidWater = Math.round(monthPrepaid * waterRatio);
  const monthPrepaidElec = monthPrepaid - monthPrepaidWater;

  /* 当月企业用量(按月缩放) */
  const monthCompanies = utilCompaniesForMonth(selMonth);
  const ranked = monthCompanies.map(c => ({
    ...c,
    totalFee: c.waterFee + c.elecFee,
    waterFee: c.waterFee,
    elecFee: c.elecFee
  })).sort((a, b) => b.totalFee - a.totalFee);
  const maxFee = Math.max(...ranked.map(c => c.totalFee));
  const sumWater = monthCompanies.reduce((s, c) => s + c.water, 0);
  const sumElec = monthCompanies.reduce((s, c) => s + c.electric, 0);

  /* 年月分组(用于下拉弹层) */
  const monthsByYear = {};
  u.monthly.forEach(m => {
    const y = m.month.slice(0, 4);
    if (!monthsByYear[y]) monthsByYear[y] = [];
    monthsByYear[y].push(m);
  });
  const yearKeys = Object.keys(monthsByYear).sort();
  const triggerLabel = `${selMonth.slice(0, 4)} 年 ${parseInt(selMonth.slice(5), 10)} 月`;

  const monthTitle = isCurrent ? '本月水/电收支' : `${selMonth.replace('-', '年')}月 水/电收支`;

  const content = `
    <button class="util-month-trigger" id="monthPickerTrigger" type="button">
      <span class="util-month-trigger-text">${triggerLabel}</span>
      <span class="util-month-trigger-caret">▾</span>
    </button>

    <div class="util-balance-card" data-page="utility-prepaid" style="cursor:pointer;">
      <div class="util-balance-title">${monthTitle}</div>
      <div class="util-balance-grid">
        <div class="util-balance-col">
          <div class="util-balance-col-label">${isCurrent ? '本月预缴' : `${selMonth} 预缴`}</div>
          <div class="util-balance-row">
            <span class="util-balance-bar water"></span>
            <span class="util-balance-row-label">水</span>
            <span class="util-balance-row-val">¥${monthPrepaidWater.toLocaleString()}</span>
          </div>
          <div class="util-balance-row">
            <span class="util-balance-bar elec"></span>
            <span class="util-balance-row-label">电</span>
            <span class="util-balance-row-val">¥${monthPrepaidElec.toLocaleString()}</span>
          </div>
        </div>
        <div class="util-balance-col">
          <div class="util-balance-col-label">${isCurrent ? '本月实际' : `${selMonth} 实际`}</div>
          <div class="util-balance-row">
            <span class="util-balance-bar water"></span>
            <span class="util-balance-row-label">水</span>
            <span class="util-balance-row-val">¥${monthWaterFee.toLocaleString()}</span>
          </div>
          <div class="util-balance-row">
            <span class="util-balance-bar elec"></span>
            <span class="util-balance-row-label">电</span>
            <span class="util-balance-row-val">¥${monthElecFee.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="page-section">
      <div class="section-header">
        <div class="section-title">${isCurrent ? '当月' : selMonth} 各企业使用情况</div>
        <span class="section-more">合计 ${sumWater.toLocaleString()} 吨 / ${sumElec.toLocaleString()} 度</span>
      </div>
      <div style="background:#fff; border-radius:var(--r-md); padding:0 14px; box-shadow: var(--sh-sm);">
        ${ranked.map((c, i) => `
          <div class="mini-company-card" data-page="utility-company-detail" data-params='{"id":"${c.id}","month":"${selMonth}"}'>
            <div class="mini-company-avatar">${c.name.charAt(0)}</div>
            <div class="mini-company-info">
              <div class="mini-company-name">${i + 1}. ${c.name}</div>
              <div class="mini-company-meta">水 ${c.water.toLocaleString()} 吨 · 电 ${c.electric.toLocaleString()} 度</div>
              <div class="util-progress">
                <div class="util-progress-bar" style="width:${(c.totalFee / maxFee) * 100}%"></div>
              </div>
            </div>
            <div style="text-align:right; font-size: var(--fs-sm); color: var(--c-text-sub); flex-shrink:0;">
              <div style="font-weight:700; color: var(--c-text);">¥${c.totalFee.toLocaleString()}</div>
              <div style="font-size:11px;">余额 ¥${c.prepaidBalance.toLocaleString()}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <div style="height: 16px"></div>
  `;
  return subPageShell('水电总览', content, `<button class="sub-action" data-page="utility-analysis">分析</button>`);
};

PAGE_RENDERERS['utility-company'] = (params) => {
  const filter = params.filter || 'all';
  const list = UTILITY.byCompany.filter(c => {
    if (filter === 'all') return true;
    if (filter === 'water') return c.deltaWater > 0;
    if (filter === 'electric') return c.deltaElec > 0;
    if (filter === 'low') return c.prepaidBalance < (c.waterFee + c.elecFee);
    return true;
  });

  const totalBalance = UTILITY.byCompany.reduce((s, c) => s + c.prepaidBalance, 0);
  const lowCount = UTILITY.byCompany.filter(c => c.prepaidBalance < c.waterFee + c.elecFee).length;
  const emptyCount = UTILITY.byCompany.filter(c => c.prepaidBalance === 0).length;

  /* 6 月水/电迷你柱图(基于 monthly 数据) */
  const last6 = UTILITY.monthly.slice(-6);
  const max6Water = Math.max(...last6.map(m => m.water));
  const max6Elec = Math.max(...last6.map(m => m.electric));

  const content = `
    <div class="mini-stat-row" style="grid-template-columns: 1fr 1fr 1fr;">
      <div class="mini-stat">
        <div class="mini-stat-value">${UTILITY.byCompany.length}</div>
        <div class="mini-stat-label">入驻企业</div>
      </div>
      <div class="mini-stat">
        <div class="mini-stat-value success">¥${(totalBalance / 10000).toFixed(2)}<span class="mini-stat-unit" style="font-size:11px;">万</span></div>
        <div class="mini-stat-label">预缴总余额</div>
      </div>
      <div class="mini-stat">
        <div class="mini-stat-value ${emptyCount > 0 ? 'warning' : ''}">${emptyCount}</div>
        <div class="mini-stat-label">待充值</div>
      </div>
    </div>
    <div class="filter-bar">
      ${[['all','全部'],['water','用水上涨'],['electric','用电上涨'],['low','需关注']]
        .map(([k, l]) => `<button class="filter-item ${filter === k ? 'active' : ''}" data-page="utility-company" data-params='{"filter":"${k}"}'>${l}</button>`).join('')}
    </div>
    <div class="list-page">
      ${list.map(c => {
        const fee = c.waterFee + c.elecFee;
        const isEmpty = c.prepaidBalance === 0;
        const isLow = !isEmpty && c.prepaidBalance < fee;
        const tag = isEmpty
          ? `<span class="list-card-tag" style="background:var(--c-warning-soft); color:var(--c-warning); padding:1px 6px; border-radius:8px; font-size:11px;">待充值</span>`
          : isLow
            ? `<span class="util-attn-icon" title="需关注"></span>`
            : `<span class="list-card-tag" style="background:var(--c-success-soft); color:var(--c-success); padding:1px 6px; border-radius:8px; font-size:11px;">预缴</span>`;
        /* 预缴 vs 本月费用 进度条(横条 = 余额占本月费用比例) */
        const balanceRatio = fee > 0 ? Math.min(100, (c.prepaidBalance / fee) * 100) : 0;
        const ratioColor = isEmpty ? 'var(--c-danger)' : isLow ? 'var(--c-warning)' : 'var(--c-success)';
        return `
          <div class="list-card" data-page="utility-company-detail" data-params='{"id":"${c.id}"}'>
            <div class="list-card-header">
              <div class="list-card-title">${tag}<span class="list-card-title-text">${c.name}</span></div>
              <span class="list-card-status s-active">¥${fee.toLocaleString()}</span>
            </div>
            <div class="list-card-meta">
              <span style="color:#1e6fbb;">💧 ${c.water.toLocaleString()} 吨</span>
              <span style="color:#c47800;">⚡ ${c.electric.toLocaleString()} 度</span>
            </div>
            <div style="display:flex; gap:2px; height: 28px; align-items:flex-end; margin: 4px 0 6px;">
              ${last6.map(m => `
                <div style="flex:1; display:flex; gap:1px; height:100%; align-items:flex-end;">
                  <div style="width:50%; background: linear-gradient(180deg, #4eb6e5, #1e6fbb); height: ${(m.water / max6Water) * 100}%; border-radius: 2px 2px 0 0; min-height:2px;" title="水 ${m.water}"></div>
                  <div style="width:50%; background: linear-gradient(180deg, #f0b955, #c47800); height: ${(m.electric / max6Elec) * 100}%; border-radius: 2px 2px 0 0; min-height:2px;" title="电 ${m.electric}"></div>
                </div>
              `).join('')}
            </div>
            <div class="list-card-row" style="display:flex; align-items:center; gap: 6px; font-size: var(--fs-xs);">
              <span style="color: var(--c-text-sub); width: 60px; flex-shrink: 0;">预缴 ¥${c.prepaidBalance.toLocaleString()}</span>
              <div class="util-progress" style="flex: 1; height: 5px;">
                <div class="util-progress-bar" style="width:${balanceRatio}%; background: ${ratioColor};"></div>
              </div>
              ${isEmpty || isLow ? '<span class="util-attn-icon" title="需关注"></span>' : '<span style="color: var(--c-success); font-size:11px; flex-shrink:0;">✓</span>'}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  return subPageShell('企业用量', content);
};

PAGE_RENDERERS['utility-company-detail'] = (params) => {
  const cBase = UTILITY.byCompany.find(x => x.id === params.id);
  if (!cBase) return subPageShell('企业用量详情', emptyState('企业不存在'));
  const selMonth = params.month || utilCurrentMonth();
  const isCurrent = selMonth === utilCurrentMonth();
  /* 按月缩放后的企业数据(本月的日常保持原值,历史月按水/电总量比例缩放) */
  const monthCompanies = utilCompaniesForMonth(selMonth);
  const c = isCurrent ? cBase : (monthCompanies.find(x => x.id === params.id) || cBase);
  const totalFee = c.waterFee + c.elecFee;
  const monthLabel = isCurrent ? '本月' : selMonth;

  /* 6 月趋势按企业缩放:以当前月企业用量为基准,按园区月水/电比例分配到 6 个月 */
  const last6 = UTILITY.monthly.slice(-6);
  const monthBarMax = (key) => Math.max(...last6.map(m => m[key])) || 1;
  const companyMonthly = last6.map(m => {
    /* 缩放:公司当月用量 × (该月园区量 / 当前月园区量) */
    const wScale = UTILITY.monthly[UTILITY.monthly.length - 1].water > 0 ? m.water / UTILITY.monthly[UTILITY.monthly.length - 1].water : 1;
    const eScale = UTILITY.monthly[UTILITY.monthly.length - 1].electric > 0 ? m.electric / UTILITY.monthly[UTILITY.monthly.length - 1].electric : 1;
    return {
      month: m.month,
      water: Math.round(cBase.water * wScale),
      electric: Math.round(cBase.electric * eScale),
      isSel: m.month === selMonth
    };
  });
  const companyMaxWater = Math.max(...companyMonthly.map(x => x.water)) || 1;
  const companyMaxElec = Math.max(...companyMonthly.map(x => x.electric)) || 1;

  const content = `
    <div class="detail-hero">
      <div class="detail-hero-title">${c.name}</div>
      <div class="detail-hero-meta">${monthLabel}水 + 电 合计${isCurrent ? '' : ' · 历史月份'}</div>
      <div style="margin-top:10px; font-size: var(--fs-3xl); font-weight:700;">¥${totalFee.toLocaleString()}</div>
      ${!isCurrent ? `<div style="margin-top:4px; font-size:11px; opacity:0.7;">数据为按园区总量等比换算,仅供参考</div>` : ''}
    </div>
    <div class="detail-section">
      <div class="detail-section-title">${monthLabel}用量</div>
      <div class="detail-row"><div class="detail-label">用水量</div><div class="detail-value">${c.water.toLocaleString()} 吨${isCurrent ? ` <span style="color: ${c.deltaWater > 0 ? 'var(--c-danger)' : c.deltaWater < 0 ? 'var(--c-success)' : 'var(--c-text-sub)'};">${c.deltaWater > 0 ? '+' : ''}${c.deltaWater}%</span>` : ''}</div></div>
      <div class="detail-row"><div class="detail-label">用水费</div><div class="detail-value">¥${c.waterFee.toLocaleString()}</div></div>
      <div class="detail-row"><div class="detail-label">用电量</div><div class="detail-value">${c.electric.toLocaleString()} 度${isCurrent ? ` <span style="color: ${c.deltaElec > 0 ? 'var(--c-danger)' : c.deltaElec < 0 ? 'var(--c-success)' : 'var(--c-text-sub)'};">${c.deltaElec > 0 ? '+' : ''}${c.deltaElec}%</span>` : ''}</div></div>
      <div class="detail-row"><div class="detail-label">用电费</div><div class="detail-value">¥${c.elecFee.toLocaleString()}</div></div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">预缴情况</div>
      ${isCurrent ? `
        <div class="detail-row"><div class="detail-label">付费模式</div><div class="detail-value"><span style="color:var(--c-success); font-weight:600;">● 预缴</span></div></div>
        <div class="detail-row"><div class="detail-label">当前余额</div><div class="detail-value" style="color:${c.prepaidBalance === 0 ? 'var(--c-warning)' : 'var(--c-success)'}; font-weight:600; font-size: var(--fs-lg);">¥${c.prepaidBalance.toLocaleString()}${c.prepaidBalance === 0 ? ' · 待充值' : ''}</div></div>
        <div class="detail-row"><div class="detail-label">上次充值</div><div class="detail-value">${c.prepaidAt || '-'}</div></div>
        ${c.prepaidBalance === 0 ? `
          <div class="detail-row"><div class="detail-label">充值建议</div><div class="detail-value" style="color:var(--c-warning);">余额已耗尽,请尽快充值</div></div>
        ` : c.prepaidBalance >= totalFee ? `
          <div class="detail-row"><div class="detail-label">预计可用</div><div class="detail-value" style="color:var(--c-success);">约 ${Math.floor(c.prepaidBalance / Math.max(1, totalFee))} 个月</div></div>
        ` : ''}
      ` : `
        <div class="detail-row"><div class="detail-label">付费模式</div><div class="detail-value" style="color:var(--c-text-sub);">— 历史月份 —</div></div>
        <div class="detail-row"><div class="detail-label">当月预缴</div><div class="detail-value">¥${Math.round((cBase.prepaidBalance + totalFee) * 0.7).toLocaleString()}</div></div>
        <div class="detail-row"><div class="detail-label">说明</div><div class="detail-value" style="color:var(--c-text-sub); font-size: var(--fs-xs);">历史月份无完整充值流水,余额仅作参考</div></div>
      `}
    </div>
    <div class="detail-section">
      <div class="detail-section-title">用量趋势</div>
      <div class="util-trend-tabs">
        <button class="util-trend-tab ${(params.trend || 'daily') === 'daily' ? 'active' : ''}" data-page="utility-company-detail" data-params='{"id":"${cBase.id}","month":"${selMonth}","trend":"daily"}'>${isCurrent ? '月度明细' : selMonth + ' 明细'}</button>
        <button class="util-trend-tab ${params.trend === 'month' ? 'active' : ''}" data-page="utility-company-detail" data-params='{"id":"${cBase.id}","month":"${selMonth}","trend":"month"}'>近 6 月趋势</button>
      </div>
      ${(params.trend || 'daily') === 'month' ? `
        <div class="chart-card" style="margin: 8px 0 0; box-shadow:none; padding: 16px 8px 12px;">
          <div class="chart-bars" style="height: auto; padding: 4px 0;">
            ${companyMonthly.map(m => `
              <div class="chart-bar-wrap ${m.isSel ? 'sel' : ''}">
                <div class="chart-bar-num" style="font-size:10px; line-height:1.35; text-align:center; margin-bottom: 4px;">
                  <div style="color:#c47800; font-weight:${m.isSel ? '700' : '600'}; opacity:${m.isSel ? '1' : '0.7'};">${(m.electric/1000).toFixed(1)}k</div>
                  <div style="color:#1e6fbb; font-weight:${m.isSel ? '700' : '600'}; opacity:${m.isSel ? '1' : '0.7'};">${(m.water/1000).toFixed(2)}k</div>
                </div>
                <div style="display:flex; gap:2px; height: 90px; align-items:flex-end; width: 100%;">
                  <div class="chart-bar water" style="height: ${(m.water / companyMaxWater) * 100}%"></div>
                  <div class="chart-bar electric" style="height: ${(m.electric / companyMaxElec) * 100}%"></div>
                </div>
                <div class="chart-bar-label" style="color:${m.isSel ? 'var(--c-primary)' : 'var(--c-text-sub)'}; font-weight:${m.isSel ? '700' : '400'};">${m.month.slice(5)}</div>
              </div>
            `).join('')}
          </div>
          <div class="chart-legend">
            <span><i class="water"></i>水(千吨)</span>
            <span><i class="electric"></i>电(千度)</span>
          </div>
        </div>
      ` : isCurrent ? `
        <div class="util-daily-list">
          <div class="util-daily-list-head">
            <span>日期</span>
            <span style="color:#1e6fbb;">💧 水(吨)</span>
            <span style="color:#c47800;">⚡ 电(度)</span>
          </div>
          ${[...UTILITY.daily].reverse().map(d => {
            const companyDay = d.companies.find(x => x.id === cBase.id);
            const w = companyDay ? companyDay.water : 0;
            const e = companyDay ? companyDay.electric : 0;
            return `
              <div class="util-daily-list-row">
                <span><span class="util-daily-date">${d.date}</span></span>
                <span style="color:#1e6fbb;">${w.toFixed(1)}</span>
                <span style="color:#c47800;">${e.toFixed(1)}</span>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <div style="text-align:center; padding: 24px 12px; color: var(--c-text-sub); font-size: var(--fs-sm); background: #f7f8fa; border-radius: 8px; margin-top: 8px;">
          ${selMonth} 月暂无日级明细数据<br>
          <span style="font-size:11px; color: var(--c-text-sub);">月合计:水 ${c.water.toLocaleString()} 吨 · 电 ${c.electric.toLocaleString()} 度</span>
        </div>
      `}
    </div>
    <div style="height: 16px"></div>
  `;
  return subPageShell(c.name, content);
};

PAGE_RENDERERS['utility-prepaid'] = () => {
  const list = UTILITY.byCompany;
  const sortedList = [...list].sort((a, b) => a.prepaidBalance - b.prepaidBalance);
  const totalBalance = list.reduce((s, c) => s + c.prepaidBalance, 0);
  const totalMonthFee = list.reduce((s, c) => s + c.waterFee + c.elecFee, 0);
  const totalWater = list.reduce((s, c) => s + c.water, 0);
  const totalElec = list.reduce((s, c) => s + c.electric, 0);
  /* 需关注:余额 0 + 余额不足(余额 < 本月费用) */
  const warnList = list.filter(c => c.prepaidBalance < c.waterFee + c.elecFee);

  /* 渲染单家企业卡片:水/电使用 + 预缴余额 合并展示 */
  const renderCompanyCard = (c) => {
    const fee = c.waterFee + c.elecFee;
    const isEmpty = c.prepaidBalance === 0;
    const isLow = !isEmpty && c.prepaidBalance < fee;
    const tag = isEmpty
      ? `<span class="list-card-tag" style="background:var(--c-warning-soft); color:var(--c-warning); padding:1px 6px; border-radius:8px; font-size:11px;">待充值</span>`
      : isLow
        ? `<span class="util-attn-icon" title="需关注"></span>`
        : `<span class="list-card-tag" style="background:var(--c-success-soft); color:var(--c-success); padding:1px 6px; border-radius:8px; font-size:11px;">预缴</span>`;
    const balanceLine = isEmpty
      ? `<div class="list-card-row" style="color:var(--c-warning);">余额 ¥0</div>`
      : `<div class="list-card-row" style="color:${isLow ? 'var(--c-warning)' : 'var(--c-success)'};">余额 ¥${c.prepaidBalance.toLocaleString()}</div>`;
    return `
      <div class="list-card" data-page="utility-company-detail" data-params='{"id":"${c.id}"}' style="margin-bottom: 8px;">
        <div class="list-card-header">
          <div class="list-card-title">${tag}<span class="list-card-title-text">${c.name}</span></div>
          <span class="list-card-status">¥${fee.toLocaleString()}</span>
        </div>
        <div class="list-card-meta">
          <span style="color:#1e6fbb;">💧 ${c.water} 吨</span>
          <span style="color:#c47800;">⚡ ${c.electric} 度</span>
        </div>
        ${balanceLine}
      </div>
    `;
  };

  const content = `
    <div class="hero-card prepaid-hero">
      <div class="hero-card-label">预缴总余额</div>
      <div class="hero-card-value">¥${totalBalance.toLocaleString()}</div>
      <div class="hero-card-meta">${list.length} 家企业 · 余额为 0 待充值 ${list.filter(c => c.prepaidBalance === 0).length} 家</div>
    </div>
    <div class="mini-stat-row">
      <div class="mini-stat">
        <div class="mini-stat-value success">¥${(totalBalance / 10000).toFixed(2)}<span class="mini-stat-unit" style="font-size:11px;">万</span></div>
        <div class="mini-stat-label">总余额</div>
      </div>
      <div class="mini-stat" title="需关注企业数">
        <div class="mini-stat-value ${warnList.length > 0 ? 'warning' : ''}">${warnList.length}</div>
        <div class="mini-stat-label" style="display:flex; align-items:center; justify-content:center; gap:4px;">
          <span class="util-attn-icon" style="width:14px; height:14px; font-size:9px;"></span>
        </div>
      </div>
      <div class="mini-stat">
        <div class="mini-stat-value">¥${(totalMonthFee / 10000).toFixed(1)}<span class="mini-stat-unit" style="font-size:11px;">万</span></div>
        <div class="mini-stat-label">本月应收</div>
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section-title">本月总用量</div>
      <div class="detail-row"><div class="detail-label">用水合计</div><div class="detail-value" style="color:#1e6fbb;">${totalWater.toLocaleString()} 吨</div></div>
      <div class="detail-row"><div class="detail-label">用电合计</div><div class="detail-value" style="color:#c47800;">${totalElec.toLocaleString()} 度</div></div>
      <div class="detail-row"><div class="detail-label">水 + 电 费用</div><div class="detail-value" style="font-weight:600;">¥${totalMonthFee.toLocaleString()}</div></div>
    </div>

    <div class="detail-section">
      <div class="detail-section-title">所有企业 · 水/电使用 + 预缴情况(${list.length})</div>
      ${sortedList.map(c => renderCompanyCard(c)).join('')}
    </div>

    <div style="height: 16px"></div>
  `;
  return subPageShell('预缴管理', content, `<button class="sub-action" data-page="utility-company">企业用量</button>`);
};

PAGE_RENDERERS['utility-analysis'] = (params) => {
  const u = UTILITY;
  const WATER_PRICE = 4, ELEC_PRICE = 0.75;
  const tab = params && params.tab === 'electric' ? 'electric' : 'water';
  const months = u.monthly.slice(-6);
  const rangeLabel = `${months[0].month} ~ ${months[months.length - 1].month}`;

  const cfg = tab === 'water' ? {
    key: 'water', name: '水', unit: '吨', price: WATER_PRICE, color: '#1e6fbb',
    icon: '💧', barClass: 'water', feeName: '水费', legendUnit: '千吨'
  } : {
    key: 'electric', name: '电', unit: '度', price: ELEC_PRICE, color: '#c47800',
    icon: '⚡', barClass: 'electric', feeName: '电费', legendUnit: '千度'
  };

  /* 每月该资源:用量 / 实际费 / 按费用占比拆分的预缴份额 */
  const series = months.map(m => {
    const waterFee = m.water * WATER_PRICE;
    const elecFee = m.electric * ELEC_PRICE;
    const totalFee = waterFee + elecFee;
    const actual = Math.round(m[cfg.key] * cfg.price);
    const prepaid = totalFee > 0 ? Math.round(m.prepaid * actual / totalFee) : 0;
    return { month: m.month, value: m[cfg.key], actual, prepaid };
  });
  const maxVal = Math.max(...series.map(s => s.value));
  const maxFee = Math.max(...series.map(s => Math.max(s.prepaid, s.actual)));
  const totalUsage = series.reduce((s, x) => s + x.value, 0);
  const avgUsage = Math.round(totalUsage / series.length);
  const totalActual = series.reduce((s, x) => s + x.actual, 0);
  const totalPrepaid = series.reduce((s, x) => s + x.prepaid, 0);
  const totalDiff = totalPrepaid - totalActual;
  const sortedDesc = [...series].sort((a, b) => b.value - a.value);
  const peakMonth = sortedDesc[0];
  const valleyMonth = sortedDesc[sortedDesc.length - 1];
  const fmtK = v => tab === 'water' ? (v / 1000).toFixed(1) + 'k' : (v / 1000).toFixed(0) + 'k';

  const content = `
    <div class="util-trend-tabs">
      <button class="util-trend-tab ${tab === 'water' ? 'active' : ''}" data-page="utility-analysis" data-params='{"tab":"water"}'>💧 水</button>
      <button class="util-trend-tab ${tab === 'electric' ? 'active' : ''}" data-page="utility-analysis" data-params='{"tab":"electric"}'>⚡ 电</button>
    </div>

    <div class="hero-card" style="background: linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc); color:#fff;">
      <div class="hero-card-label" style="color:rgba(255,255,255,0.85);">${cfg.icon} 近 6 月累计${cfg.name}用量 · ${rangeLabel}</div>
      <div class="hero-card-value">${totalUsage.toLocaleString()} <span style="font-size:14px; font-weight:500; opacity:0.9;">${cfg.unit}</span></div>
      <div class="hero-card-meta" style="color:rgba(255,255,255,0.9);">
        月均 <b>${avgUsage.toLocaleString()} ${cfg.unit}</b> · 累计${cfg.feeName} <b>¥${totalActual.toLocaleString()}</b>
      </div>
      <div class="hero-card-meta" style="color:rgba(255,255,255,0.9); margin-top: 4px;">
        累计预缴 <b>¥${totalPrepaid.toLocaleString()}</b> · 差额 <b>${totalDiff >= 0 ? '+' : ''}¥${totalDiff.toLocaleString()}</b>
      </div>
    </div>

    <div class="page-section">
      <div class="section-header">
        <div class="section-title">6 月 · ${cfg.name}预缴 vs 实际</div>
        <span class="section-more">元 · 预缴按占比拆分</span>
      </div>
      <div class="chart-card">
        <div class="chart-bars">
          ${series.map(s => `
            <div class="chart-bar-wrap">
              <div class="chart-bar-num" style="display:flex; gap:2px; justify-content:center; font-size:9px; color: var(--c-text-sub); margin-bottom: 2px; line-height:1.2;">
                <span style="width:50%; text-align:center; color:#059669;">${(s.prepaid/1000).toFixed(0)}k</span>
                <span style="width:50%; text-align:center; color:#ea580c;">${(s.actual/1000).toFixed(0)}k</span>
              </div>
              <div style="display:flex; gap:2px; height: 110px; align-items:flex-end; width: 100%;">
                <div class="chart-bar prepaid" style="height: ${(s.prepaid / maxFee) * 100}%" title="预缴 ${s.prepaid}"></div>
                <div class="chart-bar actual" style="height: ${(s.actual / maxFee) * 100}%" title="实际 ${s.actual}"></div>
              </div>
              <div class="chart-bar-label">${s.month.slice(5)}</div>
            </div>
          `).join('')}
        </div>
        <div class="chart-legend">
          <span><i class="prepaid"></i>预缴(千)</span>
          <span><i class="actual"></i>实际(千)</span>
        </div>
      </div>
    </div>

    <div class="page-section">
      <div class="section-header">
        <div class="section-title">6 月 · ${cfg.name}用量趋势</div>
        <span class="section-more">月累计</span>
      </div>
      <div class="chart-card">
        <div class="chart-bars">
          ${series.map(s => `
            <div class="chart-bar-wrap">
              <div class="chart-bar-num" style="font-size:9px; color: var(--c-text-sub); margin-bottom: 2px; line-height:1.2; text-align:center;">
                <span style="color:${cfg.color};">${fmtK(s.value)}</span>
              </div>
              <div style="display:flex; gap:2px; height: 110px; align-items:flex-end; width: 100%;">
                <div class="chart-bar ${cfg.barClass}" style="height: ${(s.value / maxVal) * 100}%" title="${cfg.name} ${s.value}"></div>
              </div>
              <div class="chart-bar-label">${s.month.slice(5)}</div>
            </div>
          `).join('')}
        </div>
        <div class="chart-legend">
          <span><i class="${cfg.barClass}"></i>${cfg.name}(${cfg.legendUnit})</span>
        </div>
      </div>
    </div>

    <div class="page-section">
      <div class="section-header">
        <div class="section-title">${cfg.name}用量极值</div>
      </div>
      <div class="list-page" style="padding-top: 0;">
        <div class="list-card" style="cursor:default;">
          <div class="list-card-header">
            <div class="list-card-title"><span class="rank-badge rank-1">峰</span><span class="list-card-title-text">${cfg.name}用量最高</span></div>
            <span class="list-card-status s-active">${peakMonth.month.slice(5)}</span>
          </div>
          <div class="list-card-meta">
            <span style="color:${cfg.color};">${cfg.icon} ${peakMonth.value.toLocaleString()} ${cfg.unit}</span>
            <span style="color: var(--c-text-sub);">${cfg.feeName} ¥${peakMonth.actual.toLocaleString()}</span>
          </div>
          <div class="list-card-row">较月均 +${Math.round((peakMonth.value - avgUsage) / avgUsage * 100)}%</div>
        </div>
        <div class="list-card" style="cursor:default;">
          <div class="list-card-header">
            <div class="list-card-title"><span class="rank-badge rank-2">谷</span><span class="list-card-title-text">${cfg.name}用量最低</span></div>
            <span class="list-card-status s-active">${valleyMonth.month.slice(5)}</span>
          </div>
          <div class="list-card-meta">
            <span style="color:${cfg.color};">${cfg.icon} ${valleyMonth.value.toLocaleString()} ${cfg.unit}</span>
            <span style="color: var(--c-text-sub);">${cfg.feeName} ¥${valleyMonth.actual.toLocaleString()}</span>
          </div>
          <div class="list-card-row">较月均 ${Math.round((valleyMonth.value - avgUsage) / avgUsage * 100)}%</div>
        </div>
      </div>
    </div>

    <div style="height: 16px"></div>
  `;
  return subPageShell('水电分析', content, `<button class="sub-action" data-page="utility-dashboard">总览</button>`);
};

PAGE_RENDERERS['utility-daily'] = (params) => {
  const daily = UTILITY.daily;
  /* 默认选中"今天"(最后一天) */
  const defaultDate = params.date || daily[daily.length - 1].date;
  const sel = daily.find(d => d.date === defaultDate) || daily[daily.length - 1];
  /* 排序后的企业(按总费用降序) */
  const ranked = [...sel.companies].sort((a, b) => (b.water + b.electric) - (a.water + a.electric));
  const maxCompanyUsage = Math.max(...ranked.map(c => c.water + c.electric));

  /* 日期选择器(7 天一组,避免过长) */
  const dateChips = daily.slice(-7).reverse().map(d => {
    const active = d.date === sel.date;
    return `<button class="filter-item ${active ? 'active' : ''}" data-page="utility-daily" data-params='{"date":"${d.date}"}'>${d.date.slice(5)} 周${d.weekday}</button>`;
  }).join('');

  const content = `
    <div class="hero-card prepaid-hero" style="margin-bottom: 12px;">
      <div class="hero-card-label">${sel.date} · 周${sel.weekday}</div>
      <div style="display:flex; gap:18px; margin-top: 4px;">
        <div>
          <div class="hero-card-meta" style="opacity:0.9;">当日用水(吨)</div>
          <div style="font-size: 22px; font-weight: 700; letter-spacing: -0.3px; white-space: nowrap;">${sel.water.toFixed(1)}</div>
        </div>
        <div>
          <div class="hero-card-meta" style="opacity:0.9;">当日用电(度)</div>
          <div style="font-size: 22px; font-weight: 700; letter-spacing: -0.3px; white-space: nowrap;">${sel.electric.toFixed(1)}</div>
        </div>
        <div>
          <div class="hero-card-meta" style="opacity:0.9;">当日费用(元)</div>
          <div style="font-size: 22px; font-weight: 700; letter-spacing: -0.3px; white-space: nowrap;">¥${(sel.waterFee + sel.elecFee).toLocaleString()}</div>
        </div>
      </div>
    </div>

    <div class="filter-bar" style="position:relative; top:0; margin: 0 12px; border-radius: var(--r-md); border: 1px solid var(--c-line-soft); padding: 6px;">
      ${dateChips}
    </div>

    <div class="page-section">
      <div class="section-header">
        <div class="section-title">当日各企业用量</div>
        <span class="section-more">${ranked.length} 家</span>
      </div>
      ${ranked.map((c, i) => {
        const total = c.water + c.electric;
        const pct = (total / maxCompanyUsage) * 100;
        return `
          <div class="list-card" data-page="utility-company-detail" data-params='{"id":"${c.id}"}'>
            <div class="list-card-header">
              <div class="list-card-title">
                <span class="rank-badge rank-${i < 3 ? i + 1 : 'n'}">${i + 1}</span>
                <span class="list-card-title-text">${c.name}</span>
              </div>
              <span class="list-card-status s-active">${total.toFixed(1)} 单位</span>
            </div>
            <div class="util-progress" style="margin: 4px 0 6px;">
              <div class="util-progress-bar" style="width:${pct}%"></div>
            </div>
            <div class="list-card-meta">
              <span style="color:#1e6fbb;">💧 ${c.water.toFixed(1)} 吨</span>
              <span style="color:#c47800;">⚡ ${c.electric.toFixed(1)} 度</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
    <div style="height: 16px"></div>
  `;
  return subPageShell('每日使用明细', content, `<button class="sub-action" data-page="utility-dashboard">总览</button>`);
};

PAGE_RENDERERS['contract-list'] = (params) => {
  const filter = params.filter || 'all';
  const list = CONTRACTS.filter(c => {
    const cur = getCtStatus(c.id) || c.status;
    if (filter === 'all') return true;
    if (filter === 'pending') return cur === '待审批';
    if (filter === 'active') return cur === '生效中';
    if (filter === 'expiring') return c.daysToExpire != null && c.daysToExpire < 90;
    return true;
  });

  const content = `
    <div class="filter-bar">
      ${[['all','全部'],['pending','待审批'],['active','生效中'],['expiring','即将到期']]
        .map(([k, l]) => `<button class="filter-item ${filter === k ? 'active' : ''}" data-page="contract-list" data-params='{"filter":"${k}"}'>${l}</button>`).join('')}
    </div>
    <div class="list-page">
      ${list.map(c => {
        const cur = getCtStatus(c.id) || c.status;
        return `
          <div class="list-card" data-page="contract-detail" data-params='{"id":"${c.id}"}'>
            <div class="list-card-header">
              <div class="list-card-title"><span class="list-card-title-text">${c.company} · ${c.type}</span></div>
              <span class="list-card-status s-${cur === '已驳回' ? '已到期' : cur}">${cur}</span>
            </div>
            <div class="list-card-meta">
              <span>${c.code}</span><span>${c.area}㎡</span>
            </div>
            <div class="list-card-row">${c.startDate} ~ ${c.endDate} · ¥${(c.amount / 10000).toFixed(0)}万 / ${c.payment}</div>
            ${c.daysToExpire != null ? `<div class="list-card-row" style="color: ${c.daysToExpire < 60 ? 'var(--c-danger)' : 'var(--c-warning)'};">${c.daysToExpire} 天后到期</div>` : ''}
          </div>
        `;
      }).join('')}
    </div>
  `;
  return subPageShell('合同管理', content, `<button class="sub-action" data-page="contract-create">+ 新建</button>`);
};

PAGE_RENDERERS['contract-detail'] = (params) => {
  const c = getContract(params.id);
  if (!c) return subPageShell('合同详情', emptyState('合同不存在'));
  const cur = getCtStatus(c.id) || c.status;
  const role = ROLES[state.roleId];
  const isReadonly = role.readonlyModules && role.readonlyModules.includes('M07');
  const canApprove = cur === '待审批' && state.roleId === 'manager' && !isReadonly;

  const actions = [];
  if (canApprove) {
    actions.push({ label: '审批通过', act: 'approve', cls: 'btn-primary' });
    actions.push({ label: '驳回', act: 'reject', cls: 'btn-default' });
  }
  if (cur === '生效中' && state.roleId === 'business') {
    actions.push({ label: '发起续约', act: 'renew', cls: 'btn-primary' });
  }

  const footer = actions.length ? `<div class="footer-actions">${actions.map(a => `<button class="btn ${a.cls}" data-ct-action="${a.act}" data-ct-id="${c.id}">${a.label}</button>`).join('')}</div>` : '';

  const content = `
    <div class="detail-hero">
      <div class="detail-hero-status">${cur}</div>
      <div class="detail-hero-title">${c.company} · ${c.type}</div>
      <div class="detail-hero-meta">${c.code}</div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">合同信息</div>
      <div class="detail-row"><div class="detail-label">位置</div><div class="detail-value">${c.building} · ${c.area}㎡</div></div>
      <div class="detail-row"><div class="detail-label">金额</div><div class="detail-value" style="color: var(--c-danger);">¥${c.amount.toLocaleString()}</div></div>
      <div class="detail-row"><div class="detail-label">付款方式</div><div class="detail-value">${c.payment}</div></div>
      <div class="detail-row"><div class="detail-label">签约人</div><div class="detail-value">${c.signer}</div></div>
      <div class="detail-row"><div class="detail-label">生效期</div><div class="detail-value">${c.startDate} ~ ${c.endDate}</div></div>
      ${c.daysToExpire != null ? `<div class="detail-row"><div class="detail-label">距到期</div><div class="detail-value" style="color: ${c.daysToExpire < 60 ? 'var(--c-danger)' : 'var(--c-warning)'};">${c.daysToExpire} 天</div></div>` : ''}
    </div>
    ${c.pdf ? `
    <div class="detail-section">
      <div class="detail-section-title">合同附件</div>
      <div class="contract-pdf-card" data-ct-pdf='${JSON.stringify({ id: c.id, fileName: c.pdf.fileName })}'>
        <div class="contract-pdf-icon">PDF</div>
        <div class="contract-pdf-body">
          <div class="contract-pdf-name">${c.pdf.fileName}</div>
          <div class="contract-pdf-meta">${c.pdf.size} · ${c.pdf.pages} 页</div>
        </div>
        <button class="contract-pdf-btn">查看</button>
      </div>
    </div>
    ` : ''}
    <div class="detail-section">
      <div class="detail-section-title">审批记录</div>
      <div class="timeline">
        ${(c.history.length ? c.history : [{ time: c.submitTime, actor: c.submitBy || '商务', action: '提交审批', desc: c.type }]).map(h => `
          <div class="timeline-item done">
            <div class="timeline-time">${h.time}</div>
            <div class="timeline-title">${h.actor} · ${h.action}</div>
            <div class="timeline-desc">${h.desc || ''}</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div style="height: 76px"></div>
    ${footer}
  `;
  return subPageShell('合同详情', content);
};

/* ============================================
 * M07-4 续约提醒独立页
 * 60/30/15/7 天四个节点;按到期天数升序
 * 推送对象: 商务 / 经理 / 运营专员
 * ============================================ */

PAGE_RENDERERS['contract-renewal'] = (params) => {
  const role = ROLES[state.roleId];
  if (!['business', 'manager', 'operator'].includes(role.id)) {
    return subPageShell('续约提醒', `<div class="coming-soon"><div class="coming-soon-icon">🔒</div><div class="coming-soon-text">仅商务/经理/运营专员可查看续约提醒</div></div>`);
  }

  const stages = [
    { key: 'all',   label: '全部' },
    { key: '60',    label: '60天内' },
    { key: '30',    label: '30天内' },
    { key: '15',    label: '15天内' },
    { key: '7',     label: '7天内' }
  ];
  const stage = params.stage || 'all';
  const list = CONTRACTS.filter(c => {
    if (c.daysToExpire == null) return false;
    if (stage === 'all')  return c.daysToExpire <= 90;
    if (stage === '60')   return c.daysToExpire <= 60;
    if (stage === '30')   return c.daysToExpire <= 30;
    if (stage === '15')   return c.daysToExpire <= 15;
    if (stage === '7')    return c.daysToExpire <= 7;
    return true;
  }).sort((a, b) => a.daysToExpire - b.daysToExpire);

  const counts = {
    all: CONTRACTS.filter(c => c.daysToExpire != null && c.daysToExpire <= 90).length,
    60:  CONTRACTS.filter(c => c.daysToExpire != null && c.daysToExpire <= 60).length,
    30:  CONTRACTS.filter(c => c.daysToExpire != null && c.daysToExpire <= 30).length,
    15:  CONTRACTS.filter(c => c.daysToExpire != null && c.daysToExpire <= 15).length,
    7:   CONTRACTS.filter(c => c.daysToExpire != null && c.daysToExpire <= 7).length
  };

  const tagFor = (d) => {
    if (d <= 7)  return '<span class="urgent-tag urgent-high">7天内</span>';
    if (d <= 15) return '<span class="urgent-tag urgent-high">15天</span>';
    if (d <= 30) return '<span class="urgent-tag urgent-mid">30天</span>';
    return '<span class="urgent-tag urgent-low">60天</span>';
  };

  const content = `
    <div class="filter-bar">
      ${stages.map(s => `<button class="filter-item ${stage === s.key ? 'active' : ''}" data-page="contract-renewal" data-params='{"stage":"${s.key}"}'>${s.label} ${counts[s.key]}</button>`).join('')}
    </div>
    <div class="list-summary">共 ${list.length} 份合同进入预警期</div>
    <div class="list-page">
      ${list.length === 0 ? emptyState('该范围内暂无到期合同') : list.map(c => `
        <div class="list-card" data-page="contract-detail" data-params='{"id":"${c.id}"}'>
          <div class="list-card-header">
            <div class="list-card-title">${tagFor(c.daysToExpire)}<span class="list-card-title-text">${c.company}</span></div>
            <span class="list-card-status s-${c.daysToExpire <= 30 ? '待派单' : '处理中'}">${c.daysToExpire} 天</span>
          </div>
          <div class="list-card-meta">
            <span>${c.code}</span><span>${c.area}㎡</span><span>${c.type}</span>
          </div>
          <div class="list-card-row">到期 ${c.endDate} · 年金额 ¥${(c.amount / 10000).toFixed(0)}万 · ${c.payment}</div>
          <div class="list-card-row" style="color: var(--c-text-sub);">位置: ${c.building}</div>
        </div>
      `).join('')}
    </div>
  `;
  return subPageShell('续约提醒', content);
};

PAGE_RENDERERS['contract-create'] = (params) => {
  const content = `
    <div class="form-page">
      <div class="form-section-title">合同信息</div>
      <div class="form-card">
        <div class="form-row">
          <div class="form-label required">企业</div>
          <div class="form-control">
            <div class="form-chip-group">
              ${COMPANIES.slice(0, 4).map((c, i) => `<div class="form-chip ${i === 0 ? 'active' : ''}">${c.name}</div>`).join('')}
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-label required">合同类型</div>
          <div class="form-control">
            <div class="form-chip-group">
              <div class="form-chip active">租赁合同</div><div class="form-chip">物业合同</div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-label required">位置</div>
          <div class="form-control"><input class="form-input" placeholder="如: A 栋 5 层" /></div>
        </div>
        <div class="form-row">
          <div class="form-label required">面积(㎡)</div>
          <div class="form-control"><input class="form-input" type="number" placeholder="0" /></div>
        </div>
        <div class="form-row">
          <div class="form-label required">年金额</div>
          <div class="form-control"><input class="form-input" type="number" placeholder="0" /></div>
        </div>
        <div class="form-row">
          <div class="form-label required">生效期</div>
          <div class="form-control"><input class="form-input" placeholder="开始 ~ 结束" /></div>
        </div>
        <div class="form-row column">
          <div class="form-label">备注</div>
          <div class="form-control"><textarea class="form-textarea" placeholder="选填"></textarea></div>
        </div>
      </div>
      <div style="padding: 12px;">
        <button class="btn btn-primary btn-block" data-ct-create-submit>提交审批</button>
      </div>
    </div>
  `;
  return subPageShell('新建合同', content);
};

/* ============================================
 * M08 企业入驻
 * ============================================ */

PAGE_RENDERERS['company-list'] = (params) => {
  const filter = params.filter || 'all';
  const kw = (params.kw || '').trim();
  const list = COMPANIES.filter(c => {
    if (kw && !c.name.includes(kw)) return false;
    if (filter === 'all') return true;
    if (filter === 'active') return c.status === 'active';
    if (filter === 'expiring') return c.status === 'expiring';
    if (filter === 'overdue') return c.feeStatus === 'overdue';
    return true;
  });

  const content = `
    <div class="filter-bar">
      ${[['all','全部'],['active','正常'],['expiring','即将到期'],['overdue','欠费']]
        .map(([k, l]) => `<button class="filter-item ${filter === k ? 'active' : ''}" data-page="company-list" data-params='{"filter":"${k}","kw":"${kw}"}'>${l}</button>`).join('')}
    </div>
    <div class="list-page">
      ${list.length === 0 ? emptyState('无匹配企业') : list.map(c => `
        <div class="list-card" data-page="company-detail" data-params='{"id":"${c.id}"}'>
          <div class="list-card-header">
            <div class="list-card-title">
              <span class="list-card-title-text">${c.name}</span>
            </div>
            <span class="list-card-status s-${c.feeStatus === 'overdue' ? '欠费' : c.status}">${c.feeStatus === 'overdue' ? '欠费' : c.status === 'expiring' ? '即将到期' : '正常'}</span>
          </div>
          <div class="list-card-meta">
            <span>${c.industry}</span><span>${c.building}</span><span>${c.area}㎡</span>
          </div>
          <div class="list-card-row">联系人: ${c.contact} · ${c.phone}</div>
        </div>
      `).join('')}
    </div>
  `;
  return subPageShell('入驻企业', content);
};

PAGE_RENDERERS['company-detail'] = (params) => {
  const c = getCompany(params.id);
  if (!c) return subPageShell('企业详情', emptyState('企业不存在'));
  const bills = BILLS.filter(b => b.companyId === c.id);
  const owed = bills.reduce((s, b) => s + b.owed, 0);
  const contracts = CONTRACTS.filter(ct => ct.company === c.name);

  const content = `
    <div class="detail-hero">
      <div class="detail-hero-status">${c.status === 'active' ? '正常入驻' : '即将到期'}</div>
      <div class="detail-hero-title">${c.name}</div>
      <div class="detail-hero-meta">${c.industry} · ${c.scale || ''}</div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">基本信息</div>
      <div class="detail-row"><div class="detail-label">统一信用码</div><div class="detail-value">${c.credit}</div></div>
      <div class="detail-row"><div class="detail-label">企业类型</div><div class="detail-value">${c.companyType || '-'}</div></div>
      <div class="detail-row"><div class="detail-label">行业类型</div><div class="detail-value">${c.industry || '-'}</div></div>
      <div class="detail-row"><div class="detail-label">企业规模</div><div class="detail-value">${c.scale || '-'}</div></div>
      <div class="detail-row"><div class="detail-label">入驻位置</div><div class="detail-value">${c.building} · ${c.area}㎡</div></div>
      <div class="detail-row"><div class="detail-label">入驻期</div><div class="detail-value">${c.startDate} ~ ${c.endDate}</div></div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">联系人</div>
      <div class="detail-row"><div class="detail-label">法定代表人</div><div class="detail-value">${c.legal || '-'}${c.legalPhone ? ' · ' + c.legalPhone : ''}</div></div>
      <div class="detail-row"><div class="detail-label">企业负责人</div><div class="detail-value">${c.principal || '-'}${c.principalPhone ? ' · ' + c.principalPhone : ''}</div></div>
      <div class="detail-row"><div class="detail-label">园区经办人</div><div class="detail-value">${c.parkAgent || '-'}${c.parkAgentPhone ? ' · ' + c.parkAgentPhone : ''}</div></div>
      <div class="detail-row"><div class="detail-label">财务联系人</div><div class="detail-value">${c.financeContact || '-'}${c.financeContactPhone ? ' · ' + c.financeContactPhone : ''}</div></div>
      <div class="detail-row"><div class="detail-label">业务联系人</div><div class="detail-value">${c.contact || '-'} · ${c.phone || '-'}</div></div>
      <div class="detail-row"><div class="detail-label">邮箱</div><div class="detail-value">${c.email || '-'}</div></div>
    </div>
    ${c.remark ? `
    <div class="detail-section">
      <div class="detail-section-title">企业备注</div>
      <div style="font-size: var(--fs-sm); color: var(--c-text-sub); line-height: 1.6; padding: 4px 0;">${c.remark}</div>
    </div>
    ` : ''}
    <div class="detail-section">
      <div class="detail-section-title">合同(${contracts.length})</div>
      ${contracts.length === 0 ? '<div class="empty-state" style="padding:16px;"><div class="empty-state-text">无</div></div>' : contracts.map(ct => `
        <div class="card-row" data-page="contract-detail" data-params='{"id":"${ct.id}"}'>
          <div class="card-row-icon">合</div>
          <div class="card-row-body">
            <div class="card-row-title">${ct.type}</div>
            <div class="card-row-desc">${ct.startDate} ~ ${ct.endDate}</div>
          </div>
          <span class="list-card-status s-${ct.status}">${ct.status}</span>
          <span class="card-row-arrow">›</span>
        </div>
      `).join('')}
    </div>
    <div class="detail-section">
      <div class="detail-section-title">账单(${bills.length})</div>
      ${bills.length === 0 ? '<div class="empty-state" style="padding:16px;"><div class="empty-state-text">无</div></div>' : bills.slice(0, 3).map(b => `
        <div class="card-row" data-page="fee-bill-detail" data-params='{"id":"${b.id}"}'>
          <div class="card-row-icon" style="background:${b.owed > 0 ? 'var(--c-danger-soft)' : 'var(--c-success-soft)'};color:${b.owed > 0 ? 'var(--c-danger)' : 'var(--c-success)'};">${b.type.charAt(0)}</div>
          <div class="card-row-body">
            <div class="card-row-title">${b.type} · ${b.period}</div>
            <div class="card-row-desc">应收 ¥${b.shouldPay.toLocaleString()}</div>
          </div>
          <span class="list-card-status s-${b.status}">${b.status}</span>
          <span class="card-row-arrow">›</span>
        </div>
      `).join('')}
      ${owed > 0 ? `<div style="margin-top:8px; padding:8px 12px; background:var(--c-danger-soft); color:var(--c-danger); border-radius: var(--r-sm); font-size: var(--fs-sm); text-align:center;">累计欠费 ¥${owed.toLocaleString()}</div>` : ''}
    </div>
    <div style="height: 16px"></div>
  `;
  return subPageShell(c.name, content);
};

/* ============================================
 * M09 OA
 * ============================================ */

PAGE_RENDERERS['form-list'] = (params) => {
  const role = ROLES[state.roleId];
  const scope = params.scope || 'mine';
  const type = params.type || 'all';
  const meName = role.user;

  /* 主 Tab:我发起的 / 待我审批 / 我已审批 */
  const isMyApplicant = f => f.applicant === meName;
  const isMyPending = f => {
    const cur = getFormStatus(f.id) || f.status;
    if (cur !== '待审批') return false;
    const node = f.flow.find(n => n.current);
    if (!node) return false;
    if (node.actor === meName) return true;
    if (node.actor === '经理' && state.roleId === 'manager') return true;
    if (node.actor === '财务' && state.roleId === 'finance') return true;
    if (node.actor === '法务总监' && state.roleId === 'manager') return true;
    if (node.actor === '直属上级' && state.roleId === 'staff' && f.applicant === '赵磊') return true;
    return false;
  };
  const isMyProcessed = f => {
    const cur = getFormStatus(f.id) || f.status;
    if (cur !== '已通过' && cur !== '已驳回') return false;
    return f.flow.some(n => n.actor === meName && n.done);
  };

  const scopeFilter = scope === 'pending' ? isMyPending
                    : scope === 'processed' ? isMyProcessed
                    : isMyApplicant;

  const list = FORMS.filter(f => {
    if (!scopeFilter(f)) return false;
    if (type === 'all') return true;
    if (type === 'leave') return f.type === '请假';
    if (type === 'expense') return f.type === '报销';
    if (type === 'seal') return f.type === '用印';
    return true;
  });

  const countByScope = (fn) => FORMS.filter(fn).length;
  const counts = {
    mine: countByScope(isMyApplicant),
    pending: countByScope(isMyPending),
    processed: countByScope(isMyProcessed)
  };

  const content = `
    <div class="filter-bar" style="top:44px; padding:0; border-bottom:none;">
      ${[['mine','我发起的'],['pending','待我审批'],['processed','我已审批']]
        .map(([k, l]) => `<button class="filter-item ${scope === k ? 'active' : ''}" data-page="form-list" data-params='{"scope":"${k}","type":"${type}"}'>${l} ${counts[k]}</button>`).join('')}
    </div>
    <div class="filter-bar" style="top:88px; padding:6px 12px; border-top:1px solid var(--c-line-soft);">
      ${[['all','全部'],['leave','请假'],['expense','报销'],['seal','用印']]
        .map(([k, l]) => `<button class="filter-item ${type === k ? 'active' : ''}" data-page="form-list" data-params='{"scope":"${scope}","type":"${k}"}'>${l}</button>`).join('')}
    </div>
    <div class="list-summary" style="margin-top:32px;">共 ${list.length} 单</div>
    <div class="list-page">
      ${list.length === 0 ? emptyState('该视角下暂无单据') : list.map(f => {
        const cur = getFormStatus(f.id) || f.status;
        const icon = f.type === '请假' ? '请' : f.type === '报销' ? '报' : '印';
        return `
          <div class="list-card" data-page="form-detail" data-params='{"id":"${f.id}"}'>
            <div class="list-card-header">
              <div class="list-card-title">
                <span class="list-card-title-text">${f.type} · ${f.applicant}</span>
              </div>
              <span class="list-card-status s-${cur}">${cur}</span>
            </div>
            <div class="list-card-meta">
              <span>${f.dept}</span><span>${f.submitTime.split(' ')[1] || f.submitTime}</span>
            </div>
            <div class="list-card-row">${f.detail.leaveType || f.detail.reimType || f.detail.sealType}${f.detail.amount ? ` · ¥${f.detail.amount}` : f.detail.days ? ` · ${f.detail.days} 天` : ''}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  return subPageShell('OA', content, `<button class="sub-action" data-page="form-new">+ 新建</button>`);
};

PAGE_RENDERERS['form-detail'] = (params) => {
  const f = getForm(params.id);
  if (!f) return subPageShell('单据详情', emptyState('单据不存在'));
  const cur = getFormStatus(f.id) || f.status;
  const role = ROLES[state.roleId];

  const isCurrentNode = f.flow.find(n => n.current);
  const canApprove = cur === '待审批' && isCurrentNode && (
    (isCurrentNode.actor === role.user) ||
    (isCurrentNode.actor === '经理' && state.roleId === 'manager') ||
    (isCurrentNode.actor === '财务' && state.roleId === 'finance')
  );

  /* 详情内容 */
  let detailHtml = '';
  if (f.type === '请假') {
    detailHtml = `
      <div class="detail-row"><div class="detail-label">类型</div><div class="detail-value">${f.detail.leaveType}</div></div>
      <div class="detail-row"><div class="detail-label">开始</div><div class="detail-value">${f.detail.startDate}</div></div>
      <div class="detail-row"><div class="detail-label">结束</div><div class="detail-value">${f.detail.endDate}</div></div>
      <div class="detail-row"><div class="detail-label">天数</div><div class="detail-value">${f.detail.days} 天</div></div>
      <div class="detail-row"><div class="detail-label">原因</div><div class="detail-value">${f.detail.reason}</div></div>
    `;
  } else if (f.type === '报销') {
    detailHtml = `
      <div class="detail-row"><div class="detail-label">类型</div><div class="detail-value">${f.detail.reimType}</div></div>
      <div class="detail-row"><div class="detail-label">金额</div><div class="detail-value" style="color: var(--c-danger);">¥${f.detail.amount.toLocaleString()}</div></div>
      <div class="detail-row"><div class="detail-label">发票</div><div class="detail-value">${f.detail.invoiceCount} 张</div></div>
      <div class="detail-row"><div class="detail-label">收款账户</div><div class="detail-value">${f.detail.account}</div></div>
      <div class="detail-row"><div class="detail-label">说明</div><div class="detail-value">${f.detail.reason}</div></div>
    `;
  } else if (f.type === '用印') {
    detailHtml = `
      <div class="detail-row"><div class="detail-label">印章</div><div class="detail-value">${f.detail.sealType}</div></div>
      <div class="detail-row"><div class="detail-label">次数</div><div class="detail-value">${f.detail.count} 次</div></div>
      <div class="detail-row"><div class="detail-label">文件</div><div class="detail-value">${f.detail.fileName}</div></div>
      <div class="detail-row"><div class="detail-label">说明</div><div class="detail-value">${f.detail.reason}</div></div>
    `;
  }

  const actions = [];
  if (canApprove) {
    actions.push({ label: '通过', act: 'approve', cls: 'btn-primary' });
    actions.push({ label: '驳回', act: 'reject', cls: 'btn-default' });
    actions.push({ label: '转交', act: 'transfer', cls: 'btn-default' });
  }
  const footer = actions.length ? `<div class="footer-actions">${actions.map(a => `<button class="btn ${a.cls}" data-form-action="${a.act}" data-form-id="${f.id}">${a.label}</button>`).join('')}</div>` : '';

  const content = `
    <div class="detail-hero">
      <div class="detail-hero-status">${cur}</div>
      <div class="detail-hero-title">${f.type}单</div>
      <div class="detail-hero-meta">${f.applicant} · ${f.dept} · 提交于 ${f.submitTime}</div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">单据信息</div>
      ${detailHtml}
    </div>
    <div class="detail-section">
      <div class="detail-section-title">审批流程</div>
      <div class="timeline">
        ${f.flow.map(n => `
          <div class="timeline-item ${n.done ? 'done' : n.current ? 'current' : ''}">
            <div class="timeline-time">${n.time || '待审批'}</div>
            <div class="timeline-title">${n.node} · ${n.actor}</div>
            <div class="timeline-desc">${n.action || '审批中...'}</div>
          </div>
        `).join('')}
      </div>
    </div>
    <div style="height: 76px"></div>
    ${footer}
  `;
  return subPageShell('单据详情', content);
};

PAGE_RENDERERS['form-new'] = (params) => {
  const content = `
    <div class="form-page">
      <div class="form-section-title">选择单据类型</div>
      <div class="form-card">
        <div class="card-row" data-page="form-leave">
          <div class="card-row-icon" style="background:#fef3e6;color:var(--c-warning);">请</div>
          <div class="card-row-body">
            <div class="card-row-title">请假申请</div>
            <div class="card-row-desc">事假 / 病假 / 年假 / 调休</div>
          </div>
          <span class="card-row-arrow">›</span>
        </div>
        <div class="card-row" data-page="form-expense">
          <div class="card-row-icon" style="background:var(--c-danger-soft);color:var(--c-danger);">报</div>
          <div class="card-row-body">
            <div class="card-row-title">报销申请</div>
            <div class="card-row-desc">差旅 / 日常 / 招待</div>
          </div>
          <span class="card-row-arrow">›</span>
        </div>
        <div class="card-row" data-page="form-seal">
          <div class="card-row-icon" style="background:#f0e6f7;color:#7c3aed;">印</div>
          <div class="card-row-body">
            <div class="card-row-title">用印申请</div>
            <div class="card-row-desc">公章 / 合同章 / 法人章</div>
          </div>
          <span class="card-row-arrow">›</span>
        </div>
      </div>
    </div>
  `;
  return subPageShell('新建单据', content);
};

PAGE_RENDERERS['form-leave'] = (params) => {
  const content = `
    <div class="form-page">
      <div class="form-card">
        <div class="form-row">
          <div class="form-label required">假别</div>
          <div class="form-control">
            <div class="form-chip-group">
              <div class="form-chip">事假</div><div class="form-chip active">年假</div><div class="form-chip">病假</div><div class="form-chip">调休</div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-label required">开始</div>
          <div class="form-control"><input class="form-input" placeholder="2026-06-10 09:00" /></div>
        </div>
        <div class="form-row">
          <div class="form-label required">结束</div><div class="form-control"><input class="form-input" placeholder="2026-06-12 18:00" /></div>
        </div>
        <div class="form-row">
          <div class="form-label">共计</div><div class="form-value" style="color: var(--c-text-sub);">3 天</div>
        </div>
        <div class="form-row column">
          <div class="form-label required">原因</div>
          <div class="form-control"><textarea class="form-textarea" placeholder="请说明请假原因"></textarea></div>
        </div>
      </div>
      <div style="padding: 12px;">
        <button class="btn btn-primary btn-block" data-form-submit="leave">提交</button>
      </div>
    </div>
  `;
  return subPageShell('请假申请', content);
};

PAGE_RENDERERS['form-expense'] = (params) => {
  const content = `
    <div class="form-page">
      <div class="form-card">
        <div class="form-row">
          <div class="form-label required">类型</div>
          <div class="form-control">
            <div class="form-chip-group">
              <div class="form-chip active">差旅</div><div class="form-chip">日常</div><div class="form-chip">招待</div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-label required">金额</div><div class="form-control"><input class="form-input" type="number" placeholder="0.00" /></div>
        </div>
        <div class="form-row">
          <div class="form-label">发票</div><div class="form-control"><input class="form-input" placeholder="0 张" /></div>
        </div>
        <div class="form-row">
          <div class="form-label required">收款账户</div><div class="form-control"><input class="form-input" placeholder="开户行 - 尾号" /></div>
        </div>
        <div class="form-row column">
          <div class="form-label">说明</div>
          <div class="form-control"><textarea class="form-textarea" placeholder="出差日期/事由"></textarea></div>
        </div>
        <div class="form-row column">
          <div class="form-label">凭证</div>
          <div class="form-control">
            <div class="form-uploader">
              <div class="form-upload-slot">+</div>
              <div class="form-upload-slot">+</div>
              <div class="form-upload-slot">+</div>
            </div>
          </div>
        </div>
      </div>
      <div style="padding: 12px;">
        <button class="btn btn-primary btn-block" data-form-submit="expense">提交</button>
      </div>
    </div>
  `;
  return subPageShell('报销申请', content);
};

PAGE_RENDERERS['form-seal'] = (params) => {
  const content = `
    <div class="form-page">
      <div class="form-card">
        <div class="form-row">
          <div class="form-label required">印章</div>
          <div class="form-control">
            <div class="form-chip-group">
              <div class="form-chip active">公章</div><div class="form-chip">合同章</div><div class="form-chip">法人章</div>
            </div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-label required">次数</div><div class="form-control"><input class="form-input" type="number" placeholder="1" /></div>
        </div>
        <div class="form-row">
          <div class="form-label required">文件</div><div class="form-control"><input class="form-input" placeholder="如: 合同.pdf" /></div>
        </div>
        <div class="form-row column">
          <div class="form-label">用印说明</div>
          <div class="form-control"><textarea class="form-textarea" placeholder="用印事由"></textarea></div>
        </div>
      </div>
      <div style="padding: 12px;">
        <button class="btn btn-primary btn-block" data-form-submit="seal">提交</button>
      </div>
    </div>
  `;
  return subPageShell('用印申请', content);
};

/* ============================================
 * M10 会议
 * ============================================ */

PAGE_RENDERERS['meeting-list'] = (params) => {
  const filter = params.filter || 'all';
  const list = MEETINGS.filter(m => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return m.status === '即将开始';
    if (filter === 'done') return m.status === '已结束';
    return true;
  });

  const content = `
    <div class="filter-bar">
      ${[['all','全部'],['upcoming','即将开始'],['done','已结束']]
        .map(([k, l]) => `<button class="filter-item ${filter === k ? 'active' : ''}" data-page="meeting-list" data-params='{"filter":"${k}"}'>${l}</button>`).join('')}
    </div>
    <div class="list-page">
      ${list.map(m => `
        <div class="list-card" data-page="meeting-detail" data-params='{"id":"${m.id}"}'>
          <div class="list-card-header">
            <div class="list-card-title">
              <span class="list-card-title-text">${m.title}</span>
            </div>
            <span class="list-card-status s-${m.status}">${m.status}</span>
          </div>
          <div class="list-card-meta">
            <span>${m.room}</span><span>${m.attendees.length} 人</span>
          </div>
          <div class="list-card-row">${m.startTime} ~ ${m.endTime.split(' ')[1]}</div>
          <div class="list-card-row" style="color: var(--c-text-sub);">议题: ${m.agenda}</div>
        </div>
      `).join('')}
    </div>
  `;
  return subPageShell('会议管理', content, `<button class="sub-action" data-page="meeting-book">+ 预定</button>`);
};

PAGE_RENDERERS['meeting-detail'] = (params) => {
  const m = getMeeting(params.id);
  if (!m) return subPageShell('会议详情', emptyState('会议不存在'));
  const role = ROLES[state.roleId];
  const isReadonly = role.readonlyModules && role.readonlyModules.includes('M10');
  const myStatus = m.attendees.find(a => a.name === role.user);

  const actions = [];
  if (m.status === '即将开始' && !isReadonly) {
    if (myStatus && myStatus.status === '待确认') {
      actions.push({ label: '确认参加', act: 'confirm', cls: 'btn-primary' });
      actions.push({ label: '请假', act: 'leave', cls: 'btn-default' });
    }
    if (m.creator === role.user) {
      actions.push({ label: '取消会议', act: 'cancel', cls: 'btn-default' });
    }
  }

  const footer = actions.length ? `<div class="footer-actions">${actions.map(a => `<button class="btn ${a.cls}" data-meeting-action="${a.act}" data-meeting-id="${m.id}">${a.label}</button>`).join('')}</div>` : '';

  const content = `
    <div class="detail-hero">
      <div class="detail-hero-status">${m.status}</div>
      <div class="detail-hero-title">${m.title}</div>
      <div class="detail-hero-meta">${m.startTime} ~ ${m.endTime.split(' ')[1]} · ${m.room}</div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">会议信息</div>
      <div class="detail-row"><div class="detail-label">创建人</div><div class="detail-value">${m.creator}</div></div>
      <div class="detail-row"><div class="detail-label">时间</div><div class="detail-value">${m.startTime} ~ ${m.endTime.split(' ')[1]}</div></div>
      <div class="detail-row"><div class="detail-label">会议室</div><div class="detail-value">${m.room}</div></div>
      <div class="detail-row"><div class="detail-label">议题</div><div class="detail-value">${m.agenda}</div></div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">参会人员(${m.attendees.length})</div>
      ${m.attendees.map(a => `
        <div class="card-row" style="cursor:default;">
          <div class="card-row-icon">${a.name.charAt(0)}</div>
          <div class="card-row-body">
            <div class="card-row-title">${a.name}</div>
          </div>
          <span class="list-card-status s-${a.status === '已确认' ? '已通过' : a.status === '请假' ? '已到期' : 'inprogress'}">${a.status}</span>
        </div>
      `).join('')}
    </div>
    <div style="height: 76px"></div>
    ${footer}
  `;
  return subPageShell('会议详情', content);
};

PAGE_RENDERERS['meeting-book'] = (params) => {
  const content = `
    <div class="form-page">
      <div class="form-card">
        <div class="form-row">
          <div class="form-label required">主题</div>
          <div class="form-control"><input class="form-input" placeholder="会议主题" /></div>
        </div>
        <div class="form-row">
          <div class="form-label required">开始时间</div>
          <div class="form-control"><input class="form-input" placeholder="2026-06-04 14:00" /></div>
        </div>
        <div class="form-row">
          <div class="form-label required">结束时间</div>
          <div class="form-control"><input class="form-input" placeholder="2026-06-04 16:00" /></div>
        </div>
        <div class="form-row">
          <div class="form-label required">会议室</div>
          <div class="form-control">
            <div class="form-chip-group">
              <div class="form-chip active">大会议室</div>
              <div class="form-chip">小会议室</div>
              <div class="form-chip">商务洽谈室</div>
            </div>
          </div>
        </div>
        <div class="form-row column">
          <div class="form-label">参会人</div>
          <div class="form-control">
            <div class="form-uploader">
              <div class="form-upload-slot filled" style="width:auto; padding:0 12px;">+ 张志强</div>
              <div class="form-upload-slot filled" style="width:auto; padding:0 12px;">+ 王芳</div>
              <div class="form-upload-slot">+</div>
            </div>
          </div>
        </div>
        <div class="form-row column">
          <div class="form-label">议题</div>
          <div class="form-control"><textarea class="form-textarea" placeholder="会议议题"></textarea></div>
        </div>
      </div>
      <div style="padding: 12px;">
        <button class="btn btn-primary btn-block" data-meeting-book-submit>提交预定</button>
      </div>
    </div>
  `;
  return subPageShell('预定会议', content);
};

/* ============================================
 * M11 停车记录
 * ============================================ */

PAGE_RENDERERS['parking-list'] = (params) => {
  const filter = params.filter || 'all';
  const list = PARKING.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'progress') return p.payStatus === '进行中';
    if (filter === 'paid') return p.payStatus === '已缴费';
    if (filter === 'free') return p.payStatus === '免费';
    if (filter === 'owed') return p.payStatus === '欠费';
    return true;
  });

  const inCount = PARKING.filter(p => !p.leaveTime).length;
  const total = PARKING.length;

  const content = `
    <div class="mini-stat-row">
      <div class="mini-stat">
        <div class="mini-stat-value success">${inCount}</div>
        <div class="mini-stat-label">在场车辆</div>
      </div>
      <div class="mini-stat">
        <div class="mini-stat-value">${total}</div>
        <div class="mini-stat-label">总记录</div>
      </div>
      <div class="mini-stat">
        <div class="mini-stat-value warning">${PARKING.filter(p => p.payStatus === '欠费').length}</div>
        <div class="mini-stat-label">欠费</div>
      </div>
    </div>
    <div class="filter-bar">
      ${[['all','全部'],['progress','进行中'],['paid','已缴费'],['free','免费'],['owed','欠费']]
        .map(([k, l]) => `<button class="filter-item ${filter === k ? 'active' : ''}" data-page="parking-list" data-params='{"filter":"${k}"}'>${l}</button>`).join('')}
    </div>
    <div class="list-page">
      ${list.map(p => `
        <div class="list-card" data-page="parking-detail" data-params='{"id":"${p.id}"}'>
          <div class="list-card-header">
            <div class="list-card-title">
              <span class="list-card-title-text" style="font-family:monospace; font-size: var(--fs-md);">${p.plate}</span>
              <span class="list-card-tag" style="margin-left:6px; background:var(--c-line-soft); color:var(--c-text-sub); padding:1px 6px; border-radius:8px; font-size:11px;">${p.type}</span>
            </div>
            <span class="list-card-status s-${p.payStatus}">${p.payStatus}</span>
          </div>
          <div class="list-card-meta">
            <span>${p.company}</span>
            <span>车位 ${p.space}</span>
          </div>
          <div class="list-card-meta">
            <span>进入 ${p.enterTime.split(' ')[1]}</span>
            <span>${p.leaveTime ? '离开 ' + p.leaveTime.split(' ')[1] : '未离场'}</span>
          </div>
          <div class="list-card-row" style="color: ${p.payStatus === '进行中' ? 'var(--c-warning)' : p.payStatus === '欠费' ? 'var(--c-danger)' : 'var(--c-text-sub)'};">${p.duration}${p.fee > 0 ? ' · 应付 ¥' + p.fee : ''}</div>
        </div>
      `).join('')}
    </div>
  `;
  return subPageShell('停车记录', content);
};

PAGE_RENDERERS['parking-detail'] = (params) => {
  const p = PARKING.find(x => x.id === params.id);
  if (!p) return subPageShell('停车详情', emptyState('记录不存在'));
  const statusCls = p.payStatus === '进行中' ? 's-inprogress' : p.payStatus === '欠费' ? 's-overdue' : p.payStatus === '免费' ? 's-done' : 's-done';
  const content = `
    <div class="detail-hero">
      <div class="detail-hero-status" style="background:${p.payStatus === '欠费' ? 'var(--c-danger)' : p.payStatus === '进行中' ? 'var(--c-warning)' : 'var(--c-success)'};">${p.payStatus}</div>
      <div class="detail-hero-title" style="font-family:monospace; letter-spacing:1px;">${p.plate}</div>
      <div class="detail-hero-meta">${p.type} · 车位 ${p.space}</div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">出入记录</div>
      <div class="detail-row"><div class="detail-label">进入时间</div><div class="detail-value">${p.enterTime}</div></div>
      <div class="detail-row"><div class="detail-label">离开时间</div><div class="detail-value">${p.leaveTime || '尚未离场'}</div></div>
      <div class="detail-row"><div class="detail-label">停车时长</div><div class="detail-value">${p.duration}</div></div>
    </div>
    <div class="detail-section">
      <div class="detail-section-title">车辆与计费</div>
      <div class="detail-row"><div class="detail-label">车辆类型</div><div class="detail-value">${p.type}</div></div>
      ${p.type === '月卡' ? `
        <div class="detail-row"><div class="detail-label">月卡状态</div><div class="detail-value" style="color:var(--c-success);">有效 · 免停车费</div></div>
      ` : p.type === '免费' ? `
        <div class="detail-row"><div class="detail-label">免费原因</div><div class="detail-value">合作单位公务车辆</div></div>
      ` : `
        <div class="detail-row"><div class="detail-label">应付费用</div><div class="detail-value" style="color:${p.payStatus === '欠费' ? 'var(--c-danger)' : 'var(--c-text)'}; font-weight:600;">¥${p.fee}</div></div>
        <div class="detail-row"><div class="detail-label">已支付</div><div class="detail-value">¥${p.paid}</div></div>
        ${p.fee - p.paid > 0 ? `<div class="detail-row"><div class="detail-label">未支付</div><div class="detail-value" style="color:var(--c-danger);">¥${p.fee - p.paid}</div></div>` : ''}
      `}
    </div>
    <div class="detail-section">
      <div class="detail-section-title">关联信息</div>
      ${p.companyId ? `
        <div class="card-row" data-page="company-detail" data-params='{"id":"${p.companyId}"}'>
          <div class="card-row-icon">企</div>
          <div class="card-row-body">
            <div class="card-row-title">${p.company}</div>
            <div class="card-row-desc">查看企业档案</div>
          </div>
          <div class="card-row-arrow">›</div>
        </div>
      ` : `
        <div class="card-row" style="cursor:default;">
          <div class="card-row-icon" style="background:var(--c-line-soft); color:var(--c-text-sub);">访</div>
          <div class="card-row-body">
            <div class="card-row-title">${p.company}</div>
            <div class="card-row-desc">未关联园区企业</div>
          </div>
        </div>
      `}
    </div>
    ${p.payStatus === '欠费' ? `
      <div class="footer-actions">
        <button class="btn btn-primary" data-parking-action="collect" data-parking-id="${p.id}">登记收款</button>
        <button class="btn btn-default" data-parking-action="urge" data-parking-id="${p.id}">提醒车主</button>
      </div>
    ` : p.payStatus === '进行中' && p.type === '临时' ? `
      <div class="footer-actions">
        <button class="btn btn-primary" data-parking-action="collect" data-parking-id="${p.id}">预付 / 登记</button>
      </div>
    ` : ''}
    <div style="height: 16px"></div>
  `;
  return subPageShell('停车详情', content);
};

/* ============================================
 * 占位页面(用于未实现完整二级页的模块)
 * ============================================ */

PAGE_RENDERERS['coming-soon'] = (params) => {
  return subPageShell(params.title || '敬请期待', `
    <div class="coming-soon">
      <div class="coming-soon-icon">⚙</div>
      <div class="coming-soon-text">${params.title || '该功能'}正在路上</div>
      <div class="coming-soon-hint">原型阶段暂未实现完整流程</div>
    </div>
  `);
};

/* ============================================
 * 主 Tab 4 个: home / business / message / me
 * ============================================ */

PAGE_RENDERERS['home'] = () => {
  const role = ROLES[state.roleId];
  return `
    <div class="hero">
      <div class="hero-greet">早上好,</div>
      <div class="hero-name">${role.user} · ${role.name}</div>
      <div class="hero-actions">
        ${role.heroActions.map(a => {
          const hasPage = !!a.page;
          const attrPage = hasPage ? `data-page="${a.page}"` : '';
          const attrParams = hasPage && a.params ? `data-params='${JSON.stringify(a.params)}'` : '';
          const attrToast = !hasPage && a.toast ? `data-toast="${a.toast}"` : '';
          return `
            <button class="hero-action" ${attrPage} ${attrParams} ${attrToast}>
              <span class="ha-icon">${a.icon}</span>
              <span class="ha-label">${a.label}</span>
            </button>
          `;
        }).join('')}
      </div>
    </div>

    <div class="page-section">
      <div class="section-header">
        <div class="section-title">关键数据</div>
      </div>
      <div class="stat-grid">
        ${role.stats.map(s => {
          const deltaCls = s.deltaType === 'up' ? 'up' : s.deltaType === 'down' ? 'down' : 'flat';
          return `
            <div class="stat-card ${s.color || ''}">
              <div class="stat-label">${s.label}</div>
              <div>
                <span class="stat-value">${s.value}</span>
                ${s.unit ? `<span class="stat-unit">${s.unit}</span>` : ''}
              </div>
              <div class="stat-delta ${deltaCls}">${s.delta || ''}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <div class="page-section">
      <div class="section-header">
        <div class="section-title">常用模块</div>
      </div>
      <div class="module-grid">
        ${role.modules.slice(0, 8).map(mid => {
          const m = MODULES[mid];
          const badge = role.moduleBadges && role.moduleBadges[mid];
          const iconStyle = (m.icon || '').length >= 2 ? 'font-size:12px;font-weight:700;letter-spacing:-0.5px;' : '';
          return `
            <button class="module-card" data-module="${mid}">
              <div class="module-icon ${m.color}" style="${iconStyle}">${m.icon}</div>
              <div class="module-label">${m.name}</div>
              ${badge ? `<i class="badge-num">${badge}</i>` : ''}
            </button>
          `;
        }).join('')}
      </div>
    </div>

    <div class="page-section">
      <div class="section-header">
        <div class="section-title">待办</div>
        <span class="section-more" data-page="todo-center">全部 ${role.todos.length} ›</span>
      </div>
      <div class="todo-list">
        ${role.todos.map(t => {
          const tp = t.page ? ` data-page="${t.page}" data-params='${JSON.stringify(t.params || {})}'` : '';
          return `
          <div class="todo-item"${tp}>
            <div class="todo-icon ${t.cls || ''}">${t.icon}</div>
            <div class="todo-text">
              <div class="todo-title">${t.title}</div>
              <div class="todo-desc">${t.desc}</div>
            </div>
            <span class="todo-status ${t.status}">${t.status}</span>
          </div>
        `;
        }).join('')}
      </div>
    </div>
    <div style="height: 16px"></div>
  `;
};

PAGE_RENDERERS['business'] = () => {
  const role = ROLES[state.roleId];
  const readonly = role.readonlyModules || [];
  const renderBizItem = (mid) => {
    const m = MODULES[mid];
    const badge = role.moduleBadges && role.moduleBadges[mid];
    const isReadonly = readonly.includes(mid);
    const iconStyle = (m.icon || '').length >= 2 ? 'font-size:12px;font-weight:700;letter-spacing:-0.5px;' : '';
    return `
      <button class="biz-item ${isReadonly ? 'readonly' : ''}" data-module="${mid}">
        <div class="biz-icon module-icon ${m.color}" style="${iconStyle}">${m.icon}</div>
        <div class="biz-name">${m.name}</div>
        <div class="biz-desc">${m.desc}</div>
        ${badge ? `<span class="biz-badge">${badge}</span>` : ''}
      </button>
    `;
  };
  return `
    <div style="height: 8px"></div>
    ${role.bizGroups.map(g => `
      <div class="biz-section">
        <div class="biz-section-title">${g.title}</div>
        <div class="biz-list">
          ${g.items.map(renderBizItem).join('')}
        </div>
      </div>
    `).join('')}
    <div style="height: 24px"></div>
  `;
};

const MSG_TABS_DEF = [
  { id: 'all', label: '全部' },
  { id: 'audit', label: '待审批' },
  { id: 'work', label: '待办' },
  { id: 'notice', label: '通知' }
];

PAGE_RENDERERS['message'] = (params) => {
  const role = ROLES[state.roleId];
  const all = role.messages || [];
  const activeTab = params.tab || 'all';
  const list = activeTab === 'all' ? all : all.filter(m => m.type === activeTab);
  return `
    <div class="msg-tabs">
      ${MSG_TABS_DEF.map(t => {
        const count = t.id === 'all' ? all.length : all.filter(m => m.type === t.id).length;
        const active = activeTab === t.id ? 'active' : '';
        return `<button class="msg-tab ${active}" data-page="message" data-params='{"tab":"${t.id}"}'>${t.label}${count > 0 ? ` ${count}` : ''}</button>`;
      }).join('')}
    </div>
    <div class="msg-list">
      ${list.length === 0 ? `
        <div class="empty"><div class="empty-icon">○</div><div class="empty-text">暂无该类型消息</div></div>
      ` : list.map(m => `
        <div class="msg-item ${m.unread ? 'unread' : ''}">
          <div class="msg-icon module-icon ${m.cls}">${m.icon}</div>
          <div class="msg-body">
            <div class="msg-header">
              <div class="msg-title">${m.title}</div>
              <div class="msg-time">${m.time}</div>
            </div>
            <div class="msg-desc">${m.desc}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
};

PAGE_RENDERERS['me'] = () => {
  const role = ROLES[state.roleId];
  const park = PARKS.find(p => p.id === state.parkId) || PARKS[0];
  return `
    <div class="me-header">
      <div class="me-profile">
        <div class="me-avatar">${role.short}</div>
        <div>
          <div class="me-name">${role.user}</div>
          <div class="me-role-badge">${role.name} · ${park.name}</div>
        </div>
      </div>
    </div>
    <div class="me-stats">
      <div class="me-stat">
        <div class="me-stat-value">${role.todos.length}</div>
        <div class="me-stat-label">待办</div>
      </div>
      <div class="me-stat">
        <div class="me-stat-value">${role.messages.filter(m => m.unread).length}</div>
        <div class="me-stat-label">未读消息</div>
      </div>
      <div class="me-stat">
        <div class="me-stat-value">${role.modules.length}</div>
        <div class="me-stat-label">可用模块</div>
      </div>
    </div>
    <div class="me-menu-group-title">账户</div>
    <div class="me-menu">
      <div class="me-menu-item" data-page="inspection-list">
        <div class="me-menu-icon">角</div>
        <div class="me-menu-label">切换角色</div>
        <div class="me-menu-extra">${role.name}</div>
        <span class="me-menu-arrow">›</span>
      </div>
      <div class="me-menu-item" data-page="home">
        <div class="me-menu-icon">园</div>
        <div class="me-menu-label">切换园区</div>
        <div class="me-menu-extra">${park.name}</div>
        <span class="me-menu-arrow">›</span>
      </div>
    </div>
    <div class="me-menu-group-title">业务</div>
    <div class="me-menu">
      <div class="me-menu-item">
        <div class="me-menu-icon">办</div>
        <div class="me-menu-label">我发起的单据</div>
        <div class="me-menu-extra">5 单</div>
        <span class="me-menu-arrow">›</span>
      </div>
      <div class="me-menu-item" data-page="meeting-list">
        <div class="me-menu-icon">会</div>
        <div class="me-menu-label">我的会议</div>
        <div class="me-menu-extra">2 场</div>
        <span class="me-menu-arrow">›</span>
      </div>
      <div class="me-menu-item" data-page="form-list">
        <div class="me-menu-icon">审</div>
        <div class="me-menu-label">我的审批</div>
        <div class="me-menu-extra">待审 ${role.todos.filter(t => t.status === '待审批').length}</div>
        <span class="me-menu-arrow">›</span>
      </div>
    </div>
    <div class="me-menu-group-title">设置</div>
    <div class="me-menu">
      <div class="me-menu-item"><div class="me-menu-icon">免</div><div class="me-menu-label">消息免打扰</div><div class="me-menu-extra">关</div><span class="me-menu-arrow">›</span></div>
      <div class="me-menu-item"><div class="me-menu-icon">字</div><div class="me-menu-label">字体大小</div><div class="me-menu-extra">标准</div><span class="me-menu-arrow">›</span></div>
      <div class="me-menu-item"><div class="me-menu-icon">清</div><div class="me-menu-label">清除缓存</div><div class="me-menu-extra">12.4 MB</div><span class="me-menu-arrow">›</span></div>
      <div class="me-menu-item"><div class="me-menu-icon">关</div><div class="me-menu-label">关于</div><div class="me-menu-extra">v1.0.0</div><span class="me-menu-arrow">›</span></div>
    </div>
    <div style="padding: 20px 12px;">
      <button style="width:100%; padding:14px; background:#fff; border-radius:10px; color:var(--c-danger); font-weight:600; box-shadow: var(--sh-sm);">退出登录</button>
    </div>
    <div style="height: 16px"></div>
  `;
};

/* ============================================
 * 交互处理: 工单 / 合同 / 单据 / 费用 / 巡检 / 会议
 * ============================================ */

function bindSubPageEvents() {
  /* 委托全局 click */
  document.addEventListener('click', (e) => {
    /* 关闭弹窗 */
    const closeBtn = e.target.closest('[data-close]');
    if (closeBtn) {
      const modal = closeBtn.closest('.modal');
      if (modal) { modal.hidden = true; return; }
    }
    /* 园区切换选中 */
    const parkPick = e.target.closest('[data-park-pick]');
    if (parkPick) { pickPark(parkPick.dataset.parkPick); return; }

    /* 返回 */
    const backBtn = e.target.closest('[data-back]');
    if (backBtn) { back(backBtn.dataset.backHref || null); return; }

    /* 跳页(排除 body 自身的 data-page,避免点击下拉等元素时误触发跳转) */
    const pageLink = e.target.closest('[data-page]:not(body)');
    if (pageLink) {
      const pageId = pageLink.dataset.page;
      let params = {};
      try { params = JSON.parse(pageLink.dataset.params || '{}'); }
      catch (err) { params = {}; }
      navigate(pageId, params);
      return;
    }

    /* 巡检项选择 */
    const inspRes = e.target.closest('[data-insp-result]');
    if (inspRes) {
      const [idx, val] = inspRes.dataset.inspResult.split('|');
      const inspId = state.subPageParams.id;
      if (!RUNTIME.inspectionItemResults[inspId]) RUNTIME.inspectionItemResults[inspId] = {};
      if (!RUNTIME.inspectionItemResults[inspId][idx]) RUNTIME.inspectionItemResults[inspId][idx] = {};
      RUNTIME.inspectionItemResults[inspId][idx].result = val;
      renderContent();
      return;
    }
    const inspPhoto = e.target.closest('[data-insp-photo]');
    if (inspPhoto) {
      const idx = inspPhoto.dataset.inspPhoto;
      const inspId = state.subPageParams.id;
      if (!RUNTIME.inspectionItemResults[inspId]) RUNTIME.inspectionItemResults[inspId] = {};
      if (!RUNTIME.inspectionItemResults[inspId][idx]) RUNTIME.inspectionItemResults[inspId][idx] = {};
      RUNTIME.inspectionItemResults[inspId][idx].photo = '已上传';
      showToast('已模拟上传照片');
      renderContent();
      return;
    }
    /* 巡检提交 */
    const inspSubmit = e.target.closest('[data-insp-submit]');
    if (inspSubmit) {
      const inspId = inspSubmit.dataset.inspSubmit;
      const results = RUNTIME.inspectionItemResults[inspId] || {};
      const t = getInspection(inspId);
      if (Object.keys(results).length < t.items.length) {
        showToast('请完成所有检查项');
        return;
      }
      const abnormal = Object.values(results).filter(r => r.result === 'abnormal');
      /* 更新任务状态 */
      const insp = INSPECTIONS.find(x => x.id === inspId);
      if (insp) {
        insp.status = 'done';
        insp.doneCount = t.items.length;
        insp.abnormalCount = abnormal.length;
      }
      showToast(`巡检完成 · ${abnormal.length > 0 ? `发现 ${abnormal.length} 项异常` : '全部正常'}`);
      if (abnormal.length > 0) {
        setTimeout(() => {
          showToast('已自动生成报修工单');
          window.location.href = abnormal.length > 0 ? 'workorder-list.html' : 'inspection-list.html';
        }, 1500);
      } else {
        setTimeout(() => {
          window.location.href = 'inspection-list.html';
        }, 1200);
      }
      return;
    }
    /* 巡检创建 */
    if (e.target.closest('[data-insp-create-submit]')) {
      showToast('巡检任务已创建');
      setTimeout(() => window.location.href = 'inspection-list.html', 800);
      return;
    }

    /* 工单操作 */
    const woAction = e.target.closest('[data-wo-action]');
    if (woAction) {
      const act = woAction.dataset.woAction;
      const id = woAction.dataset.woId;
      handleWorkorderAction(act, id);
      return;
    }
    /* 工单创建 */
    if (e.target.closest('[data-wo-create-submit]')) {
      showToast('工单已提交,等待派单');
      setTimeout(() => window.location.href = 'workorder-list.html', 1000);
      return;
    }

    /* 费用操作 */
    const feeAction = e.target.closest('[data-fee-action]');
    if (feeAction) {
      const act = feeAction.dataset.feeAction;
      const id = feeAction.dataset.feeId;
      handleFeeAction(act, id);
      return;
    }

    /* 合同操作 */
    const ctAction = e.target.closest('[data-ct-action]');
    if (ctAction) {
      const act = ctAction.dataset.ctAction;
      const id = ctAction.dataset.ctId;
      handleContractAction(act, id);
      return;
    }
    if (e.target.closest('[data-ct-create-submit]')) {
      showToast('合同已提交审批');
      setTimeout(() => window.location.href = 'contract-list.html', 800);
      return;
    }

    /* 合同 PDF 预览 */
    const ctPdf = e.target.closest('[data-ct-pdf]');
    if (ctPdf) {
      let info = {};
      try { info = JSON.parse(ctPdf.dataset.ctPdf || '{}'); } catch (e) { info = {}; }
      const contract = getContract(info.id);
      if (contract && contract.pdf) {
        openContractPdf({ contract });
      } else {
        showToast('合同附件不可用');
      }
      return;
    }

    /* 单据操作 */
    const formAction = e.target.closest('[data-form-action]');
    if (formAction) {
      const act = formAction.dataset.formAction;
      const id = formAction.dataset.formId;
      handleFormAction(act, id);
      return;
    }
    const formSubmit = e.target.closest('[data-form-submit]');
    if (formSubmit) {
      const type = formSubmit.dataset.formSubmit;
      const label = type === 'leave' ? '请假' : type === 'expense' ? '报销' : '用印';
      showToast(`${label}单已提交,等待审批`);
      setTimeout(() => window.location.href = 'form-list.html', 1000);
      return;
    }

    /* 会议操作 */
    const meetingAction = e.target.closest('[data-meeting-action]');
    if (meetingAction) {
      const act = meetingAction.dataset.meetingAction;
      const id = meetingAction.dataset.meetingId;
      handleMeetingAction(act, id);
      return;
    }
    if (e.target.closest('[data-meeting-book-submit]')) {
      showToast('会议预定已提交');
      setTimeout(() => window.location.href = 'meeting-list.html', 800);
      return;
    }

    /* 停车操作 */
    const parkingAction = e.target.closest('[data-parking-action]');
    if (parkingAction) {
      const act = parkingAction.dataset.parkingAction;
      const id = parkingAction.dataset.parkingId;
      handleParkingAction(act, id);
      return;
    }

    /* Hero 按钮(无对应页)toast 提示 */
    const toastBtn = e.target.closest('[data-toast]');
    if (toastBtn) {
      showToast(toastBtn.dataset.toast);
      return;
    }
  });
}

/* ---------- 业务操作 handler ---------- */

async function handleWorkorderAction(act, id) {
  const w = getWorkorder(id);
  if (!w) return;
  const role = ROLES[state.roleId];

  if (act === 'accept') {
    if (await confirmAction(`确认接单 ${w.code}?`)) {
      RUNTIME.workorderOverrides[id] = '处理中';
      w.history.push({ time: nowStr(), actor: role.user, action: '接单', desc: '已接单' });
      showToast('接单成功');
      renderContent();
    }
  } else if (act === 'assign') {
    openActionSheet({
      title: `派单 ${w.code}`,
      items: [
        { label: '派给张志强(巡检员)', val: 'inspector' },
        { label: '派给外部维保', val: 'external' }
      ],
      onPick: (p) => {
        RUNTIME.workorderOverrides[id] = '待接单';
        w.assignee = p.val === 'inspector' ? '张志强' : '外部维保公司';
        w.history.push({ time: nowStr(), actor: role.user, action: '派单', desc: `派给${w.assignee}` });
        showToast('已派单');
        renderContent();
      }
    });
  } else if (act === 'finish') {
    const note = await promptText({ title: '处理说明', placeholder: '请说明处理过程与结果' });
    if (note !== null) {
      RUNTIME.workorderOverrides[id] = '已关单';
      w.history.push({ time: nowStr(), actor: role.user, action: '处理完成', desc: note || '已处理' });
      showToast('工单已关单');
      renderContent();
    }
  } else if (act === 'transfer') {
    openActionSheet({
      title: '转单给',
      items: [
        { label: '外部维保公司', val: '外部维保' },
        { label: '张志强', val: '张志强' }
      ],
      onPick: (p) => {
        w.assignee = p.val;
        w.history.push({ time: nowStr(), actor: role.user, action: '转单', desc: `转给 ${p.val}` });
        showToast('已转单');
        renderContent();
      }
    });
  } else if (act === 'urge') {
    showToast('已发送催办消息');
    w.history.push({ time: nowStr(), actor: role.user, action: '催办', desc: '已催办' });
    setTimeout(() => renderContent(), 600);
  }
}

function handleContractAction(act, id) {
  const c = getContract(id);
  if (!c) return;
  const role = ROLES[state.roleId];

  if (act === 'approve') {
    RUNTIME.contractOverrides[id] = '生效中';
    c.history.push({ time: nowStr(), actor: role.user, action: '审批通过', desc: '经理审批通过' });
    showToast('合同已审批通过');
    renderContent();
  } else if (act === 'reject') {
    RUNTIME.contractOverrides[id] = '已驳回';
    c.history.push({ time: nowStr(), actor: role.user, action: '审批驳回', desc: '驳回' });
    showToast('合同已驳回');
    renderContent();
  } else if (act === 'renew') {
    showToast('续约合同已创建,待客户确认');
    setTimeout(() => back(), 1000);
  }
}

function handleFormAction(act, id) {
  const f = getForm(id);
  if (!f) return;
  const role = ROLES[state.roleId];
  const cur = getFormStatus(f.id) || f.status;
  const isCurrentNode = f.flow.find(n => n.current);

  if (act === 'approve') {
    if (isCurrentNode) {
      isCurrentNode.time = nowStr();
      isCurrentNode.action = '通过';
      isCurrentNode.done = true;
      isCurrentNode.current = false;
      /* 推进到下一节点 */
      const nextIdx = f.flow.indexOf(isCurrentNode) + 1;
      if (nextIdx < f.flow.length) {
        f.flow[nextIdx].current = true;
      } else {
        RUNTIME.formOverrides[id] = '已通过';
      }
    }
    showToast('已审批通过');
    renderContent();
  } else if (act === 'reject') {
    RUNTIME.formOverrides[id] = '已驳回';
    if (isCurrentNode) {
      isCurrentNode.time = nowStr();
      isCurrentNode.action = '驳回';
      isCurrentNode.done = true;
      isCurrentNode.current = false;
    }
    showToast('已驳回');
    renderContent();
  } else if (act === 'transfer') {
    const candidates = [
      { label: '王建国(经理)', val: '王建国' },
      { label: '李慧敏(财务)', val: '李慧敏' },
      { label: '张华(商务)', val: '张华' },
      { label: '陈静怡(运营)', val: '陈静怡' },
      { label: '刘小峰(员工)', val: '刘小峰' }
    ].filter(c => c.val !== role.user);
    openActionSheet({
      title: '转交给',
      items: candidates,
      onPick: (p) => {
        if (isCurrentNode) {
          isCurrentNode.action = `转交给 ${p.val}`;
          isCurrentNode.actor = p.val;
        }
        f.flow.push({ node: '转交记录', actor: role.user, time: nowStr(), action: `转交给 ${p.val}`, done: true });
        showToast(`已转交给 ${p.val}`);
        renderContent();
      }
    });
    return;
  }
}

function handleMeetingAction(act, id) {
  const m = getMeeting(id);
  if (!m) return;
  const role = ROLES[state.roleId];
  if (act === 'confirm') {
    const me = m.attendees.find(a => a.name === role.user);
    if (me) me.status = '已确认';
    showToast('已确认参加');
    renderContent();
  } else if (act === 'leave') {
    const me = m.attendees.find(a => a.name === role.user);
    if (me) me.status = '请假';
    showToast('已请假');
    renderContent();
  } else if (act === 'cancel') {
    if (confirmAction('确认取消会议?')) {
      m.status = '已结束';
      showToast('会议已取消');
      setTimeout(() => renderContent(), 600);
    }
  }
}

function handleFeeAction(act, id) {
  const b = getBill(id);
  if (!b) return;
  const role = ROLES[state.roleId];

  if (act === 'dunning') {
    openActionSheet({
      title: `催缴 ${b.company}`,
      items: [
        { label: '📩 发送消息', val: 'msg' },
        { label: '📞 拨打电话', val: 'phone' },
        { label: '📝 仅记录流水', val: 'log' }
      ],
      onPick: (p) => {
        if (p.val === 'phone') {
          showToast(`正在呼叫 ${b.company}...`);
          setTimeout(() => {
            const ok = Math.random() > 0.3;
            RUNTIME.newDunningLogs.unshift({
              id: 'dn' + Date.now(),
              companyId: b.companyId,
              company: b.company,
              operator: role.user,
              time: nowStr(),
              method: '电话',
              response: ok ? '已联系,客户承诺尽快处理' : '未接通',
              status: ok ? '已联系' : '未接通'
            });
            showToast(ok ? '通话结束,已记录' : '未接通,已记录');
            renderContent();
          }, 1200);
        } else {
          const method = p.val === 'msg' ? '消息' : '消息';
          RUNTIME.newDunningLogs.unshift({
            id: 'dn' + Date.now(),
            companyId: b.companyId,
            company: b.company,
            operator: role.user,
            time: nowStr(),
            method,
            response: '已发送',
            status: '已发送'
          });
          showToast(p.val === 'msg' ? '催缴消息已发送' : '已记录');
          renderContent();
        }
      }
    });
  } else if (act === 'record') {
    openRecordSheet({
      bill: b,
      onConfirm: (amt) => {
        if (amt > b.owed) {
          showToast(`超出待收金额 ¥${(amt - b.owed).toLocaleString()}`);
          return;
        }
        b.paid += amt;
        b.owed = Math.max(0, b.shouldPay - b.paid);
        b.status = b.owed === 0 ? '已结清' : '部分缴';
        showToast(`已记录收款 ¥${amt.toLocaleString()}`);
        renderContent();
      }
    });
  }
}

function handleParkingAction(act, id) {
  const p = PARKING.find(x => x.id === id);
  if (!p) return;
  const role = ROLES[state.roleId];

  if (act === 'collect') {
    const input = prompt('请输入收款金额', p.fee.toString());
    if (input !== null && !isNaN(input)) {
      const amt = parseFloat(input);
      p.paid += amt;
      p.payStatus = amt >= p.fee ? '已缴费' : '进行中';
      showToast(`已登记 ¥${amt}`);
      renderContent();
    } else if (input !== null) {
      showToast('请输入有效金额');
    }
  } else if (act === 'urge') {
    showToast(`已向 ${p.plate} 车主发送提醒`);
    p.history = p.history || [];
    p.history.unshift({ time: nowStr(), action: '催办', actor: role.user });
  }
}

/* ---------- 辅助: 当前时间字符串 ---------- */
function nowStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${hh}:${mm}`;
}

/* ============================================
 * 模块入口绑定(由 app.js 调用)
 * ============================================ */

function bindModuleEntry() {
  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-module]');
    if (!card) return;
    const mid = card.dataset.module;
    const m = MODULES[mid];
    if (!m) return;
    const role = ROLES[state.roleId];
    if (role.readonlyModules && role.readonlyModules.includes(mid)) {
      showToast('运营专员 · 只读查看');
    }
    const pageFile = mid === 'M03' ? 'inspection-list.html'
      : mid === 'M04' ? 'workorder-list.html'
      : mid === 'M05' ? 'fee-dashboard.html'
      : mid === 'M06' ? 'utility-dashboard.html'
      : mid === 'M07' ? 'contract-list.html'
      : mid === 'M08' ? 'company-list.html'
      : mid === 'M09' ? 'form-list.html'
      : mid === 'M10' ? 'meeting-list.html'
      : mid === 'M11' ? 'parking-list.html'
      : null;
    if (pageFile) window.location.href = pageFile;
  });
}
