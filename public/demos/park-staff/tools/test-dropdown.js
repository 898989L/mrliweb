/* 验证: 点击 select 时,body 的 data-page 不应触发跳转 */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const html = `<!DOCTYPE html><html><body data-page="home">
<div class="top-nav">
  <select id="pageSelect"><option value="home" selected>首页</option><option value="business">业务</option></select>
  <select id="roleSelect"><option value="inspector" selected>巡检员</option></select>
  <select id="parkSelect"><option value="park1" selected>园区1</option></select>
</div>
<div id="content">
  <div class="list-card" data-page="business" data-params='{}'>业务卡</div>
</div>
</body></html>`;

const dom = new JSDOM(html, {
  url: 'http://localhost/prototype/pages/home.html',
  runScripts: 'outside-only'
});
const { window } = dom;
const { document } = window;

let navCalls = [];
window.navigate = (pid, p) => { navCalls.push({ from: 'navigate', pid, p }); };
window.showToast = () => {};
/* stub init.js 中的 state(挂到 window 供 navigate 访问) */
window.state = { roleId: 'inspector', parkId: 'park1' };
window.ROLES = { inspector: { readonlyModules: [] } };

/* 加载 data + renderers */
const code =
  fs.readFileSync(path.join(__dirname, '../js/data.js'), 'utf8') + '\n' +
  fs.readFileSync(path.join(__dirname, '../js/data-detail.js'), 'utf8') + '\n' +
  fs.readFileSync(path.join(__dirname, '../js/renderers.js'), 'utf8');
window.eval(code);

window.bindSubPageEvents();

function test(name, fn) {
  navCalls = [];
  try {
    fn();
    const passed = !navCalls.some(c => c.pid === 'home');
    console.log((passed ? '✓ ' : '✗ ') + name + (navCalls.length ? ' → 调用了: ' + JSON.stringify(navCalls) : ' → 无跳转'));
    return passed;
  } catch (e) {
    console.log('✗ ' + name + ' → 异常: ' + e.message);
    return false;
  }
}

let pass = 0, fail = 0;
function check(name, ok) { if (ok) pass++; else fail++; test(name, () => {}); }

const pageSelect = document.getElementById('pageSelect');
const roleSelect = document.getElementById('roleSelect');
const parkSelect = document.getElementById('parkSelect');

console.log('--- 验证修复: 点击 select 不应触发跳转 ---');
console.log();

/* 1. 点击 page select 元素本身 */
let p1 = test('点击 pageSelect', () => {
  pageSelect.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
});

/* 2. 点击 role select 元素本身 */
let p2 = test('点击 roleSelect', () => {
  roleSelect.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
});

/* 3. 点击 park select 元素本身 */
let p3 = test('点击 parkSelect', () => {
  parkSelect.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
});

/* 4. 模拟 change 事件触发 location.href(原 change 处理器,不应被 click 拦截) */
let p4 = test('change pageSelect', () => {
  pageSelect.value = 'business';
  pageSelect.dispatchEvent(new window.Event('change', { bubbles: true }));
});
/* 这里 navigate 应不被调用,change 是 init.js 直接设置 href,跟 bindSubPageEvents 无关 */

/* 5. 点击真实的 data-page 导航按钮 - 仍应工作 */
let p5 = test('点击真实 data-page 按钮', () => {
  const btn = document.querySelector('[data-page="business"]');
  btn.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  if (navCalls.length === 0) throw new Error('预期触发跳转,实际未触发');
});

/* 6. 点击 body 空白区域(模拟点击页面) - 不应触发跳转 */
let p6 = test('点击空白处', () => {
  const blank = document.createElement('div');
  document.body.appendChild(blank);
  blank.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
});

pass = [p1, p2, p3, p4, p5, p6].filter(Boolean).length;
fail = 6 - pass;
console.log();
console.log('Passed: ' + pass + '/6');
process.exit(fail === 0 ? 0 : 1);
