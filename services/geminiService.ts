import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Article } from "../types";

// Ensure API Key is present
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const tutorialSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "O título atrativo do tutorial." },
    category: { type: Type.STRING, description: "A categoria que melhor se encaixa." },
    estimatedTime: { type: Type.STRING, description: "Tempo estimado." },
    difficulty: { type: Type.STRING, enum: ["Fácil", "Médio", "Difícil"] },
    introduction: { type: Type.STRING, description: "Introdução envolvente." },
    context: { type: Type.STRING, description: "Um texto longo e aprofundado (min 500 palavras) explicando a história, a ciência ou a importância detalhada deste tópico." },
    materials: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING }, 
      description: "Lista de materiais." 
    },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING }
        },
        required: ["title", "description"]
      },
      description: "Passo a passo detalhado."
    },
    tips: { type: Type.ARRAY, items: { type: Type.STRING } },
    commonErrors: { type: Type.ARRAY, items: { type: Type.STRING } },
    faq: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING }
        }
      },
      description: "5 perguntas frequentes com respostas detalhadas."
    },
    references: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          url: { type: Type.STRING }
        }
      },
      description: "3 links para sites externos reais ou blogs famosos relacionados ao tema."
    },
    conclusion: { type: Type.STRING, description: "Conclusão encorajadora." }
  },
  required: ["title", "category", "estimatedTime", "difficulty", "introduction", "context", "steps", "faq", "references", "conclusion"]
};

export const generateTutorial = async (topic: string): Promise<Article | null> => {
  if (!apiKey) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Crie um tutorial EXTREMAMENTE COMPLETO, LONGO e detalhado em PORTUGUÊS sobre: "${topic}". 
      O artigo deve parecer um post profissional de blog com mais de 1000 palavras de conteúdo útil. Inclua contexto histórico ou teórico.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: tutorialSchema,
        systemInstruction: "Você é um editor sênior de um portal de 'Como Fazer'. Seus artigos são profundos, técnicos mas acessíveis, e muito detalhados."
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const data = JSON.parse(text);
    
    return {
      ...data,
      id: `gen-${Date.now()}`,
      createdAt: new Date().toISOString(),
      imageUrl: `https://loremflickr.com/800/400/${encodeURIComponent(topic.split(' ')[0])},diy?lock=${Math.floor(Math.random() * 100)}`,
      isGenerated: true
    };

  } catch (error) {
    console.error("Error generating tutorial:", error);
    return null;
  }
};