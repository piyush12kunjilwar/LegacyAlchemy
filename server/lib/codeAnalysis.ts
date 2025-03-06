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

function getMockAnalysis(code: string, language: string, framework: string): CodeAnalysisResult {
  return {
    modernizedCode: `// Modernized ${language} code for ${framework}
// This is a mock response for development
${code}

// Added modern features:
// - ES6+ syntax
// - Async/await
// - Type safety`,
    explanation: `Converted ${language} code to ${framework} with modern best practices:
- Updated syntax to latest standards
- Added type definitions
- Improved error handling
- Enhanced code organization`,
    score: 85,
    suggestedImprovements: [
      "Consider using more modern syntax features",
      "Implement proper error handling",
      "Add comprehensive documentation",
      "Consider adding unit tests",
      "Optimize performance with memoization"
    ]
  };
}

export async function analyzeCode(
  code: string,
  sourceLanguage: string,
  targetFramework: string
): Promise<CodeAnalysisResult> {
  // If MOCK_ANALYSIS env var is set, return mock results
  if (process.env.MOCK_ANALYSIS === "true") {
    return getMockAnalysis(code, sourceLanguage, targetFramework);
  }

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
    let errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    // Check for rate limit or quota errors
    if (errorMessage.includes("429") || errorMessage.includes("quota")) {
      errorMessage = "OpenAI API quota exceeded. Please try again later or contact support to upgrade your plan.";
    }

    throw new Error(`Failed to analyze code: ${errorMessage}`);
  }
}