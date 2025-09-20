import {
    GoogleGenerativeAI,
    GenerationConfig,
  } from "@google/generative-ai";
  
  // Use your working API key.
  const genAI = new GoogleGenerativeAI("AIzaSyBMP_uZVl2kBslGELotY43w2bYHTt4nFNM");
  
  export async function invokeLegalAgent(prompt: string): Promise<string> {
    try {
      const generationConfig: GenerationConfig = {
        temperature: 0.1,
        maxOutputTokens: 8192,
      };
  
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig,
        // **THE DEFINITIVE FIX: A hyper-aggressive instruction focusing on clean, semantic HTML.**
        systemInstruction: `You are an expert legal document generator. Your only job is to generate a complete, professional, and fully-written HTML document.
  
        **CRITICAL FORMATTING RULES:**
        1.  It is a CRITICAL FAILURE if you include any CSS code (<style> tags or inline styles).
        2.  It is a CRITICAL FAILURE if you include markdown fences like \`\`\`html or \`\`\`. Your response must start with <!DOCTYPE html>.
        3.  Use semantic HTML: <h1> for the main title, <h2> for section headings, <p> for paragraphs, and <strong> for important terms.
        4.  Structure the document logically with a centered title and clear sections.
        5.  It is a CRITICAL FAILURE if you use placeholders like "{...}". Write the full text for every clause.
        `,
      });
  
      console.log("Calling AI with hyper-aggressive formatting prompt.");
      const result = await model.generateContent(prompt);
      const finalHtml = result.response.candidates?.[0]?.content?.parts[0]?.text ?? "";
  
      if (!finalHtml) {
        throw new Error("AI failed to generate any content.");
      }
  
      console.log("invokeLegalAgent finished successfully.");
      return finalHtml;
  
    } catch (error) {
      console.error("An unexpected error occurred in invokeLegalAgent:", error);
      throw error;
    }
  }
  