# Fase 2 · Procesos y Reglas del Negocio (Kefi Fresh)

---

## 1. Identificación del proyecto
* **Nombre del Proyecto:** Kefi Fresh · Plataforma Web de Postres Artesanales
* **Fase del Proyecto:** Fase 2 · Procesos y reglas del negocio
* **Autor / Integrantes:** Darlin Zamora
* **Cohorte / Edición:** Cohorte 2026 / React VI
* **Fecha de Emisión:** 8 de Noviembre de 2026
* **Versión del Documento:** 2.0.0 (Consolidado y Auditado)

> **AHK-LEARNING-CHECKPOINT: F2-SINTESIS**  
> Entorno verificado bajo estándares AHK 3.0.0, harness, `ahk-spec` y acceso a especificaciones aprobadas. El presente documento sintetiza la evolución de la Fase 1 integrando los requerimientos funcionales y reglas de negocio validadas mediante casos de uso concretos, sin omitir condiciones de borde ni realizar simulaciones de arquitectura técnica prematura.

---

## 2. Problema y contexto
Kefi Fresh es un emprendimiento de gastronomía artesanal especializado en la elaboración y distribución de derivados lácteos fermentados, destacando los postres a base de kéfir por sus propiedades probióticas y beneficios para la salud digestiva. 

### Situación actual y hallazgos
* **Fricción en la toma de decisiones del consumidor:** En el mercado digital actual, los compradores valoran la transparencia nutricional. Los canales informales de venta actuales (redes sociales estáticas) no permiten consultar el desglose preciso de componentes (calorías, azúcares, carbohidratos, grasas) de forma inmediata.
* **Proceso de compra desestructurado:** Los pedidos recopilados por canales de mensajería directa suelen carecer de uniformidad. Los clientes olvidan incluir datos fundamentales como la fecha de entrega deseada, el apellido o el método de pago acordado, generando sobrecarga operativa en la gestión manual por parte del negocio.
* **Ausencia de pasarelas complejas:** Al tratarse de un modelo enfocado en la agilidad comercial inicial, el proyecto descarta pasarelas de pago automatizadas de alto coste operativo, apostando por un flujo de transferencia directa o pago en efectivo coordinado a través de mensajería instantánea estructurada.

---

## 3. Usuarios y objetivos
El sistema interactúa con dos perfiles de usuario claramente diferenciados, cuyos objetivos determinan el alcance operativo de la plataforma:

1. **Cliente / Visitante (Actor Principal):**
   * **Objetivo:** Explorar el catálogo de postres de manera intuitiva, consultar con absoluta transparencia el perfil nutricional de cada producto y realizar un pedido rápido sin necesidad de pasar por procesos largos de registro, autenticación o pasarelas de pago complejas.
   * **Efecto en el alcance:** Exige una interfaz limpia, accesible sin credenciales, y un mecanismo de carrito respaldado por almacenamiento local en el navegador (`localStorage`) para garantizar persistencia ante recargas accidentales.

2. **Administrador / Operador de Kefi Fresh (Actor Secundario / Destinatario):**
   * **Objetivo:** Recibir solicitudes de compra estandarizadas y libres de ambigüedades operativas, conteniendo todos los datos necesarios para la preparación, logística y despacho de los postres.
   * **Efecto en el alcance:** Requiere que la aplicación genere un mensaje preformateado y estructurado listo para enviarse a través de WhatsApp, asegurando la trazabilidad de cada orden sin requerir una base de datos centralizada compleja en esta etapa.

---

## 4. Descripción general de la solución
La solución adoptada consiste en una aplicación web interactiva desarrollada con lógica en TypeScript, estructurada para resolver las necesidades del negocio en dos pilares funcionales principales:

* **Módulo de Catálogo y Transparencia Nutricional (`SPEC-A01`):** Permite la navegación libre de los productos, la consulta de fichas informativas detalladas y la gestión de estados ante catálogos vacíos o datos nutricionales en proceso de actualización.
* **Módulo de Pedido Rápido y Checkout Simplificado (`SPEC-B01`):** Permite acumular productos en un carrito de compras interactivo y completar un formulario de despacho simplificado que recopila de forma estricta los datos obligatorios, culminando en la apertura automatizada de un enlace de WhatsApp con el resumen completo de la transacción.

---

## 5. Alcance inicial y exclusiones

### Capacidades Comprometidas (Dentro del Alcance)
* Exploración interactiva del catálogo de postres de kéfir sin requerir inicio de sesión ni registro previo.
* Desglose informativo de los aportes nutricionales de cada producto disponible.
* Manejo dinámico de un carrito de compras con persistencia local en el navegador.
* Formulario de entrega simplificado con validación estricta de campos obligatorios: Nombre y Apellido, Número Celular, Fecha de Entrega Requerida, y Método de Pago (Efectivo o Transferencia).
* Generación automatizada de mensajes estructurados para el canal de WhatsApp del negocio.
* Gestión de estados de interfaz para búsquedas sin resultados (`"Sin resultados"`) y datos nutricionales pendientes (`"Información actualizándose"`).

### Exclusiones Explícitas del Proyecto
* Sistemas de autenticación, creación de cuentas de usuario, perfiles y recuperación de contraseñas.
* Pasarelas de pago integradas (tarjetas de crédito, pasarelas bancarias automatizadas con webhooks).
* Control de inventario en tiempo real con bloqueo automático de stock en backend.
* Módulos de analítica avanzada, CRM o paneles de administración complejos protegidos por credenciales en esta fase.

---

## 6. Secciones o pantallas previstas
La arquitectura visual y de navegación del sistema contempla las siguientes vistas estáticas y dinámicas principales:

1. **Pantalla de Inicio / Catálogo General (`/`):**
   * *Propósito:* Exibir de forma visualmente atractiva la oferta de postres artesanales de kéfir.
   * *Actores:* Visitante / Cliente.
   * *Información visible:* Nombre del postre, descripción corta, precio unitario, etiqueta nutricional resumida y barra de búsqueda interactiva.
   * *Acciones:* Buscar productos, filtrar por categorías, ver detalles nutricionales y añadir productos al carrito.
   * *Casos relacionados:* `CU01`.

2. **Modal / Vista de Detalle Nutricional (`Modal-Nutricion`):**
   * *Propósito:* Mostrar la información detallada de los componentes del postre seleccionado.
   * *Actores:* Cliente.
   * *Información visible:* Calorías, carbohidratos, azúcares, grasas saludables y alérgenos potenciales.
   * *Acciones:* Cerrar modal, añadir al carrito desde el detalle.
   * *Casos relacionados:* `CU01`.

3. **Vista de Carrito y Checkout Simplificado (`/checkout` o Panel Lateral):**
   * *Propósito:* Consolidar los ítems seleccionados y recopilar los datos logísticos de entrega.
   * *Actores:* Cliente.
   * *Información visible:* Lista de ítems, cantidades, subtotal, total acumulado y campos del formulario de despacho.
   * *Acciones:* Modificar cantidades, eliminar ítems, rellenar formulario de entrega y confirmar pedido vía WhatsApp.
   * *Casos relacionados:* `CU02`.

---

## 7. Casos de uso de la versión inicial

### CU01 - Explorar Catálogo y Consultar Nutrición
* **Identificador:** `CU01`
* **Actor Principal:** Visitante / Cliente potencial.
* **Objetivo:** Consultar la variedad de postres disponibles de kéfir y verificar su composición nutricional para tomar una decisión de compra informada.
* **Condiciones Previas:** La aplicación web se encuentra cargada correctamente en el navegador del usuario.
* **Secuencia de Pasos Principales:**
  1. El usuario accede a la página principal de Kefi Fresh.
  2. El sistema muestra la lista completa de postres artesanales disponibles con sus respectivos precios y descripciones.
  3. El usuario introduce un término en la barra de búsqueda o hace clic sobre una tarjeta de producto específica.
  4. El sistema despliega la tarjeta informativa o modal con el desglose de nutrientes correspondiente.
* **Cursos Alternativos / Excepciones:**
  * *Búsqueda sin coincidencias:* Si el término introducido no genera resultados, el sistema muestra el mensaje descriptivo *"Sin resultados"*.
  * *Ausencia de datos nutricionales:* Si un producto específico carece de fichas cargadas, el sistema muestra el aviso *"Información actualizándose"*.
* **Resultado Observable:** El usuario visualiza la información nutricional transparente del postre seleccionado o recibe el aviso de control correspondiente.

### CU02 - Realizar Pedido Rápido por WhatsApp
* **Identificador:** `CU02`
* **Actor Principal:** Cliente.
* **Objetivo:** Enviar una solicitud formal de pedido al negocio de manera rápida y directa a través de WhatsApp, aportando todos los datos necesarios para su despacho.
* **Condiciones Previas:** El usuario ha agregado al menos un producto a su carrito de compras.
* **Secuencia de Pasos Principales:**
  1. El usuario abre la sección del carrito de compras para revisar los ítems seleccionados.
  2. El sistema calcula y muestra el monto total de la orden.
  3. El usuario completa de forma obligatoria los campos del formulario de entrega: Nombre y Apellido, Número Celular, Fecha de Entrega Solicitada y Método de Pago (Efectivo o Transferencia).
  4. El usuario presiona el botón de confirmación de pedido.
  5. El sistema valida que todos los campos estén completos y abre una pestaña de WhatsApp con el mensaje estructurado preformateado.
* **Cursos Alternativos / Excepciones:**
  * *Carrito Vacío:* Si el carrito no contiene productos, el botón de confirmación permanece bloqueado o emite una alerta indicando la necesidad de añadir ítems.
  * *Campos Incompletos:* Si falta alguno de los 4 datos obligatorios del formulario, el sistema impide la generación del enlace y resalta visualmente los campos pendientes.
* **Resultado Observable:** Se abre la aplicación de WhatsApp con el mensaje de pedido detallado listo para ser enviado al establecimiento comercial.

---

## 8. Decisiones y preguntas pendientes

### Decisiones Confirmadas (Cerradas)
* **Inexistencia de Autenticación:** Se ratifica que no se implementará ningún sistema de cuentas de usuario para simplificar al máximo la fricción de entrada del cliente.
* **Canal de Cierre Logístico:** El canal exclusivo para concretar la transacción comercial y la coordinación del pago/entrega será la mensajería de WhatsApp mediante URLs estructuradas (`api.whatsapp.com`).
* **Campos del Formulario Simplificado:** Quedan fijados de manera inalterable los cuatro campos obligatorios: **Nombre y Apellido**, **Número Celular**, **Fecha de Entrega Requerida** y **Método de Pago** (Efectivo / Transferencia).

### Supuestos y Preguntas Abiertas
* *Supuesto Operativo:* Se asume que el negocio cuenta con personal activo en el número de WhatsApp receptor para atender y dar respuesta rápida a los pedidos generados por la plataforma web.
* *Preguntas Abiertas (No bloqueantes para esta fase):* ¿Se implementará en fases futuras un sistema automatizado de notificaciones vía correo electrónico? *(Queda descartado para el alcance actual, aplazado para fases posteriores).*

---

## 9. Decisiones propias y uso de IA
Durante la elaboración y refinamiento de esta fase, se utilizó asistencia de inteligencia artificial para estipular con rigor los límites de validación de los formularios y la formalización de los casos de prueba.

* **Herramienta de Asistencia:** Asistente conversacional IA integrado bajo protocolo de desarrollo guiado por especificaciones (AHK).
* **Regla Precisada con la IA:** Se ajustó la validación estricta de los campos del formulario de entrega, asegurando que el sistema no permita omitir la fecha de entrega ni el método de pago, campos críticos para la logística de productos frescos de kéfir.
* **Alternativas Evaluadas:** Se evaluó implementar un flujo de checkout con múltiples pasos (Stepper UI) frente a un formulario en una sola vista (Single-page Checkout). Se optó por el formulario en una sola vista para reducir los abandonos en carritos de menor importe.
* **Ejemplo Válido:** El usuario selecciona 2 unidades de 'Postre de Kéfir Clásico', completa los 4 campos obligatorios (Ej: *María Gómez*, *+5491112345678*, *12/11/2026*, *Transferencia*) y hace clic en finalizar, abriendo correctamente WhatsApp con la orden estructurada.
* **Ejemplo Alternativo / Inválido:** El usuario intenta enviar el pedido sin rellenar la fecha de entrega requerida o con el carrito vacío; el sistema bloquea la acción e indica los campos que requieren atención.

---

## 10. Fuentes y comprobaciones de esta fase
* **Fuentes Documentales Internas:** 
  * `CU01` y `CU02` (Casos de uso base de la Fase 1).
  * `docs/entregas/fase-01.md` (Documento base de la primera entrega).
  * `docs/proceso.md` (Guía de procesos y normativas AHK).
* **Especificaciones Funcionales Generadas:**
  * `SPEC-A01-CATALOGO-NUTRICIONAL` (Aprobada formalmente).
  * `SPEC-B01-PEDIDO-RAPIDO` (Aprobada formalmente).
* **Comprobaciones Realizadas:** Validación cruzada de la consistencia de los datos del formulario, revisión de reglas de negocio contra restricciones de arquitectura y verificación de trazabilidad documental mediante el harness de especificaciones.

---

## 11. Procesos detallados

### PR-01: Consulta de Catálogo e Información Nutricional
* **Identificador de Proceso:** `PR-01`
* **Caso Relacionado:** `CU01`
* **Actor:** Visitante / Cliente.
* **Inicio:** El usuario ingresa a la URL raíz de la aplicación web de Kefi Fresh.
* **Condiciones Previas:** Servidor web activo y accesible; catálogo precargado en memoria/estado local.
* **Datos de Entrada:** Términos opcionales de búsqueda o selección mediante clics en tarjetas de productos.
* **Pasos de Interacción (Usuario / Producto):**
  1. El usuario visualiza la grilla de productos disponibles en la página principal.
  2. El usuario introduce un filtro de búsqueda o hace clic en el botón "Ver Nutrición" de un postre específico.
  3. El producto procesa la consulta y despliega la información transparente requerida.
* **Decisiones del Sistema:** Evaluar si el producto consultado posee datos nutricionales válidos o si el término de búsqueda arroja coincidencias.
* **Reglas Aplicables:** `RN-A01-01`, `RN-A01-02`.
* **Resultado Exitoso:** Despliegue correcto del desglose nutricional o de los ítems coincidentes en pantalla.
* **Curso de Fallo / Alternativo:** Visualización de mensajes de estado alternativos (*"Sin resultados"* o *"Información actualizándose"*).

### PR-02: Procesamiento y Envío de Pedido Rápido
* **Identificador de Proceso:** `PR-02`
* **Caso Relacionado:** `CU02`
* **Actor:** Cliente.
* **Inicio:** El usuario accede a la interfaz del carrito de compras tras haber seleccionado al menos un producto.
* **Condiciones Previas:** Carrito de compras con ítems válidos almacenados en el estado de la aplicación.
* **Datos de Entrada:** 
  * Nombre y Apellido (Texto, obligatorio).
  * Número Celular (Texto/Numérico, obligatorio).
  * Fecha de Entrega Requerida (Fecha, obligatorio).
  * Método de Pago (Selección: Efectivo / Transferencia, obligatorio).
* **Pasos de Interacción (Usuario / Producto):**
  1. El usuario revisa el resumen de su carrito (cantidades y subtotal).
  2. Rellena los campos obligatorios del formulario de despacho logístico.
  3. Presiona el botón de confirmación de pedido.
  4. El sistema valida el cumplimiento de las restricciones obligatorias.
  5. El sistema compila la estructura del mensaje y abre la API de WhatsApp con la URL preformateada.
* **Decisiones del Sistema:** Comprobación lógica de carrito no vacío y completitud del 100% de los campos del formulario.
* **Reglas Aplicables:** `RN-B01-01`, `RN-B01-02`, `RN-B01-03`.
* **Resultado Exitoso:** Redirección exitosa a WhatsApp con el mensaje estructurado de la orden.
* **Curso de Fallo / Excepción:** Bloqueo de la acción de envío y notificación visual de campos pendientes o carrito vacío.

---

## 12. Reglas del negocio

* **RN-A01-01 (Transparencia Nutricional Obligatoria):**  
  * *Condición:* Todo postre ofrecido en el catálogo público debe contar con su respectiva ficha informativa de nutrientes.
  * *Comportamiento:* Si la información se encuentra temporalmente pendiente de validación de laboratorio o carga, el sistema mostrará obligatoriamente el texto exacto: *"Información actualizándose"*.
  * *Motivo:* Garantizar la transparencia al consumidor en productos de salud y bienestar digestivo.

* **RN-A01-02 (Manejo de Búsquedas Vacías):**  
  * *Condición:* El usuario introduce un filtro de búsqueda que no genera intersección con los nombres o descripciones del catálogo.
  * *Comportamiento:* La interfaz debe renderizar de forma clara el mensaje institucional: *"Sin resultados"*, evitando pantallas en blanco o errores de renderizado.
  * *Motivo:* Mejorar la experiencia de usuario y orientar la navegación de forma amigable.

* **RN-B01-01 (Restricción de Carrito Vacío):**  
  * *Condición:* El usuario intenta procesar un pedido rápido con cero (0) ítems seleccionados en su carrito.
  * *Comportamiento:* El botón de finalización de compra permanecerá inhabilitado o emitirá una advertencia visual inmediata.
  * *Motivo:* Evita la generación de órdenes vacías o sin sentido comercial hacia el canal de WhatsApp.

* **RN-B01-02 (Obligatoriedad Total del Formulario de Despacho):**  
  * *Condición:* El usuario intenta enviar el pedido a WhatsApp sin completar alguno de los cuatro campos esenciales del formulario.
  * *Comportamiento:* El sistema aborta la generación de la URL de WhatsApp y resalta en color de alerta los campos faltantes (*Nombre y Apellido*, *Número Celular*, *Fecha de Entrega*, *Método de Pago*).
  * *Motivo:* Asegurar que el operador del negocio reciba 100% de los datos indispensables para coordinar la entrega sin requerir intercambios innecesarios de mensajes previos.

* **RN-B01-03 (Restricción de Métodos de Pago Válidos):**  
  * *Condición:* El usuario selecciona o define la forma de liquidar el valor del pedido.
  * *Comportamiento:* Las únicas opciones admitidas por el sistema de selección son estrictamente `Efectivo` o `Transferencia`. Cualquier otro valor no contemplado es inválido.
  * *Motivo:* Ajustar la operación comercial a las capacidades reales de cobro del emprendimiento artesanal.

---

## 13. Datos necesarios y su significado

* **Nombre y Apellido:**  
  * *Significado:* Identificación nominal del cliente que solicita la orden.  
  * *Origen:* Introducido directamente por el usuario en el formulario.  
  * *Obligatoriedad:* Obligatorio.  
  * *Valores Permitidos:* Texto alfanumérico válido con caracteres de espaciado.  
  * *Visibilidad / Modificación:* Visible para el cliente durante la edición y para el administrador al recibir el mensaje de WhatsApp.

* **Número Celular:**  
  * *Significado:* Vía de contacto telefónico para aclaraciones logísticas o confirmación de entrega.  
  * *Origen:* Introducido por el usuario.  
  * *Obligatoriedad:* Obligatorio.  
  * *Valores Permitidos:* Formato numérico con códigos de área o prefijos internacionales de mensajería.  
  * *Visibilidad / Modificación:* Visible y editable por el usuario antes del envío.

* **Fecha de Entrega Requerida:**  
  * *Significado:* Día exacto en el que el cliente necesita recibir su pedido de postres frescos.  
  * *Origen:* Seleccionado mediante selector de fecha en el formulario.  
  * *Obligatoriedad:* Obligatorio.  
  * *Valores Permitidos:* Fechas iguales o posteriores a la fecha actual del sistema.  
  * *Visibilidad / Modificación:* Editable por el usuario en el checkout.

* **Método de Pago:**  
  * *Significado:* Modalidad elegida para saldar el costo monetario del producto.  
  * *Origen:* Selección en lista desplegable o botones de opción.  
  * *Obligatoriedad:* Obligatorio.  
  * *Valores Permitidos:* Exactamente `Efectivo` o `Transferencia`.  
  * *Visibilidad / Modificación:* Editable por el usuario antes de la confirmación final.

* **Detalle del Carrito (Ítems y Cantidades):**  
  * *Significado:* Conjunto de productos seleccionados y sus respectivas unidades acumuladas.  
  * *Origen:* Calculado dinámicamente según las interacciones del usuario en el catálogo.  
  * *Obligatoriedad:* Obligatorio (mínimo 1 ítem para comprar).  
  * *Valores Permitidos:* IDs de producto válidos y cantidades enteros positivos ($> 0$).  
  * *Visibilidad / Modificación:* Modificable libremente desde el panel del carrito.

---

## 14. Validations, permisos y restricciones

* **Modelo de Permisos:** Al tratarse de una plataforma orientada a la venta directa sin fricción, todas las interfaces de exploración de catálogo, consulta nutricional y armado de carritos son de **acceso público y universal**, sin requerir roles de autenticación previos.
* **Control ante Datos Ausentes o Inválidos:**
  * Si el usuario deja campos obligatorios vacíos en el formulario de despacho, el sistema bloquea la ejecución de la redirección a WhatsApp e indica visualmente mediante marcas de error los campos afectados.
  * Si el carrito carece de productos, la interfaz impide el acceso al flujo de finalización de pedido.
* **Mecanismos de Corrección y Reintento:** Los formularios permiten la libre edición, borrado y reescritura de los datos en cualquier momento antes de presionar el botón definitivo de envío a WhatsApp, sin pérdida de estado en los ítems seleccionados del carrito (`localStorage`).

---

## 15. Estados y cambios permitidos

### Ciclo de Estados del Carrito de Compras
1. **Estado Vacío:** El carrito no contiene productos almacenados localmente. (Transición a *Con Productos* al hacer clic en "Agregar al carrito").
2. **Estado Con Productos:** El carrito posee uno o más ítems con cantidades definidas. (Transición a *Listo para Despacho* al rellenar y validar los campos obligatorios del formulario).
3. **Estado Listo para Despacho:** Todos los requisitos lógicos y de formulario se cumplen de forma íntegra. (Transición a la apertura externa de WhatsApp al confirmar la acción).

> *Nota Operativa:* La aplicación web no mantiene una máquina de estados complejos para los pedidos una vez emitidos hacia WhatsApp, ya que el ciclo de cumplimiento logístico posterior se gestiona de manera manual y externa por parte del equipo de Kefi Fresh.

---

## 16. Cálculos y ejemplos

### Cálculo del Monto Total del Pedido
* **Fórmula General:**  
  $$\text{TotalPedido} = \sum_{i=1}^{n} (\text{PrecioUnitario}_i \times \text{Cantidad}_i)$$
* **Unidades y Redondeo:** Expresado en la moneda local de curso legal con dos decimales de precisión estándar.
* **Ejemplo de Resultado Esperado:**  
  * *Entrada:* 2 unidades de 'Postre de Kéfir Clásico' a $3.50 cada una.  
  * *Cálculo:* $2 \times 3.50 = \$7.00$.
* **Ejemplo de Límite o Entrada Inválida:**  
  * *Entrada:* Intento de introducir una cantidad negativa (ej. -1) o decimales no permitidos en la cantidad de ítems.  
  * *Comportamiento del Sistema:* El control numérico limita automáticamente el valor mínimo a 1, impidiendo el cálculo con valores anómalos o negativos.

---

## 17. Alternativas, errores y recuperación

* **Situación de Búsqueda sin Coincidencias:**  
  * *Qué ve el usuario:* Mensaje en pantalla *"Sin resultados"*.  
  * *Qué permanece igual:* La barra de búsqueda sigue accesible para que el usuario pueda corregir el término o borrar el filtro.  
* **Situación de Producto sin Datos Nutricionales:**  
  * *Qué ve el usuario:* En la ficha informativa se muestra el texto *"Información actualizándose"*.  
  * *Cómo continúa:* El usuario puede seguir explorando otros productos o añadir el artículo al carrito bajo su criterio.
* **Situación de Intento de Envío con Formulario Incompleto:**  
  * *Qué ve el usuario:* Alerta visual en los campos faltantes y bloqueo de la redirección a WhatsApp.  
  * *Cómo continúa:* El usuario rellena los datos ausentes y reintenta la operación de forma inmediata sin perder los productos de su carrito.

---

## 18. Criterios de aceptación y ejemplos comprobables

* **Criterio CA-01 (Búsqueda sin coincidencias en catálogo):**
  * *Proceso Asociado:* `PR-01`
  * *Regla Aplicada:* `RN-A01-02`
  * *Condición Inicial:* El cliente se encuentra visualizando la página principal de productos.
  * *Acción:* El usuario introduce un término de búsqueda inexistente (ej. *"Kéfir de Chocolate Negro"*).
  * *Resultado Esperado:* La interfaz oculta los productos y muestra de manera clara el mensaje estipulado: *"Sin resultados"*.

* **Criterio CA-02 (Validación estricta y envío de pedido rápido):**
  * *Proceso Asociado:* `PR-02`
  * *Regla Aplicada:* `RN-B01-01`, `RN-B01-02`, `RN-B01-03`
  * *Condición Inicial:* El carrito contiene 1 unidad de postre y el usuario se encuentra en el checkout.
  * *Acción:* El usuario completa los campos obligatorios (Nombre, Apellido, Celular, Fecha de Entrega y Método de Pago) y presiona "Enviar pedido por WhatsApp".
  * *Resultado Esperado:* El sistema valida el 100% de los campos y abre de forma automática la aplicación de WhatsApp con el mensaje estructurado de la orden, sin errores de ejecución.

---

## 19. Relación entre casos, procesos, reglas y criterios (Matriz de Trazabilidad)

| Caso de Uso | Proceso Asociado | Reglas de Negocio Aplicables | Datos / Estados Relevantes | Criterios de Aceptación | Especificación Fuente |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CU01** | `PR-01` | `RN-A01-01`, `RN-A01-02` | Catálogo, Fichas Nutricionales, Estados de Búsqueda | `CA-01` | `SPEC-A01-CATALOGO-NUTRICIONAL` |
| **CU02** | `PR-02` | `RN-B01-01`, `RN-B01-02`, `RN-B01-03` | Carrito de Compras, Formulario Simplificado, Datos de Despacho | `CA-02` | `SPEC-B01-PEDIDO-RAPIDO` |

---

## 20. Cambios respecto de la primera entrega

* **Formalización del Formulario de Despacho:** Se actualizaron y precisaron los campos obligatorios requeridos para la integración con WhatsApp, incorporando explícitamente **Nombre y Apellido**, **Número Celular**, **Fecha de Entrega Requerida** y **Método de Pago** (Efectivo / Transferencia).
* **Precisión en Reglas de Catálogo:** Se oficializaron los mensajes institucionales exactos para escenarios de excepción (*"Sin resultados"* e *"Información actualizándose"*), eliminando ambigüedades descriptivas de la primera iteración.
* **Evolución del Alcance:** Se consolidó la separación estricta entre el alcance funcional actual (e-commerce simplificado por WhatsApp) y las exclusiones explícitas (pasarelas de pago y autenticación de usuarios), manteniendo coherencia absoluta con los entregables previos de la Fase 1.