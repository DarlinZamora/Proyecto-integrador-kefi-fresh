
import http from "node:http";

const PORT = 3001;
const API_KEY = process.env.GEMINI_API_KEY;

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    return res.end();
  }

  if (req.url !== "/api/review" || req.method !== "POST") {
    res.writeHead(404);
    return res.end();
  }

  try {
    if (!API_KEY) throw new Error("Falta GEMINI_API_KEY");

    let body = "";
    for await (const chunk of req) {
      body += chunk;
      if (body.length > 30000) {
        res.writeHead(413);
        return res.end("Solicitud demasiado grande");
      }
    }

    const { code } = JSON.parse(body);
    if (typeof code !== "string" || !code.trim()) {
      res.writeHead(400);
      return res.end("Código inválido");
    }

    const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
        {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": API_KEY
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analiza este código JavaScript/React.
Identifica 3 problemas reales si o si.
Devuelve únicamente un objeto JSON con la propiedad
"issues", que contiene un arreglo de objetos con:
severity, title, explanation y suggestion, solutions.

Código:
${code}`
            }]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      console.error("Gemini HTTP:", response.status);
      res.writeHead(502);
      return res.end(JSON.stringify({
        error: "Error al consultar Gemini"
      }));
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const result = JSON.parse(text);

    if (!Array.isArray(result.issues)) {
      throw new Error("Respuesta inesperada del modelo");
    }

    res.writeHead(200, {
      "Content-Type": "application/json"
    });
    res.end(JSON.stringify(result));

  } catch (error) {
    console.error(error.message);
    res.writeHead(500, {
      "Content-Type": "application/json"
    });
    res.end(JSON.stringify({
      error: "No se pudo analizar el código"
    }));
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`API disponible en http://localhost:${PORT}`);
});
