# Google Analytics (GA4)

## ID de medición

```
G-Q4PNCY6KV4
```

Este es un ID de Google Analytics 4 (GA4). Para ver los datos, hay que entrar a [analytics.google.com](https://analytics.google.com) con la cuenta de Google que administra esta propiedad y buscar la propiedad cuyo "Data Stream" use este ID.

## Dónde está implementado

El snippet oficial de `gtag.js` está pegado en el `<head>` de las 5 páginas del sitio:

- `index.html`
- `nosotros.html`
- `productos.html`
- `blog.html`
- `playground.html`

En cada una se ve así:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-Q4PNCY6KV4"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-Q4PNCY6KV4');
</script>
```

Como está en las 5 páginas por igual, GA registra la navegación completa del sitio, incluyendo `playground.html` (la página interna de referencia de componentes, que no está enlazada en el menú).

## Qué mide por defecto

Sin configuración adicional, GA4 registra automáticamente:

- Vistas de página (`page_view`) cada vez que alguien entra a una de las páginas.
- Eventos automáticos de GA4 (scroll, clics salientes, tiempo en sesión, etc.), según la configuración por defecto de la propiedad.

No hay eventos personalizados (`gtag('event', ...)`) definidos en el código — solo el `page_view` inicial. Si se necesita medir acciones específicas (agregar al carrito, enviar el formulario, etc.), hay que agregar llamadas `gtag('event', 'nombre_evento', {...})` donde corresponda.

## Relación con las otras herramientas de analítica

El sitio corre **tres** herramientas de analítica al mismo tiempo en cada página:

| Herramienta | Qué hace |
|---|---|
| Google Analytics (GA4) | Vistas de página y eventos automáticos |
| [Mixpanel](../js/mixpanel-events.js) | Eventos personalizados por producto/botón (`data-mixpanel-event`), carrito, login |
| Contentsquare | Grabación de sesión y mapas de calor |

Tenerlas las tres activas a la vez es redundante y aumenta el peso de carga de cada página. Si el objetivo es simplificar, Mixpanel ya cubre casi todo lo que GA4 haría por defecto (vistas de página + eventos), así que se podría evaluar dejar solo una de las dos.

## Privacidad

Actualmente el sitio no tiene banner de consentimiento de cookies ni política de privacidad. Google Analytics, Mixpanel y Contentsquare guardan cookies/identificadores del visitante desde el primer segundo, sin pedir permiso. Esto es algo a resolver si el sitio va a recibir tráfico real, especialmente si hay visitantes desde la Unión Europea (GDPR) — no es un problema de configuración de GA4 en sí, sino de todo el stack de analítica en conjunto.
