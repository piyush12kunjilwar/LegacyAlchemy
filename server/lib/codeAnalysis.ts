import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. 
// do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface CodeAnalysisResult {
  modernizedCode: string;
  explanation: string;
  score: number;
  suggestedImprovements: string[];
}

export async function analyzeCode(
  code: string,
  sourceLanguage: string,
  targetFramework: string
): Promise<CodeAnalysisResult> {
  const prompt = `
    Analyze and modernize the following code:

    Original Code (${sourceLanguage}):
    ${code}

    Target Framework: ${targetFramework}

    Please provide a response in the following JSON format:
    {
      "modernizedCode": "the converted code",
      "explanation": "detailed explanation of changes",
      "score": number between 0-100 indicating modernization quality,
      "suggestedImprovements": ["array of specific suggestions"]
    }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const result = JSON.parse(content) as CodeAnalysisResult;
    return result;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to analyze code: ${errorMessage}`);
  }
}