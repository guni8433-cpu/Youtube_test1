import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, TopicSuggestion } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY || '' });

// Analyze an existing script
export const analyzeScriptWithGemini = async (scriptText: string): Promise<AnalysisResult> => {
  const model = "gemini-2.5-flash";
  
  const response = await ai.models.generateContent({
    model,
    contents: `Analyze the following YouTube video script provided in the input. 
    Provide a critique on the hook, pacing, and expected audience retention.
    Give a score out of 100.
    
    Script:
    ${scriptText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "Overall script quality score from 0 to 100" },
          hookAnalysis: { type: Type.STRING, description: "Analysis of the first 30 seconds" },
          pacing: { type: Type.STRING, description: "Comments on flow and speed" },
          audienceRetention: { type: Type.STRING, description: "Predicted drop-off points or engagement peaks" },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top 5 SEO keywords detected" },
          improvements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 actionable tips to improve the script" },
          sentiment: { type: Type.STRING, enum: ["Positive", "Neutral", "Negative"] }
        },
        required: ["score", "hookAnalysis", "pacing", "audienceRetention", "keywords", "improvements", "sentiment"]
      }
    }
  });

  const jsonText = response.text || "{}";
  return JSON.parse(jsonText) as AnalysisResult;
};

// Suggest new topics based on a niche or analysis
export const suggestTopicsWithGemini = async (nicheOrContext: string): Promise<TopicSuggestion[]> => {
  const model = "gemini-2.5-flash";

  const response = await ai.models.generateContent({
    model,
    contents: `You are a YouTube strategist. Based on the following context (which could be a niche, a previous script, or a topic), suggest 5 high-potential, viral video ideas.
    
    Context: ${nicheOrContext}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Clickbait but honest title" },
            thumbnailIdea: { type: Type.STRING, description: "Visual description for the thumbnail" },
            viralityScore: { type: Type.NUMBER, description: "Predicted viral potential 1-10" },
            reasoning: { type: Type.STRING, description: "Why this topic will work" }
          },
          required: ["title", "thumbnailIdea", "viralityScore", "reasoning"]
        }
      }
    }
  });

  const jsonText = response.text || "[]";
  return JSON.parse(jsonText) as TopicSuggestion[];
};

// Generate a full script
export const generateScriptWithGemini = async (topic: string, tone: string, duration: string, audience: string): Promise<string> => {
  const model = "gemini-2.5-flash"; // Using flash for speed, could use pro for deeper reasoning

  const response = await ai.models.generateContent({
    model,
    contents: `Write a complete YouTube video script.
    
    Topic: ${topic}
    Tone: ${tone}
    Target Duration: ${duration}
    Target Audience: ${audience}
    
    Format the output in Markdown.
    Include:
    1. Title Options
    2. Thumbnail Concept
    3. Hook (0:00-0:45) - Make it very gripping.
    4. Intro
    5. Body Paragraphs (with visual cues in brackets like [Visual: Show graph])
    6. Call to Action (Subscribe/Like)
    7. Outro
    
    Write in Korean.`
  });

  return response.text || "";
};
