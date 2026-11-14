# 1. Identificación del proyecto
- **Nombre del producto:** Plataforma E-commerce de Postres Artesanales a Base de Kéfir ("Kefi-Fresh").
- **Autor / Integrantes:** Darlin Zamora
- **Cohorte:** Bootcamp Fase 1.
- **Fecha:** Octubre 2026.
- **Versión del documento:** 1.0 (Fase 1 · Definición funcional).

# 2. Problema y contexto
Los postres que se venden en tiendas cercanas tienen altos contenidos de azúcar, grasas saturadas, entre otros. Por ejemplo, el consumidor ecuatoriano adquiere frecuentemente productos como el postre “Pingüinos de Chocolate”, el cual, según la Organización Panamericana de la Salud (OPS), contiene excesos en azúcares y grasas saturadas. Los jóvenes universitarios y adultos profesionales con agendas ajustadas no tienen tiempo suficiente para preparar comidas o postres saludables y recurren a tiendas cercanas a consumir productos sin consultar su perfil nutricional. Esta situación impacta negativamente su salud digestiva y bienestar general a largo plazo.

# 3. Usuarios y objetivos
- **Actor Principal (Cliente Final):** Jóvenes universitarios y adultos profesionales con agendas ocupadas. 
  - *Objetivo:* Encontrar, evaluar nutricionalmente (control de azúcar, carbohidratos y grasas) y adquirir de forma rápida y directa postres artesanales a base de kéfir para mejorar su salud digestiva sin invertir tiempo en preparación.

# 4. Descripción general de la solución
La plataforma ofrece un servicio de e-commerce web enfocado en la comercialización de postres artesanales elaborados a base de kéfir. De principio a fin, el recorrido consiste en que el usuario ingresa a la web, explora el catálogo con desglose transparente de nutrientes (control de azúcar, carbohidratos y grasas para favorecer la digestión), selecciona sus productos de preferencia y realiza un pedido rápido mediante un formulario de entrega simplificado. No requiere registros complejos ni pasarelas de pago automatizadas en esta primera versión.

# 5. Alcance inicial y exclusiones
- **Alcance comprometido (Fase 1):**
  - Catálogo web de postres artesanales de kéfir con información nutricional detallada.
  - Formulario de pedido rápido y directo sin necesidad de registro previo (checkout simplificado).
- **Exclusiones (Fuera de alcance):**
  - Sistema de cuentas de usuario, autenticación o perfiles guardados.
  - Pasarela de pagos con tarjeta de crédito en línea.
  - Panel de administración para gestión de inventario.
  - Cuestionarios interactivos o recomendaciones personalizadas por IA.

# 6. Secciones o pantallas previstas
- **Pantalla de Inicio / Catálogo (`/productos.html` o similar):**
  - *Propósito:* Mostrar la oferta disponible de postres de kéfir y sus propiedades digestivas y nutricionales.
  - *Usuario:* Cliente final.
  - *Información muestra:* Listado de postres, precios, descripción e indicadores de control de azúcar, carbohidratos y grasas.
  - *Acciones:* Ver detalle del producto o seleccionarlo para compra.
  - *Casos de uso relacionados:* CU01.
- **Pantalla de Pedido Rápido / Checkout (`/checkout.html` o similar):**
  - *Propósito:* Permitir al cliente enviar sus datos de contacto y entrega de forma ágil.
  - *Usuario:* Cliente final.
  - *Información muestra:* Resumen del pedido seleccionado.
  - *Acciones:* Ingresar datos de envío y confirmar la solicitud del pedido.
  - *Casos de uso relacionados:* CU02.

# 7. Casos de uso de la versión inicial

## CU01: Consultar catálogo de postres y perfil nutricional
1. **Identificador y nombre:** CU01 - Consulta de Catálogo y Perfil Nutricional.
2. **Actor principal y objetivo:** Cliente final. Objetivo: Visualizar la variedad de postres a base de kéfir y verificar el control de azúcar, carbohidratos y grasas.
3. **Situación que lo inicia y condiciones previas:** El usuario ingresa a la plataforma web buscando una opción de postre saludable y digestivo.
4. **Pasos del recorrido principal:**
   - El sistema muestra el catálogo principal de postres artesanales de kéfir.
   - El usuario explora las opciones y selecciona un producto para ver sus especificaciones nutricionales.
   - El sistema muestra el desglose de nutrientes y beneficios digestivos del postre seleccionado.
5. **Alternativas, errores y restricciones relevantes:** Si un producto no está disponible temporalmente, se indica visualmente en el catálogo.
6. **Resultado observable:** El usuario comprende claramente el perfil nutricional y los beneficios digestivos del postre de kéfir antes de decidir adquirirlo.
7. **Criterios de aceptación:** El catálogo muestra de manera explícita el contenido de azúcar, carbohidratos y grasas de cada postre artesanal.

## CU02: Realizar pedido rápido
1. **Identificador y nombre:** CU02 - Realización de Pedido Rápido.
2. **Actor principal y objetivo:** Cliente final. Objetivo: Enviar la solicitud de compra de los postres seleccionados mediante un formulario de entrega directo y sin registro.
3. **Situación que lo inicia y condiciones previas:** El usuario ha revisado el catálogo (CU01) y ha decidido qué postres desea adquirir.
4. **Pasos del recorrido principal:**
   - El usuario accede a la sección de pedido o carrito simplificado.
   - El usuario completa un formulario rápido con sus datos de entrega y contacto.
   - El usuario confirma el envío del pedido.
   - El sistema valida los datos y muestra un mensaje de confirmación exitosa con los detalles de despacho.
5. **Alternativas, errores y restricciones relevantes:** Si faltan campos obligatorios en el formulario (como dirección o teléfono), el sistema resalta los errores antes de permitir la confirmación.
6. **Resultado observable:** El pedido queda registrado y el cliente recibe la confirmación de envío de sus postres saludables.
7. **Criterios de aceptación:** El formulario procesa correctamente la solicitud de compra sin requerir la creación previa de una cuenta de usuario.

# 8. Decisiones y preguntas pendientes
- **Decisiones confirmadas:** Enfoque exclusivo en el cliente final, modelo de checkout rápido sin registro obligatorio y catálogo centrado en postres de kéfir con control nutricional transparente.
- **Supuestos por validar:** Logística de entrega local para asegurar que los postres artesanales mantengan su cadena de frío y frescura durante el despacho.
- **Preguntas abiertas:** Ninguna que impida cerrar el alcance actual de la Fase 1.

# 9. Decisiones propias y uso de IA
- **Qué agente utilizaste y cómo comprobaste AHK 3.0.0:** Se utilizó asistencia de IA conversacional para estructurar el documento validando localmente el entorno con Node.js 22, pnpm y la versión 3.0.0 de AHK mediante `ahk --version`.
- **Qué decisiones tomaste y por qué:** Se descartó el sistema de usuarios y pasarelas de pago automáticas para ceñirse a un MVP ágil (checkout simplificado) adecuado para el tiempo y recursos del proyecto de estudiantes y profesionales.
- **Recorrido principal y situación alternativa:** El usuario navega el catálogo nutricional y ejecuta un pedido directo sin fricción de registro.

# 10. Fuentes y comprobaciones de esta fase
- `ahk --version`: Verificación de la versión del CLI ejecutada localmente en el entorno.
- Plantilla inicial y estructura base del proyecto configurada con Vite y React.
- `ahk doctor` y `ahk health`: Diagnóstico y validación de la integridad del workspace y dependencias del harness.