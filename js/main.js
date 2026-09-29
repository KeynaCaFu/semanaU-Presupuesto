// Semana U 2026 · presupuesto (JS puro). Los datos están en js/presupuesto.js

// ---------- Menú móvil ----------
const menuToggle = document.querySelector('.menu-toggle')
const mobileMenu = document.getElementById('mobile-menu')

function setMenu(open) {
  mobileMenu.hidden = !open
  menuToggle.setAttribute('aria-expanded', String(open))
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú')
}

menuToggle.addEventListener('click', () => setMenu(mobileMenu.hidden))
mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)))

// ---------- Utilidades ----------
// Formato de la hoja de cálculo: ₡1.525.208,50
function colones(n) {
  const [ent, dec] = n.toFixed(2).split('.')
  return `₡${ent.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${dec}`
}
const pct = (n, total) => `${((n / total) * 100).toFixed(1).replace('.', ',')}%`
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])
const sum = (list) => list.reduce((acc, c) => acc + c.total, 0)

// Fechas: "lunes 12 de octubre"
const fechaLarga = (d) => d.toLocaleDateString('es-CR', { weekday: 'long', day: 'numeric', month: 'long' }).replace(',', '')
const limiteCompra = ([y, m, d]) => new Date(y, m - 1, d - ANTICIPACION_DIAS)

// Solo cuentan las compras con precio; las demás van a "Pendientes"
const compras = COMPRAS.filter((c) => c.precio != null).map((c) => ({ ...c, total: c.cant * c.precio }))
const pendientes = COMPRAS.filter((c) => c.precio == null)
const TOTAL = sum(compras)

const porDia = DIAS.map((d) => ({ ...d, compras: compras.filter((c) => c.dia === d.id), limite: limiteCompra(d.fecha) }))
porDia.forEach((d) => (d.total = sum(d.compras)))
const PRIMER_LIMITE = new Date(Math.min(...porDia.map((d) => d.limite)))

const porRubro = Object.entries(CATEGORIAS).map(([id, cat]) => {
  const lista = compras.filter((c) => c.cat === id)
  return { id, nombre: cat.nombre, total: sum(lista), n: lista.length }
}).sort((a, b) => b.total - a.total)

const comprasDeActividad = (id) => COMPRAS.filter((c) => c.para && c.para.includes(id))

document.querySelectorAll('[data-total]').forEach((el) => (el.textContent = colones(TOTAL)))
document.querySelectorAll('[data-limite]').forEach((el) => (el.textContent = fechaLarga(PRIMER_LIMITE)))
document.querySelectorAll('[data-semanas]').forEach((el) => (el.textContent = `${ANTICIPACION_DIAS / 7} semanas`))

// ---------- Cifras clave ----------
const conPresupuesto = ACTIVIDADES.filter((a) => comprasDeActividad(a.id).length)
const diaMayor = porDia.filter((d) => d.id !== 'semana').sort((a, b) => b.total - a.total)[0]

document.getElementById('cifras').innerHTML = [
  ['Inversión total', colones(TOTAL), 'Presupuesto de toda la Semana U'],
  ['Actividades', ACTIVIDADES.length, `${conPresupuesto.length} con compras asociadas`],
  ['Compras', compras.length, `En ${porRubro.length} rubros`],
  ['Día de mayor gasto', diaMayor.corto, colones(diaMayor.total)],
].map(([label, valor, nota], i) => `
  <div class="pillar stat reveal delay-${i + 1}">
    <p class="stat-label">${label}</p>
    <p class="stat-value">${valor}</p>
    <p>${nota}</p>
  </div>`).join('')

// ---------- Barras del resumen ----------
function barras(el, filas) {
  const max = Math.max(...filas.map((f) => f.total))
  el.innerHTML = filas.map((f) => {
    const contenido = `
      <span class="bar-head"><span class="bar-name">${esc(f.nombre)}</span><span class="bar-value">${colones(f.total)}</span></span>
      <span class="bar-track"><span class="bar-fill" style="width:${(f.total / max) * 100}%"></span></span>
      <span class="bar-pct">${pct(f.total, TOTAL)} del total${f.extra ? ` · ${f.extra}` : ''}</span>`
    const title = `${f.nombre}: ${colones(f.total)} (${pct(f.total, TOTAL)})`
    return f.href
      ? `<li><a class="bar-row" href="${f.href}" title="${esc(title)}">${contenido}</a></li>`
      : `<li><div class="bar-row" title="${esc(title)}">${contenido}</div></li>`
  }).join('')
}

barras(document.getElementById('bars-dias'), porDia.map((d) => ({ nombre: d.corto, total: d.total, href: `#dia-${d.id}` })))
barras(document.getElementById('bars-rubros'), porRubro.map((r) => ({ nombre: r.nombre, total: r.total, extra: `${r.n} ${r.n === 1 ? 'compra' : 'compras'}` })))

// ---------- Navegación por día ----------
const dayNav = document.getElementById('day-nav')
dayNav.innerHTML = porDia.map((d) => `<a class="day-btn" href="#dia-${d.id}">${d.corto}</a>`).join('')

// ---------- Paneles por día ----------
function tarjetaActividad(a) {
  const cubre = comprasDeActividad(a.id).map((c) => c.item).join(', ')
  return `
    <article class="activity-card">
      <div class="activity-media">
        <div class="media-fill"><img src="img/actividades/${a.foto}" alt="" loading="lazy"${a.pos ? ` style="object-position: ${a.pos}"` : ''} /></div>
      </div>
      <div class="activity-body">
        <p class="activity-time"><svg class="icon" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><use href="#i-clock"/></svg><span>${esc(a.hora)}</span></p>
        <h4 class="activity-title">${esc(a.titulo)}</h4>
        <p class="activity-covers"><span>Incluye:</span> ${esc(cubre)}</p>
        ${a.nota ? `<p class="activity-covers"><span>Nota:</span> ${esc(a.nota)}</p>` : ''}
      </div>
    </article>`
}

function filaCompra(c) {
  const fecha = c.fecha ? ` <span class="date-flag">${c.fecha}</span>` : ''
  const nota = (c.uso ? `<small class="item-note"><strong>Se usa en:</strong> ${esc(c.uso)}</small>` : '')
    + (c.nota ? `<small class="item-note">${esc(c.nota)}</small>` : '')
  return `
    <tr>
      <td class="col-item" data-label="Compra"><span class="item-name">${esc(c.item)}${fecha}</span><small class="item-qty">${c.cant} × ${colones(c.precio)}</small>${nota}</td>
      <td class="num" data-label="Cantidad">${c.cant}</td>
      <td class="num" data-label="Precio unitario">${colones(c.precio)}</td>
      <td data-label="Proveedor">${esc(c.prov)}</td>
      <td class="num col-total" data-label="Total">${colones(c.total)}</td>
    </tr>`
}

function tablaDia(d) {
  const grupos = porRubro
    .map((r) => ({ ...r, lista: d.compras.filter((c) => c.cat === r.id) }))
    .filter((g) => g.lista.length)
    .sort((a, b) => sum(b.lista) - sum(a.lista))

  return `
    <div class="table-wrap">
      <table class="budget-table">
        <thead>
          <tr><th>Compra</th><th class="num">Cantidad</th><th class="num">Precio unitario</th><th>Proveedor</th><th class="num">Total</th></tr>
        </thead>
        ${grupos.map((g) => `
          <tbody>
            <tr class="cat-row"><th colspan="4" scope="rowgroup">${esc(g.nombre)}</th><td class="num">${colones(sum(g.lista))}</td></tr>
            ${g.lista.map(filaCompra).join('')}
          </tbody>`).join('')}
        <tfoot>
          <tr><th colspan="4">Total ${d.id === 'semana' ? 'toda la semana' : `del ${d.corto.toLowerCase()}`}</th><td class="num">${colones(d.total)}</td></tr>
        </tfoot>
      </table>
    </div>`
}

document.getElementById('dias').innerHTML = porDia.map((d) => {
  const actividades = ACTIVIDADES.filter((a) => a.dia === d.id)
  const conCompras = actividades.filter((a) => comprasDeActividad(a.id).length)
  const sinCompras = actividades.filter((a) => !comprasDeActividad(a.id).length)

  return `
    <section class="day-panel reveal" id="dia-${d.id}" aria-labelledby="t-${d.id}">
      <img src="img/hojas.png" alt="" aria-hidden="true" class="day-leaves" />
      <header class="day-head">
        <div>
          <p class="kicker">${esc(d.sub)}</p>
          <h3 class="day-title" id="t-${d.id}">${esc(d.titulo)}</h3>
        </div>
        <div class="day-total">
          <span>${d.id === 'semana' ? 'Presupuesto' : 'Presupuesto del día'}</span>
          <strong>${colones(d.total)}</strong>
          <small>${pct(d.total, TOTAL)} del total · ${d.compras.length} ${d.compras.length === 1 ? 'compra' : 'compras'}</small>
        </div>
      </header>

      <p class="buy-by"><svg class="icon" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><use href="#i-clock"/></svg>
        <span>${d.id === 'semana' ? 'Compras y contrataciones de uso general' : 'Compras de este día'}: realizar a más tardar el <strong>${fechaLarga(d.limite)}</strong> (${ANTICIPACION_DIAS / 7} semanas antes)</span></p>

      ${conCompras.length ? `
        <h4 class="block-label">Actividades con presupuesto</h4>
        <div class="activities-grid">${conCompras.map(tarjetaActividad).join('')}</div>` : ''}

      ${sinCompras.length ? `
        <div class="also">
          <h4 class="block-label">${conCompras.length ? 'También este día' : 'Actividades del día'} <span>(sin presupuesto asignado)</span></h4>
          <ul class="chip-list">${sinCompras.map((a) => `<li>${esc(a.titulo)}${a.hora ? ` <span>· ${esc(a.hora)}</span>` : ''}</li>`).join('')}</ul>
        </div>` : ''}

      <h4 class="block-label">Desglose de compras</h4>
      ${tablaDia(d)}
    </section>`
}).join('')

// ---------- Pendientes ----------
document.getElementById('pendientes-lista').innerHTML = pendientes
  .map((c) => `<li>${esc(c.item)}${c.cant ? ` <span>· ${c.cant} unidades</span>` : ''} <span>· ${esc(CATEGORIAS[c.cat].nombre)}</span></li>`)
  .join('')

// ---------- Día activo en la navegación ----------
const dayLinks = dayNav.querySelectorAll('.day-btn')
const panelObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      dayLinks.forEach((a) => a.setAttribute('aria-current', String(a.hash === `#${entry.target.id}`)))
    })
  },
  { rootMargin: '-40% 0px -55% 0px' },
)
document.querySelectorAll('.day-panel').forEach((p) => panelObserver.observe(p))

// ---------- Revelado al hacer scroll ----------
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.05 },
)
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
