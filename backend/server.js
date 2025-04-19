// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// Endpoint POST untuk menerima permintaan dari frontend
app.post("/chat", async (req, res) => {
  const { history, systemPrompt } = req.body;
  const API_KEY = process.env.GOOGLE_API_KEY;

  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [systemPrompt, ...history],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048
        }
      })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Gagal memanggil API Gemini." });
  }
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});