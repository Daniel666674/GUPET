# GUPET: demo de rediseño

Sitio de demostración estático (HTML + CSS + JavaScript, sin dependencias ni build)
para mostrarle a GUPET (gupet.co) una propuesta de rediseño frente a su tienda
actual en WordPress/WooCommerce.

## Qué muestra la demo

**Tienda completa, no solo una landing**

- **Catálogo con buscador, filtros y orden**: busca por marca o necesidad, filtra
  por mascota, muestra solo ofertas y ordena por precio o calificación.
- **Ficha de producto por artículo** (`producto.html?id=…`): presentaciones,
  precio por tamaño, cantidad, disponibilidad, pestañas de descripción/envío/asesoría,
  productos relacionados y "vistos recientemente".
- **Carrito completo**: panel lateral que se abre al agregar, página de carrito,
  cupones (`GUPET10`, `PRIMERA`), barra de progreso hacia el envío gratis y
  cálculo de envío.
- **Checkout simulado**: datos de contacto y envío, tarjeta o contra entrega,
  formato automático de tarjeta y vencimiento.
- **Confirmación de pedido**: número, entrega estimada, línea de estado y resumen.

**Contenido que una tienda real necesita**

- `faq.html`: preguntas frecuentes en acordeón, con datos estructurados FAQPage.
- `envios.html`: costos por monto, tiempos por zona, seguimiento, cambios y devoluciones.
- `politicas.html`: tratamiento de datos, cookies, condiciones de compra y alcance de la demo.
- `consejos.html` / `consejo.html?id=…`: tres guías de alimentación y cuidado.
- `servicios.html`: asesoría, cálculo de ración, plan de cambio de alimento, pedido recurrente.
- `404.html`: página de error con salida al catálogo.

**Detalles de sitio profesional**

- Barra de anuncios, buscador en el header, reseñas de clientes, newsletter,
  tira de garantías, botón de volver arriba y menú móvil.
- SEO: títulos y descripciones por página, Open Graph, `sitemap.xml`, `robots.txt`,
  favicon propio y datos estructurados de producto, tienda y FAQ.
- Accesibilidad: enlace de salto al contenido, `aria-label` en controles, foco
  visible, migas de pan y respeto a `prefers-reduced-motion`.

## Qué resuelve frente al sitio actual

- **Precio que sí reacciona**: al cambiar la presentación (Churu 20/40/60 tubos,
  bolsas chica/grande) el precio se actualiza al instante, que es el bug reportado.
- **URLs limpias**: `catalogo.html`, `producto.html?id=churu-tuna-seafood-variety`,
  sin parámetros técnicos tipo `?srsltid=…`.
- **Marca real, no genérica**: logo, verde de marca (#459c63), degradé teal→lima de
  las categorías y el ámbar de "¡Oferta!", extraídos por pixel de capturas del sitio actual.
- **Fotografía real del catálogo**: recortes del propio sitio (Agility Gold, Hill's,
  Dr. Clauder's, Nutra Nuggets, Churu, N&D y las tarjetas Guau/Miau/Pet Lovers/Servicios).
- **La compra se cierra en el sitio**: carrito, cupón y checkout completos, en vez
  de un flujo que termina en un chat.

## Estructura

```
index.html          Inicio
catalogo.html       Catálogo con filtros
producto.html       Ficha de producto (?id=…)
servicios.html      Servicios y asesoría
consejos.html       Blog  ·  consejo.html  Artículo (?id=…)
nosotros.html       Quiénes somos + comparativa
contacto.html       Formulario + WhatsApp
faq.html            Preguntas frecuentes
envios.html         Envíos y devoluciones
politicas.html      Privacidad y términos
carrito.html · checkout.html · pedido-confirmado.html · 404.html

data.js             Catálogo, categorías, reseñas, blog y FAQ (una sola fuente)
script.js           Header, footer, carrito, filtros, ficha, formularios
style.css           Estilos del sitio
```

El header y el footer se generan desde `script.js`, así que un cambio en el menú o
en los datos de contacto se hace una sola vez y aparece en todas las páginas.
Lo mismo con `data.js`: agregar un producto o cambiar un precio se toca en un solo lugar.

## Ver localmente

```bash
python3 -m http.server 8000
```

Y abrir `http://localhost:8000`.

## Notas

- **Nada se envía a ningún servidor.** El carrito, el cupón y los productos vistos
  viven en el `localStorage` del navegador; el pago es simulado y los formularios
  solo muestran su confirmación.
- Los precios, marcas y presentaciones (Agility Gold, Hill's, Dr. Clauder's,
  Nutra Nuggets, Churu, N&D) son los del sitio actual.
- Las imágenes en `img/` son recortes reales de capturas de gupet.co; no hay fotos
  de stock ni dependencias externas de imágenes.
- El único canal de contacto confirmado es el WhatsApp (315 745 4408). Las tarifas y
  plazos de `envios.html`, los horarios y el texto legal de `politicas.html` son
  plantillas de estructura, marcadas como tales dentro de las propias páginas: se
  reemplazan con los datos reales de GUPET antes de publicar.
- Las reseñas de clientes del inicio son de ejemplo, para mostrar el módulo.
