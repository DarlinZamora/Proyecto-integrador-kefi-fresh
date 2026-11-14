# Entrega Fase 3: Diseño Técnico y Plan de Construcción

## 1. Identificación del proyecto
- **Nombre del Proyecto:** Kefi-Fresh
- **Integrantes / Autor:** Darlin Zamora
- **Cohorte:** React Guide VI
- **Fecha:** 12 de Noviembre del 2026
- **Versión:** 3.0.0 (Fase 3 · Diseño técnico)

## 2. Problema y contexto
Se mantiene el análisis del problema enfocado en la dificultad de los usuarios para acceder de forma rápida, transparente y ordenada a productos frescos y saludables, digitalizando las operaciones locales sin alterar las evidencias funcionales aprobadas en fases previas.

## 3. Usuarios y objetivos
- **Cliente / Comprador:** Navegar por el catálogo de productos frescos, consultar información nutricional detallada y armar pedidos de forma ágil.
- **Administrador del Negocio:** Gestionar la disponibilidad del catálogo y visualizar los pedidos generados. No se introducen actores ficticios para justificar librerías técnicas.

## 4. Descripción general de la solución
Aplicación web interactiva estructurada en dos pilares funcionales:
- **`SPEC-A01` (Catálogo y Transparencia Nutricional):** Permite la navegación libre por el catálogo y la consulta de fichas informativas detalladas de cada producto.
- **`SPEC-B01` (Pedido Rápido y Checkout Simplificado):** Permite acumular productos en un carrito interactivo y completar un formulario de despacho para generar un enlace automatizado con el resumen del pedido hacia WhatsApp.

## 5. Alcance inicial y exclusiones
- **Capacidades incluidas:** Navegación por rutas, consulta remota de catálogo, gestión global de carrito en cliente, validación de formularios y apertura de modal de confirmación con redirección a WhatsApp.
- **Exclusiones:** No incluye pasarela de pagos en línea, backend propio implementado en esta fase, ni despliegue en producción. Una decisión técnica no amplía el alcance funcional.

## 6. Secciones o pantallas previstas
- **Landing / Inicio:** Pantalla de bienvenida y presentación general.
- **Vista de Catálogo (`/catalogo`):** Visualización de productos disponibles con filtrado por categorías (`SPEC-A01`).
- **Vista de Detalle (`/catalogo/:id`):** Ficha detallada de transparencia nutricional.
- **Vista de Checkout y Carrito (`/checkout`):** Resumen del carrito y formulario de despacho de pedidos (`SPEC-B01`).

## 7. Casos de uso de la versión inicial
- **CU-01 (Consultar Catálogo):** El usuario visualiza la lista de productos obtenidos de la fuente remota.
- **CU-02 (Consultar Ficha Nutricional):** El usuario selecciona un producto para ver sus detalles e información nutricional.
- **CU-03 (Gestionar Carrito y Checkout):** El usuario agrega ítems, valida sus datos en el formulario de despacho y confirma su pedido mediante el modal.

## 8. Decisiones y preguntas pendientes
- Se confirman las reglas funcionales de los dos módulos principales. No existen fuentes pendientes ni diseños en estado de reconciliación ocultos.

## 9. Decisiones propias y uso de IA
- **Decisiones propias:** Se seleccionó el uso de Zustand para el carrito de compras por su simplicidad frente al prop drilling, y TanStack Query para el catálogo por su manejo nativo de caché y estados remotos. La IA sirvió como guía de consulta, estructuración y verificación de alternativas, pero todas las elecciones de diseño fueron evaluadas y confirmadas por el autor.

## 10. Fuentes y comprobaciones de esta fase
- **Herramientas de entorno verificadas:** Node (`v24.18.0`), pnpm (`v11.17.0`), CLI AHK (`v3.0.0`) y base de datos local del harness operativas.
- **Librerías consultadas:** React Router (`8.3.1`), TanStack Query (`5.102.8`), Zustand (`5.0.15`), Zod (`9.4.1`), Mantine Form (`4.4.3`) y Mantine Core / Modal (`9.4.1`).

## 11. Procesos detallados
- **Proceso de Compra:** Selección de productos $\rightarrow$ Adición al carrito global $\rightarrow$ Ingreso al checkout $\rightarrow$ Rellenado y validación de formulario $\rightarrow$ Apertura de Mantine Modal de confirmación $\rightarrow$ Envío de pedido a WhatsApp.

## 12. Reglas del negocio
- **RN-01:** No se puede confirmar un pedido con el carrito vacío.
- **RN-02:** Todos los campos obligatorios del formulario de despacho deben cumplir con el esquema de validación estricto antes de habilitar la confirmación del modal.

## 13. Datos necesarios y su significado
- **Producto:** `id`, `nombre`, `precio`, `categoria`, `informacionNutricional`. Obligatorios, origen remoto.
- **Pedido / Despacho:** `nombreCliente`, `telefono`, `direccionEntrega`, `observaciones`. Obligatorios en el formulario del cliente.

## 14. Validaciones, permisos y restricciones
- Validación en tiempo de ejecución de campos de texto y formato de teléfono mediante esquemas Zod en el cliente. Restricción de navegación a vistas inexistentes mediante rutas comodín (`*`).

## 15. Estados y cambios permitidos
- **Estado del Negocio / Cliente:** Carrito vacío $\to$ Con productos seleccionados $\to$ Formulario incompleto $\to$ Formulario válido $\to$ Pedido confirmado. (Diferenciado de los estados de carga o error de la red).

## 16. Cálculos y ejemplos
- **Cálculo del Total del Carrito:** Sumatoria de (`precio unitario` $\times$ `cantidad`) por cada ítem presente en el store de Zustand. Ejemplo: 2 unidades de producto a \$5.00 dan un subtotal de \$10.00.

## 17. Alternativas, errores y recuperación
- Ante un error de carga en el catálogo remoto (TanStack Query), la interfaz muestra un estado de error visible con opción de reintentar la petición sin perder el estado del carrito del cliente.

## 18. Criterios de aceptación y ejemplos comprobables
- **CA-01:** Al hacer clic en un producto del catálogo, la ruta cambia a `/catalogo/:id` mostrando su información nutricional correspondiente.
- **CA-02:** Si el usuario intenta enviar el formulario de despacho con campos vacíos, Zod y Mantine Form muestran los errores visuales correspondientes sin disparar el modal.

## 19. Relación entre casos, procesos, reglas y criterios
- Matriz de trazabilidad funcional consolidada que vincula `SPEC-A01` y `SPEC-B01` con sus respectivos casos de uso, reglas de negocio y criterios de aceptación observables.

## 20. Cambios respecto de la primera entrega
- Evolución documentada desde la definición inicial de la Fase 1 y Fase 2, ajustando los flujos de interacción a una arquitectura web basada en componentes y SPA con React.

## 21. Stack y matriz de herramientas obligatorias
| Herramienta | Versión | Rol / Responsabilidad en Kefi-Fresh | Comprobación Prevista |
| :--- | :--- | :--- | :--- |
| **React Router** | `8.3.1` | Navegación declarativa entre inicio, catálogo y checkout[cite: 3]. | Cambio de URL y renderizado de vistas[cite: 3]. |
| **TanStack Query** | `5.102.8` | Obtención, caché y sincronización de datos remotos del catálogo[cite: 3]. | Estados de carga, éxito y reintento de datos[cite: 3]. |
| **Zustand** | `5.0.15` | Gestión global del estado del carrito de compras en el cliente[cite: 3, 8]. | Agregar, quitar y persistir ítems activos[cite: 3, 8]. |
| **Zod con Mantine Form** | `9.4.1` / `4.4.3` | Validación estricta en tiempo de ejecución del formulario de despacho[cite: 3]. | Errores visibles ante entradas inválidas[cite: 3]. |
| **Mantine Modal** | `9.4.1` | Ventana flotante de confirmación y resumen final del pedido[cite: 3]. | Apertura, cancelación y cierre del flujo[cite: 3]. |

## 22. Arquitectura y responsabilidades
Estructura modular limpia en kebab-case para carpetas y PascalCase para componentes:
- `src/components/`: Componentes visuales genéricos y layouts.
- `src/modules/`: Módulos de negocio (`catalog/`, `checkout/`).
- `src/store/`: Stores globales de Zustand (ej. `useCartStore.ts`)[cite: 8].
- `src/services/`: Definición de peticiones y contratos para TanStack Query.
- `src/schemas/`: Esquemas de validación con Zod.
- `src/routes/`: Configuración de rutas de React Router.

## 23. Navegación con React Router
- **Modo declarativo:** Uso de `<BrowserRouter>`, `<Routes>` y `<Route>`[cite: 3].
- **Rutas:** `/` (Inicio), `/catalogo` (Catálogo), `/catalogo/:id` (Detalle), `/checkout` (Checkout y Carrito)[cite: 3].
- Manejo de rutas desconocidas (`*`) redirigidas a la vista principal o de error controlado[cite: 8].

## 24. Propiedad del estado y uso de Zustand
- **Zustand** administra exclusivamente el estado compartido del carrito de compras (lista de productos seleccionados, cantidades y acciones de modificación)[cite: 8].
- **Se excluyen:** No se almacenan datos remotos del catálogo (gestionados por TanStack Query) ni los valores temporales del formulario de despacho (gestionados por Mantine Form), evitando duplicaciones y redundancias de estado[cite: 4, 8].

## 25. Datos, servicios y límites de integración
- Identificación de fuentes remotas para el catálogo de productos[cite: 8]. Los contratos se basan en interfaces tipadas en TypeScript. No se exponen claves privadas ni credenciales de backend en el cliente del navegador[cite: 8].

## 26. Formularios, Zod y Mantine Modal
- **Validación:** Cadena operativa `Regla de negocio` $\to$ `Esquema Zod` $\to$ `Mantine Form con schemaResolver` $\to$ `Respuesta visual de errores en interfaz`[cite: 8].
- **Mantine Modal:** Disparado tras un submit exitoso del formulario de despacho. Contiene el resumen inmutable del pedido. Al cancelar, conserva los datos del formulario y del carrito para permitir correcciones del usuario sin pérdida de información[cite: 4, 8].

## 27. Recorridos técnicos y sincronización con TanStack Query
- La consulta remota del catálogo utiliza una `queryKey` única (ej. `['catalog-products']`). Gestiona los estados de carga, error y datos vacíos de manera nativa sin recurrir al uso prohibido de `useEffect` para fetching[cite: 4, 9].

## 28. Estrategia de verificación y límites de evidencia
- **Pruebas unitarias:** Uso planeado de Vitest para validar esquemas de Zod y funciones puras de cálculo de totales del carrito[cite: 9].
- **Pruebas de interfaz:** Comprobación de recorridos de navegación, comportamiento del modal y validación de formularios en entorno local. Los tests son un plan proyectado y no se declaran como ejecutados[cite: 9].

## 29. Plan de construcción, dependencias y riesgos
- **Etapa 1:** Configuración base del harness, proveedores y enrutamiento[cite: 9].
- **Etapa 2:** Implementación del Módulo de Catálogo con TanStack Query (`SPEC-A01`)[cite: 3, 9].
- **Etapa 3:** Creación del store global del carrito con Zustand[cite: 3, 8, 9].
- **Etapa 4:** Desarrollo del formulario de despacho con Zod/Mantine Form y activación del Mantine Modal (`SPEC-B01`)[cite: 3, 8, 9].
- **Riesgos:** Cambios en contratos de APIs remotas (mitigado mediante tipado estricto con TypeScript).

## 30. Trazabilidad técnica y cambios respecto de la segunda entrega
- Matriz de correlación estricta: `Caso de uso / Regla` $\to$ `Especificación funcional (Fase 2)` $\to$ `Especificación técnica (Fase 3)` $\to$ `Pieza responsable` $\to$ `Herramienta obligatoria` $\to$ `Criterio de verificación previsto`[cite: 9]. Se documenta el registro histórico de evolución sin alterar las decisiones aprobadas previamente[cite: 9].

