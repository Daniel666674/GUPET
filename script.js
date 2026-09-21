/* ---------------------------------------------------------------------------
   GUPET — lógica del sitio
   Todo corre en el navegador: no hay servidor, no se envía información a
   ningún lado y el carrito vive en el almacenamiento local del visitante.
--------------------------------------------------------------------------- */

var CART_KEY = 'gupet_cart_v2';
var LAST_ORDER_KEY = 'gupet_last_order_v1';
var VIEWED_KEY = 'gupet_vistos_v1';
var COUPON_KEY = 'gupet_cupon_v1';

/* ===================== utilidades ===================== */

function $(sel, ctx) { return (ctx || document).querySelector(sel); }
function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

function formatCOP(n) {
  return '$' + Number(Math.round(n)).toLocaleString('es-CO');
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function param(name) {
  var m = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
}

function productoPorId(id) {
  for (var i = 0; i < PRODUCTOS.length; i++) {
    if (PRODUCTOS[i].id === id) return PRODUCTOS[i];
  }
  return null;
}

function categoriaPorId(id) {
  for (var i = 0; i < CATEGORIAS.length; i++) {
    if (CATEGORIAS[i].id === id) return CATEGORIAS[i];
  }
  return null;
}

function precioDesde(p) {
  return Math.min.apply(null, p.variantes.map(function (v) { return v.precio; }));
}

function estrellas(valor) {
  var llenas = Math.round(valor);
  var out = '';
  for (var i = 1; i <= 5; i++) out += i <= llenas ? '★' : '☆';
  return out;
}

function waLink(texto) {
  return 'https://wa.me/' + SITE.whatsapp + (texto ? '?text=' + encodeURIComponent(texto) : '');
}

/* ===================== carrito ===================== */

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch (e) { return []; }
}

function saveCart(cart) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  updateCartBadge();
  renderDrawer();
  renderCartPage();
}

function addToCart(item) {
  var cart = getCart();
  var existing = cart.filter(function (i) { return i.id === item.id; })[0];
  if (existing) { existing.qty += item.qty || 1; }
  else { item.qty = item.qty || 1; cart.push(item); }
  saveCart(cart);
}

function removeFromCart(id) {
  saveCart(getCart().filter(function (i) { return i.id !== id; }));
}

function setQty(id, qty) {
  var cart = getCart();
  cart.forEach(function (i) { if (i.id === id) { i.qty = Math.max(1, qty); } });
  saveCart(cart);
}

function cartCount() {
  return getCart().reduce(function (s, i) { return s + i.qty; }, 0);
}

function cartSubtotal() {
  return getCart().reduce(function (s, i) { return s + i.qty * i.price; }, 0);
}

function getCoupon() {
  try {
    var code = localStorage.getItem(COUPON_KEY);
    return code && SITE.cupones[code] ? code : '';
  } catch (e) { return ''; }
}

function setCoupon(code) {
  try {
    if (code) localStorage.setItem(COUPON_KEY, code);
    else localStorage.removeItem(COUPON_KEY);
  } catch (e) {}
}

function cartTotals() {
  var subtotal = cartSubtotal();
  var code = getCoupon();
  var descuento = code ? Math.round(subtotal * SITE.cupones[code].pct / 100) : 0;
  var base = subtotal - descuento;
  var envio = base === 0 ? 0 : (base >= SITE.envioGratisDesde ? 0 : 12000);
  return {
    subtotal: subtotal, cupon: code, descuento: descuento,
    envio: envio, total: base + envio,
    faltaParaEnvioGratis: Math.max(0, SITE.envioGratisDesde - base)
  };
}

function updateCartBadge() {
  var n = cartCount();
  $$('.cart-badge').forEach(function (b) {
    b.textContent = n;
    b.style.display = n > 0 ? 'flex' : 'none';
  });
}

/* ===================== toast ===================== */

function showToast(message) {
  var toast = $('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function () { toast.classList.remove('show'); }, 2400);
}

/* ===================== header / footer compartidos ===================== */

var NAV = [
  { href: 'index.html',     label: 'Inicio' },
  { href: 'catalogo.html',  label: 'Catálogo' },
  { href: 'servicios.html', label: 'Servicios' },
  { href: 'consejos.html',  label: 'Consejos' },
  { href: 'nosotros.html',  label: 'Nosotros' },
  { href: 'contacto.html',  label: 'Contacto' }
];

function buildChrome() {
  var page = document.body.dataset.page || '';

  var navHtml = NAV.map(function (n) {
    var act = (n.href.replace('.html', '') === page) ? ' class="active"' : '';
    return '<li><a href="' + n.href + '"' + act + '>' + n.label + '</a></li>';
  }).join('');

  var header = '' +
    '<a class="skip-link" href="#main">Saltar al contenido</a>' +
    '<div class="announce-bar">' +
      '<div class="container announce-inner">' +
        '<span>Envío gratis desde ' + formatCOP(SITE.envioGratisDesde) + '</span>' +
        '<span class="announce-sep" aria-hidden="true">·</span>' +
        '<span>Cupón <strong>GUPET10</strong> — 10% off</span>' +
        '<span class="announce-sep" aria-hidden="true">·</span>' +
        '<a href="' + waLink('Hola GUPET, tengo una duda sobre un producto.') + '" target="_blank" rel="noopener">Asesoría por WhatsApp</a>' +
      '</div>' +
    '</div>' +
    '<header class="site-header">' +
      '<div class="container header-inner">' +
        '<a href="index.html" class="logo" aria-label="GUPET, inicio"><img src="img/logo.png" alt="GUPET"></a>' +
        '<nav class="main-nav" aria-label="Principal"><ul>' + navHtml + '</ul></nav>' +
        '<div class="header-actions">' +
          '<form class="header-search" role="search" action="catalogo.html" method="get">' +
            '<label class="sr-only" for="hdr-q">Buscar en el catálogo</label>' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>' +
            '<input id="hdr-q" type="search" name="q" placeholder="Buscar marca o producto" autocomplete="off">' +
          '</form>' +
          '<button type="button" class="cart-link" data-open-drawer aria-label="Abrir carrito">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' +
            '<span class="cart-badge">0</span>' +
          '</button>' +
          '<button class="menu-toggle" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span><span></span></button>' +
        '</div>' +
      '</div>' +
    '</header>';

  var slot = $('[data-site-header]');
  if (slot) slot.outerHTML = header;

  var footerNav = NAV.map(function (n) {
    return '<li><a href="' + n.href + '">' + n.label + '</a></li>';
  }).join('');

  var footer = '' +
    '<section class="newsletter-band">' +
      '<div class="container newsletter-inner">' +
        '<div>' +
          '<h2>Consejos de alimentación, una vez al mes</h2>' +
          '<p>Sin spam y sin catálogo disfrazado de newsletter: una guía corta y las ofertas del mes.</p>' +
        '</div>' +
        '<form class="newsletter-form" data-newsletter novalidate>' +
          '<label class="sr-only" for="nl-email">Tu correo</label>' +
          '<input id="nl-email" type="email" name="email" placeholder="tucorreo@ejemplo.com" required>' +
          '<button type="submit" class="btn btn-primary">Suscribirme</button>' +
          '<p class="form-msg" data-msg role="status"></p>' +
        '</form>' +
      '</div>' +
    '</section>' +
    '<footer class="site-footer">' +
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div>' +
            '<a href="index.html" class="logo"><img src="img/logo-white.png" alt="GUPET"></a>' +
            '<p class="footer-about">Tienda de alimento y cuidado para perros y gatos en Colombia. Catálogo elegido marca por marca, con asesoría antes y después de la compra.</p>' +
            '<div class="footer-social">' +
              '<a href="' + waLink('') + '" target="_blank" rel="noopener" aria-label="WhatsApp">WhatsApp</a>' +
            '</div>' +
          '</div>' +
          '<div><h4>Tienda</h4><ul>' + footerNav + '</ul></div>' +
          '<div><h4>Ayuda</h4><ul>' +
            '<li><a href="faq.html">Preguntas frecuentes</a></li>' +
            '<li><a href="envios.html">Envíos y devoluciones</a></li>' +
            '<li><a href="carrito.html">Mi carrito</a></li>' +
            '<li><a href="politicas.html">Privacidad y términos</a></li>' +
          '</ul></div>' +
          '<div><h4>Atención</h4><ul>' +
            '<li><a href="' + waLink('') + '" target="_blank" rel="noopener">WhatsApp ' + SITE.whatsappVisible + '</a></li>' +
            '<li class="footer-quiet">Lunes a sábado</li>' +
            '<li class="footer-quiet">Pedidos en línea 24/7</li>' +
          '</ul>' +
          '<div class="pay-row" aria-label="Medios de pago simulados">' +
            '<span>Visa</span><span>Mastercard</span><span>PSE</span><span>Nequi</span>' +
          '</div>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<span>© 2026 GUPET · Sitio de demostración, no es la tienda en operación.</span>' +
          '<span>Fotos y precios: gupet.co</span>' +
        '</div>' +
      '</div>' +
    '</footer>' +
    '<a href="' + waLink('Hola GUPET, vengo del sitio web.') + '" class="wa-float" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">' +
      '<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.7 4.607 1.907 6.474L4 29l7.72-1.867A11.94 11.94 0 0 0 16.001 27C22.629 27 28 21.627 28 15S22.629 3 16.001 3Zm6.994 16.96c-.297.837-1.47 1.53-2.404 1.727-.638.135-1.47.242-4.273-.917-3.586-1.482-5.892-5.127-6.073-5.363-.174-.235-1.454-1.937-1.454-3.696 0-1.759.918-2.622 1.243-2.982.325-.36.71-.45.946-.45.236 0 .473.002.68.012.218.01.51-.083.798.61.297.71 1.007 2.469 1.095 2.65.089.18.148.393.03.628-.118.236-.178.383-.354.59-.177.207-.371.462-.53.62-.176.176-.36.368-.155.72.207.353.92 1.517 1.976 2.457 1.357 1.21 2.5 1.585 2.853 1.762.353.176.56.147.766-.089.207-.235.887-1.033 1.124-1.387.236-.353.472-.294.797-.176.324.117 2.062.973 2.416 1.15.353.177.588.265.677.412.089.147.089.85-.208 1.687Z"/></svg>' +
    '</a>' +
    '<button type="button" class="to-top" data-to-top aria-label="Volver arriba">↑</button>' +
    '<div class="drawer-backdrop" data-drawer-backdrop hidden></div>' +
    '<aside class="cart-drawer" data-drawer aria-label="Carrito" aria-hidden="true">' +
      '<div class="drawer-head">' +
        '<h2>Tu carrito</h2>' +
        '<button type="button" class="drawer-close" data-close-drawer aria-label="Cerrar carrito">✕</button>' +
      '</div>' +
      '<div class="drawer-body" data-drawer-body></div>' +
      '<div class="drawer-foot" data-drawer-foot></div>' +
    '</aside>';

  var fslot = $('[data-site-footer]');
  if (fslot) fslot.outerHTML = footer;
}

/* ===================== drawer del carrito ===================== */

function openDrawer() {
  var d = $('[data-drawer]'), b = $('[data-drawer-backdrop]');
  if (!d) return;
  renderDrawer();
  d.classList.add('open');
  d.setAttribute('aria-hidden', 'false');
  if (b) b.hidden = false;
  document.body.classList.add('no-scroll');
}

function closeDrawer() {
  var d = $('[data-drawer]'), b = $('[data-drawer-backdrop]');
  if (!d) return;
  d.classList.remove('open');
  d.setAttribute('aria-hidden', 'true');
  if (b) b.hidden = true;
  document.body.classList.remove('no-scroll');
}

function freeShippingBar(t) {
  if (t.subtotal === 0) return '';
  if (t.faltaParaEnvioGratis === 0) {
    return '<div class="ship-bar done"><strong>¡Listo!</strong> Tu pedido tiene envío gratis.' +
      '<div class="ship-track"><span style="width:100%"></span></div></div>';
  }
  var pct = Math.min(100, Math.round((t.subtotal - t.descuento) / SITE.envioGratisDesde * 100));
  return '<div class="ship-bar">Te faltan <strong>' + formatCOP(t.faltaParaEnvioGratis) + '</strong> para el envío gratis.' +
    '<div class="ship-track"><span style="width:' + pct + '%"></span></div></div>';
}

function renderDrawer() {
  var body = $('[data-drawer-body]'), foot = $('[data-drawer-foot]');
  if (!body || !foot) return;
  var cart = getCart();

  if (cart.length === 0) {
    body.innerHTML = '<div class="drawer-empty"><div class="perk-icon">🛒</div><p>Todavía no hay nada en tu carrito.</p>' +
      '<a href="catalogo.html" class="btn btn-primary">Ver catálogo</a></div>';
    foot.innerHTML = '';
    return;
  }

  var t = cartTotals();
  body.innerHTML = freeShippingBar(t) + cart.map(function (i) {
    return '<div class="drawer-row" data-id="' + esc(i.id) + '">' +
      '<img src="' + esc(i.image) + '" alt="' + esc(i.name) + '">' +
      '<div class="drawer-row-info">' +
        '<span class="product-brand">' + esc(i.brand) + '</span>' +
        '<strong>' + esc(i.name) + '</strong>' +
        '<span class="price-unit">' + esc(i.unit) + '</span>' +
        '<div class="cart-row-qty">' +
          '<button type="button" class="qty-btn" data-action="dec" aria-label="Quitar uno">−</button>' +
          '<span class="qty-value">' + i.qty + '</span>' +
          '<button type="button" class="qty-btn" data-action="inc" aria-label="Agregar uno">+</button>' +
        '</div>' +
      '</div>' +
      '<div class="drawer-row-right">' +
        '<span class="cart-row-price">' + formatCOP(i.price * i.qty) + '</span>' +
        '<button type="button" class="cart-row-remove" data-action="del" aria-label="Quitar del carrito">✕</button>' +
      '</div>' +
    '</div>';
  }).join('');

  foot.innerHTML =
    '<div class="summary-line"><span>Subtotal</span><span>' + formatCOP(t.subtotal) + '</span></div>' +
    (t.descuento ? '<div class="summary-line discount"><span>Cupón ' + esc(t.cupon) + '</span><span>−' + formatCOP(t.descuento) + '</span></div>' : '') +
    '<div class="summary-line"><span>Envío</span><span>' + (t.envio === 0 ? 'Gratis' : formatCOP(t.envio)) + '</span></div>' +
    '<div class="summary-line summary-total"><span>Total</span><span>' + formatCOP(t.total) + '</span></div>' +
    '<a href="checkout.html" class="btn btn-primary drawer-cta">Ir a pagar</a>' +
    '<a href="carrito.html" class="btn btn-outline drawer-cta">Ver el carrito completo</a>';

  $$('.drawer-row', body).forEach(function (row) {
    var id = row.dataset.id;
    row.addEventListener('click', function (e) {
      var act = e.target.dataset.action;
      if (!act) return;
      var item = getCart().filter(function (i) { return i.id === id; })[0];
      if (!item) return;
      if (act === 'inc') setQty(id, item.qty + 1);
      else if (act === 'dec') { if (item.qty <= 1) removeFromCart(id); else setQty(id, item.qty - 1); }
      else if (act === 'del') removeFromCart(id);
    });
  });
}

/* ===================== tarjetas de producto ===================== */

function productCard(p) {
  var v0 = p.variantes[0];
  var badges = p.destacado ? '<span class="product-tag tag-top">Más vendido</span>' : '';
  var ahorro = v0.precioAntes ? '<span class="save-tag">Ahorras ' + formatCOP(v0.precioAntes - v0.precio) + '</span>' : '';

  var selector = p.variantes.length > 1
    ? '<div class="weight-select" role="group" aria-label="Presentación">' + p.variantes.map(function (v, i) {
        return '<button type="button" data-index="' + i + '"' + (i === 0 ? ' class="active"' : '') + '>' + esc(v.label) + '</button>';
      }).join('') + '</div>'
    : '';

  return '<article class="product-card" data-product="' + esc(p.id) + '">' +
    '<a class="product-media" href="producto.html?id=' + encodeURIComponent(p.id) + '" aria-label="Ver ' + esc(p.nombre) + '">' +
      badges + '<img src="' + esc(p.img) + '" alt="' + esc(p.marca + ' ' + p.nombre) + '" loading="lazy">' +
    '</a>' +
    '<div class="product-body">' +
      '<span class="product-brand">' + esc(p.marca) + '</span>' +
      '<h3><a href="producto.html?id=' + encodeURIComponent(p.id) + '">' + esc(p.nombre) + '</a></h3>' +
      '<div class="rating" aria-label="' + p.rating + ' de 5"><span class="stars">' + estrellas(p.rating) + '</span><span>(' + p.resenas + ')</span></div>' +
      selector +
      '<div class="price-row"><span class="price">' + formatCOP(v0.precio) + '</span>' +
        '<span class="price-old"' + (v0.precioAntes ? '' : ' style="display:none"') + '>' + (v0.precioAntes ? formatCOP(v0.precioAntes) : '') + '</span>' +
        ahorro +
      '</div>' +
      '<span class="price-unit">' + esc(v0.unidad) + '</span>' +
      '<button type="button" class="product-cta add-to-cart">Agregar al carrito</button>' +
    '</div>' +
  '</article>';
}

function bindProductCards(scope) {
  $$('.product-card', scope || document).forEach(function (card) {
    if (card._bound) return;
    card._bound = true;

    var p = productoPorId(card.dataset.product);
    if (!p) return;
    card._index = 0;

    var priceEl = $('.price', card), oldEl = $('.price-old', card), unitEl = $('.price-unit', card);

    $$('.weight-select button', card).forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('.weight-select button', card).forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        var v = p.variantes[Number(btn.dataset.index)];
        card._index = Number(btn.dataset.index);
        if (priceEl) priceEl.textContent = formatCOP(v.precio);
        if (unitEl) unitEl.textContent = v.unidad;
        if (oldEl) {
          oldEl.style.display = v.precioAntes ? '' : 'none';
          oldEl.textContent = v.precioAntes ? formatCOP(v.precioAntes) : '';
        }
      });
    });

    var add = $('.add-to-cart', card);
    if (add) {
      add.addEventListener('click', function () {
        addProductToCart(p, card._index || 0, 1);
      });
    }
  });
}

function addProductToCart(p, index, qty) {
  var v = p.variantes[index] || p.variantes[0];
  addToCart({
    id: p.id + '|' + index,
    productId: p.id,
    name: p.nombre,
    brand: p.marca,
    price: v.precio,
    unit: v.unidad,
    image: p.img,
    qty: qty || 1
  });
  showToast(p.nombre + ' (' + v.unidad.toLowerCase() + ') se agregó al carrito');
  openDrawer();
}

/* ===================== inicio ===================== */

function renderHome() {
  var grid = $('[data-home-products]');
  if (grid) {
    grid.innerHTML = PRODUCTOS.slice(0, 4).map(productCard).join('');
    bindProductCards(grid);
  }

  var cats = $('[data-home-categorias]');
  if (cats) {
    cats.innerHTML = CATEGORIAS.map(function (c) {
      var href = c.id === 'servicios' ? 'servicios.html' : 'catalogo.html?cat=' + c.id;
      return '<a class="category-card" href="' + href + '">' +
        '<img src="' + c.img + '" alt="' + esc(c.nombre + ': ' + c.desc) + '" loading="lazy">' +
        '<div class="cat-label"><strong>' + esc(c.nombre) + '</strong><span>' + esc(c.desc) + '</span></div>' +
      '</a>';
    }).join('');
  }

  var brands = $('[data-marcas]');
  if (brands) {
    brands.innerHTML = MARCAS.map(function (m) { return '<span class="brand-chip">' + esc(m) + '</span>'; }).join('');
  }

  var revs = $('[data-resenas]');
  if (revs) {
    revs.innerHTML = RESENAS.map(function (r) {
      return '<figure class="review-card">' +
        '<div class="stars">' + estrellas(r.estrellas) + '</div>' +
        '<blockquote>“' + esc(r.texto) + '”</blockquote>' +
        '<figcaption><strong>' + esc(r.nombre) + '</strong><span>' + esc(r.mascota) + '</span></figcaption>' +
      '</figure>';
    }).join('');
  }

  var posts = $('[data-home-posts]');
  if (posts) posts.innerHTML = POSTS.slice(0, 3).map(postCard).join('');
}

/* ===================== catálogo ===================== */

var catalogState = { cat: '', q: '', orden: 'relevancia', soloOferta: false };

function renderCatalogo() {
  var grid = $('[data-catalogo]');
  if (!grid) return;

  catalogState.cat = param('cat');
  catalogState.q = param('q');

  var chips = $('[data-cat-filtros]');
  if (chips) {
    var conProductos = CATEGORIAS.filter(function (c) {
      return PRODUCTOS.some(function (p) { return p.cat === c.id; });
    });
    var opciones = [{ id: '', nombre: 'Todo' }].concat(conProductos);
    chips.innerHTML = opciones.map(function (c) {
      return '<button type="button" class="chip" data-cat="' + c.id + '">' + esc(c.nombre) + (c.subtitulo ? ' <span>· ' + esc(c.subtitulo) + '</span>' : '') + '</button>';
    }).join('');
    chips.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-cat]');
      if (!btn) return;
      catalogState.cat = btn.dataset.cat;
      pintarCatalogo();
    });
  }

  var buscador = $('[data-cat-buscar]');
  if (buscador) {
    buscador.value = catalogState.q;
    buscador.addEventListener('input', function () {
      catalogState.q = buscador.value;
      pintarCatalogo();
    });
  }

  var orden = $('[data-cat-orden]');
  if (orden) {
    orden.addEventListener('change', function () {
      catalogState.orden = orden.value;
      pintarCatalogo();
    });
  }

  var oferta = $('[data-cat-oferta]');
  if (oferta) {
    oferta.addEventListener('change', function () {
      catalogState.soloOferta = oferta.checked;
      pintarCatalogo();
    });
  }

  pintarCatalogo();
}

function pintarCatalogo() {
  var grid = $('[data-catalogo]');
  var q = catalogState.q.trim().toLowerCase();

  var lista = PRODUCTOS.filter(function (p) {
    if (catalogState.cat && p.cat !== catalogState.cat) return false;
    if (catalogState.soloOferta && !p.oferta) return false;
    if (!q) return true;
    var heno = (p.nombre + ' ' + p.marca + ' ' + p.tipo + ' ' + p.tags.join(' ') + ' ' + p.resumen).toLowerCase();
    return q.split(/\s+/).every(function (w) { return heno.indexOf(w) !== -1; });
  });

  if (catalogState.orden === 'precio-asc') lista.sort(function (a, b) { return precioDesde(a) - precioDesde(b); });
  else if (catalogState.orden === 'precio-desc') lista.sort(function (a, b) { return precioDesde(b) - precioDesde(a); });
  else if (catalogState.orden === 'rating') lista.sort(function (a, b) { return b.rating - a.rating; });

  $$('[data-cat-filtros] .chip').forEach(function (c) {
    c.classList.toggle('active', c.dataset.cat === catalogState.cat);
  });

  var contador = $('[data-cat-contador]');
  if (contador) {
    contador.textContent = lista.length === 1
      ? '1 producto'
      : lista.length + ' productos';
  }

  if (lista.length === 0) {
    grid.innerHTML = '<div class="empty-state">' +
      '<div class="perk-icon">🔎</div>' +
      '<h3>No encontramos productos con ese filtro</h3>' +
      '<p>El catálogo completo de la tienda es más amplio que esta demo. Escríbenos y te confirmamos si manejamos lo que buscas.</p>' +
      '<a class="btn btn-primary" target="_blank" rel="noopener" href="' + waLink('Hola GUPET, busco: ' + catalogState.q) + '">Preguntar por WhatsApp</a>' +
    '</div>';
    return;
  }

  grid.innerHTML = lista.map(productCard).join('');
  bindProductCards(grid);
}

/* ===================== ficha de producto ===================== */

function renderProducto() {
  var root = $('[data-producto]');
  if (!root) return;

  var p = productoPorId(param('id')) || PRODUCTOS[0];
  document.title = p.marca + ' ' + p.nombre + ' — GUPET';

  var cat = categoriaPorId(p.cat);
  var crumbs = $('[data-breadcrumb]');
  if (crumbs) {
    crumbs.innerHTML = '<a href="index.html">Inicio</a> <span>/</span> ' +
      '<a href="catalogo.html">Catálogo</a> <span>/</span> ' +
      '<a href="catalogo.html?cat=' + p.cat + '">' + esc(cat ? cat.nombre : '') + '</a> <span>/</span> ' +
      '<span aria-current="page">' + esc(p.nombre) + '</span>';
  }

  var v0 = p.variantes[0];
  root.innerHTML = '' +
    '<div class="pdp-media">' +
      '<img src="' + esc(p.img) + '" alt="' + esc(p.marca + ' ' + p.nombre) + '">' +
    '</div>' +
    '<div class="pdp-info">' +
      '<span class="product-brand">' + esc(p.marca) + '</span>' +
      '<h1>' + esc(p.nombre) + '</h1>' +
      '<div class="rating"><span class="stars">' + estrellas(p.rating) + '</span><span>' + p.rating.toFixed(1) + ' · ' + p.resenas + ' reseñas</span></div>' +
      '<p class="pdp-resumen">' + esc(p.resumen) + '</p>' +
      (p.variantes.length > 1
        ? '<div class="pdp-field"><span class="pdp-label">Presentación</span>' +
          '<div class="weight-select" data-pdp-variantes role="group" aria-label="Presentación">' +
            p.variantes.map(function (v, i) {
              return '<button type="button" data-index="' + i + '"' + (i === 0 ? ' class="active"' : '') + '>' + esc(v.label) + '</button>';
            }).join('') +
          '</div></div>'
        : '') +
      '<div class="pdp-price">' +
        '<span class="price" data-pdp-price>' + formatCOP(v0.precio) + '</span>' +
        '<span class="price-old" data-pdp-old' + (v0.precioAntes ? '' : ' style="display:none"') + '>' + (v0.precioAntes ? formatCOP(v0.precioAntes) : '') + '</span>' +
        '<span class="price-unit" data-pdp-unit>' + esc(v0.unidad) + '</span>' +
      '</div>' +
      '<div class="pdp-buy">' +
        '<div class="cart-row-qty qty-box">' +
          '<button type="button" class="qty-btn" data-pdp-dec aria-label="Menos">−</button>' +
          '<span class="qty-value" data-pdp-qty>1</span>' +
          '<button type="button" class="qty-btn" data-pdp-inc aria-label="Más">+</button>' +
        '</div>' +
        '<button type="button" class="btn btn-primary pdp-add" data-pdp-add>Agregar al carrito</button>' +
      '</div>' +
      '<p class="pdp-stock">' + (p.stock ? '<span class="dot-ok"></span> Disponible · despacho en 24–48 h hábiles' : 'Sin stock por ahora') + '</p>' +
      '<ul class="pdp-bullets">' + p.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>' +
      '<div class="pdp-help">' +
        '<strong>¿Dudas con la presentación?</strong>' +
        '<p>Cuéntanos edad, peso y tamaño de tu mascota y te decimos cuál rinde mejor.</p>' +
        '<a class="btn btn-outline" target="_blank" rel="noopener" href="' + waLink('Hola GUPET, quiero asesoría sobre ' + p.marca + ' ' + p.nombre) + '">Preguntar por WhatsApp</a>' +
      '</div>' +
    '</div>';

  var detalle = $('[data-pdp-detalle]');
  if (detalle) {
    detalle.innerHTML =
      '<div class="pdp-tabs" role="tablist">' +
        '<button type="button" class="active" data-tab="desc" role="tab">Descripción</button>' +
        '<button type="button" data-tab="envio" role="tab">Envío</button>' +
        '<button type="button" data-tab="asesoria" role="tab">Asesoría</button>' +
      '</div>' +
      '<div class="pdp-panel active" data-panel="desc"><p>' + esc(p.detalle) + '</p>' +
        '<p class="pdp-meta"><strong>Categoría:</strong> ' + esc(cat ? cat.nombre + ' · ' + cat.subtitulo : '') + ' · <strong>Tipo:</strong> ' + esc(p.tipo) + '</p></div>' +
      '<div class="pdp-panel" data-panel="envio"><p>Despacho en 24 a 48 horas hábiles después de confirmado el pedido. Envío gratis desde ' + formatCOP(SITE.envioGratisDesde) + '; por debajo de ese monto se cobra una tarifa plana de ' + formatCOP(12000) + '.</p><p>Las condiciones completas están en <a href="envios.html">Envíos y devoluciones</a>.</p></div>' +
      '<div class="pdp-panel" data-panel="asesoria"><p>Si no estás seguro de la línea o la presentación, escríbenos antes de comprar. Un alimento mal elegido termina costando más que la asesoría de cinco minutos que te podemos dar por WhatsApp.</p><p>Si es una dieta veterinaria, pídele la indicación a tu veterinario: esas fórmulas no son intercambiables.</p></div>';

    detalle.addEventListener('click', function (e) {
      var b = e.target.closest('[data-tab]');
      if (!b) return;
      $$('[data-tab]', detalle).forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      $$('[data-panel]', detalle).forEach(function (x) {
        x.classList.toggle('active', x.dataset.panel === b.dataset.tab);
      });
    });
  }

  var idx = 0, qty = 1;
  var priceEl = $('[data-pdp-price]'), oldEl = $('[data-pdp-old]'), unitEl = $('[data-pdp-unit]'), qtyEl = $('[data-pdp-qty]');

  $$('[data-pdp-variantes] button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('[data-pdp-variantes] button').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      idx = Number(btn.dataset.index);
      var v = p.variantes[idx];
      priceEl.textContent = formatCOP(v.precio);
      unitEl.textContent = v.unidad;
      oldEl.style.display = v.precioAntes ? '' : 'none';
      oldEl.textContent = v.precioAntes ? formatCOP(v.precioAntes) : '';
    });
  });

  $('[data-pdp-inc]').addEventListener('click', function () { qty++; qtyEl.textContent = qty; });
  $('[data-pdp-dec]').addEventListener('click', function () { qty = Math.max(1, qty - 1); qtyEl.textContent = qty; });
  $('[data-pdp-add]').addEventListener('click', function () { addProductToCart(p, idx, qty); });

  recordarVisto(p.id);

  var rel = $('[data-relacionados]');
  if (rel) {
    var otros = PRODUCTOS.filter(function (o) { return o.id !== p.id && o.cat === p.cat; });
    if (otros.length < 3) {
      otros = otros.concat(PRODUCTOS.filter(function (o) { return o.id !== p.id && o.cat !== p.cat; }));
    }
    rel.innerHTML = otros.slice(0, 3).map(productCard).join('');
    bindProductCards(rel);
  }

  var ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Product',
    name: p.marca + ' ' + p.nombre, brand: { '@type': 'Brand', name: p.marca },
    description: p.resumen, image: p.img,
    aggregateRating: { '@type': 'AggregateRating', ratingValue: p.rating, reviewCount: p.resenas },
    offers: p.variantes.map(function (v) {
      return { '@type': 'Offer', name: v.unidad, price: v.precio, priceCurrency: 'COP', availability: 'https://schema.org/InStock' };
    })
  });
  document.head.appendChild(ld);
}

function recordarVisto(id) {
  try {
    var vistos = JSON.parse(localStorage.getItem(VIEWED_KEY)) || [];
    vistos = [id].concat(vistos.filter(function (x) { return x !== id; })).slice(0, 6);
    localStorage.setItem(VIEWED_KEY, JSON.stringify(vistos));
  } catch (e) {}
}

function renderVistos() {
  var el = $('[data-vistos]');
  if (!el) return;
  var ids = [];
  try { ids = JSON.parse(localStorage.getItem(VIEWED_KEY)) || []; } catch (e) {}
  var lista = ids.map(productoPorId).filter(Boolean).slice(0, 4);
  if (lista.length < 2) { el.closest('section').style.display = 'none'; return; }
  $('[data-vistos-grid]').innerHTML = lista.map(productCard).join('');
  bindProductCards(el);
}

/* ===================== blog ===================== */

function postCard(post) {
  return '<article class="post-card">' +
    '<a href="consejo.html?id=' + encodeURIComponent(post.id) + '" class="post-media">' +
      '<img src="' + esc(post.img) + '" alt="" loading="lazy">' +
    '</a>' +
    '<div class="post-body">' +
      '<span class="post-meta">' + esc(post.cat) + ' · ' + esc(post.fechaTexto) + '</span>' +
      '<h3><a href="consejo.html?id=' + encodeURIComponent(post.id) + '">' + esc(post.titulo) + '</a></h3>' +
      '<p>' + esc(post.resumen) + '</p>' +
      '<a class="text-link" href="consejo.html?id=' + encodeURIComponent(post.id) + '">Leer el artículo →</a>' +
    '</div>' +
  '</article>';
}

function renderBlog() {
  var el = $('[data-posts]');
  if (el) el.innerHTML = POSTS.map(postCard).join('');

  var art = $('[data-post]');
  if (!art) return;
  var id = param('id');
  var post = POSTS.filter(function (p) { return p.id === id; })[0] || POSTS[0];
  document.title = post.titulo + ' — GUPET';

  var crumbs = $('[data-breadcrumb]');
  if (crumbs) {
    crumbs.innerHTML = '<a href="index.html">Inicio</a> <span>/</span> <a href="consejos.html">Consejos</a> <span>/</span> <span aria-current="page">' + esc(post.titulo) + '</span>';
  }

  art.innerHTML = '<span class="post-meta">' + esc(post.cat) + ' · ' + esc(post.fechaTexto) + '</span>' +
    '<h1>' + esc(post.titulo) + '</h1>' +
    '<img class="post-hero" src="' + esc(post.img) + '" alt="">' +
    post.cuerpo.map(function (par) { return '<p>' + esc(par) + '</p>'; }).join('') +
    '<div class="post-cta">' +
      '<strong>¿Te quedó una duda con tu caso puntual?</strong>' +
      '<p>Escríbenos con la edad, el peso y el alimento actual de tu mascota y te damos una recomendación concreta.</p>' +
      '<a class="btn btn-primary" target="_blank" rel="noopener" href="' + waLink('Hola GUPET, leí el artículo "' + post.titulo + '" y tengo una duda.') + '">Preguntar por WhatsApp</a>' +
    '</div>';

  var mas = $('[data-post-mas]');
  if (mas) {
    mas.innerHTML = POSTS.filter(function (p) { return p.id !== post.id; }).map(postCard).join('');
  }
}

/* ===================== FAQ ===================== */

function renderFaq() {
  var el = $('[data-faq]');
  if (!el) return;
  el.innerHTML = FAQS.map(function (f, i) {
    return '<div class="faq-item">' +
      '<button type="button" class="faq-q" aria-expanded="false" aria-controls="faq-a-' + i + '">' +
        '<span>' + esc(f.q) + '</span><span class="faq-icon" aria-hidden="true">+</span>' +
      '</button>' +
      '<div class="faq-a" id="faq-a-' + i + '" hidden><p>' + esc(f.a) + '</p></div>' +
    '</div>';
  }).join('');

  el.addEventListener('click', function (e) {
    var btn = e.target.closest('.faq-q');
    if (!btn) return;
    var open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    btn.parentNode.classList.toggle('open', !open);
    btn.nextElementSibling.hidden = open;
  });

  var ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQS.map(function (f) {
      return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } };
    })
  });
  document.head.appendChild(ld);
}

/* ===================== carrito (página) ===================== */

function renderCartPage() {
  var root = $('[data-cart-root]');
  if (!root) return;
  var cart = getCart();
  var emptyEl = $('[data-cart-empty]'), listEl = $('[data-cart-list]'),
      summaryEl = $('[data-cart-summary]'), layout = $('.cart-layout');

  if (cart.length === 0) {
    if (emptyEl) emptyEl.style.display = '';
    if (layout) layout.style.display = 'none';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';
  if (layout) layout.style.display = '';

  listEl.innerHTML = cart.map(function (item) {
    return '<div class="cart-row" data-id="' + esc(item.id) + '">' +
      '<a href="producto.html?id=' + encodeURIComponent(item.productId || '') + '"><img src="' + esc(item.image) + '" alt="' + esc(item.name) + '"></a>' +
      '<div class="cart-row-info">' +
        '<span class="product-brand">' + esc(item.brand) + '</span>' +
        '<h3><a href="producto.html?id=' + encodeURIComponent(item.productId || '') + '">' + esc(item.name) + '</a></h3>' +
        '<span class="price-unit">' + esc(item.unit) + ' · ' + formatCOP(item.price) + ' c/u</span>' +
      '</div>' +
      '<div class="cart-row-qty">' +
        '<button type="button" class="qty-btn" data-action="dec" aria-label="Quitar uno">−</button>' +
        '<span class="qty-value">' + item.qty + '</span>' +
        '<button type="button" class="qty-btn" data-action="inc" aria-label="Agregar uno">+</button>' +
      '</div>' +
      '<div class="cart-row-price">' + formatCOP(item.price * item.qty) + '</div>' +
      '<button type="button" class="cart-row-remove" data-action="del" aria-label="Quitar">✕</button>' +
    '</div>';
  }).join('');

  var t = cartTotals();
  summaryEl.innerHTML = '<h2 class="summary-title">Resumen del pedido</h2>' +
    freeShippingBar(t) +
    '<div class="summary-line"><span>Subtotal (' + cartCount() + ' art.)</span><span>' + formatCOP(t.subtotal) + '</span></div>' +
    (t.descuento ? '<div class="summary-line discount"><span>Cupón ' + esc(t.cupon) + '</span><span>−' + formatCOP(t.descuento) + '</span></div>' : '') +
    '<div class="summary-line"><span>Envío</span><span>' + (t.envio === 0 ? 'Gratis' : formatCOP(t.envio)) + '</span></div>' +
    '<div class="summary-line summary-total"><span>Total</span><span>' + formatCOP(t.total) + '</span></div>' +
    '<form class="coupon-form" data-coupon>' +
      '<label class="sr-only" for="cupon">Cupón</label>' +
      '<input id="cupon" type="text" placeholder="Cupón (prueba GUPET10)" value="' + esc(t.cupon) + '">' +
      '<button type="submit" class="btn btn-outline">Aplicar</button>' +
      '<p class="form-msg" data-msg role="status">' + (t.cupon ? SITE.cupones[t.cupon].texto + ' aplicado.' : '') + '</p>' +
    '</form>' +
    '<a href="checkout.html" class="btn btn-primary full">Proceder al pago</a>' +
    '<a href="catalogo.html" class="btn btn-outline full">Seguir comprando</a>' +
    '<ul class="trust-list">' +
      '<li>Pago simulado, nada se cobra en la demo</li>' +
      '<li>Envío gratis desde ' + formatCOP(SITE.envioGratisDesde) + '</li>' +
      '<li>Asesoría por WhatsApp antes y después de comprar</li>' +
    '</ul>';

  listEl.addEventListener('click', onCartRowClick);

  var cf = $('[data-coupon]');
  if (cf) {
    cf.addEventListener('submit', function (e) {
      e.preventDefault();
      var code = $('#cupon').value.trim().toUpperCase();
      var msg = $('[data-msg]', cf);
      if (!code) { setCoupon(''); renderCartPage(); return; }
      if (SITE.cupones[code]) {
        setCoupon(code);
        showToast('Cupón aplicado: ' + SITE.cupones[code].texto);
        renderCartPage();
      } else {
        msg.textContent = 'Ese cupón no existe. Prueba con GUPET10.';
        msg.className = 'form-msg error';
      }
    });
  }
}

function onCartRowClick(e) {
  var act = e.target.dataset.action;
  if (!act) return;
  var row = e.target.closest('.cart-row');
  if (!row) return;
  var id = row.dataset.id;
  var item = getCart().filter(function (i) { return i.id === id; })[0];
  if (!item) return;
  if (act === 'inc') setQty(id, item.qty + 1);
  else if (act === 'dec') { if (item.qty <= 1) removeFromCart(id); else setQty(id, item.qty - 1); }
  else if (act === 'del') { removeFromCart(id); showToast('Producto eliminado del carrito'); }
}

/* ===================== checkout ===================== */

function renderCheckoutSummary() {
  var el = $('[data-checkout-summary]');
  if (!el) return;
  var cart = getCart();
  if (cart.length === 0) { window.location.href = 'carrito.html'; return; }
  var t = cartTotals();
  el.innerHTML = cart.map(function (item) {
    return '<div class="checkout-line">' +
      '<img src="' + esc(item.image) + '" alt="' + esc(item.name) + '">' +
      '<div class="checkout-line-info"><strong>' + esc(item.name) + '</strong><span>' + esc(item.unit) + ' × ' + item.qty + '</span></div>' +
      '<span class="checkout-line-price">' + formatCOP(item.price * item.qty) + '</span>' +
    '</div>';
  }).join('') +
    '<div class="summary-line"><span>Subtotal</span><span>' + formatCOP(t.subtotal) + '</span></div>' +
    (t.descuento ? '<div class="summary-line discount"><span>Cupón ' + esc(t.cupon) + '</span><span>−' + formatCOP(t.descuento) + '</span></div>' : '') +
    '<div class="summary-line"><span>Envío</span><span>' + (t.envio === 0 ? 'Gratis' : formatCOP(t.envio)) + '</span></div>' +
    '<div class="summary-line summary-total"><span>Total</span><span>' + formatCOP(t.total) + '</span></div>';
}

function bindCheckout() {
  var form = $('#checkout-form');
  if (!form) return;

  var tarjeta = $('#co-tarjeta');
  if (tarjeta) {
    tarjeta.addEventListener('input', function () {
      var v = tarjeta.value.replace(/\D/g, '').slice(0, 16);
      tarjeta.value = v.replace(/(.{4})/g, '$1 ').trim();
    });
  }
  var venc = $('#co-vencimiento');
  if (venc) {
    venc.addEventListener('input', function () {
      var v = venc.value.replace(/\D/g, '').slice(0, 4);
      venc.value = v.length > 2 ? v.slice(0, 2) + '/' + v.slice(2) : v;
    });
  }

  $$('[data-pago-opcion]').forEach(function (opt) {
    opt.addEventListener('change', function () {
      var esTarjeta = opt.value === 'tarjeta' && opt.checked;
      var box = $('[data-pago-tarjeta]');
      if (box) box.style.display = esTarjeta ? '' : 'none';
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var cart = getCart();
    if (cart.length === 0) return;

    if (!form.checkValidity()) { form.reportValidity(); return; }

    var t = cartTotals();
    var metodo = ($('[data-pago-opcion]:checked') || {}).value || 'tarjeta';
    var order = {
      number: 'GP-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      name: $('#co-nombre').value.trim(),
      email: $('#co-email') ? $('#co-email').value.trim() : '',
      address: $('#co-direccion').value.trim(),
      city: $('#co-ciudad').value.trim(),
      phone: $('#co-telefono').value.trim(),
      nota: $('#co-nota') ? $('#co-nota').value.trim() : '',
      metodo: metodo === 'contraentrega' ? 'Pago contra entrega' : 'Tarjeta (simulada)',
      items: cart, totals: t, total: t.total
    };

    try { sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order)); } catch (err) {}
    setCoupon('');
    saveCart([]);
    window.location.href = 'pedido-confirmado.html';
  });
}

/* ===================== confirmación ===================== */

function renderOrderConfirmation() {
  var root = $('[data-order-root]');
  if (!root) return;
  var raw = null;
  try { raw = sessionStorage.getItem(LAST_ORDER_KEY); } catch (e) {}
  if (!raw) {
    root.innerHTML = '<div class="empty-state"><div class="perk-icon">📦</div>' +
      '<h3>No encontramos un pedido reciente</h3>' +
      '<p>Arma un pedido desde el catálogo para ver cómo se ve la confirmación.</p>' +
      '<a class="btn btn-primary" href="catalogo.html">Ver catálogo</a></div>';
    return;
  }
  var order = JSON.parse(raw);
  var t = order.totals || { subtotal: order.total, descuento: 0, envio: 0, total: order.total };
  var fecha = new Date(order.date);
  var entrega = new Date(fecha.getTime() + 3 * 86400000);
  var fmt = function (d) { return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long' }); };

  $$('[data-order-number]').forEach(function (n) { n.textContent = order.number; });
  $$('[data-order-name]').forEach(function (n) { n.textContent = order.name; });
  $$('[data-order-address]').forEach(function (n) { n.textContent = order.address + ', ' + order.city; });

  var meta = $('[data-order-meta]');
  if (meta) {
    meta.innerHTML =
      '<div><span>Pedido</span><strong>' + esc(order.number) + '</strong></div>' +
      '<div><span>Entrega estimada</span><strong>' + fmt(entrega) + '</strong></div>' +
      '<div><span>Método de pago</span><strong>' + esc(order.metodo || 'Tarjeta (simulada)') + '</strong></div>' +
      '<div><span>Teléfono</span><strong>' + esc(order.phone) + '</strong></div>';
  }

  var pasos = $('[data-order-pasos]');
  if (pasos) {
    pasos.innerHTML = ['Pedido recibido', 'En preparación', 'En camino', 'Entregado']
      .map(function (p, i) {
        return '<li class="' + (i === 0 ? 'done' : '') + '"><span class="step-dot"></span>' + p + '</li>';
      }).join('');
  }

  var itemsEl = $('[data-order-items]');
  if (itemsEl) {
    itemsEl.innerHTML = order.items.map(function (item) {
      return '<div class="checkout-line">' +
        '<img src="' + esc(item.image) + '" alt="' + esc(item.name) + '">' +
        '<div class="checkout-line-info"><strong>' + esc(item.name) + '</strong><span>' + esc(item.unit) + ' × ' + item.qty + '</span></div>' +
        '<span class="checkout-line-price">' + formatCOP(item.price * item.qty) + '</span>' +
      '</div>';
    }).join('') +
      '<div class="summary-line"><span>Subtotal</span><span>' + formatCOP(t.subtotal) + '</span></div>' +
      (t.descuento ? '<div class="summary-line discount"><span>Cupón</span><span>−' + formatCOP(t.descuento) + '</span></div>' : '') +
      '<div class="summary-line"><span>Envío</span><span>' + (t.envio === 0 ? 'Gratis' : formatCOP(t.envio)) + '</span></div>' +
      '<div class="summary-line summary-total"><span>Total pagado (simulado)</span><span>' + formatCOP(t.total) + '</span></div>';
  }

  var wa = $('[data-order-wa]');
  if (wa) wa.href = waLink('Hola GUPET, consulto por mi pedido ' + order.number + '.');
}

/* ===================== formularios ===================== */

function bindForms() {
  var nl = $('[data-newsletter]');
  if (nl) {
    nl.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('input', nl), msg = $('[data-msg]', nl);
      var ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value.trim());
      msg.className = 'form-msg ' + (ok ? 'ok' : 'error');
      msg.textContent = ok
        ? '¡Listo! En la demo no se envía nada: así se vería la confirmación.'
        : 'Revisa el correo: parece que le falta algo.';
      if (ok) input.value = '';
    });
  }

  var cf = $('[data-contact-form]');
  if (cf) {
    cf.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!cf.checkValidity()) { cf.reportValidity(); return; }
      var msg = $('[data-msg]', cf);
      msg.className = 'form-msg ok';
      msg.textContent = 'Mensaje listo. En la demo no se envía a ningún servidor — en el sitio real llegaría al correo de GUPET.';
      cf.reset();
    });
  }
}

/* ===================== animaciones y varios ===================== */

function bindChrome() {
  var toggle = $('.menu-toggle'), nav = $('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.classList.toggle('open', open);
    });
  }

  $$('[data-open-drawer]').forEach(function (b) { b.addEventListener('click', openDrawer); });
  $$('[data-close-drawer], [data-drawer-backdrop]').forEach(function (b) { b.addEventListener('click', closeDrawer); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });

  var top = $('[data-to-top]');
  if (top) {
    top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    window.addEventListener('scroll', function () {
      top.classList.toggle('show', window.scrollY > 700);
    }, { passive: true });
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  }
}

/* ===================== init ===================== */

document.addEventListener('DOMContentLoaded', function () {
  buildChrome();
  bindChrome();
  updateCartBadge();

  renderHome();
  renderCatalogo();
  renderProducto();
  renderBlog();
  renderFaq();
  renderVistos();
  renderCartPage();
  renderCheckoutSummary();
  bindCheckout();
  renderOrderConfirmation();
  renderDrawer();
  bindForms();
});
