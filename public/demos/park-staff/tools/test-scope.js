/* 验证业务弹层被约束在 .phone-screen 内(action-sheet / confirm / prompt / toast) */
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

function newDom() {
  const html = `<!DOCTYPE html><html><body data-page="workorder-detail">
<div class="stage">
  <div class="phone-frame">
    <div class="phone-screen">
      <div class="status-bar"></div>
      <header class="app-bar"></header>
      <main class="screen-content">
        <button class="btn btn-default" data-wo-action="transfer" data-wo-id="w01">转单</button>
      </main>
    </div>
  </div>
</div>
</body></html>`;
  return new JSDOM(html, { url: 'http://localhost/prototype/pages/workorder-detail.html', runScripts: 'outside-only' });
}

const code = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf8') + '\n' +
             fs.readFileSync(path.join(__dirname, '..', 'js', 'data-detail.js'), 'utf8') + '\n' +
             fs.readFileSync(path.join(__dirname, '..', 'js', 'renderers.js'), 'utf8');

let pass = 0, fail = 0;
function check(name, ok) { (ok ? pass++ : fail++); console.log((ok ? '✓ ' : '✗ ') + name); }

function testCase(name, fn) {
  console.log('\n--- ' + name + ' ---');
  const dom = newDom();
  const { window } = dom;
  const { document } = window;
  window.eval(code);
  const phoneScreen = document.querySelector('.phone-screen');
  try { fn(window, document, phoneScreen); }
  catch (e) { check('执行', false); console.log('  异常: ' + e.message); }
}

/* 1. openActionSheet */
testCase('openActionSheet(转单)', (w, d, ps) => {
  w.openActionSheet({ title: '转单给', items: [{ label: 'A', val: 'A' }, { label: 'B', val: 'B' }] });
  const sheet = d.querySelector('.action-sheet');
  check('弹层存在', !!sheet);
  check('父节点是 .phone-screen', sheet && sheet.parentNode === ps);
  check('不在 body 顶层', sheet && !d.body.contains(sheet) || (sheet && ps.contains(sheet)));
});

/* 2. confirmAction */
testCase('confirmAction(接单确认)', (w, d, ps) => {
  w.confirmAction('确认接单?');
  const sheet = d.querySelector('.action-sheet');
  check('弹层存在', !!sheet);
  check('父节点是 .phone-screen', sheet && sheet.parentNode === ps);
});

/* 3. promptText */
testCase('promptText(处理说明)', (w, d, ps) => {
  w.promptText({ title: '处理说明', placeholder: '请说明' });
  const sheet = d.querySelector('.action-sheet');
  check('弹层存在', !!sheet);
  check('父节点是 .phone-screen', sheet && sheet.parentNode === ps);
});

/* 4. showToast */
testCase('showToast(派单成功)', (w, d, ps) => {
  w.showToast('已派单');
  const toast = d.querySelector('.toast');
  check('toast 存在', !!toast);
  check('父节点是 .phone-screen', toast && toast.parentNode === ps);
  check('textContent 正确', toast && toast.textContent === '已派单');
});

/* 5. CSS 校验 */
console.log('\n--- CSS 校验 ---');
const cssText = fs.readFileSync(path.join(__dirname, '..', 'css', 'pages.css'), 'utf8');
const actionSheetCss = cssText.match(/\.action-sheet\s*\{[^}]+\}/);
const toastCss = cssText.match(/\.toast\s*\{[^}]+\}/);

check('.action-sheet 使用 position: absolute', actionSheetCss && actionSheetCss[0].includes('position: absolute'));
check('.action-sheet 不再 position: fixed', actionSheetCss && !actionSheetCss[0].includes('position: fixed'));
check('.toast 使用 position: absolute', toastCss && toastCss[0].includes('position: absolute'));
check('.toast 不再 position: fixed', toastCss && !toastCss[0].includes('position: fixed'));

console.log('\nPassed: ' + pass + ' / Failed: ' + fail);
process.exit(fail === 0 ? 0 : 1);
