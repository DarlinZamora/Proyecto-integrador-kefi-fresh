// src/services/aiService.js

// Lee una URL pública si la configuraste (compatible con Vite y Create React App).
// Nota: Nunca pongas API keys privadas aquí.
const PUBLIC_AI_ENDPOINT =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_AI_ENDPOINT) ||
  (typeof process !== "undefined" && process.env?.REACT_APP_AI_ENDPOINT) ||
  "";

/**
 * 1. VALIDACIÓN DE ENTRADA (antes de enviar)
 */
export function validateInput(texto) {
  if (typeof texto !== "string") {
    throw new Error("El texto ingresado no tiene un formato válido.");
  }

  const limpio = texto.trim();

  if (limpio.length === 0) {
    throw new Error("Por favor, escribe algo antes de solicitar el análisis.");
  }

  if (limpio.length < 10) {
    throw new Error("El texto es muy corto. Escribe al menos 10 caracteres para analizar.");
  }

  if (limpio.length > 1000) {
    throw new Error("El texto supera el límite permitido de 1000 caracteres.");
  }

  return limpio;
}

/**
 * 2. VALIDACIÓN DE RESPUESTA (antes de mostrar en pantalla)
 * Garantiza que la respuesta tenga la estructura esperada.
 */
function validateAiResponse(data) {
  if (!data || typeof data !== "object") {
    throw new Error("La respuesta del servicio de IA no tiene un formato válido.");
  }

  if (typeof data.resumen !== "string" || data.resumen.trim() === "") {
    throw new Error("La respuesta de IA llegó incompleta (falta el resumen).");
  }

  if (!Array.isArray(data.recomendaciones) || data.recomendaciones.length === 0) {
    throw new Error("La respuesta de IA no incluye recomendaciones estructuradas.");
  }

  return {
    resumen: data.resumen.trim(),
    prioridad: typeof data.prioridad === "string" ? data.prioridad : "Media",
    recomendaciones: data.recomendaciones.map((item) => String(item)),
  };
}

/**
 * 3. SIMULADOR (MOCK) DE RESPUESTA IA
 * Simula latencia de red y permite probar un fallo controlado.
 */
async function mockAiCall(textoValido, simularError = false) {
  // Simula espera de 800ms como una API real
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (simularError) {
    // Simulamos una respuesta corrupta/inválida del servidor para probar la validación
    return validateAiResponse({ datos_rotos: true });
  }

  // Genera un análisis estructurado dinámico según lo que escribió el usuario
  const palabras = textoValido.split(/\s+/).length;

  return validateAiResponse({
    resumen: `Análisis completado sobre un texto de ${palabras} palabras. Se detectó una oportunidad clara de optimización y organización.`,
    prioridad: palabras > 25 ? "Alta" : "Media",
    recomendaciones: [
      `Dividir el objetivo principal ("${textoValido.slice(0, 35)}...") en tareas concretas y medibles.`,
      "Definir un responsable y una fecha límite realista para validar avances.",
      "Revisar el resultado obtenido antes de pasar a la siguiente etapa.",
    ],
  });
}

/**
 * FUNCIÓN PRINCIPAL QUE CONSUMIRÁ TU COMPONENTE REACT
 */
export async function solicitarAnalisisIA(textoUsuario, { simularError = false } = {}) {
  // Paso A: Validar entrada
  const textoValido = validateInput(textoUsuario);

  // Paso B: Si se pide simular error o no hay endpoint externo, usamos el mock
  if (simularError || !PUBLIC_AI_ENDPOINT) {
    return await mockAiCall(textoValido, simularError);
  }

  // Paso C: Si configuraste un endpoint HTTPS público real, lo llamamos
  let response;
  try {
    response = await fetch(PUBLIC_AI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: textoValido }),
    });
  } catch (networkError) {
    throw new Error("No se pudo conectar con el servicio de IA. Verifica tu conexión.");
  }

  if (!response.ok) {
    throw new Error(`El servicio de IA respondió con error HTTP ${response.status}.`);
  }

  let jsonData;
  try {
    jsonData = await response.json();
  } catch (parseError) {
    throw new Error("El servicio de IA devolvió una respuesta que no es JSON válido.");
  }

  // Paso D: Validar estructura de la respuesta antes de devolverla
  return validateAiResponse(jsonData);
}
