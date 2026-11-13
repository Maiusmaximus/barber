# Distrito Barber · sitio web estático

HTML + CSS + JavaScript, sin dependencias ni servidor.

## Abrir
Doble clic en `index.html`, o publica la carpeta completa en cualquier hosting estático (Netlify, GitHub Pages, Vercel…).

## Estructura
- `index.html` Inicio: portada, servicios destacados, misión y visión, galería, cita.
- `servicios.html` Los 20 servicios con filtros por categoría.
- `equipo.html` Los 20 integrantes con filtro.
- `css/styles.css`, `js/main.js`
- `assets/logos/`, `assets/images/` (fotos del proyecto original, optimizadas)

## Cita
El formulario valida los datos y abre WhatsApp (311 323 4989) con el mensaje ya escrito. No guarda nada: para registrar citas hace falta un backend/base de datos. El número se cambia en `js/main.js` (constante `WA`) y en los enlaces `wa.me` de las páginas.

## Pendientes (del brief)
- Confirmar misión y visión (texto provisional).
- Foto de Mauricio Bedoya (se muestran iniciales; las otras 19 fotos se asignaron en el orden de la lista, ajustar si no corresponden a cada persona) y fotos propias de cada servicio (varias imágenes se repiten).
- Dirección y horarios de la barbería (no vienen en el brief).
- Decidir si el equipo muestra a los 20 o solo a los barberos.
- Las categorías de los filtros son una agrupación propuesta a partir de los nombres de servicios.
- Al publicar con dominio: agregar `sitemap.xml` y URLs absolutas en Open Graph.
