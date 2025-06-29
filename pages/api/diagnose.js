// pages/api/diagnose.js

import OpenAI from 'openai';
import { supabase } from '../../lib/supabase.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { base64Image, userInput, userId, plantId } = req.body;

  if (!base64Image) return res.status(400).json({ error: 'Falta la imagen' });

  try {
    // 1. Obtener diagnóstico de OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'Sos un bot experto en botánica. Vas a diagnosticar enfermedades o problemas en plantas a partir de imágenes y contexto textual. Responde en español de manera clara y concisa. Tu respuesta debe seguir este formato exacto:\n\n**Especie detectada:** [nombre de la planta si la puedes identificar, o "No identificada"]\n\n**Diagnóstico:** [tu análisis del problema]\n\n**Sugerencias de cuidado:** [recomendaciones específicas]',
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

    const diagnosisText = completion.choices[0].message.content;

    // Extraer la especie detectada del texto
    const speciesMatch = diagnosisText.match(/\*\*Especie detectada:\*\*\s*([^\n]+)/);
    const detectedSpecies = speciesMatch ? speciesMatch[1].trim() : null;

    // 2. Si el usuario está autenticado y no hay plantId, buscar posibles agrupaciones
    let groupingSuggestions = [];
    if (userId && !plantId && detectedSpecies && detectedSpecies !== 'No identificada') {
      // Buscar plantas del usuario con especie igual (ignorando mayúsculas/minúsculas y tildes)
      const { data: userPlants, error: plantsError } = await supabase
        .from('plants')
        .select('*')
        .eq('user_id', userId);
      if (!plantsError && userPlants) {
        groupingSuggestions = userPlants.filter(
          (p) =>
            p.species &&
            p.species
              .trim()
              .toLowerCase()
              .normalize('NFD')
              .replace(/\p{Diacritic}/gu, '') ===
              detectedSpecies
                .trim()
                .toLowerCase()
                .normalize('NFD')
                .replace(/\p{Diacritic}/gu, ''),
        );
      }
    }

    // 3. Guardar diagnóstico si corresponde
    let targetPlantId = plantId;
    if (userId && (!groupingSuggestions.length || plantId)) {
      try {
        // Si no hay plantId, crear una nueva planta
        if (!plantId) {
          const { data: plantData, error: plantError } = await supabase
            .from('plants')
            .insert({
              user_id: userId,
              species: detectedSpecies,
              description: userInput || null,
              image_url: base64Image,
            })
            .select()
            .single();
          if (!plantError && plantData) {
            targetPlantId = plantData.id;
          }
        }
        // Guardar el diagnóstico
        if (targetPlantId) {
          await supabase.from('diagnoses').insert({
            plant_id: targetPlantId,
            user_id: userId,
            diagnosis_text: diagnosisText,
            confidence_score: 0.85,
          });
        }
      } catch (dbError) {
        console.error('Error en base de datos:', dbError);
      }
    }

    res.status(200).json({
      diagnosis: diagnosisText,
      detectedSpecies: detectedSpecies,
      isAuthenticated: !!userId,
      groupingSuggestions: groupingSuggestions.map((p) => ({
        id: p.id,
        name: p.name,
        species: p.species,
        image_url: p.image_url,
      })),
    });
  } catch (e) {
    console.error('Error GPT:', e);
    res.status(500).json({ error: 'Error al procesar la imagen con IA', details: e.message });
  }
}
