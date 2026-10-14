const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateAIResponse(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('GEMINI_API_KEY is not configured on the backend.');
    error.status = 503;
    throw error;
  }

  let lastError;

  const model = process.env.GEMINI_MODEL || "gemini-3.6-flash";
  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Gemini request using ${model} (attempt ${attempt}/${maxAttempts})`);

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      if (!response.text?.trim()) {
        throw new Error('The AI service returned an empty response.');
      }

      return response.text;

    } catch (error) {
      lastError = error;
      console.error(`Gemini attempt ${attempt} failed:`, error.message);

      if ([429, 500, 503].includes(error.status) && attempt < maxAttempts) {
        await sleep(2000 * (2 ** (attempt - 1)));
        continue;
      }

      break;
    }
  }

  const temporarilyUnavailable = [429, 503].includes(lastError?.status);
  const error = new Error(temporarilyUnavailable
    ? 'Google Gemini is temporarily busy. Please wait a moment and try again.'
    : lastError?.message || 'Gemini API failed');
  error.status = temporarilyUnavailable ? lastError.status : 502;
  throw error;
}

module.exports = { generateAIResponse };
