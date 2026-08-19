# Kefi-Fresh

Sitio web de Kefi-Fresh, una marca que elabora postres y bebidas artesanales a base de kéfir, sin azúcares refinadas e ingredientes orgánicos. El sitio presenta la marca, su catálogo de productos y un formulario de contacto.

Incluye 3 páginas (Inicio, Nosotros, Productos), navegación responsive con drawer en mobile, modo claro/oscuro y validación del formulario de contacto.

## Estructura del proyecto

```
index.html          Página de inicio
nosotros.html        Sobre la marca
productos.html        Catálogo de productos
css/estilos.css      Estilos del sitio
ts/                  Código fuente en TypeScript
js/                  Código JavaScript compilado (generado desde ts/)
```

## Cómo ejecutar el sitio

Es un sitio estático (HTML/CSS/JS), no requiere backend. Basta con levantar un servidor local en la raíz del proyecto, por ejemplo:

```bash
npx serve .
```

o con Python:

```bash
python -m http.server 8000
```

Luego abre `http://localhost:8000` (o el puerto que indique tu servidor) en el navegador.

## Compilar TypeScript

El código fuente en `ts/` se compila a `js/` con TypeScript.

```bash
npm install     # instala las dependencias (una sola vez)
npm run build   # compila ts/ a js/
```
