# GUPET — Demo de rediseño

Sitio de demostración estático (HTML/CSS/JS) para mostrarle a GUPET (gupet.co) una
propuesta de rediseño frente a su sitio actual en WordPress/WooCommerce.

## Qué resuelve esta demo

- **Precio que sí reacciona**: en Churu (20/40/60 tubos) el precio se actualiza al
  instante al cambiar la presentación, con datos reales tomados del sitio actual —
  a diferencia del bug reportado.
- **URLs limpias**: `index.html`, `nosotros.html`, `servicios.html`, `contacto.html`,
  sin parámetros técnicos tipo `?srsltid=...`.
- **Marca real, no genérica**: logo, verde de marca (#459c63), degradé teal→lima de las
  categorías y el ámbar de "¡Oferta!" extraídos por pixel de capturas del sitio actual
  — no colores inventados.
- **Fotografía real del catálogo**: recortes del propio sitio (Agility Gold, Hill's,
  Dr. Clauder's, Nutra Nuggets, Churu, N&D, tarjetas de categoría Guau/Miau/Pet
  Lovers/Servicios) en vez de fotos de stock genéricas sin relación con mascotas.

## Páginas

- `index.html` — Inicio: hero, marcas, categorías, productos destacados, oferta.
- `nosotros.html` — Quiénes somos + tabla comparativa (sitio actual vs. propuesta).
- `servicios.html` — Catálogo completo por categoría (Guau, Miau, Pet Lovers, Servicios).
- `contacto.html` — Contacto directo por WhatsApp.

## Ver localmente

```bash
python3 -m http.server 8000
```

Y abrir `http://localhost:8000`.

## Notas

- Todas las imágenes en `img/` (logo, categorías, productos, foto de cachorros) son
  recortes reales tomados de capturas del sitio actual gupet.co — no hay fotos de stock
  genéricas ni dependencias externas de imágenes.
- Los precios y nombres de producto (Agility Gold, Hill's, Dr. Clauder's, Nutra Nuggets,
  Churu, N&D) son los mismos que aparecen en el sitio actual.
- El único canal de contacto confirmado es WhatsApp (315 745 4408); no se inventó
  dirección, correo ni horarios.
