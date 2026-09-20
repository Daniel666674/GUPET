/* ---------- Carrito (simulado, 100% local — nada se envía a ningún servidor) ---------- */
var CART_KEY = 'gupet_cart_v1';
var LAST_ORDER_KEY = 'gupet_last_order_v1';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch (e) { return []; }
}

function saveCart(cart) {
  try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {}
  updateCartBadge();
}

function addToCart(item) {
  var cart = getCart();
  var existing = cart.filter(function (i) { return i.id === item.id; })[0];
  if (existing) {
    existing.qty += item.qty || 1;
  } else {
    item.qty = item.qty || 1;
    cart.push(item);
  }
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
  return getCart().reduce(function (sum, i) { return sum + i.qty; }, 0);
}

function cartTotal() {
  return getCart().reduce(function (sum, i) { return sum + i.qty * i.price; }, 0);
}

function formatCOP(n) {
  return '$' + Number(Math.round(n)).toLocaleString('es-CO');
}

function updateCartBadge() {
  document.querySelectorAll('.cart-badge').forEach(function (badge) {
    var n = cartCount();
    badge.textContent = n;
    badge.style.display = n > 0 ? 'flex' : 'none';
  });
}

function showToast(message) {
  var toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
}

/* ---------- Render del carrito (carrito.html) ---------- */
function renderCartPage() {
  var root = document.querySelector('[data-cart-root]');
  if (!root) return;
  var cart = getCart();
  var emptyEl = document.querySelector('[data-cart-empty]');
  var listEl = document.querySelector('[data-cart-list]');
  var summaryEl = document.querySelector('[data-cart-summary]');

  if (cart.length === 0) {
    if (emptyEl) emptyEl.style.display = '';
    if (listEl) listEl.style.display = 'none';
    if (summaryEl) summaryEl.style.display = 'none';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';
  if (listEl) listEl.style.display = '';
  if (summaryEl) summaryEl.style.display = '';

  listEl.innerHTML = cart.map(function (item) {
    return '' +
      '<div class="cart-row" data-id="' + item.id + '">' +
        '<img src="' + item.image + '" alt="' + item.name + '">' +
        '<div class="cart-row-info">' +
          '<span class="product-brand">' + item.brand + '</span>' +
          '<h3>' + item.name + '</h3>' +
          '<span class="price-unit">' + item.unit + '</span>' +
        '</div>' +
        '<div class="cart-row-qty">' +
          '<button type="button" class="qty-btn" data-action="dec">−</button>' +
          '<span class="qty-value">' + item.qty + '</span>' +
          '<button type="button" class="qty-btn" data-action="inc">+</button>' +
        '</div>' +
        '<div class="cart-row-price">' + formatCOP(item.price * item.qty) + '</div>' +
        '<button type="button" class="cart-row-remove" aria-label="Quitar">✕</button>' +
      '</div>';
  }).join('');

  var total = cartTotal();
  summaryEl.innerHTML = '' +
    '<div class="summary-line"><span>Subtotal</span><span>' + formatCOP(total) + '</span></div>' +
    '<div class="summary-line"><span>Envío</span><span>Se calcula en el pago</span></div>' +
    '<div class="summary-line summary-total"><span>Total</span><span>' + formatCOP(total) + '</span></div>' +
    '<a href="checkout.html" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:16px;">Proceder al pago</a>' +
    '<a href="servicios.html" class="btn btn-outline" style="width:100%; justify-content:center; margin-top:10px;">Seguir comprando</a>';

  listEl.querySelectorAll('.cart-row').forEach(function (row) {
    var id = row.dataset.id;
    row.querySelector('[data-action="inc"]').addEventListener('click', function () {
      var item = getCart().filter(function (i) { return i.id === id; })[0];
      if (item) { setQty(id, item.qty + 1); renderCartPage(); }
    });
    row.querySelector('[data-action="dec"]').addEventListener('click', function () {
      var item = getCart().filter(function (i) { return i.id === id; })[0];
      if (item) {
        if (item.qty <= 1) { removeFromCart(id); } else { setQty(id, item.qty - 1); }
        renderCartPage();
      }
    });
    row.querySelector('.cart-row-remove').addEventListener('click', function () {
      removeFromCart(id);
      renderCartPage();
    });
  });
}

/* ---------- Render del resumen en checkout.html ---------- */
function renderCheckoutSummary() {
  var el = document.querySelector('[data-checkout-summary]');
  if (!el) return;
  var cart = getCart();
  if (cart.length === 0) {
    window.location.href = 'carrito.html';
    return;
  }
  var total = cartTotal();
  el.innerHTML = cart.map(function (item) {
    return '' +
      '<div class="checkout-line">' +
        '<img src="' + item.image + '" alt="' + item.name + '">' +
        '<div class="checkout-line-info">' +
          '<strong>' + item.name + '</strong>' +
          '<span>' + item.unit + ' × ' + item.qty + '</span>' +
        '</div>' +
        '<span class="checkout-line-price">' + formatCOP(item.price * item.qty) + '</span>' +
      '</div>';
  }).join('') +
    '<div class="summary-line summary-total"><span>Total</span><span>' + formatCOP(total) + '</span></div>';
}

/* ---------- Envío del formulario de checkout (simulado) ---------- */
function handleCheckoutSubmit(e) {
  e.preventDefault();
  var cart = getCart();
  if (cart.length === 0) return;

  var form = e.target;
  var order = {
    number: 'GP-' + Math.floor(100000 + Math.random() * 900000),
    date: new Date().toISOString(),
    name: form.querySelector('#co-nombre').value.trim(),
    address: form.querySelector('#co-direccion').value.trim(),
    city: form.querySelector('#co-ciudad').value.trim(),
    phone: form.querySelector('#co-telefono').value.trim(),
    items: cart,
    total: cartTotal()
  };

  try { sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order)); } catch (err) {}
  saveCart([]);
  window.location.href = 'pedido-confirmado.html';
}

/* ---------- Render de confirmación (pedido-confirmado.html) ---------- */
function renderOrderConfirmation() {
  var root = document.querySelector('[data-order-root]');
  if (!root) return;
  var raw = null;
  try { raw = sessionStorage.getItem(LAST_ORDER_KEY); } catch (e) {}
  if (!raw) {
    root.innerHTML = '<p>No encontramos un pedido reciente. <a href="servicios.html">Vuelve al catálogo</a> para armar uno nuevo.</p>';
    return;
  }
  var order = JSON.parse(raw);
  document.querySelectorAll('[data-order-number]').forEach(function (n) { n.textContent = order.number; });
  document.querySelectorAll('[data-order-name]').forEach(function (n) { n.textContent = order.name; });
  document.querySelectorAll('[data-order-address]').forEach(function (n) { n.textContent = order.address + ', ' + order.city; });

  var itemsEl = document.querySelector('[data-order-items]');
  if (itemsEl) {
    itemsEl.innerHTML = order.items.map(function (item) {
      return '<div class="checkout-line">' +
        '<img src="' + item.image + '" alt="' + item.name + '">' +
        '<div class="checkout-line-info"><strong>' + item.name + '</strong><span>' + item.unit + ' × ' + item.qty + '</span></div>' +
        '<span class="checkout-line-price">' + formatCOP(item.price * item.qty) + '</span>' +
      '</div>';
    }).join('') + '<div class="summary-line summary-total"><span>Total pagado (simulado)</span><span>' + formatCOP(order.total) + '</span></div>';
  }
}

/* ---------- Init general ---------- */
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  updateCartBadge();

  // Selector de presentacion: actualiza el precio en tiempo real
  // (esto es justo lo que falla en el sitio actual de WooCommerce) y
  // deja el precio/unidad activos guardados en la tarjeta para el carrito.
  document.querySelectorAll('.product-card').forEach(function (card) {
    var group = card.querySelector('.weight-select');
    var priceEl = card.querySelector('.price');
    var oldPriceEl = card.querySelector('.price-old');
    var unitEl = card.querySelector('.price-unit');
    var addBtn = card.querySelector('.add-to-cart');

    if (group) {
      var buttons = group.querySelectorAll('button');
      var activeBtn = group.querySelector('button.active') || buttons[0];
      card.dataset.currentPrice = activeBtn.dataset.price;
      card.dataset.currentUnit = activeBtn.dataset.unit || '';

      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          buttons.forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');

          if (priceEl && btn.dataset.price) {
            priceEl.textContent = formatCOP(btn.dataset.price);
          }
          if (oldPriceEl) {
            if (btn.dataset.old) {
              oldPriceEl.style.display = '';
              oldPriceEl.textContent = formatCOP(btn.dataset.old);
            } else {
              oldPriceEl.style.display = 'none';
            }
          }
          if (unitEl && btn.dataset.unit) {
            unitEl.textContent = btn.dataset.unit;
          }
          card.dataset.currentPrice = btn.dataset.price;
          card.dataset.currentUnit = btn.dataset.unit || '';
        });
      });
    } else if (addBtn) {
      card.dataset.currentPrice = addBtn.dataset.price;
      card.dataset.currentUnit = addBtn.dataset.unit || (unitEl ? unitEl.textContent.trim() : '');
    }

    if (addBtn) {
      addBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var name = card.querySelector('h3').textContent.trim();
        var brand = card.querySelector('.product-brand').textContent.trim();
        var img = card.querySelector('.product-media img');
        var unit = card.dataset.currentUnit || '';
        var price = Number(card.dataset.currentPrice || 0);
        var id = (brand + '|' + name + '|' + unit).toLowerCase();

        addToCart({
          id: id,
          name: name,
          brand: brand,
          price: price,
          unit: unit,
          image: img ? img.getAttribute('src') : ''
        });
        showToast(name + ' se agregó al carrito');
      });
    }
  });

  renderCartPage();
  renderCheckoutSummary();
  renderOrderConfirmation();

  var checkoutForm = document.querySelector('#checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckoutSubmit);
  }
});
