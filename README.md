# GUPET — Demo de rediseño

Sitio de demostración estático (HTML/CSS/JS) para mostrarle a GUPET (gupet.co) una
propuesta de rediseño frente a su sitio actual en WordPress/WooCommerce.

## Qué resuelve esta demo

- **Precio que sí reacciona**: al cambiar el peso/presentación de un producto
  (Royal Canin, N&D, Orijen, Churu, Nupec), el precio se actualiza al instante con JS —
  a diferencia del bug reportado en el sitio actual.
- **URLs limpias**: `index.html`, `nosotros.html`, `servicios.html`, `contacto.html`,
  sin parámetros técnicos tipo `?srsltid=...`.
- **Diseño propio de marca**: paleta verde pino + coral, tipografía Baloo 2 + Work Sans,
  en vez de la plantilla genérica de WooCommerce.

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

- Las imágenes de producto son placeholders de Picsum Photos — se reemplazan por fotos
  reales del catálogo cuando estén disponibles.
- El único canal de contacto confirmado es WhatsApp (315 745 4408); no se inventó
  dirección, correo ni horarios.
