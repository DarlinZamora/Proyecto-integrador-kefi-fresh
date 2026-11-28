// src/components/AiAssistantPanel.tsx
import { useState } from "react";
import { solicitarAnalisisIA } from "../services/aiService";

type EstadoAnalisis = "idle" | "loading" | "success" | "error";

interface ResultadoAnalisisIA {
  resumen: string;
  prioridad: string;
  recomendaciones: string[];
}

export default function AiAssistantPanel() {
  const [inputTexto, setInputTexto] = useState<string>("");
  const [estado, setEstado] = useState<EstadoAnalisis>("idle");
  const [resultado, setResultado] = useState<ResultadoAnalisisIA | null>(null);
  const [mensajeError, setMensajeError] = useState<string>("");

  const ejecutarAnalisis = async (forzarError: boolean = false): Promise<void> => {
    setEstado("loading");
    setMensajeError("");
    setResultado(null);

    try {
      const data = (await solicitarAnalisisIA(inputTexto, {
        simularError: forzarError,
      })) as ResultadoAnalisisIA;

      setResultado(data);
      setEstado("success");
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado al procesar el análisis.";
      setMensajeError(msg);
      setEstado("error");
    }
  };

  return (
    <section
      style={{
        maxWidth: "680px",
        margin: "2rem auto",
        padding: "1.5rem",
        border: "1px solid #d1d5db",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h2 style={{ marginTop: 0, color: "#111827" }}>
        Asistente de Análisis con IA
      </h2>
      <p style={{ color: "#4b5563", fontSize: "0.95rem" }}>
        Ingresa una descripción, tarea o consulta (mínimo 10 caracteres) para generar recomendaciones estructuradas.
      </p>

      <textarea
        rows={4}
        value={inputTexto}
        onChange={(e) => setInputTexto(e.target.value)}
        placeholder="Ejemplo: Quiero organizar el lanzamiento de mi tienda online de café artesanal en dos semanas..."
        disabled={estado === "loading"}
        style={{
          width: "100%",
          padding: "0.75rem",
          borderRadius: "8px",
          border: "1px solid #9ca3af",
          fontSize: "1rem",
          boxSizing: "border-box",
          marginBottom: "1rem",
        }}
      />

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => void ejecutarAnalisis(false)}
          disabled={estado === "loading"}
          style={{
            padding: "0.65rem 1.2rem",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            cursor: estado === "loading" ? "not-allowed" : "pointer",
          }}
        >
          {estado === "loading" ? "Analizando con IA..." : "Analizar con IA"}
        </button>

        <button
          type="button"
          onClick={() => void ejecutarAnalisis(true)}
          disabled={estado === "loading"}
          style={{
            padding: "0.65rem 1.2rem",
            backgroundColor: "#f3f4f6",
            color: "#374151",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontWeight: 500,
            cursor: estado === "loading" ? "not-allowed" : "pointer",
          }}
        >
          Simular fallo del servicio
        </button>
      </div>

      {/* ESTADO: LOADING */}
      {estado === "loading" && (
        <div
          style={{
            marginTop: "1.25rem",
            padding: "1rem",
            backgroundColor: "#eff6ff",
            color: "#1e40af",
            borderRadius: "8px",
          }}
        >
          Procesando solicitud y validando respuesta...
        </div>
      )}

      {/* ESTADO: ERROR CONTROLADO */}
      {estado === "error" && (
        <div
          role="alert"
          style={{
            marginTop: "1.25rem",
            padding: "1rem",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            borderRadius: "8px",
          }}
        >
          <strong>No se pudo completar el análisis:</strong> {mensajeError}
        </div>
      )}

      {/* ESTADO: SUCCESS (ANÁLISIS ESTRUCTURADO) */}
      {estado === "success" && resultado && (
        <div
          style={{
            marginTop: "1.25rem",
            padding: "1.25rem",
            backgroundColor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "8px",
            color: "#14532d",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0 }}>Resultado del Análisis IA</h3>
            <span
              style={{
                padding: "0.2rem 0.6rem",
                backgroundColor: "#dcfce7",
                borderRadius: "999px",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              Prioridad: {resultado.prioridad}
            </span>
          </div>

          <p style={{ marginTop: "0.75rem", lineHeight: 1.5 }}>
            <strong>Resumen:</strong> {resultado.resumen}
          </p>

          <strong>Recomendaciones estructuradas:</strong>
          <ul style={{ marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
            {resultado.recomendaciones.map((rec, index) => (
              <li key={index} style={{ marginBottom: "0.4rem" }}>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
