/* ════════════════════════════
   DATA — do PDF exacto
════════════════════════════ */
const CORAIS = [
  {nome:"Juventude Bobole",              tipo:"",        num:1},
  {nome:"Juventude Bela Vista",          tipo:"",        num:2},
  {nome:"Juventude Machangulo",          tipo:"",        num:3},
  {nome:"Juventude Mumemo",              tipo:"",        num:4},
  {nome:"Super Especial Zona Verde B",   tipo:"especial",num:5},
  {nome:"Juventude Matola Rio",          tipo:"",        num:6},
  {nome:"Juventude Ressano Garcia",       tipo:"",        num:7},
  {nome:"Juventude Machava Trevo",       tipo:"",        num:8},
  {nome:"Juventude Mozal",               tipo:"",        num:9},
  {nome:"Juventude Chiboene",            tipo:"",        num:10},
  {nome:"Juventude da Liberdade",        tipo:"",        num:11},
  {nome:"Juventude Namaacha",            tipo:"",        num:12},
  {nome:"Juventude Marracuene",          tipo:"",        num:13},
  {nome:"Juventude Fomento",             tipo:"",        num:14},
  {nome:"Juventude de Salinas",          tipo:"",        num:15},
  {nome:"Especial Juventude Khongolote", tipo:"especial",num:16},
  {nome:"Juventude Ndlavela",            tipo:"",        num:17},
  {nome:"Juventude Patrice Lumumba",     tipo:"",        num:18},
  {nome:"Juventude Matlemele",           tipo:"",        num:19},
  {nome:"Juventude São Damanso",         tipo:"",        num:20},
  {nome:"Especial Juventude Boquisso",   tipo:"especial",num:21},
  {nome:"Juventude Machava Bedene",      tipo:"",        num:22},
  {nome:"Juventude Bunhica",             tipo:"",        num:23},
  {nome:"Juventude Matibwana",           tipo:"",        num:24},
  {nome:"Juventude Tenga",               tipo:"",        num:25},
  {nome:"Juventude Infulene T3",         tipo:"",        num:26},
  {nome:"Juventude Geral Zona Verde A",  tipo:"",        num:27},
  {nome:"Juventude Geral de Intaka",     tipo:"",        num:28},
  {nome:"Juventude Matola Gare",         tipo:"",        num:29},
  {nome:"Juventude Moamba",              tipo:"",        num:30},
  {nome:"Juventude Geral Matola C",      tipo:"",        num:31},
  {nome:"Juventude Cidade da Matola",    tipo:"",        num:32},
  {nome:"Juventude Geral Sikwama",        tipo:"",        num:33},
  {nome:"Juventude de Boane",            tipo:"",        num:34},
  {nome:"Geral da Juventude do Apóstolo",tipo:"geral",   num:35},
  {nome:"Coro Geral do Apóstolo Adultos",tipo:"geral",   num:36},
];

const FILTROS = [
  {label:"Todos",       fn: c => true},
  {label:"Especiais",   fn: c => c.tipo === "especial"},
  {label:"Gerais",      fn: c => c.tipo === "geral"},
  {label:"Juventudes",  fn: c => c.tipo === ""},
];

let filtroIdx = 0;
let query = "";

/* ════════════════════════════
   RENDER FILTROS
════════════════════════════ */
function renderPills() {
  document.getElementById('pills').innerHTML = FILTROS.map((f,i) =>
    `<button class="pill${i===filtroIdx?' active':''}"
             onclick="setFiltro(${i})">${f.label}</button>`
  ).join('');
}

function setFiltro(i) {
  filtroIdx = i;
  renderPills();
  filterCorais();
}

/* ════════════════════════════
   FILTER + RENDER CORAIS
════════════════════════════ */
function filterCorais() {
  query = document.getElementById('searchInput').value.toLowerCase().trim();
  const f = FILTROS[filtroIdx].fn;
  const filtered = CORAIS.filter(c =>
    f(c) && (!query || c.nome.toLowerCase().includes(query))
  );

  document.getElementById('statTotal').textContent = CORAIS.length;
  document.getElementById('statVis').textContent   = filtered.length;

  const grid = document.getElementById('grid');

  if (!filtered.length) {
    grid.innerHTML = `<div class="empty">
      <div class="empty-icon">🕊️</div>
      <div class="empty-txt">Nenhum coral encontrado</div>
    </div>`;
    return;
  }

  grid.innerHTML = filtered.map((c, i) => {
    const delay = Math.min(i * 35, 500);
    const badgeClass = c.tipo ? ` ${c.tipo}` : '';
    const stripeClass = c.tipo ? ` ${c.tipo}` : '';
    const badgeLabel = c.tipo === 'especial' ? 'Especial' : c.tipo === 'geral' ? 'Geral · 8min' : 'Juventude · 5min';
    return `
    <div class="coral-card" style="transition-delay:${delay}ms">
      <div class="coral-stripe${stripeClass}"></div>
      <div class="coral-body">
        <div class="coral-num">${String(c.num).padStart(2,'0')}</div>
        <div class="coral-badge${badgeClass}">${badgeLabel}</div>
        <h3 class="coral-nome">${c.nome}</h3>
      </div>
      <div class="coral-footer">
        <div class="coral-duracao">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${c.tipo === 'geral' ? '8 minutos' : '5 minutos'}
        </div>
        <div class="coral-arrow">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </div>
      </div>
    </div>`;
  }).join('');

  // animate in
  requestAnimationFrame(() => {
    document.querySelectorAll('.coral-card').forEach(el => {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); } });
      }, {threshold:.08});
      obs.observe(el);
    });
  });
}

/* ════════════════════════════
   NAV
════════════════════════════ */
function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'))
);

/* Active nav on scroll */
const sections = ['programa','corais','footer'];
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if(el && window.scrollY >= el.offsetTop - 80) cur = id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#'+cur);
  });
}, {passive:true});

/* ════════════════════════════
   INIT
════════════════════════════ */
renderPills();
filterCorais();