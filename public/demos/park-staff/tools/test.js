const fs = require('fs');
const path = require('path');

const stub = `
  const document = { body: { dataset: {} }, addEventListener: () => {}, querySelector: () => null, querySelectorAll: () => [], createElement: () => ({ classList: { add: () => {} }, addEventListener: () => {}, remove: () => {}, style: {}, dataset: {}, innerHTML: '', appendChild: () => {} }) };
  const window = { location: { href: '', search: '' }, localStorage: { getItem: () => null, setItem: () => {} } };
  const localStorage = window.localStorage;
  const URLSearchParams = class { toString() { return ''; } };
  const state = { roleId: 'inspector', parkId: 'park1', subPage: null, subPageParams: {}, pageStack: [] };
`;

const code = fs.readFileSync(path.join(__dirname, '../js/data.js'), 'utf8') + '\n' +
             fs.readFileSync(path.join(__dirname, '../js/data-detail.js'), 'utf8') + '\n' +
             fs.readFileSync(path.join(__dirname, '../js/renderers.js'), 'utf8');

const fn = new Function(stub + '\n' + code + '\nreturn { PAGE_RENDERERS, state };');
const result = fn();
const PAGE_RENDERERS = result.PAGE_RENDERERS;
const state = result.state;

console.log('PAGE_RENDERERS count:', Object.keys(PAGE_RENDERERS).length);

const tests = [
  { id: 'home', params: {} },
  { id: 'business', params: {} },
  { id: 'message', params: {} },
  { id: 'me', params: {} },
  { id: 'inspection-list', params: {filter: 'all'} },
  { id: 'inspection-detail', params: {id: 'i01'} },
  { id: 'inspection-execute', params: {id: 'i01'} },
  { id: 'inspection-create', params: {} },
  { id: 'inspection-summary', params: {range: 'day'} },
  { id: 'inspection-summary', params: {range: 'week'} },
  { id: 'inspection-summary', params: {range: 'month'} },
  { id: 'workorder-list', params: {filter: 'all'} },
  { id: 'workorder-detail', params: {id: 'w01'} },
  { id: 'workorder-create', params: {} },
  { id: 'fee-dashboard', params: {} },
  { id: 'fee-analysis', params: {} },
  { id: 'fee-analysis', params: {month: '2026-03'} },
  { id: 'fee-bill-list', params: {view: 'bill'} },
  { id: 'fee-bill-list', params: {view: 'company'} },
  { id: 'fee-bill-list', params: {view: 'company', filter: 'owed'} },
  { id: 'fee-bill-detail', params: {id: 'b01'} },
  { id: 'fee-dunning-list', params: {} },
  { id: 'park-analysis', params: {} },
  { id: 'park-analysis', params: {month: '2026-03'} },
  { id: 'utility-dashboard', params: {} },
  { id: 'utility-analysis', params: {} },
  { id: 'utility-daily', params: {} },
  { id: 'utility-daily', params: {date: '2026-06-01'} },
  { id: 'utility-company', params: {filter: 'all'} },
  { id: 'utility-company-detail', params: {id: 'c01'} },
  { id: 'utility-prepaid', params: {} },
  { id: 'contract-list', params: {filter: 'all'} },
  { id: 'contract-detail', params: {id: 'ct01'} },
  { id: 'contract-create', params: {} },
  { id: 'contract-renewal', params: {stage: 'all'} },
  { id: 'contract-renewal', params: {stage: '30'} },
  { id: 'contract-renewal', params: {stage: '7'} },
  { id: 'company-list', params: {filter: 'all'} },
  { id: 'company-detail', params: {id: 'c01'} },
  { id: 'form-list', params: {scope: 'mine'} },
  { id: 'form-list', params: {scope: 'pending'} },
  { id: 'form-list', params: {scope: 'processed'} },
  { id: 'form-list', params: {scope: 'mine', type: 'leave'} },
  { id: 'form-list', params: {scope: 'mine', type: 'expense'} },
  { id: 'form-list', params: {scope: 'mine', type: 'seal'} },
  { id: 'form-detail', params: {id: 'f01'} },
  { id: 'form-new', params: {} },
  { id: 'form-leave', params: {} },
  { id: 'form-expense', params: {} },
  { id: 'form-seal', params: {} },
  { id: 'meeting-list', params: {filter: 'all'} },
  { id: 'meeting-detail', params: {id: 'm01'} },
  { id: 'meeting-book', params: {} },
  { id: 'parking-list', params: {filter: 'all'} },
  { id: 'parking-detail', params: {id: 'p01'} },
  { id: 'parking-detail', params: {id: 'p02'} },
  { id: 'parking-detail', params: {id: 'p06'} }
];

let pass = 0, fail = 0;
for (const t of tests) {
  try {
    const fn = PAGE_RENDERERS[t.id];
    if (!fn) { console.log('  ' + t.id + ': NOT REGISTERED'); fail++; continue; }
    const html = fn(t.params, state);
    console.log('  ' + t.id + (t.params.range ? '[' + t.params.range + ']' : (t.params.filter ? '[' + t.params.filter + ']' : (t.params.scope ? '[' + t.params.scope + ']' : (t.params.view ? '[' + t.params.view + ']' : (t.params.tab ? '[' + t.params.tab + ']' : ''))))) + ': OK', html.length, 'chars');
    pass++;
  } catch (e) {
    console.log('  ' + t.id + ' ERR:', e.message);
    fail++;
  }
}
console.log('\nPassed:', pass, 'Failed:', fail);
