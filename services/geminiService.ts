import { GoogleGenAI } from "@google/genai";
import { DataFormat, TokenCounts } from "../types";

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a high-performance Data Conversion Engine. Your goal is to convert text data accurately and IMMEDIATELY between formats.

FORMAT RULES:

1. **CSV (Strict RFC 4180 & Denormalized)**:
   - **QUOTING**: Enclose fields containing commas, newlines, or double quotes in double quotes (").
   - **ESCAPING**: Escape double quotes inside fields by doubling them (""). Example: "He said ""Hello"""
   - **PROHIBITED**: Do NOT use backslashes (\\) to escape characters. Do NOT output \\".
   - **PROHIBITED**: Do NOT output the CSV as a JSON string literal. Output raw text.
   - **DATA STRUCTURE**:
     - **Unwind Arrays**: When converting JSON/Hierarchical data to CSV, fully **unwind** arrays of objects into multiple rows.
     - **Duplicate Parent Data**: For each unwound array item, repeat the fields from the parent/root objects.
     - **Recursive Unwinding**: If nested arrays exist (e.g., root -> employees -> projects), create a row for every combination (cross-product) to flatten the data completely.
     - **Primitives Lists**: Arrays of simple values (strings/numbers) should be joined with semicolons (e.g., "item1; item2") rather than unwound, unless they are the primary data.

2. **TOON CODE (Canonical)**:
   - **Objects**: \`key: value\`
   - **Arrays**: \`key[count]{field1,field2}:\` followed by comma-separated rows.
   - **Strings**: Quote strings if they contain delimiters.

3. **JSON**:
   - Standard strict JSON.

PERFORMANCE & BEHAVIOR:
- **DETERMINISM**: Output must be deterministic.
- **NO THINKING**: Do not generate internal thoughts. Start output immediately.
- **NO MARKDOWN**: Do not wrap in \`\`\`.
- **NO PREAMBLE**: Return ONLY the result.

ERROR HANDLING:
- If input is invalid, return "ERROR: [Reason]".
`;

const getErrorMessage = (error: any): string => {
  let errorMessage = error.message || "Unknown error occurred during conversion.";
  
  // Parse common API errors for better user feedback
  if (errorMessage.includes("429")) {
    errorMessage = "Rate limit exceeded. Please wait a moment and try again.";
  } else if (errorMessage.includes("503")) {
    errorMessage = "Service temporarily overloaded. Please try again later.";
  } else if (errorMessage.includes("API key")) {
    errorMessage = "Invalid or missing API Key.";
  } else if (errorMessage.includes("400")) {
    errorMessage = "The request was invalid. Please check your input data.";
  }
  return errorMessage;
};

export const convertDataStream = async (
  data: string,
  fromFormat: DataFormat | 'AUTO',
  toFormat: DataFormat,
  onChunk: (text: string) => void
): Promise<string> => {
  try {
    const modelId = 'gemini-2.5-flash'; 
    
    const prompt = `
    Convert the following data from ${fromFormat} to ${toFormat}.
    
    [DATA START]
    ${data}
    [DATA END]
    `;

    const responseStream = await ai.models.generateContentStream({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0,
        responseMimeType: 'text/plain',
      },
    });

    let fullText = '';
    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(text);
      }
    }
    
    if (!fullText) {
       throw new Error("No response generated.");
    }

    return fullText;
  } catch (error: any) {
    console.error("Gemini Stream Error:", error);
    throw new Error(getErrorMessage(error));
  }
};

export const convertData = async (
  data: string,
  fromFormat: DataFormat | 'AUTO',
  toFormat: DataFormat
): Promise<string> => {
  try {
    const modelId = 'gemini-2.5-flash'; 
    
    const prompt = `
    Convert the following data from ${fromFormat} to ${toFormat}.
    
    [DATA START]
    ${data}
    [DATA END]
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0,
        responseMimeType: 'text/plain',
      },
    });

    if (!response.text) {
       if (response.candidates && response.candidates[0] && response.candidates[0].finishReason !== 'STOP') {
           return `ERROR: Generation stopped due to ${response.candidates[0].finishReason}. The content might have triggered safety filters.`;
       }
       return "ERROR: No response generated.";
    }

    return response.text;
  } catch (error: any) {
    console.error("Gemini Conversion Error:", error);
    return `ERROR: ${getErrorMessage(error)}`;
  }
};

export const getTokenCounts = async (text: string): Promise<TokenCounts> => {
  if (!text || !text.trim()) {
    return { gemini: 0, openai: 0, lovable: 0 };
  }

  // Optimization: Used local heuristic instead of API call to ensure 
  // instant feedback and avoid network latency for metadata.
  // 1 token ≈ 4 characters is the standard estimation.
  const estimated = Math.ceil(text.length / 4);

  return {
    gemini: estimated,
    openai: estimated,
    lovable: estimated
  };
};
