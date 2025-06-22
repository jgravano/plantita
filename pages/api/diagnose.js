// pages/api/diagnose.js

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { base64Image, userInput } = req.body;

  if (!base64Image) return res.status(400).json({ error: 'Falta la imagen' });

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Sos un bot experto en botánica. Vas a diagnosticar enfermedades o problemas en plantas a partir de imágenes y contexto textual.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Descripción del usuario: "${userInput || 'sin descripción'}"`,
            },
            {
              type: 'image_url',
              image_url: {
                url: base64Image,
              },
            },
          ],
        },
      ],
    });

    const reply = completion.choices[0].message.content;
    res.status(200).json({ diagnosis: reply });
  } catch (e) {
    console.error('Error GPT:', e);
    res.status(500).json({ error: 'Error al procesar la imagen con IA', details: e.message });
  }
}
