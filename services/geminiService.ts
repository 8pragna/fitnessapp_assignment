import { GoogleGenAI, Type, Modality } from "@google/genai";
import { UserProfile, FitnessPlan } from "../types";

// Initialize with a getter to ensure environment variable is read at runtime
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to decode base64 audio
const decodeAudioData = async (
  base64Data: string,
  audioContext: AudioContext
): Promise<AudioBuffer> => {
  const binaryString = atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  // Important: The Gemini API returns raw PCM, we need to handle it if it was raw. 
  // However, the TTS endpoint usually returns data that might need specific handling.
  // The @google/genai documentation for TTS implies raw PCM often requires manual WAV header or using decodeAudioData on specific formats.
  // The new SDK standardizes on receiving encoded audio in the response. 
  // For simplicity in this environment, we assume standard audio output handling or use the provided decoding example.
  
  // Actually, the example code provided uses a manual PCM decoder.
  // Let's implement the manual PCM decoder for 24kHz as per the specific example in the system prompt.
  
  const dataInt16 = new Int16Array(bytes.buffer);
  const numChannels = 1;
  const sampleRate = 24000;
  const frameCount = dataInt16.length / numChannels;
  const buffer = audioContext.createBuffer(numChannels, frameCount, sampleRate);
  
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
        // Convert Int16 to Float32
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};

export const generateFitnessPlan = async (profile: UserProfile): Promise<FitnessPlan> => {
  const ai = getAI();
  
  const prompt = `
    Act as a world-class fitness coach. Create a personalized workout and diet plan for:
    Name: ${profile.name}, Age: ${profile.age}, Gender: ${profile.gender}
    Height: ${profile.height}cm, Weight: ${profile.weight}kg
    Goal: ${profile.goal}, Level: ${profile.level}
    Location: ${profile.location} (Available equipment based on this)
    Diet Preference: ${profile.diet}
    Medical History: ${profile.medicalHistory || 'None'}
    
    Output a JSON structure containing:
    1. A 3-5 day split workout routine (depending on level).
    2. A detailed one-day example diet plan (macros included).
    3. A motivational quote.
    4. 3-5 actionable lifestyle tips.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          workout: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                focus: { type: Type.STRING },
                exercises: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      sets: { type: Type.STRING },
                      reps: { type: Type.STRING },
                      rest: { type: Type.STRING },
                      notes: { type: Type.STRING },
                    }
                  }
                }
              }
            }
          },
          diet: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.STRING },
              meals: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'] },
                    suggestions: { type: Type.STRING },
                    items: {
                      type: Type.ARRAY,
                      items: {
                         type: Type.OBJECT,
                         properties: {
                           name: { type: Type.STRING },
                           quantity: { type: Type.STRING },
                           calories: { type: Type.NUMBER },
                           protein: { type: Type.STRING },
                           carbs: { type: Type.STRING },
                           fats: { type: Type.STRING },
                         }
                      }
                    }
                  }
                }
              }
            }
          },
          motivation: { type: Type.STRING },
          tips: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });

  if (!response.text) throw new Error("No response from AI");
  return JSON.parse(response.text) as FitnessPlan;
};

export const generateImageVisual = async (prompt: string): Promise<string | null> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        responseModalities: [Modality.IMAGE]
      }
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData && part.inlineData.data) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
    return null;
  } catch (error) {
    console.error("Image generation failed", error);
    return null;
  }
};

export const playTextToSpeech = async (text: string, voiceName: string = 'Kore') => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: { parts: [{ text }] },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) return;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContextClass({ sampleRate: 24000 });
    
    const audioBuffer = await decodeAudioData(base64Audio, audioContext);
    
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
    
  } catch (error) {
    console.error("TTS failed", error);
  }
};
